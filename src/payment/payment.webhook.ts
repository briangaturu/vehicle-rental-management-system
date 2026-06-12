import { Request, Response } from "express";
import Stripe from "stripe";
import db from "../drizzle/db";
import { payments, bookings } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { mpesaCallbackService } from "./payment.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

// ─── Stripe Webhook ───────────────────────────────────────────────────────────

export const webhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const bookingId = session.metadata?.bookingId;
    const userId = session.metadata?.userId;
    const transactionId = session.payment_intent as string;
    const amount = session.amount_total;

    if (!bookingId || !userId || !transactionId || !amount) {
      console.error("❌ Missing required metadata");
      return res.status(400).json({ error: "Missing required metadata" });
    }

    let paymentStatus: "Pending" | "Paid" | "Failed" = "Pending";
    if (session.payment_status === "paid") paymentStatus = "Paid";
    else if (["unpaid", "no_payment_required"].includes(session.payment_status)) paymentStatus = "Failed";

    try {
      await db.insert(payments).values({
        bookingId: Number(bookingId),
        userId: Number(userId),
        amount: (amount / 100).toFixed(2),
        paymentStatus,
        transactionId,
        paymentMethod: "Stripe",
      } as typeof payments.$inferInsert);

      if (paymentStatus === "Paid") {
        await db
          .update(bookings)
          .set({ bookingStatus: "Confirmed" })
          .where(eq(bookings.bookingId, Number(bookingId)));
      }
    } catch (err) {
      console.error("❌ Failed to save Stripe payment", err);
      return res.status(500).json({ error: "Database operation failed" });
    }
  }

  return res.status(200).json({ received: true });
};

// ─── M-Pesa Helpers ───────────────────────────────────────────────────────────

const getMpesaToken = async (): Promise<string> => {
  const key = process.env.MPESA_CONSUMER_KEY!;
  const secret = process.env.MPESA_CONSUMER_SECRET!;
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");

  const res = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );

  const data = await res.json() as { access_token: string };
  return data.access_token;
};

const getMpesaPassword = (): { password: string; timestamp: string } => {
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14); // YYYYMMDDHHmmss
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
  return { password, timestamp };
};

// ─── M-Pesa STK Push Initiator ────────────────────────────────────────────────

export const initiateMpesaSTKPush = async (req: Request, res: Response) => {
  console.log("SHORTCODE:", process.env.MPESA_SHORTCODE);
  console.log("PASSKEY:", process.env.MPESA_PASSKEY);
  console.log("CALLBACK:", process.env.MPESA_CALLBACK_URL);
  // ... rest of your code
  const { phone, amount, bookingId, userId } = req.body;

  if (!phone || !amount || !bookingId || !userId) {
    return res.status(400).json({ error: "⚠️ phone, amount, bookingId and userId are required" });
  }

  // Normalize phone: strip leading 0 or +254, ensure 254XXXXXXXXX
  const normalizedPhone = phone
    .toString()
    .replace(/^\+/, "")
    .replace(/^0/, "254");

  try {
    const token = await getMpesaToken();
    const { password, timestamp } = getMpesaPassword();
    const shortcode = process.env.MPESA_SHORTCODE!;
    const callbackUrl = process.env.MPESA_CALLBACK_URL!;

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(Number(amount)),  // M-Pesa requires whole numbers
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: callbackUrl,
      AccountReference: `Booking-${bookingId}`,
      TransactionDesc: `Vehicle rental payment for booking ${bookingId}`,
    };

    const mpesaRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const mpesaData = await mpesaRes.json() as {
      ResponseCode: string;
      CheckoutRequestID: string;
      ResponseDescription: string;
      CustomerMessage: string;
    };

    if (mpesaData.ResponseCode !== "0") {
      console.error("❌ STK Push failed:", mpesaData);
      return res.status(400).json({ error: "STK Push failed", details: mpesaData });
    }

    console.log(`📲 STK Push sent to ${normalizedPhone} for booking ${bookingId}`);
    return res.status(200).json({
      message: "STK Push sent ✅ — ask customer to check their phone",
      checkoutRequestId: mpesaData.CheckoutRequestID,
    });

  } catch (err: any) {
    console.error("❌ M-Pesa STK Push error:", err.message);
    return res.status(500).json({ error: "Failed to initiate M-Pesa payment" });
  }
};

// ─── M-Pesa Callback Handler ─────────────────────────────────────────────────

export const mpesaCallback = async (req: Request, res: Response) => {
  const body = req.body?.Body?.stkCallback;

  if (!body) {
    console.error("❌ Invalid M-Pesa callback body");
    return res.status(400).json({ error: "Invalid callback" });
  }

  const resultCode: number = body.ResultCode;
  const resultDesc: string = body.ResultDesc;
  const metadata = body.CallbackMetadata?.Item as Array<{ Name: string; Value: any }> | undefined;

  console.log(`📩 M-Pesa callback received — ResultCode: ${resultCode} | ${resultDesc}`);

  // Extract metadata items by name
  const getMeta = (name: string) =>
    metadata?.find((i) => i.Name === name)?.Value;

  const transactionId = getMeta("MpesaReceiptNumber") as string | undefined;
  const amount = getMeta("Amount") as number | undefined;
  const phone = getMeta("PhoneNumber") as number | undefined;

  // AccountReference was set as "Booking-{bookingId}" during STK push
  // Safaricom echoes it back in the callback
  const accountRef = getMeta("AccountReference") as string | undefined;

  // Parse bookingId and userId from AccountReference or use fallback
  // If you need userId, consider storing CheckoutRequestID → {bookingId, userId} in Redis/DB
  // For now we extract bookingId from the reference and require userId in a separate lookup
  const bookingId = accountRef?.replace("Booking-", "");

  if (resultCode !== 0) {
    console.log(`⚠️ Payment not completed: ${resultDesc}`);
    // Optionally update a pending payment record to Failed here
    return res.status(200).json({ message: "Callback received — payment not completed" });
  }

  if (!transactionId || !amount || !bookingId) {
    console.error("❌ Missing callback fields", { transactionId, amount, bookingId });
    return res.status(400).json({ error: "Incomplete callback data" });
  }

  try {
    // Fetch userId from the booking
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.bookingId, Number(bookingId)),
      columns: { userId: true },
    });

    if (!booking) {
      console.error(`❌ Booking ${bookingId} not found`);
      return res.status(404).json({ error: "Booking not found" });
    }

    await mpesaCallbackService(
      Number(bookingId),
      booking.userId,
      amount.toString(),
      transactionId,
      "Paid"
    );

    console.log(`✅ M-Pesa payment saved — booking ${bookingId} confirmed`);
    return res.status(200).json({ message: "Payment recorded ✅" });

  } catch (err: any) {
    console.error("❌ Failed to save M-Pesa payment:", err.message);
    return res.status(500).json({ error: "Database error" });
  }
};
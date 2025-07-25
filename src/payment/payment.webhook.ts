import { Request, Response } from "express";
import Stripe from "stripe";
import db from "../drizzle/db";
import { payments, bookings } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

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
      console.error("❌ Missing required metadata (bookingId, userId, transactionId, amount)");
      return res.status(400).json({ error: "Missing required metadata" });
    }

    let paymentStatus: "pending" | "Paid" | "Failed" = "pending";
    const stripeStatus = session.payment_status;

    if (stripeStatus === "paid") {
      paymentStatus = "Paid";
    } else if (stripeStatus === "unpaid" || stripeStatus === "no_payment_required") {
      paymentStatus = "Failed";
    }

    try {
      console.log(`💰 Saving payment for booking ${bookingId}`);

      await db.insert(payments).values({
        bookingId: Number(bookingId),
        userId: Number(userId),
        amount: (amount / 100).toFixed(2),
        paymentStatus,
        transactionId,
        paymentMethod: "Stripe",
      } as typeof payments.$inferInsert);

      console.log(`✅ Payment recorded for booking ${bookingId}`);

      if (paymentStatus === "Paid") {
        await db
          .update(bookings)
          .set({ bookingStatus: "Completed" })
          .where(eq(bookings.bookingId, Number(bookingId)));

        console.log(`✅ Booking ${bookingId} marked as Completed`);
      }

    } catch (err) {
      console.error("❌ Failed to save payment or update booking", err);
      return res.status(500).json({ error: "Database operation failed" });
    }
  }

  return res.status(200).json({ received: true });
};

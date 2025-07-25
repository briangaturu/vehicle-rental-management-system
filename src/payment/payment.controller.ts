// controllers/payment.controller.ts

import { Request, Response } from "express";
import {
  getAllPaymentsService,
  getPaymentByIdService,
  getPaymentsByBookingIdService,
  getPaymentsByStatusService,
  createPaymentService,
  updatePaymentService,
  deletePaymentService,
  getPaymentByUserIdService,
} from "./payment.service";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});


// Get all payments
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const allPayments = await getAllPaymentsService();
    if (!allPayments || allPayments.length === 0) {
      res.status(404).json({ message: "🔍 No payments found" });
    } else {
      res.status(200).json(allPayments);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to retrieve payments") });
  }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
    res.status(400).json({ error: "🚫 Invalid payment ID" });
    return;
  }
  try {
    const payment = await getPaymentByIdService(paymentId);
    if (!payment) {
      res.status(404).json({ message: "🔍 Payment not found" });
    } else {
      res.status(200).json(payment);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to retrieve payment") });
  }
};

// Get payments by Booking ID
export const getPaymentsByBookingId = async (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.bookingId);
  if (isNaN(bookingId)) {
    res.status(400).json({ error: "🚫 Invalid booking ID" });
    return;
  }
  try {
    const payments = await getPaymentsByBookingIdService(bookingId);
    if (!payments || payments.length === 0) {
      res.status(404).json({ message: `🔍 No payments found for booking ID ${bookingId}` });
    } else {
      res.status(200).json(payments);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || `Failed to retrieve payments for booking ID ${bookingId}`) });
  }
};

// Get payments by Status
export const getPaymentsByStatus = async (req: Request, res: Response) => {
  const status = req.query.status as string;

  if (!status) {
    res.status(400).json({ error: "⚠️ Missing status query parameter" });
    return;
  }

  const allowedStatuses = ["Pending", "Paid", "Failed"] as const;
  type PaymentStatus = typeof allowedStatuses[number];

  if (!allowedStatuses.includes(status as PaymentStatus)) {
    res.status(400).json({ error: `🚫 Invalid status value. Allowed values are: ${allowedStatuses.join(", ")}` });
    return;
  }

  try {
    const payments = await getPaymentsByStatusService(status as PaymentStatus);
    if (!payments || payments.length === 0) {
      res.status(404).json({ message: `🔍 No payments found with status "${status}"` });
    } else {
      res.status(200).json(payments);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || `Failed to retrieve payments with status "${status}"`) });
  }
};

//get payment by userid
export const getPaymentByUserId = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: "🚫 Invalid user ID" });
    return;
  }
  try {
    const payments = await getPaymentByUserIdService(userId);
    if (!payments || payments.length === 0) {
      res.status(404).json({ message: `🔍 No payments found for user ID ${userId}` });
    } else {
      res.status(200).json(payments);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || `Failed to retrieve payments for user ID ${userId}`) });
  }
}


// Create new payment
export const createPayment = async (req: Request, res: Response) => {
  const { bookingId, amount, paymentStatus, paymentMethod, transactionId } = req.body;

  if (!bookingId || !amount) {
    res.status(400).json({ error: "⚠️ Essential fields (bookingId, amount) are required" });
    return;
  }

  const parsedBookingId = parseInt(bookingId);
  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedBookingId) || isNaN(parsedAmount)) {
    res.status(400).json({ error: "🚫 Invalid data types for bookingId or amount" });
    return;
  }

  try {
    const newPayment = {
      bookingId: parsedBookingId,
      userId: req.body.userid,
      amount: parsedAmount.toString(),
      paymentStatus: paymentStatus || "Pending",
      paymentMethod: paymentMethod || null,
      transactionId: transactionId || null,
    };
    const message = await createPaymentService(newPayment);
    res.status(201).json({ message: "✅ " + message });
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to create payment") });
  }
};

// Update payment
export const updatePayment = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
    res.status(400).json({ error: "🚫 Invalid payment ID" });
    return;
  }

  const updateData: { [key: string]: any } = {};
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      let value = req.body[key];
      if (key === 'bookingId') {
        value = parseInt(value);
        if (isNaN(value)) {
          res.status(400).json({ error: `🚫 Invalid number format for ${key}` });
          return;
        }
      } else if (key === 'amount') {
        value = parseFloat(value);
        if (isNaN(value)) {
          res.status(400).json({ error: `🚫 Invalid number format for ${key}` });
          return;
        }
      }
      updateData[key] = value;
    }
  }

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: "📝 No fields provided for update" });
    return;
  }

  try {
    const result = await updatePaymentService(paymentId, updateData);
    res.status(200).json({ message: "🔄 " + result });
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to update payment") });
  }
};

// Delete payment
export const deletePayment = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
    res.status(400).json({ error: "🚫 Invalid payment ID" });
    return;
  }
  try {
    const result = await deletePaymentService(paymentId);
    res.status(200).json({ message: "🗑️ " + result });
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to delete payment") });
  }
};
export const createCheckoutSession = async (req: Request, res: Response) => {
  const { amount, bookingId, userId } = req.body;

  if (!amount || isNaN(amount)) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amount,
            product_data: {
              name: 'vehicle Payment',
              description: 'vehicle booking payment',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: bookingId ? String(bookingId) : '',
        userId: userId ? String(userId) : '',
      },
      success_url: 'http://localhost:5173/user',
      cancel_url: 'http://localhost:5173/user',
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

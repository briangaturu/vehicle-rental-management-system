
// routes/payment.routes.ts

import { Router } from "express";
import {
  getAllPayments,
  getPaymentById,
  getPaymentsByBookingId,
  getPaymentsByStatus,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentByUserId,
  createCheckoutSession,
} from "./payment.controller"; 
import { webhookHandler } from "./payment.webhook";

export const paymentRouter = Router();


// Search payments by status ("Pending", "Paid", "Failed")
paymentRouter.get("/payments-status-search", getPaymentsByStatus);

// Get all payments
paymentRouter.get("/payments", getAllPayments);

// Get payment by ID
paymentRouter.get("/payments/:id", getPaymentById);

// Get payments by Booking ID
paymentRouter.get("/payments/booking/:bookingId", getPaymentsByBookingId);

//get payment by user id
paymentRouter.get("/payments/user/:id", getPaymentByUserId);

// Create a new payment
paymentRouter.post("/payments", createPayment);

// Update an existing payment
paymentRouter.put("/payments/:id", updatePayment);

// Delete an existing payment
paymentRouter.delete("/payments/:id", deletePayment);

paymentRouter.post("/payments/checkout-session", createCheckoutSession);

paymentRouter.post("/webhook", webhookHandler);
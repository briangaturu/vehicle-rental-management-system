"use strict";
// routes/payment.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const payment_webhook_1 = require("./payment.webhook");
exports.paymentRouter = (0, express_1.Router)();
// Search payments by status ("Pending", "Paid", "Failed")
exports.paymentRouter.get("/payments-status-search", payment_controller_1.getPaymentsByStatus);
// Get all payments
exports.paymentRouter.get("/payments", payment_controller_1.getAllPayments);
// Get payment by ID
exports.paymentRouter.get("/payments/:id", payment_controller_1.getPaymentById);
// Get payments by Booking ID
exports.paymentRouter.get("/payments/booking/:bookingId", payment_controller_1.getPaymentsByBookingId);
//get payment by user id
exports.paymentRouter.get("/payments/user/:id", payment_controller_1.getPaymentByUserId);
// Create a new payment
exports.paymentRouter.post("/payments", payment_controller_1.createPayment);
// Update an existing payment
exports.paymentRouter.put("/payments/:id", payment_controller_1.updatePayment);
// Delete an existing payment
exports.paymentRouter.delete("/payments/:id", payment_controller_1.deletePayment);
exports.paymentRouter.post("/payments/checkout-session", payment_controller_1.createCheckoutSession);
exports.paymentRouter.post("/webhook", payment_webhook_1.webhookHandler);

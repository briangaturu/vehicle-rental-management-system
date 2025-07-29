"use strict";
// controllers/payment.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = exports.deletePayment = exports.updatePayment = exports.createPayment = exports.getPaymentByUserId = exports.getPaymentsByStatus = exports.getPaymentsByBookingId = exports.getPaymentById = exports.getAllPayments = void 0;
const payment_service_1 = require("./payment.service");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
});
// Get all payments
const getAllPayments = async (req, res) => {
    try {
        const allPayments = await (0, payment_service_1.getAllPaymentsService)();
        if (!allPayments || allPayments.length === 0) {
            res.status(404).json({ message: "🔍 No payments found" });
        }
        else {
            res.status(200).json(allPayments);
        }
    }
    catch (error) {
        res.status(500).json({ error: "🚫 " + (error.message || "Failed to retrieve payments") });
    }
};
exports.getAllPayments = getAllPayments;
// Get payment by ID
const getPaymentById = async (req, res) => {
    const paymentId = parseInt(req.params.id);
    if (isNaN(paymentId)) {
        res.status(400).json({ error: "🚫 Invalid payment ID" });
        return;
    }
    try {
        const payment = await (0, payment_service_1.getPaymentByIdService)(paymentId);
        if (!payment) {
            res.status(404).json({ message: "🔍 Payment not found" });
        }
        else {
            res.status(200).json(payment);
        }
    }
    catch (error) {
        res.status(500).json({ error: "🚫 " + (error.message || "Failed to retrieve payment") });
    }
};
exports.getPaymentById = getPaymentById;
// Get payments by Booking ID
const getPaymentsByBookingId = async (req, res) => {
    const bookingId = parseInt(req.params.bookingId);
    if (isNaN(bookingId)) {
        res.status(400).json({ error: "🚫 Invalid booking ID" });
        return;
    }
    try {
        const payments = await (0, payment_service_1.getPaymentsByBookingIdService)(bookingId);
        if (!payments || payments.length === 0) {
            res.status(404).json({ message: `🔍 No payments found for booking ID ${bookingId}` });
        }
        else {
            res.status(200).json(payments);
        }
    }
    catch (error) {
        res.status(500).json({ error: "🚫 " + (error.message || `Failed to retrieve payments for booking ID ${bookingId}`) });
    }
};
exports.getPaymentsByBookingId = getPaymentsByBookingId;
// Get payments by Status
const getPaymentsByStatus = async (req, res) => {
    const status = req.query.status;
    if (!status) {
        res.status(400).json({ error: "⚠️ Missing status query parameter" });
        return;
    }
    const allowedStatuses = ["Pending", "Paid", "Failed"];
    if (!allowedStatuses.includes(status)) {
        res.status(400).json({ error: `🚫 Invalid status value. Allowed values are: ${allowedStatuses.join(", ")}` });
        return;
    }
    try {
        const payments = await (0, payment_service_1.getPaymentsByStatusService)(status);
        if (!payments || payments.length === 0) {
            res.status(404).json({ message: `🔍 No payments found with status "${status}"` });
        }
        else {
            res.status(200).json(payments);
        }
    }
    catch (error) {
        res.status(500).json({ error: "🚫 " + (error.message || `Failed to retrieve payments with status "${status}"`) });
    }
};
exports.getPaymentsByStatus = getPaymentsByStatus;
//get payment by userid
const getPaymentByUserId = async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "🚫 Invalid user ID" });
        return;
    }
    try {
        const payments = await (0, payment_service_1.getPaymentByUserIdService)(userId);
        if (!payments || payments.length === 0) {
            res.status(404).json({ message: `🔍 No payments found for user ID ${userId}` });
        }
        else {
            res.status(200).json(payments);
        }
    }
    catch (error) {
        res.status(500).json({ error: "🚫 " + (error.message || `Failed to retrieve payments for user ID ${userId}`) });
    }
};
exports.getPaymentByUserId = getPaymentByUserId;
// Create new payment
const createPayment = async (req, res) => {
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
        const message = await (0, payment_service_1.createPaymentService)(newPayment);
        res.status(201).json({ message: "✅ " + message });
    }
    catch (error) {
        res.status(500).json({ error: "🚫 " + (error.message || "Failed to create payment") });
    }
};
exports.createPayment = createPayment;
// Update payment
const updatePayment = async (req, res) => {
    const paymentId = parseInt(req.params.id);
    if (isNaN(paymentId)) {
        res.status(400).json({ error: "🚫 Invalid payment ID" });
        return;
    }
    const updateData = {};
    for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            let value = req.body[key];
            if (key === 'bookingId') {
                value = parseInt(value);
                if (isNaN(value)) {
                    res.status(400).json({ error: `🚫 Invalid number format for ${key}` });
                    return;
                }
            }
            else if (key === 'amount') {
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
        const result = await (0, payment_service_1.updatePaymentService)(paymentId, updateData);
        res.status(200).json({ message: "🔄 " + result });
    }
    catch (error) {
        res.status(500).json({ error: "🚫 " + (error.message || "Failed to update payment") });
    }
};
exports.updatePayment = updatePayment;
// Delete payment
const deletePayment = async (req, res) => {
    const paymentId = parseInt(req.params.id);
    if (isNaN(paymentId)) {
        res.status(400).json({ error: "🚫 Invalid payment ID" });
        return;
    }
    try {
        const result = await (0, payment_service_1.deletePaymentService)(paymentId);
        res.status(200).json({ message: "🗑️ " + result });
    }
    catch (error) {
        res.status(500).json({ error: "🚫 " + (error.message || "Failed to delete payment") });
    }
};
exports.deletePayment = deletePayment;
const createCheckoutSession = async (req, res) => {
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
            success_url: 'https://vehicle-rental-mgnt-system.netlify.app/user',
            cancel_url: 'https://vehicle-rental-mgnt-system.netlify.app/user',
        });
        res.status(200).json({ url: session.url });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};
exports.createCheckoutSession = createCheckoutSession;

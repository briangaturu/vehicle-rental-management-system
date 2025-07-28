"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookHandler = void 0;
const stripe_1 = __importDefault(require("stripe"));
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
});
const webhookHandler = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;
        const userId = session.metadata?.userId;
        const transactionId = session.payment_intent;
        const amount = session.amount_total;
        if (!bookingId || !userId || !transactionId || !amount) {
            console.error("❌ Missing required metadata (bookingId, userId, transactionId, amount)");
            return res.status(400).json({ error: "Missing required metadata" });
        }
        let paymentStatus = "pending";
        const stripeStatus = session.payment_status;
        if (stripeStatus === "paid") {
            paymentStatus = "Paid";
        }
        else if (stripeStatus === "unpaid" || stripeStatus === "no_payment_required") {
            paymentStatus = "Failed";
        }
        try {
            console.log(`💰 Saving payment for booking ${bookingId}`);
            await db_1.default.insert(schema_1.payments).values({
                bookingId: Number(bookingId),
                userId: Number(userId),
                amount: (amount / 100).toFixed(2),
                paymentStatus,
                transactionId,
                paymentMethod: "Stripe",
            });
            console.log(`✅ Payment recorded for booking ${bookingId}`);
            if (paymentStatus === "Paid") {
                await db_1.default
                    .update(schema_1.bookings)
                    .set({ bookingStatus: "Confirmed" })
                    .where((0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, Number(bookingId)));
                console.log(`✅ Booking ${bookingId} marked as Confirmed`);
            }
        }
        catch (err) {
            console.error("❌ Failed to save payment or update booking", err);
            return res.status(500).json({ error: "Database operation failed" });
        }
    }
    return res.status(200).json({ received: true });
};
exports.webhookHandler = webhookHandler;

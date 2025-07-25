"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_route_1 = require("./users/users.route");
const auth_route_1 = require("./auth/auth.route");
const vehicles_route_1 = require("./vehicles/vehicles.route");
const vehicleSpec_route_1 = require("./vehicleSpec/vehicleSpec.route");
const location_route_1 = require("./location/location.route");
const booking_route_1 = require("./booking/booking.route");
const supportTicket_route_1 = require("./supportTicket/supportTicket.route");
const payment_route_1 = require("./payment/payment.route");
const cors_1 = __importDefault(require("cors"));
const payment_webhook_1 = require("./payment/payment.webhook");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.post("/api/webhook", express_1.default.raw({ type: 'application/json' }), payment_webhook_1.webhookHandler);
// Basic Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
//default route
app.get('/', (req, res) => {
    res.send("Welcome to Vehicle express API Backend WIth Drizzle ORM and PostgreSQL");
});
// Importing user routes
app.use('/api', users_route_1.userRouter);
app.use('/api', auth_route_1.authRouter);
app.use('/api', vehicles_route_1.vehicleRouter);
app.use('/api', vehicleSpec_route_1.VehicleSpecsRouter);
app.use('/api', location_route_1.locationRouter);
app.use('/api', booking_route_1.bookingRouter);
app.use('/api', supportTicket_route_1.ticketRouter);
app.use('/api', payment_route_1.paymentRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

import express, { Application,Response } from 'express';
import dotenv from 'dotenv';
import { userRouter } from './users/users.route';
import { authRouter } from './auth/auth.route';
import { vehicleRouter } from './vehicles/vehicles.route';
import { VehicleSpecsRouter } from './vehicleSpec/vehicleSpec.route';
import { locationRouter } from './location/location.route';
import { bookingRouter } from './booking/booking.route';
import { ticketRouter } from './supportTicket/supportTicket.route';
import { paymentRouter } from './payment/payment.route';
import cors from 'cors';
import { webhookHandler } from './payment/payment.webhook';



dotenv.config();

const app: Application = express();

app.post("/api/webhook", express.raw({ type: 'application/json' }), webhookHandler);

// Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())



//default route
app.get('/', (req, res:Response) => {
  res.send("Welcome to Vehicle express API Backend WIth Drizzle ORM and PostgreSQL");
});

// Importing user routes
app.use('/api',userRouter)
app.use('/api',authRouter)
app.use('/api',vehicleRouter)
app.use('/api', VehicleSpecsRouter)
app.use('/api', locationRouter)
app.use('/api',bookingRouter)
app.use('/api',ticketRouter)
app.use('/api',paymentRouter)

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
 });
  





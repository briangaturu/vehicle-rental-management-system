import express, { Application,Response } from 'express';
import dotenv from 'dotenv';
import { userRouter } from './users/users.route';
import { authRouter } from './auth/auth.route';
import { vehicleRouter } from './vehicles/vehicles.route';
import { VehicleSpecsRouter } from './vehicleSpec/vehicleSpec.route';



dotenv.config();

const app: Application = express();

// Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//default route
app.get('/', (req, res:Response) => {
  res.send("Welcome to Vehicle express API Backend WIth Drizzle ORM and PostgreSQL");
});

// Importing user routes
app.use('/api',userRouter)
app.use('/api',authRouter)
app.use('/api',vehicleRouter)
app.use('/api', VehicleSpecsRouter)

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
 });
  




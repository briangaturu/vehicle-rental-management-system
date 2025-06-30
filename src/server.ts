import express, { Application,Response } from 'express';
import dotenv from 'dotenv';
import { userRouter } from './users/users.route';


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

const PORT = process.env.PORT || 5000;

//  then start the server

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
 });
  




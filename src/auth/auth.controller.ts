import { Request, Response } from "express";
import { createUserServices, getUserByEmailService } from "./auth.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserLoginValidator, UserValidator } from "../validation/user.validator";
import { sendNotificationEmail } from "../middleware/googlemailer";

interface ExistigUser {
    userId: number,
    firstame: string,
    lastname:string,
    email: string,
    userType: string,
    createdAt: Date,
    updatedAt:Date
}


export const createUser = async (req: Request, res: Response) => {     
    try {
         // Validate user input
        const parseResult = UserValidator.safeParse(req.body);
        if (!parseResult.success) {
             res.status(400).json({ error: parseResult.error.issues });
             return;
        }
        const user = parseResult.data;
        const userEmail = user.email;

        const existingUser  = await getUserByEmailService(userEmail);
        if (existingUser) {
            res.status(400).json({ error: "User with this email already exists" });
            return;
        }
        // Genereate hashed password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(user.password,salt);
        user.password = hashedPassword;

        // Call the service to create the user
        const newUser = await createUserServices(user);
        const result = await sendNotificationEmail(user.email,user.firstname,user.lastname, "Acount Created Successfully 🌟","Welcome to our Food Services")

        res.status(201).json({message:newUser,emailNofication:result});    

    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to create user" });
    }
}

//Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const parseResult = UserLoginValidator.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues });
      return;
    }
    const { email, password } = parseResult.data;

    // Check if user exists
    const user = await getUserByEmailService(email);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Compare passwords
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    // Generate token
    let payload = {
      userId: user.userId,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    let secret = process.env.JWT_SECRET as string;
    const token = jwt.sign(payload, secret);
    console.log(payload)

    res.status(200).json({
      token,
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
      },
      role: user.role,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to login user" });
  }
};

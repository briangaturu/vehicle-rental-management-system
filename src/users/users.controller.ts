import {Request, Response} from "express";
import { createUserServices,deleteUserServices,getUserByIdServices,getUsersService,updateUserProfileImage,updateUserServices } from "./users.service";
import db from "../drizzle/db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await getUsersService();
        if (allUsers == null || allUsers.length == 0) {
          res.status(404).json({ message: "No users found" });
        }else{
            res.status(200).json(allUsers);             
        }            
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch users" });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
         return; 
    }
    try {
        const user = await getUserByIdServices(userId);
        if (user == null) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(200).json(user);
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch user" });
    }
}

export const createUser = async (req: Request, res: Response) => {
    const { firstname,lastname, email, password,userId,contact,address } = req.body;
    if (!firstname || !lastname || !email || !password || !userId || !contact || !address) {
        res.status(400).json({ error: "All fields are required" });
        return; 
    }
    try {
        const newUser = await createUserServices({ firstname,lastname, email, password,userId, contact,address });
        if (newUser == null) {
            res.status(500).json({ message: "Failed to create user" });
        } else {
            res.status(201).json(newUser);
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to create user" });
    }
}

export const updateUser = async (req: Request, res: Response) => {

    console.log(req.body)
    const usersId = parseInt(req.params.id);
    if (isNaN(usersId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
   
    const { firstname, lastname, email, password, contact, address } = req.body;

    
    if (!firstname || !lastname || !email || !password || !contact || !address) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }

    try {
       
        const updatedUser = await updateUserServices(usersId, { firstname, lastname, email, password, contact, address });
        if (updatedUser == null) {
            // Service might return null if user not found or update failed (depending on its implementation)
            res.status(404).json({ message: "User not found or failed to update" });
        } else {
            res.status(200).json(updatedUser); // Return the updated user object
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to update user" });
    }
}
export const deleteUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);  
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return; 
    }
    try {
        const deletedUser = await deleteUserServices(userId);
        if (deletedUser) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error:any) {    
        res.status(500).json({ error:error.message || "Failed to delete user" });
    }    
}

export const updateProfileImage = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const { profileUrl } = req.body;

    if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    if (!profileUrl) {
        return res.status(400).json({ error: "Profile URL is required" });
    }

    try {
        // Update only the profileUrl and updatedAt fields
        const updatedUser = await db.update(users)
            .set({ 
                profileUrl,
                updatedAt: new Date()
            })
            .where(eq(users.userId, userId))
            .returning();

        if (updatedUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile image updated successfully",
            user: updatedUser[0]
        });
    } catch (error: any) {
        console.error("Profile image update error:", error);
        return res.status(500).json({ 
            error: error.message || "Failed to update profile image" 
        });
    }
};
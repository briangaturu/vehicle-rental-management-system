import {Request, Response} from "express";
import { createUserServices,deleteUserServices,getUserByIdServices,getUsersService,updateUserServices } from "./users.service";

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
         return; // Prevent further execution
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
    const { firstname,lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const newUser = await createUserServices({ firstname,lastname, email, password });
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
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return; // Prevent further execution
    }
    const { firstname,lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        res.status(400).json({ error: "All fields are required" });
        return; // Prevent further execution
    }
    try {
        const updatedUser = await updateUserServices(userId, { firstname,lastname, email, password });
        if (updatedUser == null) {
            res.status(404).json({ message: "User not found or failed to update" });
        } else {
            res.status(200).json(updatedUser);
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to update user" });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);  
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return; // Prevent further execution
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
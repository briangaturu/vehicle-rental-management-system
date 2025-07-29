"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileImage = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const users_service_1 = require("./users.service");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getUsers = async (req, res) => {
    try {
        const allUsers = await (0, users_service_1.getUsersService)();
        if (allUsers == null || allUsers.length == 0) {
            res.status(404).json({ message: "No users found" });
        }
        else {
            res.status(200).json(allUsers);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch users" });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    try {
        const user = await (0, users_service_1.getUserByIdServices)(userId);
        if (user == null) {
            res.status(404).json({ message: "User not found" });
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch user" });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    const { firstname, lastname, email, password, userId, contact, address } = req.body;
    if (!firstname || !lastname || !email || !password || !userId || !contact || !address) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        const newUser = await (0, users_service_1.createUserServices)({ firstname, lastname, email, password, userId, contact, address });
        if (newUser == null) {
            res.status(500).json({ message: "Failed to create user" });
        }
        else {
            res.status(201).json(newUser);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to create user" });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    console.log(req.body);
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
        const updatedUser = await (0, users_service_1.updateUserServices)(usersId, { firstname, lastname, email, password, contact, address });
        if (updatedUser == null) {
            // Service might return null if user not found or update failed (depending on its implementation)
            res.status(404).json({ message: "User not found or failed to update" });
        }
        else {
            res.status(200).json(updatedUser); // Return the updated user object
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update user" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    try {
        const deletedUser = await (0, users_service_1.deleteUserServices)(userId);
        if (deletedUser) {
            res.status(200).json({ message: "User deleted successfully" });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to delete user" });
    }
};
exports.deleteUser = deleteUser;
const updateProfileImage = async (req, res) => {
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
        const updatedUser = await db_1.default.update(schema_1.users)
            .set({
            profileUrl,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.userId, userId))
            .returning();
        if (updatedUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "Profile image updated successfully",
            user: updatedUser[0]
        });
    }
    catch (error) {
        console.error("Profile image update error:", error);
        return res.status(500).json({
            error: error.message || "Failed to update profile image"
        });
    }
};
exports.updateProfileImage = updateProfileImage;

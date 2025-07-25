"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const users_service_1 = require("./users.service");
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
    const usersId = parseInt(req.params.id); // This is the ID from the URL, which is the user to update
    if (isNaN(usersId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    // Destructure fields from req.body. We no longer need userId from body here
    const { firstname, lastname, email, password, contact, address } = req.body;
    // Your existing validation: All fields are required. Keep this as per your instruction.
    // Note: For a PUT (update) operation, usually not all fields are strictly required,
    // but I'm keeping your original validation logic here as per your request.
    if (!firstname || !lastname || !email || !password || !contact || !address) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        // CORRECTED LINE: Pass usersId (from req.params.id) to updateUserServices
        // The payload for updateUserServices should contain the fields to update.
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

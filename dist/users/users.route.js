"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
exports.userRouter = (0, express_1.Router)();
// User routes definition
// Get all users
exports.userRouter.get('/users', users_controller_1.getUsers);
// Get user by ID
exports.userRouter.get('/users/:id', users_controller_1.getUserById);
// Create a new user
exports.userRouter.post('/users', users_controller_1.createUser);
// Update an existing user
exports.userRouter.put('/users/:id', users_controller_1.updateUser);
// Update an existing user with partial fields
// userRouter.patch('/users/:id', updateUserPartial);
// Delete an existing user
exports.userRouter.delete('/users/:id', users_controller_1.deleteUser);

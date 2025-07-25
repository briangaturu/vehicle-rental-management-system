"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
exports.authRouter = (0, express_1.Router)();
// Auth routes definition
// Register a new user
exports.authRouter.post('/auth/register', auth_controller_1.createUser);
exports.authRouter.post('/auth/login', auth_controller_1.loginUser);

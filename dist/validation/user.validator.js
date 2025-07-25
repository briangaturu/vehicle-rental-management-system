"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginValidator = exports.UserValidator = void 0;
const v4_1 = require("zod/v4");
exports.UserValidator = v4_1.z.object({
    userId: v4_1.z.number(),
    email: v4_1.z.email().trim(),
    firstname: v4_1.z.string().min(5).max(100).trim(),
    lastname: v4_1.z.string().min(5).max(100).trim(),
    password: v4_1.z.string().min(4).max(100).trim(),
    contact: v4_1.z.string().min(10).max(15).trim(),
    address: v4_1.z.string().min(5).max(200).trim(),
});
exports.UserLoginValidator = v4_1.z.object({
    email: v4_1.z.email().trim(),
    password: v4_1.z.string().min(4).max(100).trim(),
});

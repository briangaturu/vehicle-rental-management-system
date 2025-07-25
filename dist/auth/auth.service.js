"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmailService = exports.createUserServices = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
//Register a new user
const createUserServices = async (user) => {
    await db_1.default.insert(schema_1.users).values(user).returning();
    return "User created successfully 🎉";
};
exports.createUserServices = createUserServices;
//get user by email
const getUserByEmailService = async (user_email) => {
    return await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, user_email)
    });
};
exports.getUserByEmailService = getUserByEmailService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileImage = exports.deleteUserServices = exports.updateUserServices = exports.createUserServices = exports.getUserByIdServices = exports.getUsersService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
//Get all users
const getUsersService = async () => {
    return await db_1.default.query.users.findMany({
        with: {
            bookings: true,
            supportTickets: true,
        },
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.users.userId)]
    });
};
exports.getUsersService = getUsersService;
//Get users by Id
const getUserByIdServices = async (userId) => {
    return await db_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.userId, userId),
        with: {
            bookings: true,
            supportTickets: true,
        },
    });
};
exports.getUserByIdServices = getUserByIdServices;
//create new user
const createUserServices = async (user) => {
    await db_1.default.insert(schema_1.users).values(user).returning();
    return "User created successfully 🎉";
};
exports.createUserServices = createUserServices;
//update a user
const updateUserServices = async (userId, user) => {
    await db_1.default.update(schema_1.users).set(user).where((0, drizzle_orm_1.eq)(schema_1.users.userId, userId));
    return "User updated successfully 😎";
};
exports.updateUserServices = updateUserServices;
//delete a user
const deleteUserServices = async (userId) => {
    await db_1.default.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.userId, userId));
    return "User deleted successfully 🎉";
};
exports.deleteUserServices = deleteUserServices;
const updateUserProfileImage = async (userId, profileUrl) => {
    try {
        const result = await db_1.default.update(schema_1.users)
            .set({
            profileUrl,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.userId, userId))
            .returning();
        return result[0] || null;
    }
    catch (error) {
        throw error;
    }
};
exports.updateUserProfileImage = updateUserProfileImage;

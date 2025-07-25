"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicketService = exports.updateTicketServices = exports.createTicketServices = exports.getTicketByUserIdService = exports.getTicketByIdService = exports.GetAllTicketService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
// Get All support tickets
const GetAllTicketService = async () => {
    return await db_1.default.query.supportTickets.findMany({
        with: {
            user: { columns: {
                    userId: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                    contact: true,
                } }
        },
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.supportTickets.ticketId)]
    });
};
exports.GetAllTicketService = GetAllTicketService;
// Get tickets By Id
const getTicketByIdService = async (supportTicketId) => {
    return await db_1.default.query.supportTickets.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.supportTickets.ticketId, supportTicketId),
    });
};
exports.getTicketByIdService = getTicketByIdService;
//get tickets by userid
const getTicketByUserIdService = async (userId) => {
    return await db_1.default.query.supportTickets.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.supportTickets.userId, userId),
        with: {
            user: { columns: {
                    userId: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                    contact: true,
                } }
        },
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.supportTickets.ticketId)]
    });
};
exports.getTicketByUserIdService = getTicketByUserIdService;
// cREATING TICKET
const createTicketServices = async (ticket) => {
    await db_1.default.insert(schema_1.supportTickets).values(ticket).returning();
    return "ticket Created SucccessFully";
};
exports.createTicketServices = createTicketServices;
// Updating SpecS
const updateTicketServices = async (ticketId, ticket) => {
    await db_1.default.update(schema_1.supportTickets).set(ticket).where((0, drizzle_orm_1.eq)(schema_1.supportTickets.ticketId, ticketId));
    return "Support tickets Updated SucccessFully";
};
exports.updateTicketServices = updateTicketServices;
// DELETE TICKET
const deleteTicketService = async (ticketId) => {
    await db_1.default.delete(schema_1.supportTickets).where((0, drizzle_orm_1.eq)(schema_1.supportTickets.ticketId, ticketId));
    return "ticket Deleted Successfully";
};
exports.deleteTicketService = deleteTicketService;

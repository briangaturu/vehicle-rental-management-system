"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRouter = void 0;
const express_1 = __importDefault(require("express"));
const supportTicket_controller_1 = require("./supportTicket.controller");
exports.ticketRouter = (0, express_1.default)();
//get all tickets
exports.ticketRouter.get('/ticket', supportTicket_controller_1.getAllTickets);
//get ticket by id
exports.ticketRouter.get('/ticket/:id', supportTicket_controller_1.getTicketById);
//get ticket by user id
exports.ticketRouter.get('/ticket/user/:id', supportTicket_controller_1.getTicketByUserId);
//search booking by date
//bookingRouter.get('/location-search',getLocationByName);
//create a ticket
exports.ticketRouter.post('/ticket', supportTicket_controller_1.createTicket);
//update ticket
exports.ticketRouter.patch('/ticket/:id', supportTicket_controller_1.updateTicket);
//delete ticket
exports.ticketRouter.delete('/ticket/:id', supportTicket_controller_1.deleteTicketById);

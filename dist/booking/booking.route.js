"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRouter = void 0;
const express_1 = __importDefault(require("express"));
const booking_contoller_1 = require("./booking.contoller");
exports.bookingRouter = (0, express_1.default)();
//get all bookings
exports.bookingRouter.get('/booking', booking_contoller_1.getAllBookings);
//get booking by id
exports.bookingRouter.get('/booking/:id', booking_contoller_1.getBookingById);
//get booking by user id
exports.bookingRouter.get('/booking/user/:id', booking_contoller_1.getBookingByUserId);
//search booking by date
//bookingRouter.get('/location-search',getLocationByName);
//create a booking
exports.bookingRouter.post('/booking', booking_contoller_1.createBooking);
//update booking
exports.bookingRouter.put('/booking/:id', booking_contoller_1.updateBooking);
//delete booking
exports.bookingRouter.delete('/booking/:id', booking_contoller_1.deleteBookingById);

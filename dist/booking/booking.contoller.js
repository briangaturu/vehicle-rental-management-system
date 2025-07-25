"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBookingById = exports.updateBooking = exports.createBooking = exports.getBookingByUserId = exports.getBookingById = exports.getAllBookings = void 0;
const booking_service_1 = require("./booking.service");
//get all bookings
const getAllBookings = async (req, res) => {
    try {
        const allBookings = await (0, booking_service_1.GetAllBookingService)();
        if (!allBookings) {
            res.status(404).json({ error: "No bookings found" });
        }
        else {
            res.status(200).json(allBookings);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to fetch Bookings" });
    }
};
exports.getAllBookings = getAllBookings;
//get bookings by id
const getBookingById = async (req, res) => {
    const bookingId = parseInt(req.params.id);
    if (isNaN(bookingId)) {
        res.status(400).json({ error: "invalid bookingId" });
        return;
    }
    try {
        const bookingById = await (0, booking_service_1.getBookingByIdService)(bookingId);
        if (!bookingId) {
            res.status(404).json({ error: "no booking found" });
        }
        else {
            res.status(200).json(bookingById);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to fetch booking" });
    }
};
exports.getBookingById = getBookingById;
//get bookings by user id
const getBookingByUserId = async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "invalid user id" });
        return;
    }
    try {
        const bookingByUserId = await (0, booking_service_1.getBookingByUserIdService)(userId);
        if (!bookingByUserId) {
            res.status(404).json({ error: "no booking found" });
        }
        else {
            res.status(200).json(bookingByUserId);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to fetch booking" });
    }
};
exports.getBookingByUserId = getBookingByUserId;
//creating a booking
const createBooking = async (req, res) => {
    const { bookingDate, returnDate, totalAmount, vehicleId, locationId, userId } = req.body;
    if (!bookingDate || !returnDate || !totalAmount || !vehicleId || !locationId || !userId) {
        res.status(400).json({ error: 'All fielsd are required!' });
        return;
    }
    try {
        const createBooking = await (0, booking_service_1.createBookingServices)({ bookingDate, returnDate, totalAmount, vehicleId, locationId, userId });
        if (!createBooking) {
            res.status(404).json({ error: "Failed to create a Booking" });
        }
        else {
            res.status(200).json(createBooking);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to create Booking" });
    }
};
exports.createBooking = createBooking;
//update booking
const updateBooking = async (req, res) => {
    const bookingId = parseInt(req.params.id);
    if (isNaN(bookingId)) {
        res.status(404).json({ error: "invalid booking id" });
        return;
    }
    const { bookingDate, returnDate, totalAmount } = req.body;
    if (!bookingDate || !returnDate || !totalAmount) {
        res.status(400).json({ error: 'All Fields are required!' });
        return;
    }
    try {
        const updateBooking = await (0, booking_service_1.updateBookingServices)(bookingId, { bookingDate, returnDate, totalAmount });
        if (!updateBooking) {
            res.status(404).json({ error: "Failed to update booking" });
        }
        else {
            res.status(200).json(updateBooking);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to update Bookings" });
    }
};
exports.updateBooking = updateBooking;
//delete a booking
const deleteBookingById = async (req, res) => {
    const bookingId = parseInt(req.params.id);
    if (isNaN(bookingId)) {
        res.status(404).json({ error: "Invalid booking id!" });
        return;
    }
    try {
        const deleteBooking = (0, booking_service_1.deleteBookingService)(bookingId);
        if (!deleteBooking) {
        }
        res.status(200).json({ message: "  Booking deleted successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to delete booking" });
    }
};
exports.deleteBookingById = deleteBookingById;

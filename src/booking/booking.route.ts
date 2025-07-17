import Router from "express"
import { createBooking, deleteBookingById, getAllBookings, getBookingById, getBookingByUserId, updateBooking } from "./booking.contoller";




export const bookingRouter = Router();

//get all bookings
bookingRouter.get('/booking',getAllBookings);

//get booking by id
bookingRouter.get('/booking/:id',getBookingById);

//get booking by user id
bookingRouter.get('/booking/user/:id',getBookingByUserId);


//search booking by date
//bookingRouter.get('/location-search',getLocationByName);

//create a booking
bookingRouter.post('/booking',createBooking);

//update booking
bookingRouter.put('/booking/:id',updateBooking);

//delete booking
bookingRouter.delete('/booking/:id',deleteBookingById);

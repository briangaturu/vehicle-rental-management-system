import {Request,Response} from "express";
import { createBookingServices, deleteBookingService, GetAllBookingService, getBookingByIdService, getBookingByUserIdService, updateBookingServices, checkVehicleAvailabilityService, getAvailableVehiclesService, debugVehicleBookingsService } from "./booking.service";



//get all bookings
export const getAllBookings = async(req:Request, res:Response)=>{
try {
    const allBookings = await GetAllBookingService();
    if(!allBookings){
        res.status(404).json({error:"No bookings found"})
    }else{
        res.status(200).json(allBookings)
    }
    
} catch (error:any) {
     res.status(500).json({error: error.message || "error occured Failed to fetch Bookings"})
}
}

//get bookings by id
export const getBookingById = async(req:Request,res:Response)=>{
const bookingId = parseInt(req.params.id);
if(isNaN(bookingId)){
    res.status(400).json({error:"invalid bookingId"})
    return;
}
try {
  const bookingById = await getBookingByIdService(bookingId);
  if(!bookingId)  
  {
    res.status(404).json({error:"no booking found"})
  }else{
    res.status(200).json(bookingById)
  }
} catch (error:any) {
     res.status(500).json({error: error.message || "error occured Failed to fetch booking"})
}
}

//get bookings by user id
export const getBookingByUserId = async(req:Request,res:Response)=>{
    const userId = parseInt(req.params.id);
    if(isNaN(userId)){
        res.status(400).json({error:"invalid user id"})
        return;
    }
    try {
        const bookingByUserId = await getBookingByUserIdService(userId);
        if(!bookingByUserId){
            res.status(404).json({error:"no booking found"})
        }else{
            res.status(200).json(bookingByUserId)
        }
    } catch (error:any) {
         res.status(500).json({error: error.message || "error occured Failed to fetch booking"})
    }
    }


//creating a booking
export const createBooking = async(req: Request, res: Response)=>{
    const {bookingDate,returnDate,totalAmount,vehicleId,locationId,userId}=req.body;
    if(!bookingDate || !returnDate || !totalAmount || !vehicleId || !locationId || !userId ){
        res.status(400).json({error: 'All fields are required!'})
        return;
    }

    // Validate date format
    const bookingDateObj = new Date(bookingDate);
    const returnDateObj = new Date(returnDate);
    
    if (isNaN(bookingDateObj.getTime()) || isNaN(returnDateObj.getTime())) {
        res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD format.' });
        return;
    }

    if (bookingDateObj >= returnDateObj) {
        res.status(400).json({ error: 'Return date must be after booking date!' });
        return;
    }

    try {
        // Check vehicle availability before creating booking
        const availability = await checkVehicleAvailabilityService(vehicleId, bookingDate, returnDate);
        
        if (!availability.available) {
            res.status(409).json({
                error: "Vehicle is not available for the selected dates",
                conflictingBookings: availability.conflictingBookings
            });
            return;
        }

        const createBooking = await createBookingServices({bookingDate, returnDate, totalAmount, vehicleId,locationId,userId});
        if(!createBooking){
            res.status(404).json({error:"Failed to create a Booking"})
        }else{
            res.status(201).json({
                message: "Booking created successfully",
                booking: createBooking
            })
        }
        
    } catch (error:any) {
       res.status(500).json({error: error.message || "error occurred Failed to create Booking"}) 
    }
}

//update booking
export const updateBooking =async(req:Request,res:Response)=>{
const bookingId = parseInt(req.params.id);
if(isNaN(bookingId)){
    res.status(404).json({error:"invalid booking id"})
    return
}

  const {bookingDate,returnDate,totalAmount}=req.body;
  if(!bookingDate || !returnDate || !totalAmount){
    res.status(400).json({error:'All Fields are required!'})
    return;
    }
  try {
    const  updateBooking = await updateBookingServices(bookingId,{bookingDate,returnDate,totalAmount});
    if(!updateBooking){
    res.status(404).json({error:"Failed to update booking"})
  }else{
    res.status(200).json(updateBooking)
  }
}catch (error:any) {
    res.status(500).json({error: error.message || "error occured Failed to update Bookings"})
}
}

//delete a booking
export const deleteBookingById = async(req: Request, res: Response ) =>{
    const bookingId = parseInt(req.params.id);
    if(isNaN(bookingId)){
        res.status(404).json({error: "Invalid booking id!"});
        return;
    }

    try {
        const deleteBooking = deleteBookingService(bookingId);
        if(!deleteBooking ){
            
        }
            res.status(200).json({message:  "  Booking deleted successfully"})
            return;
           
    } catch (error:any) {
        res.status(500).json({error: error.message || "error occured Failed to delete booking"})
    }
}

// Check vehicle availability for a date range
export const checkVehicleAvailability = async(req: Request, res: Response) => {
    const { vehicleId, bookingDate, returnDate } = req.body;
    
    if (!vehicleId || !bookingDate || !returnDate) {
        res.status(400).json({ error: 'Vehicle ID, booking date, and return date are required!' });
        return;
    }

    // Validate date format
    const bookingDateObj = new Date(bookingDate);
    const returnDateObj = new Date(returnDate);
    
    if (isNaN(bookingDateObj.getTime()) || isNaN(returnDateObj.getTime())) {
        res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD format.' });
        return;
    }

    if (bookingDateObj >= returnDateObj) {
        res.status(400).json({ error: 'Return date must be after booking date!' });
        return;
    }

    try {
        const availability = await checkVehicleAvailabilityService(vehicleId, bookingDate, returnDate);
        
        if (availability.available) {
            res.status(200).json({
                available: true,
                message: 'Vehicle is available for the selected dates',
                debug: availability.debug
            });
        } else {
            res.status(200).json({
                available: false,
                message: 'Vehicle is not available for the selected dates',
                conflictingBookings: availability.conflictingBookings,
                debug: availability.debug
            });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Error occurred while checking vehicle availability" });
    }
}

// Get all available vehicles for a date range
export const getAvailableVehicles = async(req: Request, res: Response) => {
    const { bookingDate, returnDate } = req.body;
    
    if (!bookingDate || !returnDate) {
        res.status(400).json({ error: 'Booking date and return date are required!' });
        return;
    }

    // Validate date format
    const bookingDateObj = new Date(bookingDate);
    const returnDateObj = new Date(returnDate);
    
    if (isNaN(bookingDateObj.getTime()) || isNaN(returnDateObj.getTime())) {
        res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD format.' });
        return;
    }

    if (bookingDateObj >= returnDateObj) {
        res.status(400).json({ error: 'Return date must be after booking date!' });
        return;
    }

    try {
        const availableVehicles = await getAvailableVehiclesService(bookingDate, returnDate);
        
        res.status(200).json({
            availableVehicles,
            count: availableVehicles.length,
            message: `Found ${availableVehicles.length} available vehicles for the selected dates`
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Error occurred while fetching available vehicles" });
    }
}

// Debug endpoint to check all bookings for a vehicle
export const debugVehicleBookings = async(req: Request, res: Response) => {
    const vehicleId = parseInt(req.params.vehicleId);
    
    if (isNaN(vehicleId)) {
        res.status(400).json({ error: 'Invalid vehicle ID' });
        return;
    }

    try {
        const debugInfo = await debugVehicleBookingsService(vehicleId);
        res.status(200).json(debugInfo);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Error occurred while debugging vehicle bookings" });
    }
}

import {Request,Response} from "express";
import { createBookingServices, deleteBookingService, GetAllBookingService, getBookingByIdService, updateBookingServices } from "./booking.service";



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

//creating a booking
export const createBooking = async(req: Request, res: Response)=>{
    const {bookingDate,returnDate,totalAmount,vehicleId,locationId,userId}=req.body;
    if(!bookingDate || !returnDate || !totalAmount || !vehicleId || !locationId || !userId ){
        res.status(400).json({error: 'All fielsd are required!'})
        return;
    }
    try {
        const createBooking =await  createBookingServices({bookingDate, returnDate, totalAmount, vehicleId,locationId,userId});
        if(!createBooking){
            res.status(404).json({error:"Failed to create a Booking"})
        }else{
            res.status(200).json(createBooking)
        }
        
    } catch (error:any) {
       res.status(500).json({error: error.message || "error occured Failed to create Booking"}) 
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

import { desc, eq, ilike } from "drizzle-orm";
import db from "../drizzle/db";
import { bookings, TBookingInsert,TBookingSelect, } from "../drizzle/schema";

// Get bookings
export const GetAllBookingService = async(): Promise<TBookingSelect[]>=>{
    return await db.query.bookings.findMany({
        orderBy: [desc(bookings.bookingId)]
    });
}

// Get Booking By Id
export const getBookingByIdService = async(bookingId: number): Promise<TBookingSelect | undefined> =>{
    return await db.query.bookings.findFirst({
        where: eq(bookings.bookingId, bookingId),
       
    })
}

// cREATING BOOKINGS
export const createBookingServices = async(booking: TBookingInsert):Promise<string> =>{
    await db.insert(bookings).values(booking).returning();
    return "Booking Created SucccessFully"
}

// Updating SpecS
export const updateBookingServices = async(bookingId: number,booking: Partial<TBookingInsert>):Promise<string> =>{
    await db.update(bookings).set(booking).where(eq(bookings.bookingId, bookingId))
    return "booking Updated SucccessFully"
}

// DELETE SPECS
export const deleteBookingService = async(bookingId : number) =>{
    await db.delete(bookings).where(eq(bookings.bookingId, bookingId));
    return "Booking Deleted Successfully"
}
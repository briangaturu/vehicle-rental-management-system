import { desc, eq, ilike } from "drizzle-orm";
import db from "../drizzle/db";
import { bookings, TBookingInsert,TBookingSelect, } from "../drizzle/schema";

// Get bookings
export const GetAllBookingService = async(): Promise<TBookingSelect[]>=>{
    return await db.query.bookings.findMany({
         with:{
           user:true,
              vehicle: {
                 with: {
                vehicleSpec: true
                 }
              }, 
               location: true,
        payments: true,
        },
       
        orderBy: [desc(bookings.bookingId)]
    
    });
}

// Get Booking By Id
export const getBookingByIdService = async(bookingId: number): Promise<TBookingSelect | undefined> =>{
    return await db.query.bookings.findFirst({
        where: eq(bookings.bookingId, bookingId),
         with:{
           user:{
            columns: {
                userId: true,
                firstname: true,
                lastname: true,
                email: true,
                contact: true,
            }
                      },
              vehicle: {
                columns:{
                    vehicleId:true,
                    rentalRate: true,
                    availability: true,
                },
                 with: {
                vehicleSpec:{
                    columns:{
                        manufacturer: true,
                        model: true,
                        year: true,
                        color: true,
                        transmission: true,
                        engineCapacity: true,
                        fuelType: true,
                        seatingCapacity: true,
                        features: true,
                    }
                }
                 }
              }, 
               location:{
                columns:{
                    locationId: true,
                    name: true,
                    address: true,
                    contact: true,
                }
               },
        payments:{
            columns:{
                bookingId: true,
                amount: true,
                paymentDate: true,
                paymentStatus: true,
                paymentMethod: true,
            }
        },
        },
       
    })
}

//get bookings by user id
export const getBookingByUserIdService = async(userId: number): Promise<TBookingSelect[]>=>{
    return await db.query.bookings.findMany({
        where: eq(bookings.userId, userId),
         with:{
           user:true,
              vehicle: {
                 with: {
                vehicleSpec: true
                 }
              }, 
               location: true,
        payments: true,
        },
       
        orderBy: [desc(bookings.bookingId)]
    
    });
}

// cREATING BOOKINGS
export const createBookingServices = async(booking: TBookingInsert):Promise<TBookingSelect> =>{
 const [newBooking] =   await db.insert(bookings).values(booking).returning();
    return newBooking;
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
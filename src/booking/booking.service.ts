import { desc, eq, ilike, and, gte, lte, or } from "drizzle-orm";
import db from "../drizzle/db";
import { bookings, vehicles, TBookingInsert,TBookingSelect, } from "../drizzle/schema";

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

// Check vehicle availability for a date range
export const checkVehicleAvailabilityService = async(
  vehicleId: number, 
  bookingDate: string, 
  returnDate: string
): Promise<{ available: boolean; conflictingBookings?: any[]; debug?: any }> => {
  try {
    // First check if the vehicle is generally available
    const vehicle = await db.query.vehicles.findFirst({
      where: eq(vehicles.vehicleId, vehicleId),
      columns: {
        availability: true,
        vehicleId: true
      }
    });

    if (!vehicle || !vehicle.availability) {
      return { available: false };
    }

    // Check for conflicting bookings in the date range
    const conflictingBookings = await db.query.bookings.findMany({
      where: and(
        eq(bookings.vehicleId, vehicleId),
        or(
          // Existing booking overlaps with new booking period
          and(
            lte(bookings.bookingDate, returnDate),
            gte(bookings.returnDate, bookingDate)
          )
        ),
        // Only consider active bookings (not cancelled)
        or(
          eq(bookings.bookingStatus, "Confirmed"),
          eq(bookings.bookingStatus, "Pending")
        )
      ),
      columns: {
        bookingId: true,
        bookingDate: true,
        returnDate: true,
        bookingStatus: true
      }
    });

    return {
      available: conflictingBookings.length === 0,
      conflictingBookings: conflictingBookings.length > 0 ? conflictingBookings : undefined,
      debug: {
        vehicleId,
        requestedBookingDate: bookingDate,
        requestedReturnDate: returnDate,
        conflictingBookingsCount: conflictingBookings.length
      }
    };
  } catch (error) {
    throw new Error(`Failed to check vehicle availability: ${error}`);
  }
}

// Get available vehicles for a date range
export const getAvailableVehiclesService = async(
  bookingDate: string, 
  returnDate: string
): Promise<any[]> => {
  try {
    // Get all vehicles that are generally available
    const allVehicles = await db.query.vehicles.findMany({
      where: eq(vehicles.availability, true),
      with: {
        vehicleSpec: true
      }
    });

    const availableVehicles = [];

    for (const vehicle of allVehicles) {
      const availability = await checkVehicleAvailabilityService(
        vehicle.vehicleId, 
        bookingDate, 
        returnDate
      );
      
      if (availability.available) {
        availableVehicles.push(vehicle);
      }
    }

    return availableVehicles;
  } catch (error) {
    throw new Error(`Failed to get available vehicles: ${error}`);
  }
}

// Debug function to check what bookings exist for a vehicle
export const debugVehicleBookingsService = async(vehicleId: number): Promise<any> => {
  try {
    const vehicle = await db.query.vehicles.findFirst({
      where: eq(vehicles.vehicleId, vehicleId),
      columns: {
        vehicleId: true,
        availability: true
      }
    });

    if (!vehicle) {
      return { error: "Vehicle not found" };
    }

    const allBookings = await db.query.bookings.findMany({
      where: eq(bookings.vehicleId, vehicleId),
      columns: {
        bookingId: true,
        bookingDate: true,
        returnDate: true,
        bookingStatus: true
      },
      orderBy: [bookings.bookingDate]
    });

    return {
      vehicle,
      totalBookings: allBookings.length,
      bookings: allBookings
    };
  } catch (error) {
    throw new Error(`Failed to debug vehicle bookings: ${error}`);
  }
}
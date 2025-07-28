"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugVehicleBookingsService = exports.getAvailableVehiclesService = exports.checkVehicleAvailabilityService = exports.deleteBookingService = exports.updateBookingServices = exports.createBookingServices = exports.getBookingByUserIdService = exports.getBookingByIdService = exports.GetAllBookingService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
// Get bookings
const GetAllBookingService = async () => {
    return await db_1.default.query.bookings.findMany({
        with: {
            user: true,
            vehicle: {
                with: {
                    vehicleSpec: true
                }
            },
            location: true,
            payments: true,
        },
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.bookings.bookingId)]
    });
};
exports.GetAllBookingService = GetAllBookingService;
// Get Booking By Id
const getBookingByIdService = async (bookingId) => {
    return await db_1.default.query.bookings.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, bookingId),
        with: {
            user: {
                columns: {
                    userId: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                    contact: true,
                }
            },
            vehicle: {
                columns: {
                    vehicleId: true,
                    rentalRate: true,
                    availability: true,
                },
                with: {
                    vehicleSpec: {
                        columns: {
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
            location: {
                columns: {
                    locationId: true,
                    name: true,
                    address: true,
                    contact: true,
                }
            },
            payments: {
                columns: {
                    bookingId: true,
                    amount: true,
                    paymentDate: true,
                    paymentStatus: true,
                    paymentMethod: true,
                }
            },
        },
    });
};
exports.getBookingByIdService = getBookingByIdService;
//get bookings by user id
const getBookingByUserIdService = async (userId) => {
    return await db_1.default.query.bookings.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.bookings.userId, userId),
        with: {
            user: true,
            vehicle: {
                with: {
                    vehicleSpec: true
                }
            },
            location: true,
            payments: true,
        },
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.bookings.bookingId)]
    });
};
exports.getBookingByUserIdService = getBookingByUserIdService;
// cREATING BOOKINGS
const createBookingServices = async (booking) => {
    const [newBooking] = await db_1.default.insert(schema_1.bookings).values(booking).returning();
    return newBooking;
};
exports.createBookingServices = createBookingServices;
// Updating SpecS
const updateBookingServices = async (bookingId, booking) => {
    await db_1.default.update(schema_1.bookings).set(booking).where((0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, bookingId));
    return "booking Updated SucccessFully";
};
exports.updateBookingServices = updateBookingServices;
// DELETE SPECS
const deleteBookingService = async (bookingId) => {
    await db_1.default.delete(schema_1.bookings).where((0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, bookingId));
    return "Booking Deleted Successfully";
};
exports.deleteBookingService = deleteBookingService;
// Check vehicle availability for a date range
const checkVehicleAvailabilityService = async (vehicleId, bookingDate, returnDate) => {
    try {
        // First check if the vehicle is generally available
        const vehicle = await db_1.default.query.vehicles.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.vehicles.vehicleId, vehicleId),
            columns: {
                availability: true,
                vehicleId: true
            }
        });
        if (!vehicle || !vehicle.availability) {
            return { available: false };
        }
        // Check for conflicting bookings in the date range
        const conflictingBookings = await db_1.default.query.bookings.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.vehicleId, vehicleId), (0, drizzle_orm_1.or)(
            // Existing booking overlaps with new booking period
            (0, drizzle_orm_1.and)((0, drizzle_orm_1.lte)(schema_1.bookings.bookingDate, returnDate), (0, drizzle_orm_1.gte)(schema_1.bookings.returnDate, bookingDate))), 
            // Only consider active bookings (not cancelled)
            (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.bookings.bookingStatus, "Confirmed"), (0, drizzle_orm_1.eq)(schema_1.bookings.bookingStatus, "Pending"))),
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
    }
    catch (error) {
        throw new Error(`Failed to check vehicle availability: ${error}`);
    }
};
exports.checkVehicleAvailabilityService = checkVehicleAvailabilityService;
// Get available vehicles for a date range
const getAvailableVehiclesService = async (bookingDate, returnDate) => {
    try {
        // Get all vehicles that are generally available
        const allVehicles = await db_1.default.query.vehicles.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.vehicles.availability, true),
            with: {
                vehicleSpec: true
            }
        });
        const availableVehicles = [];
        for (const vehicle of allVehicles) {
            const availability = await (0, exports.checkVehicleAvailabilityService)(vehicle.vehicleId, bookingDate, returnDate);
            if (availability.available) {
                availableVehicles.push(vehicle);
            }
        }
        return availableVehicles;
    }
    catch (error) {
        throw new Error(`Failed to get available vehicles: ${error}`);
    }
};
exports.getAvailableVehiclesService = getAvailableVehiclesService;
// Debug function to check what bookings exist for a vehicle
const debugVehicleBookingsService = async (vehicleId) => {
    try {
        const vehicle = await db_1.default.query.vehicles.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.vehicles.vehicleId, vehicleId),
            columns: {
                vehicleId: true,
                availability: true
            }
        });
        if (!vehicle) {
            return { error: "Vehicle not found" };
        }
        const allBookings = await db_1.default.query.bookings.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.bookings.vehicleId, vehicleId),
            columns: {
                bookingId: true,
                bookingDate: true,
                returnDate: true,
                bookingStatus: true
            },
            orderBy: [schema_1.bookings.bookingDate]
        });
        return {
            vehicle,
            totalBookings: allBookings.length,
            bookings: allBookings
        };
    }
    catch (error) {
        throw new Error(`Failed to debug vehicle bookings: ${error}`);
    }
};
exports.debugVehicleBookingsService = debugVehicleBookingsService;

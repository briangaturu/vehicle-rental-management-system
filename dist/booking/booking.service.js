"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBookingService = exports.updateBookingServices = exports.createBookingServices = exports.getBookingByUserIdService = exports.getBookingByIdService = exports.GetAllBookingService = void 0;
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

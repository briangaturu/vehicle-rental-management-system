"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicleServices = exports.updateVehicleServices = exports.createVehicleServices = exports.getVehicleByIdServices = exports.getVehiclesServices = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
// Get all vehicles
const getVehiclesServices = async () => {
    return await db_1.default.query.vehicles.findMany({
        with: {
            vehicleSpec: true,
        },
        orderBy: (vehicles, { desc }) => [desc(vehicles.createdAt)],
    });
};
exports.getVehiclesServices = getVehiclesServices;
// Get vehicle by ID
const getVehicleByIdServices = async (vehicleId) => {
    return await db_1.default.query.vehicles.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.vehicles.vehicleId, vehicleId),
        with: {
            vehicleSpec: true,
        },
    });
};
exports.getVehicleByIdServices = getVehicleByIdServices;
// Create vehicle (assumes vehicleSpecId is provided in the input)
const createVehicleServices = async (
// Define an explicit type for the incoming payload from the controller
// This ensures rentalRate is expected as a number from the controller
// but matches the DB schema's inferred string type for insertion.
vehicleData) => {
    // Normalize availability value from string ("Available") or boolean to boolean for database insertion
    const isAvailable = typeof vehicleData.availability === "string"
        ? vehicleData.availability === "Available" || vehicleData.availability === "true"
        : vehicleData.availability;
    // ✨ CRITICAL FIX: Convert rentalRate from number to string to match Drizzle's inferred TVehicleInsert type for 'numeric' DB columns.
    const rentalRateForDb = String(vehicleData.rentalRate);
    const [newVehicle] = await db_1.default
        .insert(schema_1.vehicles)
        .values({
        rentalRate: rentalRateForDb, // Use the string representation for Drizzle
        availability: isAvailable, // Apply normalized boolean availability
        imageUrl: vehicleData.imageUrl,
        vehicleSpecId: vehicleData.vehicleSpecId,
    }) // Assert to TVehicleInsert to satisfy Drizzle's type check
        .returning(); // Use .returning() to get the newly inserted vehicle
    return newVehicle;
};
exports.createVehicleServices = createVehicleServices;
// Update a vehicle
const updateVehicleServices = async (vehicleId, 
// Define an explicit type for the incoming payload for update
// Similar to create, rentalRate will come as a number from the controller.
updateData) => {
    // Convert rentalRate to string if present in updateData
    const rentalRateForDb = updateData.rentalRate !== undefined ? String(updateData.rentalRate) : undefined;
    // Normalize availability if present
    const isAvailable = updateData.availability !== undefined
        ? (typeof updateData.availability === "string"
            ? updateData.availability === "Available" || updateData.availability === "true"
            : updateData.availability)
        : undefined;
    const [updated] = await db_1.default
        .update(schema_1.vehicles)
        .set({
        rentalRate: rentalRateForDb,
        availability: isAvailable,
        imageUrl: updateData.imageUrl,
        vehicleSpecId: updateData.vehicleSpecId,
    }) // Assert to TVehicleInsert
        .where((0, drizzle_orm_1.eq)(schema_1.vehicles.vehicleId, vehicleId))
        .returning(); // Use .returning() to get the updated vehicle
    return updated; // Will be undefined if no row was updated
};
exports.updateVehicleServices = updateVehicleServices;
// Delete a vehicle
const deleteVehicleServices = async (vehicleId) => {
    // Drizzle's delete returns an array of the deleted rows or an empty array if nothing was deleted
    const deletedVehicles = await db_1.default
        .delete(schema_1.vehicles)
        .where((0, drizzle_orm_1.eq)(schema_1.vehicles.vehicleId, vehicleId))
        .returning(); // Use .returning() to check if a row was actually deleted
    return deletedVehicles.length > 0; // Check if any rows were returned (i.e., deleted)
};
exports.deleteVehicleServices = deleteVehicleServices;

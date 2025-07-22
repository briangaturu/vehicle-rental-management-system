import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  TVehicleInsert,
  TVehicleSelect,
  vehicles,
} from "../drizzle/schema";

// Get all vehicles
export const getVehiclesServices = async (): Promise<TVehicleSelect[]> => {
  return await db.query.vehicles.findMany({
    with: {
      vehicleSpec: true,
    },
    orderBy: (vehicles, { desc }) => [desc(vehicles.createdAt)],
  });
};

// Get vehicle by ID
export const getVehicleByIdServices = async (
  vehicleId: number
): Promise<TVehicleSelect | undefined> => {
  return await db.query.vehicles.findFirst({
    where: eq(vehicles.vehicleId, vehicleId),
    with: {
      vehicleSpec: true,
    },
  });
};

// Create vehicle (assumes vehicleSpecId is provided in the input)
export const createVehicleServices = async (
  // Define an explicit type for the incoming payload from the controller
  // This ensures rentalRate is expected as a number from the controller
  // but matches the DB schema's inferred string type for insertion.
  vehicleData: {
    rentalRate: number; // Expect number from the controller
    availability: boolean | string; // Handle boolean or string from controller
    imageUrl?: string | null;
    vehicleSpecId: number;
  }
): Promise<TVehicleSelect> => {
  // Normalize availability value from string ("Available") or boolean to boolean for database insertion
  const isAvailable =
    typeof vehicleData.availability === "string"
      ? vehicleData.availability === "Available" || vehicleData.availability === "true"
      : vehicleData.availability;

  // ✨ CRITICAL FIX: Convert rentalRate from number to string to match Drizzle's inferred TVehicleInsert type for 'numeric' DB columns.
  const rentalRateForDb = String(vehicleData.rentalRate);

  const [newVehicle] = await db
    .insert(vehicles)
    .values({
      rentalRate: rentalRateForDb, // Use the string representation for Drizzle
      availability: isAvailable, // Apply normalized boolean availability
      imageUrl: vehicleData.imageUrl,
      vehicleSpecId: vehicleData.vehicleSpecId,
    } as TVehicleInsert) // Assert to TVehicleInsert to satisfy Drizzle's type check
    .returning(); // Use .returning() to get the newly inserted vehicle
  return newVehicle;
};

// Update a vehicle
export const updateVehicleServices = async (
  vehicleId: number,
  // Define an explicit type for the incoming payload for update
  // Similar to create, rentalRate will come as a number from the controller.
  updateData: {
    rentalRate?: number;
    availability?: boolean | string;
    imageUrl?: string | null;
    vehicleSpecId?: number;
  }
): Promise<TVehicleSelect | undefined> => { // Changed return type to include undefined for no update
  // Convert rentalRate to string if present in updateData
  const rentalRateForDb = updateData.rentalRate !== undefined ? String(updateData.rentalRate) : undefined;

  // Normalize availability if present
  const isAvailable = updateData.availability !== undefined
    ? (typeof updateData.availability === "string"
      ? updateData.availability === "Available" || updateData.availability === "true"
      : updateData.availability)
    : undefined;

  const [updated] = await db
    .update(vehicles)
    .set({
      rentalRate: rentalRateForDb,
      availability: isAvailable,
      imageUrl: updateData.imageUrl,
      vehicleSpecId: updateData.vehicleSpecId,
    } as TVehicleInsert) // Assert to TVehicleInsert
    .where(eq(vehicles.vehicleId, vehicleId))
    .returning(); // Use .returning() to get the updated vehicle

  return updated; // Will be undefined if no row was updated
};


// Delete a vehicle
export const deleteVehicleServices = async (
  vehicleId: number
): Promise<boolean> => {
  // Drizzle's delete returns an array of the deleted rows or an empty array if nothing was deleted
  const deletedVehicles = await db
    .delete(vehicles)
    .where(eq(vehicles.vehicleId, vehicleId))
    .returning(); // Use .returning() to check if a row was actually deleted

  return deletedVehicles.length > 0; // Check if any rows were returned (i.e., deleted)
};
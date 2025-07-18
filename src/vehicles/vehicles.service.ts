import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  TVehicleInsert,
  TVehicleSelect,
  vehicles,
  vehicleSpecifications,
  TVehicleSpecificationInsert,
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

// ✅ CREATE vehicle AND spec TOGETHER
export const createVehicleAndSpecServices = async ({
  rentalRate,
  availability,
  vehicleSpec,
}: {
  rentalRate: string ;
  availability?: string | boolean;
  vehicleSpec: TVehicleSpecificationInsert;
}): Promise<TVehicleSelect> => {
  // Normalize availability value
  const isAvailable =
    availability === "Available" || availability === true ? true : false;

  // Step 1: Insert spec
  const [newSpec] = await db
    .insert(vehicleSpecifications)
    .values(vehicleSpec)
    .returning({ vehicleSpecId: vehicleSpecifications.vehicleSpecId });

  // Step 2: Insert vehicle with reference to spec
  const [newVehicle] = await db
    .insert(vehicles)
    .values({
      rentalRate,
      availability: isAvailable,
      vehicleSpecId: newSpec.vehicleSpecId,
    })
    .returning();

  return newVehicle;
};

// Create vehicle with existing spec
export const createVehicleServices = async (
  vehicle: TVehicleInsert
): Promise<TVehicleSelect> => {
  const [newVehicle] = await db.insert(vehicles).values(vehicle).returning();
  return newVehicle;
};

// Update a vehicle
export const updateVehicleServices = async (
  vehicleId: number,
  vehicle: TVehicleInsert
): Promise<TVehicleSelect> => {
  const [updated] = await db
    .update(vehicles)
    .set(vehicle)
    .where(eq(vehicles.vehicleId, vehicleId))
    .returning();

  return updated;
};

// Delete a vehicle
export const deleteVehicleServices = async (
  vehicleId: number
): Promise<boolean> => {
  const deleted = await db
    .delete(vehicles)
    .where(eq(vehicles.vehicleId, vehicleId));

  return deleted.rowCount !==null && deleted.rowCount > 0;
};

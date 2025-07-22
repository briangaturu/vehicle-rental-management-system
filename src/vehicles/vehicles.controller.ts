import { Response, Request } from "express";
import {
  createVehicleServices,
  deleteVehicleServices,
  getVehicleByIdServices,
  getVehiclesServices,
  updateVehicleServices,
} from "./vehicles.service";

// GET all vehicles
export const getVehicles = async (req: Request, res: Response) => {
  try {
    const allVehicles = await getVehiclesServices();
    if (!allVehicles || allVehicles.length === 0) {
      return res.status(404).json({ message: "No vehicles found" });
    }
    return res.status(200).json(allVehicles);
  } catch (error: any) {
    console.error("❌ Error fetching vehicles:", error); // Log error for debugging
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch vehicles" });
  }
};

// GET vehicle by ID
export const getVehicleById = async (req: Request, res: Response) => {
  const vehicleId = parseInt(req.params.id);
  if (isNaN(vehicleId) || vehicleId <= 0) { // Added check for positive ID
    return res.status(400).json({ error: "Invalid vehicle ID provided" });
  }

  try {
    const vehicle = await getVehicleByIdServices(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.status(200).json(vehicle);
  } catch (error: any) {
    console.error(`❌ Error fetching vehicle with ID ${vehicleId}:`, error); // Log error
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch vehicle" });
  }
};

// CREATE vehicle (now requires an existing vehicleSpecId)
export const createVehicle = async (req: Request, res: Response) => {
  const { rentalRate, availability, imageUrl, vehicleSpecId } = req.body;

  // 1. Basic type and presence validation
  //    - rentalRate should be a number and positive
  //    - vehicleSpecId should be a number and positive
  if (
    typeof rentalRate !== "number" ||
    rentalRate <= 0 ||
    typeof vehicleSpecId !== "number" ||
    vehicleSpecId <= 0
  ) {
    // Provide more specific error messages for clarity
    const errors: string[] = [];
    if (typeof rentalRate !== "number" || rentalRate <= 0) {
      errors.push("rentalRate must be a positive number.");
    }
    if (typeof vehicleSpecId !== "number" || vehicleSpecId <= 0) {
      errors.push("vehicleSpecId must be a positive number.");
    }
    return res.status(400).json({
      error: errors.join(" "), // Join multiple errors
    });
  }

  // Normalize availability for consistency if it comes as a string from a form
  // The frontend already sends a boolean, but this adds robustness.
  const normalizedAvailability = typeof availability === 'boolean'
    ? availability
    : (availability === 'Available' || availability === 'true');


  try {
    const newVehicle = await createVehicleServices({
      rentalRate, // Pass as number to service, service will convert to string for Drizzle
      availability: normalizedAvailability,
      imageUrl,
      vehicleSpecId,
    });

    return res.status(201).json(newVehicle);
  } catch (error: any) {
    console.error("❌ Error creating vehicle:", error);
    // Improve error handling for common DB errors, e.g., foreign key constraint
    if (error.code === 'P2003') { // Prisma error code for Foreign Key Constraint Failed (common if vehicleSpecId doesn't exist)
      return res.status(400).json({ error: "Invalid vehicleSpecId. The specified vehicle specification does not exist." });
    }
    return res
      .status(500)
      .json({ error: error.message || "Failed to create vehicle" });
  }
};

// PUT / UPDATE vehicle (existing spec only)
export const updateVehicle = async (req: Request, res: Response) => {
  const vehicleId = parseInt(req.params.id);
  if (isNaN(vehicleId) || vehicleId <= 0) {
    return res.status(400).json({ error: "Invalid vehicle ID provided" });
  }

  const { rentalRate, availability, imageUrl, vehicleSpecId } = req.body;

  // Prepare update data, allowing partial updates
  const updatePayload: {
    rentalRate?: number;
    availability?: boolean | string;
    imageUrl?: string | null;
    vehicleSpecId?: number;
  } = {};

  // Validate and add fields to updatePayload if they exist and are valid
  if (rentalRate !== undefined) {
    if (typeof rentalRate !== "number" || rentalRate <= 0) {
      return res.status(400).json({ error: "Invalid rentalRate: must be a positive number if provided." });
    }
    updatePayload.rentalRate = rentalRate;
  }

  if (availability !== undefined) {
    // Normalize availability if it's provided
    updatePayload.availability = typeof availability === 'boolean'
      ? availability
      : (availability === 'Available' || availability === 'true');
  }

  if (imageUrl !== undefined) {
    if (typeof imageUrl !== "string" && imageUrl !== null) { // Allow string or null
      return res.status(400).json({ error: "Invalid imageUrl: must be a string or null if provided." });
    }
    updatePayload.imageUrl = imageUrl;
  }

  if (vehicleSpecId !== undefined) {
    if (typeof vehicleSpecId !== "number" || vehicleSpecId <= 0) {
      return res.status(400).json({ error: "Invalid vehicleSpecId: must be a positive number if provided." });
    }
    updatePayload.vehicleSpecId = vehicleSpecId;
  }

  // Ensure at least one field is provided for update
  if (Object.keys(updatePayload).length === 0) {
    return res.status(400).json({ error: "No valid fields provided for update." });
  }

  try {
    const updated = await updateVehicleServices(vehicleId, updatePayload);
    if (!updated) { // Service now returns undefined if no update occurred
        return res.status(404).json({ message: "Vehicle not found or no changes made." });
    }
    return res.status(200).json(updated);
  } catch (error: any) {
    console.error(`❌ Error updating vehicle with ID ${vehicleId}:`, error);
    if (error.code === 'P2003') { // Prisma Foreign Key Constraint Failed error code
      return res.status(400).json({ error: "Invalid vehicleSpecId. The specified vehicle specification does not exist." });
    }
    return res
      .status(500)
      .json({ error: error.message || "Failed to update vehicle" });
  }
};

// DELETE vehicle
export const deleteVehicle = async (req: Request, res: Response) => {
  const vehicleId = parseInt(req.params.id);
  if (isNaN(vehicleId) || vehicleId <= 0) { // Added check for positive ID
    return res.status(400).json({ error: "Invalid vehicle ID provided" });
  }

  try {
    const deleted = await deleteVehicleServices(vehicleId);
    if (!deleted) { // Service now returns false if no row was deleted
      return res.status(404).json({ message: "Vehicle not found." });
    }
    return res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error: any) {
    console.error(`❌ Error deleting vehicle with ID ${vehicleId}:`, error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to delete vehicle" });
  }
};
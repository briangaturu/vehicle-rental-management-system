import { Response, Request } from "express";
import {
  createVehicleAndSpecServices,
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
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch vehicles" });
  }
};

// GET vehicle by ID
export const getVehicleById = async (req: Request, res: Response) => {
  const vehicleId = parseInt(req.params.id);
  if (isNaN(vehicleId)) {
    return res.status(400).json({ error: "Invalid vehicle ID" });
  }

  try {
    const vehicle = await getVehicleByIdServices(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.status(200).json(vehicle);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch vehicle" });
  }
};

// ✅ CREATE vehicle + spec together
export const createVehicle = async (req: Request, res: Response) => {
  const { rentalRate, availability, vehicleSpec } = req.body;

  if (
    typeof rentalRate !== "string" ||
    !vehicleSpec ||
    !vehicleSpec.model ||
    !vehicleSpec.brand ||
    !vehicleSpec.year
  ) {
    return res.status(400).json({
      error: "Missing required fields: rentalRate, vehicleSpec.model, brand, year",
    });
  }

  try {
    const newVehicle = await createVehicleAndSpecServices({
      rentalRate,
      availability,
      vehicleSpec,
    });

    return res.status(201).json(newVehicle);
  } catch (error: any) {
    console.error("❌ Error creating vehicle:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to create vehicle" });
  }
};

// PUT / UPDATE vehicle (existing spec only)
export const updateVehicle = async (req: Request, res: Response) => {
  const vehicleId = parseInt(req.params.id);
  if (isNaN(vehicleId)) {
    return res.status(400).json({ error: "Invalid vehicle ID" });
  }

  const { rentalRate, availability, vehicleSpecId } = req.body;

  if (
    typeof rentalRate !== "string" ||
    typeof availability === "undefined" ||
    typeof vehicleSpecId !== "number"
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const vehicle = {
    rentalRate,
    availability: availability === "Available" || availability === true,
    vehicleSpecId,
  };

  try {
    const updated = await updateVehicleServices(vehicleId, vehicle);
    return res.status(200).json(updated);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to update vehicle" });
  }
};

// DELETE vehicle
export const deleteVehicle = async (req: Request, res: Response) => {
  const vehicleId = parseInt(req.params.id);
  if (isNaN(vehicleId)) {
    return res.status(400).json({ error: "Invalid vehicle ID" });
  }

  try {
    const deleted = await deleteVehicleServices(vehicleId);
    if (!deleted) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to delete vehicle" });
  }
};

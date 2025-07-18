import { Request, Response } from "express";
import {
  createLocationServices,
  deleteLocationService,
  getAllLocationServices,
  getLocationByIdServices,
  getLocationByNameServices,
  updateLocationServices,
} from "./location.service";

// Get all locations
export const getAllLocation = async (req: Request, res: Response) => {
  try {
    const allLocations = await getAllLocationServices();
    if (!allLocations || allLocations.length === 0) {
      return res.status(404).json({ error: "No locations found" });
    }
    res.status(200).json(allLocations);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch locations" });
  }
};

// Get location by ID
export const getLocationById = async (req: Request, res: Response) => {
  const locationId = parseInt(req.params.id);
  if (isNaN(locationId)) {
    return res.status(400).json({ error: "Invalid location ID" });
  }

  try {
    const location = await getLocationByIdServices(locationId);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.status(200).json(location);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch location" });
  }
};

// Get location by name
export const getLocationByName = async (req: Request, res: Response) => {
  const name = req.query.name as string;
  if (!name) {
    return res.status(400).json({ error: "Location name is required" });
  }

  try {
    const locations = await getLocationByNameServices(name);
    if (!locations || locations.length === 0) {
      return res.status(404).json({ error: "No location found with that name" });
    }
    res.status(200).json(locations);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to search locations" });
  }
};

// Create location
export const createLocation = async (req: Request, res: Response) => {
  const { name, address, contact } = req.body;
  if (!name || !address || !contact) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await createLocationServices({ name, address, contact });
    res.status(201).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create location" });
  }
};

// Update location
export const updateLocation = async (req: Request, res: Response) => {
  const locationId = parseInt(req.params.id);
  if (isNaN(locationId)) {
    return res.status(400).json({ error: "Invalid location ID" });
  }

  const { name, address, contact } = req.body;
  if (!name || !address || !contact) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await updateLocationServices(locationId, { name, address, contact });
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update location" });
  }
};

// Delete location
export const deleteLocationById = async (req: Request, res: Response) => {
  const locationId = parseInt(req.params.id);
  if (isNaN(locationId)) {
    return res.status(400).json({ error: "Invalid location ID" });
  }

  try {
    await deleteLocationService(locationId);
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete location" });
  }
};

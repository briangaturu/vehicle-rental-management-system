"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocationById = exports.updateLocation = exports.createLocation = exports.getLocationByName = exports.getLocationById = exports.getAllLocation = void 0;
const location_service_1 = require("./location.service");
// Get all locations
const getAllLocation = async (req, res) => {
    try {
        const allLocations = await (0, location_service_1.getAllLocationServices)();
        if (!allLocations || allLocations.length === 0) {
            return res.status(404).json({ error: "No locations found" });
        }
        res.status(200).json(allLocations);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch locations" });
    }
};
exports.getAllLocation = getAllLocation;
// Get location by ID
const getLocationById = async (req, res) => {
    const locationId = parseInt(req.params.id);
    if (isNaN(locationId)) {
        return res.status(400).json({ error: "Invalid location ID" });
    }
    try {
        const location = await (0, location_service_1.getLocationByIdServices)(locationId);
        if (!location) {
            return res.status(404).json({ error: "Location not found" });
        }
        res.status(200).json(location);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch location" });
    }
};
exports.getLocationById = getLocationById;
// Get location by name
const getLocationByName = async (req, res) => {
    const name = req.query.name;
    if (!name) {
        return res.status(400).json({ error: "Location name is required" });
    }
    try {
        const locations = await (0, location_service_1.getLocationByNameServices)(name);
        if (!locations || locations.length === 0) {
            return res.status(404).json({ error: "No location found with that name" });
        }
        res.status(200).json(locations);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to search locations" });
    }
};
exports.getLocationByName = getLocationByName;
// Create location
const createLocation = async (req, res) => {
    const { name, address, contact } = req.body;
    if (!name || !address || !contact) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const result = await (0, location_service_1.createLocationServices)({ name, address, contact });
        res.status(201).json({ message: result });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to create location" });
    }
};
exports.createLocation = createLocation;
// Update location
const updateLocation = async (req, res) => {
    const locationId = parseInt(req.params.id);
    if (isNaN(locationId)) {
        return res.status(400).json({ error: "Invalid location ID" });
    }
    const { name, address, contact } = req.body;
    if (!name || !address || !contact) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const result = await (0, location_service_1.updateLocationServices)(locationId, { name, address, contact });
        res.status(200).json({ message: result });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to update location" });
    }
};
exports.updateLocation = updateLocation;
// Delete location
const deleteLocationById = async (req, res) => {
    const locationId = parseInt(req.params.id);
    if (isNaN(locationId)) {
        return res.status(400).json({ error: "Invalid location ID" });
    }
    try {
        await (0, location_service_1.deleteLocationService)(locationId);
        res.status(200).json({ message: "Location deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to delete location" });
    }
};
exports.deleteLocationById = deleteLocationById;

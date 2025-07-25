"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicleSpecsById = exports.updateVehicleSpec = exports.createVehicleSpec = exports.getVehicleSpecsByManufacturer = exports.getVehicleSpecsById = exports.getAllVehicleSpecs = void 0;
const vehicleSpec_service_1 = require("./vehicleSpec.service");
// Get all vehicles
const getAllVehicleSpecs = async (req, res) => {
    try {
        const allVehicleSpecs = await (0, vehicleSpec_service_1.GetAllVehiclesSpecService)();
        if (!allVehicleSpecs) {
            res.status(404).json({ error: "No Vehicles Specs Found" });
        }
        else {
            res.status(200).json(allVehicleSpecs);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to fetch Vehicle Specs" });
    }
};
exports.getAllVehicleSpecs = getAllVehicleSpecs;
//get vehiclespecs by id
const getVehicleSpecsById = async (req, res) => {
    const specsId = parseInt(req.params.id);
    if (isNaN(specsId)) {
        res.status(404).json({ error: "Invalid vehicle spec id!" });
        return;
    }
    try {
        const specsById = await (0, vehicleSpec_service_1.getVehicleSpecByIdService)(specsId);
        if (!specsById) {
            res.status(404).json({ error: "No Vehicles Specs Found" });
        }
        else {
            res.status(200).json(specsById);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to fetch Vehicle Specs" });
    }
};
exports.getVehicleSpecsById = getVehicleSpecsById;
// Get vehicle By Mnufacturer
const getVehicleSpecsByManufacturer = async (req, res) => {
    const manufacturer = req.query.manufacturer;
    if (!manufacturer) {
        res.status(400).json({ error: "Manufacturer Name is Required!" });
        return;
    }
    try {
        const specsByManufacturer = await (0, vehicleSpec_service_1.getVehicleSpecByManufacturerServices)(manufacturer);
        if (!specsByManufacturer || specsByManufacturer.length === 0) {
            res.status(404).json({ error: "No Vehicles Specs Found with this manufacturer" });
            return;
        }
        res.status(200).json(specsByManufacturer);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to fetch Vehicle Specs" });
    }
};
exports.getVehicleSpecsByManufacturer = getVehicleSpecsByManufacturer;
// create a vehicle spec
const createVehicleSpec = async (req, res) => {
    const { manufacturer, model, year, fuelType, engineCapacity, transmission, seatingCapacity, color, features } = req.body;
    if (!manufacturer || !model || !year || !fuelType || !engineCapacity || !transmission || !seatingCapacity || !color || !features) {
        res.status(400).json({ error: 'All fields Are Required!' });
        return;
    }
    try {
        const createSpec = await (0, vehicleSpec_service_1.createVehicleSpecServices)({ manufacturer, model, year, fuelType, engineCapacity, transmission, seatingCapacity, color, features });
        if (!createSpec) {
            res.status(404).json({ error: "Failed to create vehicle Specs" });
        }
        else {
            res.status(200).json(createSpec);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to create Vehicle Specs" });
    }
};
exports.createVehicleSpec = createVehicleSpec;
// update vehicle spec
const updateVehicleSpec = async (req, res) => {
    const vehicleSpecId = parseInt(req.params.id);
    if (isNaN(vehicleSpecId)) {
        res.status(404).json({ error: "Invalid vehicle spec id!" });
        return;
    }
    const { manufacturer, model, year, fuelType, engineCapacity, transmission, seatingCapacity, color, features } = req.body;
    if (!manufacturer || !model || !year || !fuelType || !engineCapacity || !transmission || !seatingCapacity || !color || !features) {
        res.status(400).json({ error: 'All fields Are Required!' });
        return;
    }
    try {
        const updateSpec = await (0, vehicleSpec_service_1.updateVehicleSpecServices)(vehicleSpecId, { manufacturer, model, year, fuelType, engineCapacity, transmission, seatingCapacity, color, features });
        if (!updateSpec) {
            res.status(404).json({ error: "Failed to update vehicle Specs" });
        }
        else {
            res.status(200).json(updateSpec);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to update Vehicle Specs" });
    }
};
exports.updateVehicleSpec = updateVehicleSpec;
//delete vehicle spec
const deleteVehicleSpecsById = async (req, res) => {
    const specsId = parseInt(req.params.id);
    if (isNaN(specsId)) {
        res.status(404).json({ error: "Invalid vehicle spec id!" });
        return;
    }
    try {
        const deleteSpecs = (0, vehicleSpec_service_1.deleteVehicleSpecService)(specsId);
        res.status(200).json({ message: "  Vehicle Specs deleted successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to delete Vehicle Specs" });
    }
};
exports.deleteVehicleSpecsById = deleteVehicleSpecsById;

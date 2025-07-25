"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicleSpecService = exports.updateVehicleSpecServices = exports.createVehicleSpecServices = exports.getVehicleSpecByManufacturerServices = exports.getVehicleSpecByIdService = exports.GetAllVehiclesSpecService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
// Get All Vehicles Specs
const GetAllVehiclesSpecService = async () => {
    return await db_1.default.query.vehicleSpecifications.findMany({
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.vehicleSpecifications.vehicleSpecId)]
    });
};
exports.GetAllVehiclesSpecService = GetAllVehiclesSpecService;
// Get VehicleSpec By Id
const getVehicleSpecByIdService = async (vehicleSpecId) => {
    return await db_1.default.query.vehicleSpecifications.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.vehicleSpecifications.vehicleSpecId, vehicleSpecId),
        with: {
            vehicles: true
        }
    });
};
exports.getVehicleSpecByIdService = getVehicleSpecByIdService;
// Search car By Manufacturer
const getVehicleSpecByManufacturerServices = async (manufacturer) => {
    return await db_1.default.query.vehicleSpecifications.findMany({
        where: (0, drizzle_orm_1.ilike)(schema_1.vehicleSpecifications.manufacturer, `%${manufacturer}%`)
    });
};
exports.getVehicleSpecByManufacturerServices = getVehicleSpecByManufacturerServices;
// cREATING SPECS
const createVehicleSpecServices = async (vehicleSpec) => {
    await db_1.default.insert(schema_1.vehicleSpecifications).values(vehicleSpec).returning();
    return "Vehicle Specifications Created SucccessFully";
};
exports.createVehicleSpecServices = createVehicleSpecServices;
// Updating SpecS
const updateVehicleSpecServices = async (vehicleSpecId, vehicleSpec) => {
    await db_1.default.update(schema_1.vehicleSpecifications).set(vehicleSpec).where((0, drizzle_orm_1.eq)(schema_1.vehicleSpecifications.vehicleSpecId, vehicleSpecId));
    return "Vehicle Specifications Updated SucccessFully";
};
exports.updateVehicleSpecServices = updateVehicleSpecServices;
// DELETE SPECS
const deleteVehicleSpecService = async (vehicleSpecId) => {
    await db_1.default.delete(schema_1.vehicleSpecifications).where((0, drizzle_orm_1.eq)(schema_1.vehicleSpecifications.vehicleSpecId, vehicleSpecId));
    return "Vehicle Specs Deleted Successfully";
};
exports.deleteVehicleSpecService = deleteVehicleSpecService;

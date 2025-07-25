"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocationService = exports.updateLocationServices = exports.createLocationServices = exports.getLocationByNameServices = exports.getLocationByIdServices = exports.getAllLocationServices = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
//get all locations
const getAllLocationServices = async () => {
    return await db_1.default.query.locations.findMany({});
};
exports.getAllLocationServices = getAllLocationServices;
//get location by id
const getLocationByIdServices = async (locationId) => {
    return await db_1.default.query.locations.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.locations.locationId, locationId)
    });
};
exports.getLocationByIdServices = getLocationByIdServices;
//search by name
const getLocationByNameServices = async (name) => {
    return await db_1.default.query.locations.findMany({
        where: (0, drizzle_orm_1.ilike)(schema_1.locations.name, `%${name}%`)
    });
};
exports.getLocationByNameServices = getLocationByNameServices;
//creating a location
const createLocationServices = async (location) => {
    await db_1.default.insert(schema_1.locations).values(location).returning();
    return "location added successfully";
};
exports.createLocationServices = createLocationServices;
//updating location
const updateLocationServices = async (locationId, location) => {
    await db_1.default.update(schema_1.locations).set(location).where((0, drizzle_orm_1.eq)(schema_1.locations.locationId, locationId));
    return "location updated successfully";
};
exports.updateLocationServices = updateLocationServices;
// delete locations
const deleteLocationService = async (locationId) => {
    await db_1.default.delete(schema_1.locations).where((0, drizzle_orm_1.eq)(schema_1.locations.locationId, locationId));
    return "location deleted Successfully";
};
exports.deleteLocationService = deleteLocationService;

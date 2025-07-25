"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationRouter = void 0;
const express_1 = __importDefault(require("express"));
const location_controller_1 = require("./location.controller");
exports.locationRouter = (0, express_1.default)();
//get all locations
exports.locationRouter.get('/location', location_controller_1.getAllLocation);
//get locations by id
exports.locationRouter.get('/location/:id', location_controller_1.getLocationById);
//search location by name
exports.locationRouter.get('/location-search', location_controller_1.getLocationByName);
//create a location
exports.locationRouter.post('/location', location_controller_1.createLocation);
//update location
exports.locationRouter.put('/location/:id', location_controller_1.updateLocation);
//delete location
exports.locationRouter.delete('/location/:id', location_controller_1.deleteLocationById);

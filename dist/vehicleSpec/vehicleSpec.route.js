"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleSpecsRouter = void 0;
const express_1 = __importDefault(require("express"));
const vehicleSpec_controller_1 = require("./vehicleSpec.controller");
exports.VehicleSpecsRouter = (0, express_1.default)();
// Get all vehicle Specifications
exports.VehicleSpecsRouter.get('/vehicleSpecs', vehicleSpec_controller_1.getAllVehicleSpecs);
// Search Vehicle by manufacturer
exports.VehicleSpecsRouter.get('/vehicleSpecs-search', vehicleSpec_controller_1.getVehicleSpecsByManufacturer);
// vehicle by id
exports.VehicleSpecsRouter.get('/vehicleSpecs/:id', vehicleSpec_controller_1.getVehicleSpecsById);
// Creating Vehicle Spec
exports.VehicleSpecsRouter.post('/vehicleSpecs/', vehicleSpec_controller_1.createVehicleSpec);
// UPDATING VEHICLE SPEC
exports.VehicleSpecsRouter.put('/vehicleSpecs/:id', vehicleSpec_controller_1.updateVehicleSpec);
// deleteing Vehicle specs
exports.VehicleSpecsRouter.delete('/vehicleSpecs/:id', vehicleSpec_controller_1.deleteVehicleSpecsById);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRouter = void 0;
const express_1 = require("express");
const vehicles_controller_1 = require("./vehicles.controller");
exports.vehicleRouter = (0, express_1.Router)();
// Vehicle routes definition
exports.vehicleRouter.get('/vehicles', vehicles_controller_1.getVehicles);
exports.vehicleRouter.get('/vehicles/:id', vehicles_controller_1.getVehicleById);
exports.vehicleRouter.post('/vehicles', vehicles_controller_1.createVehicle);
exports.vehicleRouter.put('/vehicles/:id', vehicles_controller_1.updateVehicle);
exports.vehicleRouter.delete('/vehicles/:id', vehicles_controller_1.deleteVehicle);

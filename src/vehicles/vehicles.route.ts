import {Router} from "express";
import { createVehicle, deleteVehicle, getVehicleById, getVehicles, updateVehicle } from "./vehicles.controller";


export const vehicleRouter = Router();

// Vehicle routes definition
vehicleRouter.get('/vehicles', getVehicles);
vehicleRouter.get('/vehicles/:id', getVehicleById);
vehicleRouter.post('/vehicles', createVehicle);
vehicleRouter.put('/vehicles/:id', updateVehicle);
vehicleRouter.delete('/vehicles/:id', deleteVehicle);


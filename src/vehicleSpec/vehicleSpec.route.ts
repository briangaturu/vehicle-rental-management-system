import Router from "express"
import { createVehicleSpec, deleteVehicleSpecsById, getAllVehicleSpecs, getVehicleSpecsById, getVehicleSpecsByManufacturer, updateVehicleSpec } from "./vehicleSpec.controller";
import { deleteVehicle } from "../vehicles/vehicles.controller";

export const VehicleSpecsRouter = Router();

// Get all vehicle Specifications
VehicleSpecsRouter.get('/vehicleSpecs', getAllVehicleSpecs);

// Search Vehicle by manufacturer
VehicleSpecsRouter.get('/vehicleSpecs-search', getVehicleSpecsByManufacturer);

// vehicle by id
VehicleSpecsRouter.get('/vehicleSpecs/:id', getVehicleSpecsById);

// Creating Vehicle Spec
VehicleSpecsRouter.post('/vehicleSpecs/', createVehicleSpec);

// UPDATING VEHICLE SPEC
VehicleSpecsRouter.put('/vehicleSpecs/:id', updateVehicleSpec);

// deleteing Vehicle specs
VehicleSpecsRouter.delete('/vehicleSpecs/:id', deleteVehicleSpecsById);
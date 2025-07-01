import {Response, Request} from "express";
import { createVehicleServices, deleteVehicleServices, getVehicleByIdServices, getVehiclesServices, updateVehicleServices } from "./vehicles.service";


export  const getVehicles = async(req: Request, res: Response) => {
    try {
        const allVehicles = await getVehiclesServices();
        if (allVehicles == null || allVehicles.length == 0) {
          res.status(404).json({ message: "No vehicles found" }); 
        }else{
            res.status(200).json(allVehicles);
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to fetch vehicles" }); 
    }
}

export const getVehicleById = async(req:Request, res:Response)=>{
    const vehicleId = parseInt(req.params.id);

    if (isNaN(vehicleId)) {
        res.status(400).json({ error: "Invalid vehicle ID" });
        return;
    }
try {
    const vehicle = await getVehicleByIdServices(vehicleId);
    if (vehicle == null) {
        res.status(404).json({ message: "Vehicle not found" });
    } else {
        res.status(200).json(vehicle);
    }
} catch (error:any) {
 res.status(500).json({ error:error.message || "Failed to fetch vehicle" });   
}
}

export const createVehicle = async(req:Request, res:Response)=>{
    const {rentalRate, availability,vehicleSpecId}= req.body;
    console.log("🚀 ~ createVehicle ~ vehicleSpecId:", vehicleSpecId)
    if (!rentalRate ||  !vehicleSpecId || !availability) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }

    const vehicle = {rentalRate, availability,vehicleSpecId}
    console.log("🚀 ~ createVehicle ~ vehicle:", vehicle)
    try {
        const newVehicle = await createVehicleServices(vehicle);
        
        if (newVehicle == null) {
            res.status(500).json({ message: "Failed to create vehicle" });
        } else {
            res.status(201).json(newVehicle);
        }
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to create vehicle" }); 
    }
}

export const updateVehicle = async(req:Request, res:Response)=>{
    const vehicleId = parseInt(req.params.id);
    if (isNaN(vehicleId)) {
        res.status(400).json({ error: "Invalid vehicle ID" });
        return;
    }
    const {rentalRate, availability, vehicleSpecId}= req.body;

    if (!rentalRate || !availability || !vehicleSpecId) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    const vehicle = {rentalRate, availability, vehicleSpecId}
   
    try {
        const updatedVehicle = await updateVehicleServices(vehicleId, vehicle);

        if (updatedVehicle == null) {
            res.status(404).json({ message: "Vehicle not found or failed to update" });
        } else {
            res.status(200).json(updatedVehicle);
        }
    } catch (error:any) {
                res.status(500).json({ error:error.message || "Failed to update vehicle" }); 
            }
        }

        export const deleteVehicle = async(req:Request, res:Response)=>{
            const vehicleId = parseInt(req.params.id);
            if (isNaN(vehicleId)) {
                res.status(400).json({ error: "Invalid vehicle ID" });
                return;
            }
            try {
                const deletedVehicle = await deleteVehicleServices(vehicleId);
                if (deletedVehicle) {
                    res.status(200).json({ message: "Vehicle deleted successfully" });
                } else {
                    res.status(404).json({ message: "Vehicle not found" });
                }
            } catch (error:any) {
                res.status(500).json({ error:error.message || "Failed to delete vehicle" }); 
            }
        }
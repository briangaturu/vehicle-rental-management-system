import {Request, Response} from "express";
import { createVehicleSpecServices, GetAllVehiclesSpecService, getVehicleSpecByIdService, getVehicleSpecByManufacturerServices, updateVehicleSpecServices,deleteVehicleSpecService } from "./vehicleSpec.service";

// Get all vehicles
export const getAllVehicleSpecs = async(req: Request, res: Response ) =>{
    try {
        const allVehicleSpecs = await GetAllVehiclesSpecService();
        if(!allVehicleSpecs){
            res.status(404).json({error: "No Vehicles Specs Found"})
        }
        else{
            res.status(200).json(allVehicleSpecs);
        }
    } catch (error:any) {
        res.status(500).json({error: error.message || "error occured Failed to fetch Vehicle Specs"})
    }
}

//get vehiclespecs by id
export const getVehicleSpecsById = async(req: Request, res: Response ) =>{
    const specsId = parseInt(req.params.id);
    if(isNaN(specsId)){
        res.status(404).json({error: "Invalid vehicle spec id!"});
        return;
    }

    try {
        const specsById = await getVehicleSpecByIdService(specsId);
        if(!specsById){
            res.status(404).json({error: "No Vehicles Specs Found"})
        }
        else{
            res.status(200).json(specsById); 
        }
    } catch (error:any) {
        res.status(500).json({error: error.message || "error occured Failed to fetch Vehicle Specs"})
    }
}


// Get vehicle By Mnufacturer

export const getVehicleSpecsByManufacturer = async(req: Request, res: Response ) =>{
    const manufacturer = req.query.manufacturer as string;
    if(!manufacturer){
        res.status(400).json({error: "Manufacturer Name is Required!"});
        return;
    }

    try {
        const specsByManufacturer = await getVehicleSpecByManufacturerServices(manufacturer);
        if(!specsByManufacturer || specsByManufacturer.length === 0){
            res.status(404).json({error: "No Vehicles Specs Found with this manufacturer"})
            return;
        }
      
            res.status(200).json(specsByManufacturer);
        
    } catch (error:any) {
        res.status(500).json({error: error.message || "error occured Failed to fetch Vehicle Specs"})
    }
}


// create a vehicle spec
export const createVehicleSpec = async(req: Request, res: Response) =>{
    const {manufacturer,model,year,fuelType,engineCapacity,transmission,seatingCapacity,color,features} = req.body;
    if(!manufacturer ||!model ||!year ||!fuelType ||!engineCapacity ||!transmission ||!seatingCapacity ||!color ||!features){
        res.status(400).json({error: 'All fields Are Required!'});
        return;
    }
    try {
            const createSpec = await createVehicleSpecServices({manufacturer,model,year,fuelType,engineCapacity,transmission,seatingCapacity,color,features});
            if(!createSpec){
                res.status(404).json({error: "Failed to create vehicle Specs"});
            }
            else{
                res.status(200).json(createSpec);
            }
    } catch (error:any) {
      res.status(500).json({error: error.message || "error occured Failed to create Vehicle Specs"})  
   }
}

// update vehicle spec
export const updateVehicleSpec = async(req: Request, res: Response) =>{
    const vehicleSpecId = parseInt(req.params.id);
    if(isNaN(vehicleSpecId)){
        res.status(404).json({error: "Invalid vehicle spec id!"});
        return;
    }
    const {manufacturer,model,year,fuelType,engineCapacity,transmission,seatingCapacity,color,features} = req.body;
    if(!manufacturer ||!model ||!year ||!fuelType ||!engineCapacity ||!transmission ||!seatingCapacity ||!color ||!features){
        res.status(400).json({error: 'All fields Are Required!'});
        return;
    }
    try {
            const createSpec = await updateVehicleSpecServices(vehicleSpecId,{manufacturer,model,year,fuelType,engineCapacity,transmission,seatingCapacity,color,features});
            if(!createSpec){
                res.status(404).json({error: "Failed to create vehicle Specs"});
            }
            else{
                res.status(200).json(createSpec);
            }
    } catch (error:any) {
      res.status(500).json({error: error.message || "error occured Failed to update Vehicle Specs"})  
   }
}

//delete vehicle spec

export const deleteVehicleSpecsById = async(req: Request, res: Response ) =>{
    const specsId = parseInt(req.params.id);
    if(isNaN(specsId)){
        res.status(404).json({error: "Invalid vehicle spec id!"});
        return;
    }

    try {
        const deleteSpecs = deleteVehicleSpecService(specsId);
            res.status(200).json({message:  "  Vehicle Specs deleted successfully"})

            return;
           
    } catch (error:any) {
        res.status(500).json({error: error.message || "error occured Failed to delete Vehicle Specs"})
    }
}

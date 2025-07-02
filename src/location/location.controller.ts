import {Request, Response} from "express";
import { createLocationServices, deleteLocationService, getAllLocationServices, getLocationByIdServices, getLocationByNameServices, updateLocationServices } from "./location.service";


//get all location
export const getAllLocation = async(req:Request, res:Response)=>{
try {
   const allLocations = await getAllLocationServices();
   if(!allLocations){
     res.status(404).json({error: "No locations  Found"})
        }
        else{
            res.status(200).json(allLocations);
        }
} catch (error:any) {
    res.status(500).json({error: error.message || "error occured Failed to fetch locations"}) 
}
}

//get locations by id
export const getLocationById = async(req:Request, res:Response)=>{
const locationId = parseInt(req.params.id);
if(isNaN(locationId)){
    res.status(400).json({error:"invalid location id"})
    return;
}
try {
   const location = await getLocationByIdServices(locationId);
    if(!location){
            res.status(404).json({error: "No location Found"})
        }
        else{
            res.status(200).json(location);
        }
} catch (error:any) {
    res.status(500).json({error: error.message || "error occured Failed to fetch locations"})
}
}

//get location by name
export const getLocationByName = async(req: Request, res: Response ) =>{
    const name = req.query.name as string;
    if(!name){
        res.status(400).json({error: "location Name is Required!"});
        return;
    }

    try {
        const locationByName = await getLocationByNameServices(name);
        if(!locationByName || locationByName.length === 0){
            res.status(404).json({error: "No location Found with this name"})
            return;
        }
      
            res.status(200).json(locationByName);
        
    } catch (error:any) {
        res.status(500).json({error: error.message || "error occured Failed to fetch location"})
    }
}

//create location
export const createLocation = async(req:Request, res:Response)=>{
    const{name,address,contact} = req.body;
    if(!name || !address || !contact ){
        res.status(400).json({error: 'all fields are required!'})
        return;
    }
    try {
        const createLocation = await createLocationServices({name,address,contact});
       if(!createLocation) {
        res.status(404).json({error: "Failed to add location"});
            }
            else{
                res.status(200).json(createLocation);
            }
      
    } catch (error:any) {
        res.status(500).json({error: error.message || "error occured Failed to add location"})
    }

}

//update location
export const updateLocation = async(req:Request,res:Response)=>{
    const locationId = parseInt(req.params.id);
    if(isNaN(locationId)){
      res.status(404).json({error: "Invalid location id!"});
        return;  
    }
    const {name,address,contact}=req.body;
    if(!name || !address || !contact ){
      res.status(400).json({error: 'All fields Are Required!'});
              return;
          }
          try {
                  const createLocation = await updateLocationServices(locationId,{name,address,contact});
                  if(!createLocation){
                      res.status(404).json({error: "Failed to create location"});
                  }
                  else{
                      res.status(200).json(createLocation);
                  }
          } catch (error:any) {
            res.status(500).json({error: error.message || "error occured Failed to update location"})  
         }  
    }

   //delete vehicle spec
   
   export const deleteLocationById = async(req: Request, res: Response ) =>{
       const locationId = parseInt(req.params.id);
       if(isNaN(locationId)){
           res.status(404).json({error: "Invalid location id!"});
           return;
       }
   
       try {
           const deleteLocation = deleteLocationService(locationId);
               res.status(200).json({message:  "  location deleted successfully"})
   
               return;
              
       } catch (error:any) {
           res.status(500).json({error: error.message || "error occured Failed to delete location"})
       }
   }
    



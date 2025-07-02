import Router from "express"
import { createLocation, deleteLocationById, getAllLocation, getLocationById, getLocationByName, updateLocation } from "./location.controller";




export const locationRouter = Router();

//get all locations
locationRouter.get('/location',getAllLocation);

//get locations by id
locationRouter.get('/location/:id',getLocationById);


//search location by name
locationRouter.get('/location-search',getLocationByName);

//create a location
locationRouter.post('/location',createLocation);

//update location
locationRouter.put('/location/:id',updateLocation);

//delete location
locationRouter.delete('/location/:id',deleteLocationById);

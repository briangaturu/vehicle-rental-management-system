import { eq, ilike } from "drizzle-orm";
import db from "../drizzle/db";
import { locations, TLocationInsert, TLocationSelect } from "../drizzle/schema";



//get all locations
export const getAllLocationServices = async():Promise<TLocationSelect[] | null>=>{
return await db.query.locations.findMany({});
}

//get location by id
export const getLocationByIdServices = async(locationId:number):Promise<TLocationSelect | undefined>=>{
return await db.query.locations.findFirst({
    where: eq(locations.locationId,locationId)
})
}

//search by name
export const getLocationByNameServices = async(name:string):Promise<TLocationSelect[] | undefined>=>{
return await db.query.locations.findMany({
    where: ilike(locations.name,`%${name}%`)
})
}

//creating a location
export const createLocationServices = async(location:TLocationInsert):Promise<string>=>{
 await db.insert(locations).values(location).returning();
 return "location added successfully"
}

//updating location
export const updateLocationServices = async(locationId:number, location:Partial<TLocationInsert>):Promise<string>=>{
await db.update(locations).set(location).where(eq(locations.locationId,locationId))
return "location updated successfully"
}

// delete locations
export const deleteLocationService = async(locationId : number) =>{
    await db.delete(locations).where(eq(locations.locationId, locationId));
    return "location deleted Successfully"
}
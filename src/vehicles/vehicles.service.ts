import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TVehicleInsert, TVehicleSelect, vehicles } from "../drizzle/schema";


//Get all vehicles
export const getVehiclesServices = async():Promise<TVehicleSelect[] | null >=>{
return await db.query.vehicles.findMany({
    with: {
        vehicleSpec: true,
    }
});
}

//GET VEHICLE BY ID
export const getVehicleByIdServices = async(vehicleId:number):Promise<TVehicleSelect | undefined>=>{
 const res = await db.query.vehicles.findFirst({
    where: eq(vehicles.vehicleId,vehicleId),
    with: {
        vehicleSpec: true,
    }
});
return res;
}

//CREATE NEW VEHICLE
export const createVehicleServices = async(vehicle: TVehicleInsert):Promise<string>=>{
 await db.insert(vehicles).values(vehicle).returning();
return "Vehicle created successfully 🎉";
}

//UPDATE A VEHICLE
    export const updateVehicleServices = async(vehicleId:number,vehicle:TVehicleInsert):Promise<string>=>{
await db.update(vehicles).set(vehicle).where(eq(vehicles.vehicleId, vehicleId));
return "Vehicle updated successfully 😎";
    }

    //DELETE A VEHICLE
    export const deleteVehicleServices = async(vehicleId:number):Promise<string>=>{
await db.delete(vehicles).where(eq(vehicles.vehicleId,vehicleId))
return "Vehicle deleted successfully 🎉";
    }
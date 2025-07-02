import { desc, eq, ilike } from "drizzle-orm";
import db from "../drizzle/db";
import { TVehicleSpecificationInsert, TVehicleSpecificationSelect, vehicleSpecifications } from "../drizzle/schema";

// Get All Vehicles Specs
export const GetAllVehiclesSpecService = async(): Promise<TVehicleSpecificationSelect[]>=>{
    return await db.query.vehicleSpecifications.findMany({
        orderBy: [desc(vehicleSpecifications.vehicleSpecId)]
    });
}

// Get VehicleSpec By Id
export const getVehicleSpecByIdService = async(vehicleSpecId: number): Promise<TVehicleSpecificationSelect | undefined> =>{
    return await db.query.vehicleSpecifications.findFirst({
        where: eq(vehicleSpecifications.vehicleSpecId, vehicleSpecId),
        with: {
            vehicles: true
        }
    })
}

// Search car By Manufacturer
export const getVehicleSpecByManufacturerServices = async(manufacturer: string): Promise<TVehicleSpecificationSelect[] | undefined> =>{
    return await db.query.vehicleSpecifications.findMany({
        where: ilike(vehicleSpecifications.manufacturer, `%${manufacturer}%`)
    })
}

// cREATING SPECS
export const createVehicleSpecServices = async(vehicleSpec: TVehicleSpecificationInsert):Promise<string> =>{
    await db.insert(vehicleSpecifications).values(vehicleSpec).returning();
    return "Vehicle Specifications Created SucccessFully"
}

// Updating SpecS
export const updateVehicleSpecServices = async(vehicleSpecId: number,vehicleSpec: Partial<TVehicleSpecificationInsert>):Promise<string> =>{
    await db.update(vehicleSpecifications).set(vehicleSpec).where(eq(vehicleSpecifications.vehicleSpecId, vehicleSpecId))
    return "Vehicle Specifications Updated SucccessFully"
}

// DELETE SPECS
export const deleteVehicleSpecService = async(vehicleSpecId : number) =>{
    await db.delete(vehicleSpecifications).where(eq(vehicleSpecifications.vehicleSpecId, vehicleSpecId));
    return "Vehicle Specs Deleted Successfully"
}
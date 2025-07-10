import {desc, eq} from "drizzle-orm";
import db from "../drizzle/db"
import { TUserInsert, TUserSelect, users } from "../drizzle/schema";

//Get all users
export const getUsersService = async():Promise<TUserSelect[] | null > =>{
return await db.query.users.findMany({
    with: {
        bookings: true,
        supportTickets: true,
    },
    orderBy: [desc(users.userId)]
});

}

//Get users by Id
export const getUserByIdServices = async(userId:number,):Promise<TUserSelect | undefined> =>{
    return await db.query.users.findFirst({
        where: eq(users.userId,userId),
         with: {
        bookings: true,
        supportTickets: true,
    },
    })
}

//create new user
export const createUserServices = async(user:TUserInsert):Promise<string> =>{
    await db.insert(users).values(user).returning();
    return  "User created successfully 🎉";
}

//update a user
export const updateUserServices = async (userId:number,user:Partial<TUserInsert>):Promise<string>=>{
await db.update(users).set(user).where(eq(users.userId,userId))
return "User updated successfully 😎";
}

//delete a user
export const deleteUserServices = async(userId:number):Promise<string>=>{
await db.delete(users).where(eq(users.userId,userId))
 return "User deleted successfully 🎉"
}
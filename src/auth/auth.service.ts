import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TUserInsert, TUserSelect, users } from "../drizzle/schema";


//Register a new user
export const createUserServices = async(user: TUserInsert):Promise<string> => {
    await db.insert(users).values(user).returning();
    return "User created successfully 🎉";
}

//get user by email
export const getUserByEmailService = async (user_email: string): Promise<TUserSelect | undefined> => {
    return await db.query.users.findFirst({
        where: eq(users.email, user_email)
    })
}
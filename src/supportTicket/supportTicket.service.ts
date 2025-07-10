

import { desc, eq, ilike } from "drizzle-orm";
import db from "../drizzle/db";
import { supportTickets, TSupportTicketInsert, TSupportTicketSelect } from "../drizzle/schema";

// Get All support tickets
export const GetAllTicketService = async(): Promise<TSupportTicketSelect[]>=>{
    return await db.query.supportTickets.findMany({
        with: {
            user:{columns: {
                userId: true,
                firstname: true,
                lastname: true,
                email: true,
                contact: true,
            }}
            
        },
        orderBy: [desc(supportTickets.ticketId)]
    });
}

// Get tickets By Id
export const getTicketByIdService = async(supportTicketId: number): Promise<TSupportTicketSelect | undefined> =>{
    return await db.query.supportTickets.findFirst({
        where: eq(supportTickets.ticketId, supportTicketId),
    })
}

// cREATING TICKET
export const createTicketServices = async(ticket: TSupportTicketInsert):Promise<string> =>{
    await db.insert(supportTickets).values(ticket).returning();
    return "ticket Created SucccessFully"
}

// Updating SpecS
export const updateTicketServices = async(ticketId: number,ticket: Partial<TSupportTicketInsert>):Promise<string> =>{
    await db.update(supportTickets).set(ticket).where(eq(supportTickets.ticketId, ticketId))
    return "Support tickets Updated SucccessFully"
}

// DELETE TICKET
export const deleteTicketService = async(ticketId : number) =>{
    await db.delete(supportTickets).where(eq(supportTickets.ticketId, ticketId));
    return "ticket Deleted Successfully"
}
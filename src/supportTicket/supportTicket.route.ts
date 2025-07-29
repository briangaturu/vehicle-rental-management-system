import Router from "express"
import { createTicket, deleteTicketById, getAllTickets, getTicketById, getTicketByUserId, updateTicket } from "./supportTicket.controller";




export const ticketRouter = Router();

//get all tickets
ticketRouter.get('/ticket',getAllTickets);

//get ticket by id
ticketRouter.get('/ticket/:id',getTicketById);

//get ticket by user id
ticketRouter.get('/ticket/user/:id',getTicketByUserId);


//search booking by date
//bookingRouter.get('/location-search',getLocationByName);

//create a ticket
ticketRouter.post('/ticket',createTicket);

//update ticket
ticketRouter.patch('/ticket/:id', updateTicket);

//delete ticket
ticketRouter.delete('/ticket/:id',deleteTicketById);

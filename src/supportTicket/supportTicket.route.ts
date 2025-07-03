import Router from "express"
import { createTicket, deleteTicketById, getAllTickets, getTicketById, updateTicket } from "./supportTicket.controller";




export const ticketRouter = Router();

//get all tickets
ticketRouter.get('/ticket',getAllTickets);

//get ticket by id
ticketRouter.get('/ticket/:id',getTicketById);


//search booking by date
//bookingRouter.get('/location-search',getLocationByName);

//create a ticket
ticketRouter.post('/ticket',createTicket);

//update ticket
ticketRouter.put('/ticket/:id',updateTicket);

//delete ticket
ticketRouter.delete('/ticket/:id',deleteTicketById);

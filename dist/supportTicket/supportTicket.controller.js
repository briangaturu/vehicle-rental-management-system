"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicketById = exports.updateTicket = exports.createTicket = exports.getTicketByUserId = exports.getTicketById = exports.getAllTickets = void 0;
const supportTicket_service_1 = require("./supportTicket.service");
//get all tickets
const getAllTickets = async (req, res) => {
    try {
        const allTickets = await (0, supportTicket_service_1.GetAllTicketService)();
        if (!allTickets) {
            res.status(404).json({ error: "No tickets  Found" });
        }
        else {
            res.status(200).json(allTickets);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to fetch tickets" });
    }
};
exports.getAllTickets = getAllTickets;
//get tickets by id
const getTicketById = async (req, res) => {
    const ticketId = parseInt(req.params.id);
    if (isNaN(ticketId)) {
        res.status(400).json({ error: "invalid ticket id" });
        return;
    }
    try {
        const ticket = await (0, supportTicket_service_1.getTicketByIdService)(ticketId);
        if (!ticket) {
            res.status(404).json({ error: "No ticket Found" });
        }
        else {
            res.status(200).json(ticket);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to fetch tickets" });
    }
};
exports.getTicketById = getTicketById;
//get tickets by user id
const getTicketByUserId = async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "invalid user id" });
        return;
    }
    try {
        const ticket = await (0, supportTicket_service_1.getTicketByUserIdService)(userId);
        if (!ticket) {
            res.status(404).json({ error: "No ticket Found" });
        }
        else {
            res.status(200).json(ticket);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to fetch tickets" });
    }
};
exports.getTicketByUserId = getTicketByUserId;
// //get tickets by name
// export const getLocationByName = async(req: Request, res: Response ) =>{
//     const name = req.query.name as string;
//     if(!name){
//         res.status(400).json({error: "location Name is Required!"});
//         return;
//     }
//     try {
//         const locationByName = await getLocationByNameServices(name);
//         if(!locationByName || locationByName.length === 0){
//             res.status(404).json({error: "No location Found with this name"})
//             return;
//         }
//             res.status(200).json(locationByName);
//     } catch (error:any) {
//         res.status(500).json({error: error.message || "error occured Failed to fetch location"})
//     }
// }
//create ticket
const createTicket = async (req, res) => {
    const { subject, description, userId } = req.body;
    if (!subject || !description || !userId) {
        res.status(400).json({ error: 'all fields are required!' });
        return;
    }
    try {
        const createTicket = await (0, supportTicket_service_1.createTicketServices)({ subject, description, userId });
        if (!createTicket) {
            res.status(404).json({ error: "Failed to create ticket" });
        }
        else {
            res.status(200).json(createTicket);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to create ticket" });
    }
};
exports.createTicket = createTicket;
//update ticket
const updateTicket = async (req, res) => {
    const ticketId = parseInt(req.params.id);
    if (isNaN(ticketId)) {
        res.status(404).json({ error: "Invalid ticket id!" });
        return;
    }
    const updateFields = req.body;
    if (Object.keys(updateFields).length === 0) {
        res.status(400).json({ error: 'No fields provided for update!' });
        return;
    }
    try {
        const result = await (0, supportTicket_service_1.updateTicketServices)(ticketId, updateFields);
        if (!result) {
            res.status(404).json({ error: "Failed to update ticket" });
        }
        else {
            res.status(200).json({ message: result });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Error occurred. Failed to update ticket." });
    }
};
exports.updateTicket = updateTicket;
//delete ticket
const deleteTicketById = async (req, res) => {
    const ticketId = parseInt(req.params.id);
    if (isNaN(ticketId)) {
        res.status(404).json({ error: "Invalid ticket id!" });
        return;
    }
    try {
        const deleteTicket = (0, supportTicket_service_1.deleteTicketService)(ticketId);
        res.status(200).json({ message: "  ticket deleted successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message || "error occured Failed to delete ticket" });
    }
};
exports.deleteTicketById = deleteTicketById;

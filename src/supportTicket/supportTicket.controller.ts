import {Request, Response} from "express";
import { createTicketServices, deleteTicketService, GetAllTicketService, getTicketByIdService, getTicketByUserIdService, updateTicketServices } from "./supportTicket.service";


//get all tickets
export const getAllTickets = async(req:Request, res:Response)=>{
try {
   const allTickets = await GetAllTicketService();
   if(!allTickets){
     res.status(404).json({error: "No tickets  Found"})
        }
        else{
            res.status(200).json(allTickets);
        }
} catch (error:any) {
    res.status(500).json({error: error.message || "error occured Failed to fetch tickets"}) 
}
}

//get tickets by id
export const getTicketById = async(req:Request, res:Response)=>{
const ticketId = parseInt(req.params.id);
if(isNaN(ticketId)){
    res.status(400).json({error:"invalid ticket id"})
    return;
}
try {
   const ticket = await getTicketByIdService(ticketId);
    if(!ticket){
            res.status(404).json({error: "No ticket Found"})
        }
        else{
            res.status(200).json(ticket);
        }
} catch (error:any) {
    res.status(500).json({error: error.message || "error occured Failed to fetch tickets"})
}
}

//get tickets by user id
export const getTicketByUserId = async(req:Request, res:Response)=>{
const userId = parseInt(req.params.id);
if(isNaN(userId)){
    res.status(400).json({error:"invalid user id"})
    return;
}
try {
   const ticket = await getTicketByUserIdService(userId);
    if(!ticket){
            res.status(404).json({error: "No ticket Found"})
        }
        else{
            res.status(200).json(ticket);
        }
} catch (error:any) {
    res.status(500).json({error: error.message || "error occured Failed to fetch tickets"})
}
}

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
export const createTicket = async(req:Request, res:Response)=>{
    const{subject,description,userId} = req.body;
    if(!subject || !description || !userId ){
        res.status(400).json({error: 'all fields are required!'})
        return;
    }
    try {
        const createTicket = await createTicketServices({subject,description,userId});
       if(!createTicket) {
        res.status(404).json({error: "Failed to create ticket"});
            }
            else{
                res.status(200).json(createTicket);
            }
      
    } catch (error:any) {
        res.status(500).json({error: error.message || "error occured Failed to create ticket"})
    }

}

//update ticket
export const updateTicket = async(req:Request,res:Response)=>{
    const ticketId = parseInt(req.params.id);
    if(isNaN(ticketId)){
      res.status(404).json({error: "Invalid ticket id!"});
        return;  
    }
    const updateFields = req.body;
    if (Object.keys(updateFields).length === 0) {
      res.status(400).json({error: 'No fields provided for update!'});
      return;
    }
    try {
      const result = await updateTicketServices(ticketId, updateFields);
      if(!result){
          res.status(404).json({error: "Failed to update ticket"});
      }
      else{
          res.status(200).json({ message: result });
      }
    } catch (error:any) {
      res.status(500).json({error: error.message || "Error occurred. Failed to update ticket."})  
    }  
}

   //delete ticket
   
   export const deleteTicketById = async(req: Request, res: Response ) =>{
       const ticketId = parseInt(req.params.id);
       if(isNaN(ticketId)){
           res.status(404).json({error: "Invalid ticket id!"});
           return;
       }
   
       try {
           const deleteTicket = deleteTicketService(ticketId);
               res.status(200).json({message:  "  ticket deleted successfully"})
   
               return;
              
       } catch (error:any) {
           res.status(500).json({error: error.message || "error occured Failed to delete ticket"})
       }
   }

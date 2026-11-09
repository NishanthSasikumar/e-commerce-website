import express from "express";
import {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketMessages,
  claimTicket,
  closeTicket,
} from "../controllers/ticketController.js";
import { setRole } from "../utils/setRole.js";

const ticketRouter = express.Router();

ticketRouter.post("/create", setRole, createTicket);
ticketRouter.get("/all", setRole, getAllTickets);
ticketRouter.get("/mytickets", setRole, getMyTickets);
ticketRouter.get("/messages/:ticketNo", setRole, getTicketMessages);
ticketRouter.patch("/claim", setRole, claimTicket);
ticketRouter.patch("/close", setRole, closeTicket);

export { ticketRouter };

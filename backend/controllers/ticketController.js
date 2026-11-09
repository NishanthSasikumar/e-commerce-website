import { ticketModel } from "../modals/tickets.modal.js";
import { messageModel } from "../modals/chat.modal.js";
import { logger } from "../utils/logger.js";


const createTicket = async (req, res) => {
  try {
    const { issue } = req.body;
    const email = req.email;

    const ticketCount = await ticketModel.countDocuments();
    
    const ticket = await ticketModel.create({
      ticketNo: ticketCount + 1,
      email,
      issue,
    });

    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, tickets });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


const getMyTickets = async (req, res) => {
  try {
    const email = req.email;
    const tickets = await ticketModel.find({ email }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, tickets });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


const getTicketMessages = async (req, res) => {
  try {
    const { ticketNo } = req.params;
    const ticket = await ticketModel.findOne({ ticketNo: Number(ticketNo) });
    if (!ticket)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });

    const messages = await messageModel
      .find({ ticketId: ticket._id })
      .sort({ createdAt: 1 });
    return res.status(200).json({ success: true, messages, ticket });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


const claimTicket = async (req, res) => {
  try {
    const { ticketNo } = req.body;
    const adminEmail = req.email;

    const ticket = await ticketModel.findOne({ ticketNo: Number(ticketNo) });
    if (!ticket)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });

    if (ticket.claimedBy) {
      return res
        .status(400)
        .json({ success: false, message: "Ticket already claimed" });
    }

    ticket.claimedBy = adminEmail;
    await ticket.save();

    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


const closeTicket = async (req, res) => {
  try {
    const { ticketNo } = req.body;
    await ticketModel.findOneAndUpdate(
      { ticketNo: Number(ticketNo) },
      { status: "Completed" },
    );
    return res.status(200).json({ success: true, message: "Ticket closed" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketMessages,
  claimTicket,
  closeTicket,
};

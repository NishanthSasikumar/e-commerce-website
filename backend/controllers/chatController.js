import { chatModal } from "../modals/chat.modal.js";
import { logger } from "../utils/logger.js";

const getPreviousChat = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("InGetPreviousChat : ",email);
    
    const getChat = await chatModal.find({ email }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      getChat,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getChatUsers = async (req, res) => {
  try {
    const chats = await chatModal.find().sort({ createdAt: -1 });
    const users = [];
    const visited = new Set();
    for (const chat of chats) {
      if (visited.has(chat.email)) continue;

      visited.add(chat.email);

      users.push({
        email: chat.email,
        lastMessage: chat.message,
        sender: chat.sender,
        time: chat.createdAt,
      });
    }
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { getPreviousChat, getChatUsers };

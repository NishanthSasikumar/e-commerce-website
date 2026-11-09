
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticket",
    },
    sender: String,
    message: String,
  },
  {
    timestamps: true,
  },
);
const messageModel = mongoose.model("message", messageSchema);

export { messageModel };



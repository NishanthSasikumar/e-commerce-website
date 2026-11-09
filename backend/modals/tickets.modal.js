import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketNo: {
      type: Number,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    issue: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Open",
    },
    claimedBy: {
      type: String,
      default: null,
    },
    replied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const ticketModel = mongoose.model("ticket", ticketSchema);

export { ticketModel };

import mongoose from "mongoose";
import { roleModal } from "./role.modal.js";



const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const userModal = mongoose.model("User", userSchema);

export { userModal };

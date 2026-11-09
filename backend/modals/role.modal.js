import mongoose from "mongoose";

const roleSchema =new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  permission: {
    type : [String],
    default : []
  },
});

const roleModal = mongoose.model("role", roleSchema);

export { roleModal };

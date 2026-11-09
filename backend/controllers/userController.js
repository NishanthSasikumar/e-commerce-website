import { io } from "../main.js";
import { userModal } from "../modals/auth.modal.js";
import { logger } from "../utils/logger.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await userModal
      .find(
        {},
        {
          password: 0,
        },
      )
      .populate("role", "role");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

const toggleRole = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModal.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.role = user.role === "Admin" ? "User" : "Admin";
    await user.save();

    res.status(200).json({
      success: true,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

const toggleBlock = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModal.findById(id);

    if (!user)
      return res.status(404).json({
        success: false,
      });

    user.isBlocked = !user.isBlocked;

    await user.save();

    io.emit("user-blocked", {
      id: user._id,
      isBlocked: user.isBlocked,
    });

    res.status(200).json({
      success: true,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    log
    res.status(500).json({
      success: false,
    });
  }
};

export { getAllUsers, toggleRole, toggleBlock };

import { userModal } from "../modals/auth.modal.js";
import { pageModel } from "../modals/pages.modal.js";
import { roleModal } from "../modals/role.modal.js";
import { logger } from "../utils/logger.js";
import { io } from "../main.js";
const getRole = async (req, res) => {
  try {
    const roles = await roleModal.find().populate("permission");

    res.status(200).json({
      success: true,
      roles,
    });
  } catch (error) {
    console.log(error);
  }
};
const getPages = async (req, res) => {
  try {
    const pages = await pageModel.find({}, { permission: 0, __v: 0 });
    if (!pages)
      return res
        .status(404)
        .json({ message: "pages not found", success: false });
    return res.status(200).json({ success: true, pages });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const createRole = async (req, res) => {
  try {
    const { role } = req.body;
    const existingRole = await roleModal.findOne({ role });

    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Role already exists",
      });
    }
    const createRoleQuery = await roleModal.create({ role });
    if (!createRoleQuery)
      return res
        .status(400)
        .json({ message: "Error In creating role", success: false });
    return res
      .status(200)
      .json({ message: "Role created successfully", success: true });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const updatePermission = async (req, res) => {
  try {
    const { roleId, page } = req.body;

    const findRole = await roleModal.findById(roleId);

    if (!findRole) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    if (findRole.permission.includes(page)) {
      findRole.permission = findRole.permission.filter((item) => item !== page);
    } else {
      findRole.permission.push(page);
    }

    await findRole.save();
    io.emit("permissionUpdated", findRole);
    return res.status(200).json({
      success: true,
      message: "Permission updated",
      role: findRole,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const updateRole = async (req, res) => {
  try {
    const { email, roleId } = req.body;
    console.log(email, roleId);
    const updatedUser = await userModal
      .findOneAndUpdate(
        { email: email },
        { role: roleId },
        { returnDocument: "after" },
      )
      .populate("role", "role");

    io.emit("role-updated", {
      email: updatedUser.email,
      role: updatedUser.role,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      updatedUser,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const createPage = async (req, res) => {
  try {
    const { pages } = req.body;

    if (!pages) {
      return res
        .status(400)
        .json({ success: false, message: "Page name is required" });
    }
    const existingPage = await pageModel.findOne({ pages });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: "Page already exists",
      });
    }

    const newPage = await pageModel.create({
      pages,
    });

    return res.status(201).json({
      success: true,
      message: "Page created successfully",
      page: newPage,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export {
  createRole,
  updatePermission,
  getRole,
  updateRole,
  createPage,
  getPages,
};

import { userModal } from "../modals/auth.modal.js";
import { logger } from "../utils/logger.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { roleModal } from "../modals/role.modal.js";

dotenv.config();
const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    if (name === "" || email === "" || password == "" || confirmPassword == "")
      return res
        .status(400)
        .json({ message: "Fields shouldn't be empty", success: false });

    const exist = await userModal.findOne({ email });

    if (exist)
      return res
        .status(409)
        .json({ message: "Email already exist", success: false });

    if (password != confirmPassword)
      return res
        .status(400)
        .json({ message: "Confirmpassword is mismatching", success: false });
    const memberRole = await roleModal.findOne({
      role: "member",
    });

    const user = await userModal.create({
      name,
      email,
      password,
      role: memberRole._id,
    });
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    return res
      .status(200)
      .json({
        message: "signup successfully",
        role: user.role,
        success: true,
        token,
      });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkEmail = await userModal.findOne({ email });
    logger.info("Login");
    if (checkEmail.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account blocked by admin",
      });
    }
    if (!checkEmail)
      return res
        .status(409)
        .json({ message: "Please signup first", success: false });
    if (checkEmail.password != password)
      return res
        .status(409)
        .json({ message: "Invalid password", success: false });
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({
      message: "login successfully",
      role: checkEmail.role,
      id : checkEmail._id,
      email,
      success: true,
      token,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const getUserRole = async (req, res) => {
  try {
    const email = req.email;
    const getRole = await userModal.findOne({ email }).populate({
      path : "role",
      select : "role permission",
      populate : {
        path : "permission",
      } 
    });
    const role = getRole.role;
    return res.status(200).json({
      message: "successfully got role",
      success: true,
      permission : getRole.role.permission,
      role : getRole.role.role,
      userId : getRole.id,
      email
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
export { signup, login, getUserRole, logout };

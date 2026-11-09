import express from "express";
import { getUserRole, login, logout, signup } from "../controllers/authController.js";
import { setRole } from "../utils/setRole.js";
const authRouter = express.Router();

authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.get("/role",setRole,getUserRole)
authRouter.post("/logout", logout);
export {authRouter}

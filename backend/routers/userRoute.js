import express from "express";
import { getAllUsers, toggleBlock, toggleRole } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/get", getAllUsers);

userRouter.patch("/togglerole/:id", toggleRole);

userRouter.patch("/toggleblock/:id", toggleBlock);

export {userRouter}
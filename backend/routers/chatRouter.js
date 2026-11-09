import express from "express";
import { getChatUsers, getPreviousChat } from "../controllers/chatController.js";

const chatRouter = express.Router();
chatRouter.get("/users",call,getChatUsers);
chatRouter.post("/previous",call,getPreviousChat);

export{chatRouter}
function  call(req,res,next) {
    console.log("hi from chat");
    next();
}


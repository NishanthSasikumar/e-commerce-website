
import express from "express";
import { addToCart, decreaseQuantity, getCart, getCartCount, increaseQuantity, removeFromCart } from "../controllers/cartController.js";
import { setRole } from "../utils/setRole.js";

const cartRouter = express.Router();


cartRouter.get("/get",call, getCart);

cartRouter.post("/add", addToCart);

cartRouter.get("/count",call,getCartCount);

cartRouter.put("/increase/:id", increaseQuantity);

cartRouter.put("/decrease/:id", decreaseQuantity);

cartRouter.delete("/remove/:id", removeFromCart);

export {cartRouter}

function  call(req,res,next) {
    console.log("Hi cartRouter");
    next();
}
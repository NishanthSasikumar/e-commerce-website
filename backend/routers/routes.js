import express from "express";
import {
  deleteProducts,
  getAll,
  getProducts,
  postProducts,
  putProducts,
  reducerStock,
} from "../controllers/productsController.js";
import { setRole } from "../utils/setRole.js";

const router = express.Router();
router.get("/all",getAll);
router.get("/:category", getProducts);
router.post("/:category", postProducts);
router.put("/:id", putProducts);
router.delete("/:id", deleteProducts);
router.patch("/:id",setRole,reducerStock);
export { router };

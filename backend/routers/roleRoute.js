import express from "express";
import { createPage, createRole, getPages, getRole, updatePermission, updateRole } from "../controllers/roleController.js";

const roleRouter = express.Router();

roleRouter.post("/createrole", createRole);
roleRouter.patch("/updatepermission",updatePermission)
roleRouter.patch("/updaterole",updateRole)
roleRouter.get("/getrole",getRole);


roleRouter.post("/createpage",createPage);
roleRouter.get("/getpages",getPages);
export { roleRouter };

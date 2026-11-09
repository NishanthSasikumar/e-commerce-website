import jwt from "jsonwebtoken";
import { logger } from "./logger.js";
import dotenv from "dotenv";

dotenv.config();

const setRole = (req,res,next)=>{
    try {
        const cookieToken=req.cookies.token;
        if(!cookieToken)
            return;
        const token = jwt.verify(cookieToken,process.env.SECRET_KEY);
        req.email = token.email;
        next();

    } catch (error) {
        console.log(error);
        
        logger.error(error);
        return res.status(500).json({message : "Internal server error"});
    }
};

export {setRole};
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { logger } from "./utils/logger.js";
import { router } from "./routers/routes.js";
import { authRouter } from "./routers/authRoute.js";
import { cartRouter } from "./routers/cartRoute.js";
import { setRole } from "./utils/setRole.js";
import { userRouter } from "./routers/userRoute.js";
import { roleRouter } from "./routers/roleRoute.js";
import { ticketRouter } from "./routers/ticketRoute.js";
import { ticketModel } from "./modals/tickets.modal.js";
import { messageModel } from "./modals/chat.modal.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/product", router);
app.use("/auth", authRouter);
app.use("/cart", setRole, cartRouter);
app.use("/role", roleRouter);
app.use("/users", userRouter);
app.use("/ticket", ticketRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => logger.info("MongoDB connected"))
  .catch((error) => logger.error(error));

const server = app.listen(process.env.PORT, () => {
  logger.info(`Server is running ${process.env?.PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected :", socket.id);

  socket.on("joinTicket", (ticketNo) => {
    socket.join(String(ticketNo));
    console.log("join ticket room", ticketNo);
  });

  socket.on("message", async (data) => {
    try {
      const ticket = await ticketModel.findOne({
        ticketNo: Number(data.ticketNo),
      });
      if (!ticket) return;

      const savedMessage = await messageModel.create({
        ticketId: ticket._id,
        sender: data.sender,
        message: data.message,
      });

      
      if (data.senderRole !== "member" && !ticket.replied) {
        await ticketModel.findByIdAndUpdate(ticket._id, { replied: true });
      }

      io.to(String(data.ticketNo)).emit("message", savedMessage);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("ticketClosed", (ticketNo) => {
    io.to(String(ticketNo)).emit("ticketClosed");
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "Disconnected");
  });
});

export { io };

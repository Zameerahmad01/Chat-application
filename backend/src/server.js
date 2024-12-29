import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import projectModel from "./models/project.model.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query.projectId;

    if (!projectId) {
      next(new Error("projectId is required"));
    }

    socket.project = await projectModel.findById(projectId);

    if (!token) {
      next(new Error("unauthorized"));
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      next(new Error("unauthorized"));
    }
    socket.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  console.log("a user connected");
  socket.join(socket.roomId);

  socket.on("project-message", (data) => {
    console.log(data);

    socket.broadcast.to(socket.roomId).emit("project-message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(socket.roomId);
  });
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("mongodb connection ", error);
  });

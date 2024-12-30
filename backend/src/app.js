import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-control",
      "Expires",
      "pragma",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import authRoutes from "./routes/auth.routes.js";
import projectsRoutes from "./routes/project.routes.js";
import aiRoutes from "./routes/ai.routes.js";
app.use("/api/auth", authRoutes);
app.use("/api/project", projectsRoutes);
app.use("/api/ai", aiRoutes);

export { app };

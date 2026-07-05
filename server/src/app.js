import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.route.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { corsOptions } from "./config/cors.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions()));

app.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is Healthy",
  });
});

app.use("/api/chat", chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };

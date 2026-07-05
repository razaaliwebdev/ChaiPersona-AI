import { app } from "./app.js";
import dotenv from "dotenv";
import { logger } from "./utils/logger.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

function startServer() {
  const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      logger.error(`Port ${PORT} is already in use. Stop the other process or change PORT in .env`);
    } else {
      logger.error("Failed to start server:", error.message);
    }
    process.exit(1);
  });
}

startServer();

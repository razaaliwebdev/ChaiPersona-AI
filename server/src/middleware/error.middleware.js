import { formatErrorResponse } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export function errorHandler(err, req, res, _next) {
  logger.error(err.message);

  const statusCode = err.isOperational ? err.statusCode : 500;
  const body = formatErrorResponse(err);

  return res.status(statusCode).json(body);
}

export function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
    code: "NOT_FOUND",
  });
}

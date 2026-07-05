import { generateChatReply } from "../services/ai.service.js";
import { validateChatRequest } from "../utils/validation.js";
import { logger } from "../utils/logger.js";

export async function chatHandler(req, res, next) {
  try {
    const validation = validateChatRequest(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
        code: "VALIDATION_ERROR",
      });
    }

    const { personaId, messages } = validation.data;

    logger.info(`Chat request — persona: ${personaId}, messages: ${messages.length}`);

    const result = await generateChatReply({ personaId, messages });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

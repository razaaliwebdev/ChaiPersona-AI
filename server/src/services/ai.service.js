import { getOpenAiClient } from "../config/ai.js";
import { buildMessages } from "../prompts/builder.js";
import { getPersona } from "../prompts/index.js";
import { DEFAULT_OPENAI_MODEL } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

const DEFAULT_TEMPERATURE = 0.7;

function getModel() {
  return process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
}

function getTemperature(personaId) {
  const persona = getPersona(personaId);
  return persona?.temperature ?? DEFAULT_TEMPERATURE;
}

function assertApiKey() {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === "") {
    throw new AppError(
      "OpenAI API key is not configured",
      503,
      "MISSING_API_KEY",
    );
  }
}

function mapOpenAiError(error) {
  const status = error?.status ?? error?.response?.status;

  if (status === 429) {
    return new AppError(
      "Rate limit exceeded. Please try again later.",
      429,
      "RATE_LIMIT",
    );
  }

  if (status === 401) {
    return new AppError(
      "Invalid OpenAI API key",
      503,
      "INVALID_API_KEY",
    );
  }

  return new AppError(
    error?.message || "Failed to generate AI response",
    502,
    "AI_PROVIDER_ERROR",
  );
}

export async function generateChatReply({ personaId, messages }) {
  assertApiKey();

  const openai = getOpenAiClient();
  const openAiMessages = buildMessages(personaId, messages);
  const model = getModel();
  const temperature = getTemperature(personaId);

  logger.debug(
    `Generating reply with model: ${model}, persona: ${personaId}, temperature: ${temperature}`,
  );

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: openAiMessages,
      temperature,
      frequency_penalty: 0.5,
      presence_penalty: 0.3,
    });

    const reply = response.choices?.[0]?.message?.content;

    if (!reply || reply.trim().length === 0) {
      throw new AppError(
        "Received an empty response from AI provider",
        502,
        "INVALID_AI_RESPONSE",
      );
    }

    return {
      success: true,
      reply: reply.trim(),
    };
  } catch (error) {
    if (error instanceof AppError) throw error;

    logger.error("OpenAI API error:", error.message);
    throw mapOpenAiError(error);
  }
}

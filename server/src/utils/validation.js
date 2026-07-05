import { getPersona, getPersonaIds } from "../prompts/index.js";
import { VALID_MESSAGE_ROLES } from "./constants.js";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateMessage(message, index) {
  if (!message || typeof message !== "object") {
    return `messages[${index}] must be an object`;
  }

  if (!VALID_MESSAGE_ROLES.includes(message.role)) {
    return `messages[${index}].role must be one of: ${VALID_MESSAGE_ROLES.join(", ")}`;
  }

  if (!isNonEmptyString(message.content)) {
    return `messages[${index}].content must be a non-empty string`;
  }

  return null;
}

export function validateChatRequest(body) {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body is required" };
  }

  const { personaId, messages } = body;

  if (!isNonEmptyString(personaId)) {
    return { valid: false, error: "personaId is required and must be a non-empty string" };
  }

  if (!getPersona(personaId)) {
    return {
      valid: false,
      error: `Invalid personaId. Supported personas: ${getPersonaIds().join(", ")}`,
    };
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return { valid: false, error: "messages must be a non-empty array" };
  }

  for (let i = 0; i < messages.length; i++) {
    const messageError = validateMessage(messages[i], i);
    if (messageError) {
      return { valid: false, error: messageError };
    }
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== "user") {
    return { valid: false, error: "The last message must be from the user" };
  }

  return {
    valid: true,
    data: {
      personaId: personaId.trim(),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content.trim(),
      })),
    },
  };
}

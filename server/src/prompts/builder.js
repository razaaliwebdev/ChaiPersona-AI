import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getPersona } from "./index.js";
import {
  MAX_HISTORY_MESSAGES,
  MAX_FEW_SHOT_EXAMPLES,
  VALID_MESSAGE_ROLES,
} from "../utils/constants.js";
import { AppError } from "../utils/errors.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PERSONA_DATA_DIR = join(__dirname, "../../data/personas");

function loadPersonaNotes(personaId) {
  const filePath = join(PERSONA_DATA_DIR, `${personaId}.json`);

  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function formatPersonaNotes(notes) {
  if (!notes) return "";

  const sections = [];

  if (notes.teachingPatterns?.length) {
    sections.push(
      `Observed teaching patterns:\n${notes.teachingPatterns.map((p) => `- ${p}`).join("\n")}`,
    );
  }

  if (notes.writingStyle) {
    sections.push(`Writing style: ${notes.writingStyle}`);
  }

  if (sections.length === 0) return "";

  return `\n\n---\n\n# PUBLIC CONTENT STYLE NOTES\n\n${sections.join("\n\n")}`;
}

function buildFewShotMessages(examples) {
  if (!Array.isArray(examples)) return [];

  const selected = examples.slice(0, MAX_FEW_SHOT_EXAMPLES);

  return selected.flatMap((example) => [
    { role: "user", content: example.user.trim() },
    { role: "assistant", content: example.assistant.trim() },
  ]);
}

function sanitizeHistory(messages) {
  return messages
    .filter(
      (message) =>
        message &&
        VALID_MESSAGE_ROLES.includes(message.role) &&
        typeof message.content === "string" &&
        message.content.trim().length > 0,
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));
}

function limitHistory(messages) {
  if (messages.length <= MAX_HISTORY_MESSAGES) {
    return messages;
  }

  return messages.slice(-MAX_HISTORY_MESSAGES);
}

function injectStyleAnchor(history, voiceReminder) {
  if (!voiceReminder || history.length === 0) {
    return history;
  }

  const lastMessage = history[history.length - 1];
  if (lastMessage.role !== "user") {
    return history;
  }

  const styleAnchor = {
    role: "system",
    content: `# STYLE ANCHOR — your next reply MUST follow this voice\n\n${voiceReminder}`,
  };

  return [...history.slice(0, -1), styleAnchor, lastMessage];
}

export function buildMessages(personaId, messages) {
  const persona = getPersona(personaId);

  if (!persona) {
    throw new AppError(`Invalid persona: ${personaId}`, 400, "INVALID_PERSONA");
  }

  const systemPrompt = persona.getPrompt();
  const personaNotes = formatPersonaNotes(loadPersonaNotes(personaId));

  const systemContent = [systemPrompt.trim(), personaNotes]
    .filter(Boolean)
    .join("");

  const systemMessage = {
    role: "system",
    content: systemContent,
  };

  const fewShotMessages = buildFewShotMessages(persona.examples);
  const history = limitHistory(sanitizeHistory(messages));

  const voiceReminder =
    typeof persona.getVoiceReminder === "function"
      ? persona.getVoiceReminder()
      : "";

  const historyWithAnchor = injectStyleAnchor(history, voiceReminder);

  return [systemMessage, ...fewShotMessages, ...historyWithAnchor];
}

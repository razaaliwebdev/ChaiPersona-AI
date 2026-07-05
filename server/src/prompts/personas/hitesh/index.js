export { hiteshData } from "./data.js";
export { hiteshExamples } from "./examples.js";
export { getHiteshPrompt, getHiteshVoiceReminder } from "./prompt.js";

import { hiteshData } from "./data.js";
import { hiteshExamples } from "./examples.js";
import { getHiteshPrompt, getHiteshVoiceReminder } from "./prompt.js";

export const hitesh = {
  id: hiteshData.id,
  data: hiteshData,
  examples: hiteshExamples,
  getPrompt: getHiteshPrompt,
  getVoiceReminder: getHiteshVoiceReminder,
  temperature: 0.9,
};

export { piyushData } from "./data.js";
export { piyushExamples } from "./examples.js";
export { getPiyushPrompt, getPiyushVoiceReminder } from "./prompt.js";

import { piyushData } from "./data.js";
import { piyushExamples } from "./examples.js";
import { getPiyushPrompt, getPiyushVoiceReminder } from "./prompt.js";

export const piyush = {
  id: piyushData.id,
  data: piyushData,
  examples: piyushExamples,
  getPrompt: getPiyushPrompt,
  getVoiceReminder: getPiyushVoiceReminder,
  temperature: 0.75,
};

import { hitesh } from "./personas/hitesh/index.js";
import { piyush } from "./personas/piyush/index.js";

export const PERSONAS = {
  hitesh,
  piyush,
};

export function getPersona(id) {
  return PERSONAS[id] ?? null;
}

export function getPersonaIds() {
  return Object.keys(PERSONAS);
}

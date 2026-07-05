import dotenv from "dotenv";
import { collectPersonaData } from "../src/collectors/personas/persona.collector.js";
import { getPersonaIds } from "../src/prompts/index.js";
import { logger } from "../src/utils/logger.js";

dotenv.config();

const personaId = process.argv[2];
const maxVideos = parseInt(process.argv[3], 10) || 10;

async function main() {
  if (!personaId) {
    console.log("Usage: node scripts/buildPersona.js <personaId> [maxVideos]");
    console.log(`Available personas: ${getPersonaIds().join(", ")}`);
    process.exit(1);
  }

  if (!getPersonaIds().includes(personaId)) {
    console.error(`Unknown persona: ${personaId}`);
    console.log(`Available personas: ${getPersonaIds().join(", ")}`);
    process.exit(1);
  }

  try {
    logger.info(`Building persona data for: ${personaId}`);
    const result = await collectPersonaData(personaId, { maxVideos });
    console.log(`\nPersona data generated successfully.`);
    console.log(`Topics: ${result.topics.length}`);
    console.log(`Teaching patterns: ${result.teachingPatterns.length}`);
    console.log(`Saved to: data/personas/${personaId}.json`);
  } catch (error) {
    console.error("Failed to build persona:", error.message);
    process.exit(1);
  }
}

main();

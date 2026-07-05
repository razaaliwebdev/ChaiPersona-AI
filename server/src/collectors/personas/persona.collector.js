import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getPersona } from "../../prompts/index.js";
import { collectChannelData } from "../youtube/youtube.service.js";
import { fetchTranscriptsForVideos } from "../youtube/transcript.service.js";
import { collectWebsiteData } from "../website/website.service.js";
import { logger } from "../../utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../../../data/personas");

function extractTeachingPatterns(transcripts) {
  const patterns = new Set();

  for (const item of transcripts) {
    const text = item.transcript?.toLowerCase() ?? "";

    if (text.includes("let's understand") || text.includes("let us understand")) {
      patterns.add("Starts explanations with 'let's understand'");
    }
    if (text.includes("internally") || text.includes("under the hood")) {
      patterns.add("Explains internal workings");
    }
    if (text.includes("trade-off") || text.includes("trade off")) {
      patterns.add("Discusses trade-offs between approaches");
    }
    if (text.includes("production") || text.includes("in real world")) {
      patterns.add("References production scenarios");
    }
    if (text.includes("architecture") || text.includes("system design")) {
      patterns.add("Discusses architecture and system design");
    }
    if (text.includes("for example") || text.includes("let me show")) {
      patterns.add("Uses examples to illustrate concepts");
    }
    if (text.includes("first principle") || text.includes("from scratch")) {
      patterns.add("Builds understanding from first principles");
    }
    if (text.includes("project") || text.includes("build")) {
      patterns.add("Encourages hands-on project building");
    }
  }

  return [...patterns];
}

function mergeTopics(...topicLists) {
  return [...new Set(topicLists.flat())].slice(0, 30);
}

function mergeTerminology(...termLists) {
  return [...new Set(termLists.flat())].slice(0, 30);
}

export async function collectPersonaData(personaId, options = {}) {
  const { maxVideos = 10 } = options;

  const persona = getPersona(personaId);

  if (!persona) {
    throw new Error(`Unknown persona: ${personaId}`);
  }

  const { data } = persona;
  const sources = data.sources;

  logger.info(`Starting persona collection for: ${personaId}`);

  let youtubeData = [];
  let websiteData = null;

  if (sources.youtube?.length) {
    for (const channelUrl of sources.youtube) {
      try {
        const channelData = await collectChannelData(channelUrl, { maxVideos });
        const withTranscripts = await fetchTranscriptsForVideos(channelData.videos);
        youtubeData.push({
          channelUrl,
          ...channelData,
          videosWithTranscripts: withTranscripts,
        });
      } catch (error) {
        logger.error(`YouTube collection failed for ${channelUrl}: ${error.message}`);
      }
    }
  }

  if (sources.website) {
    try {
      websiteData = await collectWebsiteData(sources.website);
    } catch (error) {
      logger.error(`Website collection failed: ${error.message}`);
    }
  }

  const allTranscripts = youtubeData.flatMap((c) => c.videosWithTranscripts ?? []);
  const teachingPatterns = extractTeachingPatterns(allTranscripts);

  const youtubeTopics = youtubeData.flatMap((c) =>
    c.videos.map((v) => v.title).filter(Boolean),
  );

  const personaJson = {
    id: personaId,
    name: data.name,
    collectedAt: new Date().toISOString(),
    sources: {
      youtube: sources.youtube ?? [],
      website: sources.website ?? null,
    },
    topics: mergeTopics(
      youtubeTopics,
      websiteData?.topics ?? [],
    ),
    terminology: mergeTerminology(
      websiteData?.terminology ?? [],
      allTranscripts.flatMap((t) =>
        (t.transcript?.match(/\b(?:API|REST|Node\.js|React|Docker|microservices?)\b/gi) ?? []),
      ),
    ),
    teachingPatterns,
    writingStyle: websiteData?.writingStyle ?? null,
    youtube: {
      channelsCollected: youtubeData.length,
      videosWithTranscripts: allTranscripts.length,
    },
    website: websiteData
      ? {
          pagesCollected: websiteData.pages?.length ?? 0,
          writingStyle: websiteData.writingStyle,
        }
      : null,
  };

  mkdirSync(DATA_DIR, { recursive: true });
  const outputPath = join(DATA_DIR, `${personaId}.json`);
  writeFileSync(outputPath, JSON.stringify(personaJson, null, 2), "utf-8");

  logger.info(`Persona data saved to: ${outputPath}`);

  return personaJson;
}

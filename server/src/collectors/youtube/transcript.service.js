import { YoutubeTranscript } from "youtube-transcript";
import { logger } from "../../utils/logger.js";

export async function fetchTranscript(videoId) {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: "en",
    });

    if (!segments || segments.length === 0) {
      return null;
    }

    return {
      videoId,
      language: "en",
      text: segments.map((s) => s.text).join(" "),
      segments: segments.map((s) => ({
        text: s.text,
        offset: s.offset,
        duration: s.duration,
      })),
    };
  } catch (error) {
    logger.debug(`No transcript available for video ${videoId}: ${error.message}`);
    return null;
  }
}

export async function fetchTranscriptsForVideos(videos) {
  const results = [];

  for (const video of videos) {
    const transcript = await fetchTranscript(video.videoId);

    if (transcript) {
      results.push({
        ...video,
        transcript: transcript.text,
      });
    }
  }

  return results;
}

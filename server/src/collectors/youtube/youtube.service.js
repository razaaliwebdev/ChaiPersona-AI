import { google } from "googleapis";
import { AppError } from "../../utils/errors.js";
import { logger } from "../../utils/logger.js";

function getYouTubeClient() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    throw new AppError(
      "YouTube API key is not configured",
      503,
      "MISSING_YOUTUBE_API_KEY",
    );
  }

  return google.youtube({
    version: "v3",
    auth: apiKey,
  });
}

function extractChannelId(url) {
  const channelMatch = url.match(/youtube\.com\/channel\/([^/?]+)/);
  if (channelMatch) return channelMatch[1];

  const handleMatch = url.match(/youtube\.com\/@([^/?]+)/);
  if (handleMatch) return { handle: handleMatch[1] };

  return null;
}

export async function resolveChannelId(channelUrl) {
  const youtube = getYouTubeClient();
  const extracted = extractChannelId(channelUrl);

  if (!extracted) {
    throw new AppError(`Could not parse channel URL: ${channelUrl}`, 400);
  }

  if (typeof extracted === "string") {
    return extracted;
  }

  const response = await youtube.channels.list({
    part: ["id"],
    forHandle: extracted.handle,
  });

  const channelId = response.data.items?.[0]?.id;

  if (!channelId) {
    throw new AppError(`Channel not found for handle: @${extracted.handle}`, 404);
  }

  return channelId;
}

export async function fetchChannelVideos(channelId, maxResults = 10) {
  const youtube = getYouTubeClient();

  const uploadsPlaylist = await youtube.channels.list({
    part: ["contentDetails"],
    id: [channelId],
  });

  const playlistId =
    uploadsPlaylist.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!playlistId) {
    return [];
  }

  const response = await youtube.playlistItems.list({
    part: ["snippet", "contentDetails"],
    playlistId,
    maxResults,
  });

  return (response.data.items ?? []).map((item) => ({
    videoId: item.contentDetails?.videoId,
    title: item.snippet?.title,
    description: item.snippet?.description,
    publishedAt: item.snippet?.publishedAt,
    thumbnail: item.snippet?.thumbnails?.medium?.url,
  }));
}

export async function fetchPlaylists(channelId, maxResults = 10) {
  const youtube = getYouTubeClient();

  const response = await youtube.playlists.list({
    part: ["snippet", "contentDetails"],
    channelId,
    maxResults,
  });

  return (response.data.items ?? []).map((item) => ({
    playlistId: item.id,
    title: item.snippet?.title,
    description: item.snippet?.description,
    videoCount: item.contentDetails?.itemCount,
  }));
}

export async function fetchVideoMetadata(videoId) {
  const youtube = getYouTubeClient();

  const response = await youtube.videos.list({
    part: ["snippet", "contentDetails", "statistics"],
    id: [videoId],
  });

  const video = response.data.items?.[0];

  if (!video) {
    throw new AppError(`Video not found: ${videoId}`, 404);
  }

  return {
    videoId,
    title: video.snippet?.title,
    description: video.snippet?.description,
    publishedAt: video.snippet?.publishedAt,
    duration: video.contentDetails?.duration,
    viewCount: video.statistics?.viewCount,
    tags: video.snippet?.tags ?? [],
  };
}

export async function collectChannelData(channelUrl, options = {}) {
  const { maxVideos = 10 } = options;

  logger.info(`Collecting YouTube data for: ${channelUrl}`);

  const channelId = await resolveChannelId(channelUrl);
  const [videos, playlists] = await Promise.all([
    fetchChannelVideos(channelId, maxVideos),
    fetchPlaylists(channelId),
  ]);

  const videoMetadata = await Promise.all(
    videos
      .filter((v) => v.videoId)
      .map((v) => fetchVideoMetadata(v.videoId).catch(() => null)),
  );

  return {
    channelId,
    channelUrl,
    videos: videoMetadata.filter(Boolean),
    playlists,
    collectedAt: new Date().toISOString(),
  };
}

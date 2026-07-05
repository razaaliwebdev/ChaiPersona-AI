import * as cheerio from "cheerio";
import { logger } from "../../utils/logger.js";

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "must", "shall", "can", "need", "to", "of",
  "in", "for", "on", "with", "at", "by", "from", "as", "into", "through",
  "during", "before", "after", "and", "but", "or", "not", "no", "this",
  "that", "these", "those", "it", "its", "we", "you", "your", "our",
  "they", "them", "their", "he", "she", "his", "her", "i", "my", "me",
]);

function extractText($) {
  $("script, style, nav, footer, header, noscript").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}

function extractHeadings($) {
  const headings = [];

  $("h1, h2, h3").each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 2) headings.push(text);
  });

  return headings;
}

function extractTopics(text, headings) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const frequency = {};

  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;
  }

  const topWords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);

  return [...new Set([...headings.slice(0, 10), ...topWords])].slice(0, 25);
}

function extractTerminology(text) {
  const techPatterns = [
    /\b(?:JavaScript|TypeScript|Node\.js|React|Next\.js|Express|MongoDB|PostgreSQL|Docker|Kubernetes|AWS|API|REST|GraphQL|microservices?|authentication|middleware|database|backend|frontend|DevOps|CI\/CD|system design|architecture)\b/gi,
  ];

  const terms = new Set();

  for (const pattern of techPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((m) => terms.add(m));
    }
  }

  return [...terms];
}

function analyzeWritingStyle(text) {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  const avgSentenceLength =
    sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) /
    (sentences.length || 1);

  const usesQuestions = (text.match(/\?/g) || []).length > 2;
  const usesLists = text.includes("•") || /\d+\.\s/.test(text);
  const usesCodeTerms = /\b(function|const|class|import|export|async|await)\b/i.test(text);

  const traits = [];

  if (avgSentenceLength < 15) traits.push("Short, direct sentences");
  if (avgSentenceLength >= 15) traits.push("Detailed, explanatory sentences");
  if (usesQuestions) traits.push("Uses questions to guide thinking");
  if (usesLists) traits.push("Uses structured lists");
  if (usesCodeTerms) traits.push("References code concepts frequently");

  return traits.join(". ") || "Standard technical writing";
}

export async function fetchPage(url) {
  logger.debug(`Fetching website: ${url}`);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "ChaiPersona-Collector/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const text = extractText($);
  const headings = extractHeadings($);

  return {
    url,
    title: $("title").text().trim(),
    headings,
    text: text.slice(0, 50000),
    topics: extractTopics(text, headings),
    terminology: extractTerminology(text),
    writingStyle: analyzeWritingStyle(text),
    collectedAt: new Date().toISOString(),
  };
}

export async function collectWebsiteData(websiteUrl) {
  logger.info(`Collecting website data from: ${websiteUrl}`);

  const mainPage = await fetchPage(websiteUrl);

  const blogLinks = [];
  const $ = cheerio.load(
    await fetch(websiteUrl, {
      headers: { "User-Agent": "ChaiPersona-Collector/1.0" },
    }).then((r) => r.text()),
  );

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (
      href &&
      (href.includes("/blog") ||
        href.includes("/post") ||
        href.includes("/article") ||
        href.includes("/tutorial"))
    ) {
      try {
        const fullUrl = new URL(href, websiteUrl).href;
        if (!blogLinks.includes(fullUrl)) blogLinks.push(fullUrl);
      } catch {
        // skip invalid URLs
      }
    }
  });

  const pages = [mainPage];
  const linksToFetch = blogLinks.slice(0, 5);

  for (const link of linksToFetch) {
    try {
      const page = await fetchPage(link);
      pages.push(page);
    } catch (error) {
      logger.debug(`Skipped page ${link}: ${error.message}`);
    }
  }

  const allTopics = [...new Set(pages.flatMap((p) => p.topics))];
  const allTerminology = [...new Set(pages.flatMap((p) => p.terminology))];
  const writingStyles = pages.map((p) => p.writingStyle).filter(Boolean);

  return {
    websiteUrl,
    pages,
    topics: allTopics.slice(0, 30),
    terminology: allTerminology.slice(0, 30),
    writingStyle: writingStyles[0] || "Standard technical writing",
    collectedAt: new Date().toISOString(),
  };
}

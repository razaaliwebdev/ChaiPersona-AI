import { OpenAI } from "openai";

let client = null;

export function getOpenAiClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return null;
  }

  if (!client) {
    client = new OpenAI({ apiKey });
  }

  return client;
}

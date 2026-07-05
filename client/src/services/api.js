import { getApiUrl, isApiConfigured } from "@/config/api.js";

export async function sendChatMessage(personaId, messages) {
  if (!isApiConfigured()) {
    throw new Error(
      "API URL is not configured. Set VITE_API_URL in production.",
    );
  }

  let response;

  try {
    response = await fetch(getApiUrl("/api/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personaId, messages }),
    });
  } catch {
    throw new Error(
      "Cannot reach the server. Check your connection or try again later.",
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to get AI response");
  }

  return data;
}

export async function checkServerHealth() {
  try {
    const response = await fetch(getApiUrl("/health"));
    const data = await response.json();
    return response.ok && data.success;
  } catch {
    return false;
  }
}

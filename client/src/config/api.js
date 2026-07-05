const rawBaseUrl = import.meta.env.VITE_API_URL || "";

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

export function getApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function isApiConfigured() {
  return API_BASE_URL.length > 0 || import.meta.env.DEV;
}

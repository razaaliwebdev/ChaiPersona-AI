function parseOrigins(value) {
  if (!value) return [];

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getAllowedOrigins() {
  const origins = new Set(parseOrigins(process.env.CLIENT_URL));

  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:5173");
    origins.add("http://127.0.0.1:5173");
    origins.add("http://localhost:4173");
    origins.add("http://127.0.0.1:4173");
  }

  if (origins.size === 0) {
    origins.add("http://localhost:5173");
  }

  return [...origins];
}

export function corsOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: false,
  };
}

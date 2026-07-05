const isDev = process.env.NODE_ENV === "development";

export const logger = {
  info(...args) {
    if (isDev) console.log("[INFO]", ...args);
  },

  error(...args) {
    console.error("[ERROR]", ...args);
  },

  debug(...args) {
    if (isDev) console.debug("[DEBUG]", ...args);
  },
};

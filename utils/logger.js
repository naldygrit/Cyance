// Simple logger implementation
const logger = {
  error: (message) => console.error(`[ERROR] ${message}`),
  info: (message) => console.log(`[INFO] ${message}`),
  warn: (message) => console.warn(`[WARN] ${message}`)
}

module.exports = logger
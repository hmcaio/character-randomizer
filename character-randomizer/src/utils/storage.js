import log from 'loglevel'

// Reads a JSON value from localStorage. Returns defaultValue when the key is
// missing, holds null, is not valid JSON, or storage is unavailable.
export function readStored(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return defaultValue
    return JSON.parse(raw) ?? defaultValue
  } catch (err) {
    log.warn(`readStored failed for key=${key}: ${err}`)
    return defaultValue
  }
}

// Writes a JSON value to localStorage. Skips undefined, which JSON.stringify
// would turn into the unparseable string "undefined".
export function writeStored(key, value) {
  if (value === undefined) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    log.warn(`writeStored failed for key=${key}: ${err}`)
  }
}

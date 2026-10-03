export const DATA_BASE_URL = import.meta.env.VITE_DATA_BASE_URL || ""
export const CACHE_KEY = "appDataCache"

export function resolveImageUrl(img, baseUrl = DATA_BASE_URL) {
  return img.startsWith("http") ? img : `${baseUrl}${img}`
}

export function normalizeAppData(rawAppData, baseUrl = DATA_BASE_URL) {
  const normalized = {}
  for (const [gameId, game] of Object.entries(rawAppData)) {
    normalized[gameId] = {
      ...game,
      characters: game.characters.map((character) => ({
        ...character,
        img: resolveImageUrl(character.img, baseUrl),
      })),
    }
  }
  return normalized
}

export function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
    return cached?.appData ?? null
  } catch {
    return null
  }
}

export function writeCache(appData) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ appData, cachedAt: Date.now() }))
}

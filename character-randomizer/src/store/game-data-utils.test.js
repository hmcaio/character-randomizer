import { CACHE_KEY, normalizeAppData, readCache, resolveImageUrl, writeCache } from './game-data-utils'

describe('resolveImageUrl', () => {
  it('prefixes relative paths with the base URL', () => {
    expect(resolveImageUrl('/character-images/zzz/a.png', 'https://data.example')).toBe('https://data.example/character-images/zzz/a.png')
  })

  it('leaves absolute URLs unchanged', () => {
    expect(resolveImageUrl('https://cdn.example/a.png', 'https://data.example')).toBe('https://cdn.example/a.png')
  })
})

describe('normalizeAppData', () => {
  it('resolves every character image and keeps other fields', () => {
    const raw = {
      ZZZ: {
        name: 'Zenless Zone Zero',
        teamCharacterCount: 3,
        characters: [
          { id: 'A', name: 'A', img: '/character-images/zzz/a.png', rank: 'S' },
          { id: 'B', name: 'B', img: 'http://cdn.example/b.png' },
        ],
      },
    }
    const normalized = normalizeAppData(raw, 'https://data.example')
    expect(normalized.ZZZ.name).toBe('Zenless Zone Zero')
    expect(normalized.ZZZ.teamCharacterCount).toBe(3)
    expect(normalized.ZZZ.characters[0]).toEqual({ id: 'A', name: 'A', img: 'https://data.example/character-images/zzz/a.png', rank: 'S' })
    expect(normalized.ZZZ.characters[1].img).toBe('http://cdn.example/b.png')
    expect(raw.ZZZ.characters[0].img).toBe('/character-images/zzz/a.png')
  })
})

describe('app data cache', () => {
  it('round-trips through writeCache and readCache', () => {
    const appData = { ZZZ: { name: 'Z', characters: [] } }
    writeCache(appData)
    expect(readCache()).toEqual(appData)
    expect(JSON.parse(localStorage.getItem(CACHE_KEY)).cachedAt).toEqual(expect.any(Number))
  })

  it('returns null when nothing is cached', () => {
    expect(readCache()).toBeNull()
  })

  it('returns null for corrupt JSON', () => {
    localStorage.setItem(CACHE_KEY, '{not json')
    expect(readCache()).toBeNull()
  })
})

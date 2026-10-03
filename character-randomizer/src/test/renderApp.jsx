import { render } from '@testing-library/react'
import App from '../App'

function makeCharacters(prefix, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix} ${i + 1}`,
    name: `${prefix} ${i + 1}`,
    img: `/character-images/${prefix.toLowerCase()}/${i + 1}.png`,
  }))
}

// Small, stable fixture shaped like game-data/public/app-data.json.
export const fixtureAppData = {
  ALPHA: {
    name: 'Alpha Game',
    teamCharacterCount: 3,
    filters: [],
    characters: makeCharacters('Alpha', 5),
  },
  BETA: {
    name: 'Beta Game',
    teamCharacterCount: 2,
    filters: [],
    characters: makeCharacters('Beta', 3),
  },
}

export function stubFetch(data = fixtureAppData) {
  const fetchMock = vi.fn(() => Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

export function seedLocalStorage(entries) {
  for (const [key, value] of Object.entries(entries)) {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
  }
}

export function readStored(key) {
  return JSON.parse(localStorage.getItem(key))
}

export function renderApp() {
  stubFetch()
  return render(<App />)
}

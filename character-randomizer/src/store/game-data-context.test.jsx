import { render, screen } from '@testing-library/react'
import GameDataProvider, { GameDataContext } from './game-data-context'
import { useContext } from 'react'
import { CACHE_KEY } from './game-data-utils'
import { fixtureAppData, stubFetch } from '../test/renderApp'

function GameNames() {
  const { appData } = useContext(GameDataContext)
  return <ul>{Object.values(appData).map((game) => <li key={game.name}>{game.name}</li>)}</ul>
}

function renderProvider() {
  return render(
    <GameDataProvider>
      <GameNames />
    </GameDataProvider>
  )
}

describe('GameDataProvider', () => {
  it('shows a spinner, then renders children with the fetched data', async () => {
    const fetchMock = stubFetch()
    renderProvider()

    expect(screen.getByRole('progressbar', { hidden: true })).toBeInTheDocument()
    expect(await screen.findByText('Alpha Game')).toBeInTheDocument()
    expect(screen.getByText('Beta Game')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/app-data\.json$/), expect.anything())
  })

  it('writes the fetched data to the cache', async () => {
    stubFetch()
    renderProvider()
    await screen.findByText('Alpha Game')

    const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
    expect(Object.keys(cached.appData)).toEqual(Object.keys(fixtureAppData))
  })

  it('falls back to the cache when the fetch fails', async () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ appData: { CACHED: { name: 'Cached Game', characters: [] } } }))
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))))
    renderProvider()

    expect(await screen.findByText('Cached Game')).toBeInTheDocument()
  })

  it('shows an error with a Retry button when the fetch fails and there is no cache', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, status: 500 })))
    renderProvider()

    expect(await screen.findByText("Couldn't load character data")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry', hidden: true })).toBeInTheDocument()
  })
})

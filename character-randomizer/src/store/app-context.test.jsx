import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fixtureAppData, readStored, renderApp, seedLocalStorage } from '../test/renderApp'

const alphaIds = fixtureAppData.ALPHA.characters.map((c) => c.id)
const betaIds = fixtureAppData.BETA.characters.map((c) => c.id)

describe('AppContextProvider', () => {
  it('starts on the first game and defaults owned to every character', async () => {
    renderApp()
    await screen.findByText('Alpha 1')

    expect(localStorage.getItem('selectedGame')).toBe('ALPHA')
    expect(readStored('ALPHA.owned')).toEqual(alphaIds)
  })

  it('restores the last selected game', async () => {
    seedLocalStorage({ selectedGame: 'BETA' })
    renderApp()

    expect(await screen.findByText('Beta 1')).toBeInTheDocument()
    expect(screen.queryByText('Alpha 1')).not.toBeInTheDocument()
    expect(screen.getAllByText('Character')).toHaveLength(2)
  })

  it('swaps in each game\'s saved state when switching games', async () => {
    seedLocalStorage({
      'ALPHA.owned': ['Alpha 1', 'Alpha 2'],
      'ALPHA.selectionHistory': ['Alpha 1'],
      'BETA.owned': ['Beta 2'],
      'BETA.selectionHistory': ['Beta 2', 'Beta 3'],
      'BETA.config': { characterSlots: 'single', isRepetitionAllowed: false },
    })
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Alpha 1')
    expect(screen.getAllByTestId('CheckCircleIcon')).toHaveLength(1)

    await user.click(screen.getAllByRole('button', { name: 'Beta Game', hidden: true })[0])

    expect(await screen.findByText('Beta 1')).toBeInTheDocument()
    expect(localStorage.getItem('selectedGame')).toBe('BETA')
    expect(screen.getAllByTestId('CheckCircleIcon')).toHaveLength(2)
    expect(screen.getAllByText('Character')).toHaveLength(1)
    expect(readStored('BETA.owned')).toEqual(['Beta 2'])
    expect(readStored('BETA.selectionHistory')).toEqual(['Beta 2', 'Beta 3'])

    await user.click(screen.getAllByRole('button', { name: 'Alpha Game', hidden: true })[0])

    expect(await screen.findByText('Alpha 1')).toBeInTheDocument()
    expect(readStored('ALPHA.owned')).toEqual(['Alpha 1', 'Alpha 2'])
    expect(readStored('ALPHA.selectionHistory')).toEqual(['Alpha 1'])
    expect(readStored('BETA.owned')).toEqual(['Beta 2'])
  })

  it('initializes owned for a game with no saved state on first switch', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Alpha 1')

    await user.click(screen.getAllByRole('button', { name: 'Beta Game', hidden: true })[0])
    await screen.findByText('Beta 1')

    expect(readStored('BETA.owned')).toEqual(betaIds)
  })
})

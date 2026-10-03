import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fixtureAppData, readStored, renderApp, seedLocalStorage } from '../../test/renderApp'

const alphaIds = fixtureAppData.ALPHA.characters.map((c) => c.id)

describe('CharacterGrid', () => {
  it('renders a card for every character of the selected game', async () => {
    renderApp()
    for (const id of alphaIds) {
      expect(await screen.findByText(id)).toBeInTheDocument()
    }
  })

  it('toggles a character in and out of owned on click', async () => {
    const user = userEvent.setup()
    renderApp()

    // Hovering the name opens a tooltip with the same text, so keep the element.
    const card = await screen.findByText('Alpha 2')
    await user.click(card)
    expect(readStored('ALPHA.owned')).toEqual(alphaIds.filter((id) => id !== 'Alpha 2'))

    await user.click(card)
    expect(readStored('ALPHA.owned').sort()).toEqual(alphaIds)
  })

  it('marks characters in the selection history', async () => {
    seedLocalStorage({ 'ALPHA.selectionHistory': ['Alpha 1', 'Alpha 3'] })
    renderApp()
    await screen.findByText('Alpha 1')

    expect(screen.getAllByTestId('CheckCircleIcon')).toHaveLength(2)
  })

  it('hides history marks when repetition is allowed', async () => {
    seedLocalStorage({
      'ALPHA.config': { characterSlots: 'team', isRepetitionAllowed: true },
      'ALPHA.selectionHistory': ['Alpha 1'],
    })
    renderApp()
    await screen.findByText('Alpha 1')

    expect(screen.queryByTestId('CheckCircleIcon')).not.toBeInTheDocument()
  })
})

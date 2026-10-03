import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fixtureAppData, readStored, renderApp, seedLocalStorage } from '../../test/renderApp'

const alphaIds = fixtureAppData.ALPHA.characters.map((c) => c.id)

// SelectionConfig renders its controls twice (desktop panel and mobile
// accordion). The first match is the desktop panel.
async function setup() {
  const user = userEvent.setup()
  renderApp()
  await screen.findByRole('button', { name: 'Randomize' })
  const first = (role, name) => screen.getAllByRole(role, { name, hidden: true })[0]
  return { user, first }
}

describe('SelectionConfig', () => {
  it('switches to single mode and clears the current selection', async () => {
    seedLocalStorage({ 'ALPHA.selected': [fixtureAppData.ALPHA.characters[0]] })
    const { user, first } = await setup()

    await user.click(first('button', 'single'))
    expect(readStored('ALPHA.config').characterSlots).toBe('single')
    expect(readStored('ALPHA.selected')).toEqual([])
    expect(screen.getAllByText('Character')).toHaveLength(1)
  })

  it('toggles repetition and disables Reset Pool while it is allowed', async () => {
    const { user, first } = await setup()
    expect(first('button', 'Reset Pool')).toBeEnabled()

    await user.click(first('switch', 'Allow repetition'))
    expect(readStored('ALPHA.config').isRepetitionAllowed).toBe(true)
    expect(first('button', 'Reset Pool')).toBeDisabled()
  })

  it('clears the selection history with Reset Pool', async () => {
    seedLocalStorage({ 'ALPHA.selectionHistory': ['Alpha 1', 'Alpha 2'] })
    const { user, first } = await setup()

    await user.click(first('button', 'Reset Pool'))
    expect(readStored('ALPHA.selectionHistory')).toEqual([])
  })

  it('selects none and all characters', async () => {
    const { user, first } = await setup()

    await user.click(first('button', 'Select none'))
    expect(readStored('ALPHA.owned')).toEqual([])

    await user.click(first('button', 'Select all'))
    expect(readStored('ALPHA.owned')).toEqual(alphaIds)
  })
})

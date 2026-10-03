import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readStored, renderApp, seedLocalStorage } from '../../test/renderApp'

async function setup() {
  const user = userEvent.setup()
  renderApp()
  const randomize = await screen.findByRole('button', { name: 'Randomize' })
  return { user, randomize }
}

describe('CharacterSlots', () => {
  it('shows empty placeholder slots for the team size before randomizing', async () => {
    await setup()
    expect(screen.getAllByText('Character')).toHaveLength(3)
  })

  it('fills every team slot with distinct owned characters', async () => {
    const { user, randomize } = await setup()
    await user.click(randomize)

    const selected = readStored('ALPHA.selected')
    expect(selected).toHaveLength(3)
    expect(new Set(selected.map((c) => c.id)).size).toBe(3)
    expect(screen.queryByText('Character')).not.toBeInTheDocument()
  })

  it('fills a single slot in single mode', async () => {
    seedLocalStorage({ 'ALPHA.config': { characterSlots: 'single', isRepetitionAllowed: false } })
    const { user, randomize } = await setup()
    expect(screen.getAllByText('Character')).toHaveLength(1)

    await user.click(randomize)
    expect(readStored('ALPHA.selected')).toHaveLength(1)
  })

  it('accumulates history and resets it with a notice once the pool is used up', async () => {
    const { user, randomize } = await setup()

    await user.click(randomize)
    expect(readStored('ALPHA.selectionHistory')).toHaveLength(3)

    await user.click(randomize)
    expect(readStored('ALPHA.selectionHistory')).toHaveLength(5)
    expect(readStored('ALPHA.selected')).toHaveLength(2)
    expect(screen.queryByText('All characters randomized. The pool was reset.')).not.toBeInTheDocument()

    await user.click(randomize)
    expect(readStored('ALPHA.selectionHistory')).toHaveLength(3)
    expect(await screen.findByText('All characters randomized. The pool was reset.')).toBeInTheDocument()
  })

  it('does not touch history when repetition is allowed', async () => {
    seedLocalStorage({
      'ALPHA.config': { characterSlots: 'team', isRepetitionAllowed: true },
      'ALPHA.selectionHistory': ['Alpha 1'],
    })
    const { user, randomize } = await setup()

    await user.click(randomize)
    expect(readStored('ALPHA.selected')).toHaveLength(3)
    expect(readStored('ALPHA.selectionHistory')).toEqual(['Alpha 1'])
  })

  it('draws only owned characters', async () => {
    seedLocalStorage({ 'ALPHA.owned': ['Alpha 2', 'Alpha 4'] })
    const { user, randomize } = await setup()

    await user.click(randomize)
    expect(readStored('ALPHA.selected').map((c) => c.id).sort()).toEqual(['Alpha 2', 'Alpha 4'])
    expect(screen.getAllByText('Character')).toHaveLength(1)
  })
})

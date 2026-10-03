import { containsAll, getRandomizedCharacters, nextDraw, shuffleArray } from './randomizer'

const characters = ['A', 'B', 'C', 'D', 'E'].map((id) => ({ id, name: id }))
const allIds = characters.map((c) => c.id)
const ids = (list) => list.map((c) => c.id)

// Always picks index 0, so the shuffle is fully deterministic.
const firstIndex = () => 0

describe('shuffleArray', () => {
  it('shuffles in place and returns the same array', () => {
    const array = [1, 2, 3, 4]
    const result = shuffleArray(array, firstIndex)
    expect(result).toBe(array)
    expect(result).toEqual([2, 3, 4, 1])
  })

  it('keeps every element', () => {
    const result = shuffleArray([1, 2, 3, 4, 5])
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5])
  })

  it('handles empty and single-element arrays', () => {
    expect(shuffleArray([])).toEqual([])
    expect(shuffleArray([1])).toEqual([1])
  })
})

describe('getRandomizedCharacters', () => {
  it('draws only owned characters', () => {
    const drawn = getRandomizedCharacters(characters, ['B', 'D'], [], 5)
    expect(ids(drawn).sort()).toEqual(['B', 'D'])
  })

  it('excludes the given ids', () => {
    const drawn = getRandomizedCharacters(characters, allIds, ['A', 'B', 'C'], 5)
    expect(ids(drawn).sort()).toEqual(['D', 'E'])
  })

  it('returns at most n characters without duplicates', () => {
    const drawn = getRandomizedCharacters(characters, allIds, [], 3)
    expect(drawn).toHaveLength(3)
    expect(new Set(ids(drawn)).size).toBe(3)
  })

  it('returns an empty list when nothing is owned', () => {
    expect(getRandomizedCharacters(characters, [], [], 3)).toEqual([])
  })

  it('does not mutate the input character list', () => {
    const copy = [...characters]
    getRandomizedCharacters(characters, allIds, [], 3)
    expect(characters).toEqual(copy)
  })
})

describe('containsAll', () => {
  it('is true when every element of the sub list is present', () => {
    expect(containsAll(['A', 'B', 'C'], ['A', 'C'])).toBe(true)
    expect(containsAll(['A'], [])).toBe(true)
  })

  it('is false when an element is missing', () => {
    expect(containsAll(['A', 'B'], ['A', 'C'])).toBe(false)
  })
})

describe('nextDraw', () => {
  describe('with repetition allowed', () => {
    it('ignores and keeps the selection history', () => {
      const history = ['A', 'B', 'C', 'D']
      const result = nextDraw({ characters, owned: allIds, selectionHistory: history, isRepetitionAllowed: true, n: 5 })
      expect(result.drawn).toHaveLength(5)
      expect(result.newHistory).toEqual(history)
      expect(result.poolReset).toBe(false)
    })
  })

  describe('with repetition disallowed', () => {
    const draw = (selectionHistory, owned = allIds, n = 2) =>
      nextDraw({ characters, owned, selectionHistory, isRepetitionAllowed: false, n, random: firstIndex })

    it('adds the drawn ids to the history', () => {
      const result = draw(['A'])
      expect(ids(result.drawn)).not.toContain('A')
      expect(result.newHistory).toEqual(['A', ...ids(result.drawn)])
      expect(result.poolReset).toBe(false)
    })

    it('draws fewer than n when the remaining pool is smaller', () => {
      const result = draw(['A', 'B', 'C', 'D'])
      expect(ids(result.drawn)).toEqual(['E'])
      expect(result.poolReset).toBe(false)
    })

    it('resets the history once it covers every owned character', () => {
      const result = draw(allIds)
      expect(result.poolReset).toBe(true)
      expect(result.drawn).toHaveLength(2)
      expect(result.newHistory).toEqual(ids(result.drawn))
    })

    it('draws every owned character before any repeat', () => {
      let history = []
      const seen = []
      for (let i = 0; i < Math.ceil(allIds.length / 2); i++) {
        const result = nextDraw({ characters, owned: allIds, selectionHistory: history, isRepetitionAllowed: false, n: 2 })
        expect(result.poolReset).toBe(false)
        seen.push(...ids(result.drawn))
        history = result.newHistory
      }
      expect(seen.sort()).toEqual(allIds)
    })

    it('ignores history ids that are no longer owned', () => {
      const result = draw(['A', 'B', 'Z'], ['A', 'B', 'C'])
      expect(ids(result.drawn)).toEqual(['C'])
      expect(result.poolReset).toBe(false)
    })

    it('resets when history covers owned even if it holds unowned ids', () => {
      const result = draw(['A', 'B', 'Z'], ['A', 'B'])
      expect(result.poolReset).toBe(true)
      expect(ids(result.drawn).sort()).toEqual(['A', 'B'])
    })

    it('draws all owned characters when fewer are owned than the team size', () => {
      const result = draw([], ['A'], 3)
      expect(ids(result.drawn)).toEqual(['A'])
    })
  })
})

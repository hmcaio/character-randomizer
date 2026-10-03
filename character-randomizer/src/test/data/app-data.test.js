import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Validates the production game data served from game-data/public.
const dataDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../game-data/public')
const appData = JSON.parse(fs.readFileSync(path.join(dataDir, 'app-data.json'), 'utf8'))

describe('app-data.json', () => {
  it('defines at least one game', () => {
    expect(Object.keys(appData).length).toBeGreaterThan(0)
  })

  describe.each(Object.entries(appData))('%s', (gameId, game) => {
    const imageDir = `/character-images/${gameId.toLowerCase()}/`

    it('has a name and a positive team size', () => {
      expect(game.name).toEqual(expect.any(String))
      expect(game.name.trim()).not.toBe('')
      expect(Number.isInteger(game.teamCharacterCount)).toBe(true)
      expect(game.teamCharacterCount).toBeGreaterThan(0)
    })

    it('has at least as many characters as the team size', () => {
      expect(game.characters.length).toBeGreaterThanOrEqual(game.teamCharacterCount)
    })

    it('has unique, non-empty character ids and names', () => {
      const ids = game.characters.map((c) => c.id)
      const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
      expect(duplicates).toEqual([])
      for (const character of game.characters) {
        expect(character.id, JSON.stringify(character)).toEqual(expect.any(String))
        expect(character.id.trim()).not.toBe('')
        expect(character.name, character.id).toEqual(expect.any(String))
        expect(character.name.trim()).not.toBe('')
      }
    })

    it(`references images under ${imageDir} that exist`, () => {
      const badPaths = game.characters.filter((c) => !c.img.startsWith(imageDir)).map((c) => `${c.id}: ${c.img}`)
      expect(badPaths).toEqual([])

      const missing = game.characters.filter((c) => !fs.existsSync(path.join(dataDir, c.img))).map((c) => `${c.id}: ${c.img}`)
      expect(missing).toEqual([])
    })

    it('has no unreferenced image files', () => {
      const referenced = new Set(game.characters.map((c) => path.posix.basename(c.img)))
      const orphans = fs.readdirSync(path.join(dataDir, imageDir)).filter((file) => !referenced.has(file))
      expect(orphans).toEqual([])
    })

    // Filter value lists are not checked for membership: they are incomplete and
    // FilterConfig is not wired into the app yet. Only check the field exists.
    it('defines every filter field on every character', () => {
      for (const filter of game.filters) {
        expect(filter.name).toEqual(expect.any(String))
        expect(Array.isArray(filter.values)).toBe(true)
        const field = filter.name.toLowerCase()
        const missing = game.characters.filter((c) => c[field] === undefined).map((c) => c.id)
        expect(missing, `characters missing "${field}"`).toEqual([])
      }
    })
  })
})

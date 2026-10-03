import { readStored, writeStored } from './storage'

describe('readStored', () => {
  it('returns the parsed value', () => {
    localStorage.setItem('key', '{"a":1}')
    expect(readStored('key', null)).toEqual({ a: 1 })
  })

  it('returns the default when the key is missing or null', () => {
    expect(readStored('missing', 'default')).toBe('default')
    localStorage.setItem('key', 'null')
    expect(readStored('key', 'default')).toBe('default')
  })

  it('keeps falsy values', () => {
    localStorage.setItem('key', 'false')
    expect(readStored('key', true)).toBe(false)
  })

  it('returns the default for invalid JSON', () => {
    localStorage.setItem('key', 'undefined')
    expect(readStored('key', 'default')).toBe('default')
  })

  it('returns the default when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    expect(readStored('key', 'default')).toBe('default')
  })
})

describe('writeStored', () => {
  it('writes JSON', () => {
    writeStored('key', [1, 2])
    expect(localStorage.getItem('key')).toBe('[1,2]')
  })

  it('skips undefined', () => {
    localStorage.setItem('key', '"kept"')
    writeStored('key', undefined)
    expect(localStorage.getItem('key')).toBe('"kept"')
  })

  it('does not throw when storage throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    expect(() => writeStored('key', 1)).not.toThrow()
  })
})

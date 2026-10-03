import { act, renderHook } from '@testing-library/react'
import useLocalStorage from './useLocalStorage'

describe('useLocalStorage', () => {
  it('returns the default value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('ZZZ', 'owned', ['A']))
    expect(result.current[0]).toEqual(['A'])
  })

  it('reads the value namespaced by game', () => {
    localStorage.setItem('ZZZ.owned', JSON.stringify(['B']))
    localStorage.setItem('WUWA.owned', JSON.stringify(['C']))
    const { result } = renderHook(() => useLocalStorage('ZZZ', 'owned', []))
    expect(result.current[0]).toEqual(['B'])
  })

  it('updates state and writes JSON to the namespaced key', () => {
    const { result } = renderHook(() => useLocalStorage('WUWA', 'selected', []))
    act(() => result.current[1](['X', 'Y']))
    expect(result.current[0]).toEqual(['X', 'Y'])
    expect(localStorage.getItem('WUWA.selected')).toBe('["X","Y"]')
  })

  it('keeps a stored empty array instead of the default', () => {
    localStorage.setItem('ZZZ.owned', '[]')
    const { result } = renderHook(() => useLocalStorage('ZZZ', 'owned', ['A']))
    expect(result.current[0]).toEqual([])
  })

  it.each([
    ['false', false],
    ['0', 0],
    ['""', ''],
  ])('keeps a stored falsy value %s instead of the default', (raw, expected) => {
    localStorage.setItem('ZZZ.flag', raw)
    const { result } = renderHook(() => useLocalStorage('ZZZ', 'flag', 'default'))
    expect(result.current[0]).toBe(expected)
  })

  it('falls back to the default for a stored null', () => {
    localStorage.setItem('ZZZ.owned', 'null')
    const { result } = renderHook(() => useLocalStorage('ZZZ', 'owned', ['A']))
    expect(result.current[0]).toEqual(['A'])
  })

  it.each(['undefined', '{not json', '['])('falls back to the default for corrupt value %s', (raw) => {
    localStorage.setItem('ZZZ.owned', raw)
    const { result } = renderHook(() => useLocalStorage('ZZZ', 'owned', ['A']))
    expect(result.current[0]).toEqual(['A'])
  })

  it('applies functional updates to the latest value', () => {
    const { result } = renderHook(() => useLocalStorage('ZZZ', 'owned', ['A']))
    act(() => {
      result.current[1]((prev) => [...prev, 'B'])
      result.current[1]((prev) => [...prev, 'C'])
    })
    expect(result.current[0]).toEqual(['A', 'B', 'C'])
    expect(JSON.parse(localStorage.getItem('ZZZ.owned'))).toEqual(['A', 'B', 'C'])
  })

  it('ignores undefined instead of storing an unreadable value', () => {
    const { result } = renderHook(() => useLocalStorage('ZZZ', 'owned', ['A']))
    act(() => result.current[1](undefined))
    expect(result.current[0]).toEqual(['A'])
    expect(localStorage.getItem('ZZZ.owned')).toBeNull()
  })

  it('stores false and reads it back', () => {
    const first = renderHook(() => useLocalStorage('ZZZ', 'flag', true))
    act(() => first.result.current[1](false))
    first.unmount()

    const second = renderHook(() => useLocalStorage('ZZZ', 'flag', true))
    expect(second.result.current[0]).toBe(false)
  })
})

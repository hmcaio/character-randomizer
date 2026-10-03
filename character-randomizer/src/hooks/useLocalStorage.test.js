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

  // TODO: falsy stored values (false, 0) fall back to the default because the
  // hook uses `|| defaultValue`. This pins current behavior; fix separately.
  it('falls back to the default for a stored falsy value', () => {
    localStorage.setItem('ZZZ.flag', 'false')
    const { result } = renderHook(() => useLocalStorage('ZZZ', 'flag', true))
    expect(result.current[0]).toBe(true)
  })
})

import { useRef, useState } from 'react'
import { readStored, writeStored } from '../utils/storage'

function useLocalStorage(selectedGame, key, defaultValue) {
  const [value, setValueInternal] = useState(() => readStored(selectedGame + "." + key, defaultValue))
  // Tracks the latest value so functional updates chained in one tick see each other.
  const latestValue = useRef(value)

  const setValue = (newValue) => {
    const resolved = typeof newValue === 'function' ? newValue(latestValue.current) : newValue
    if (resolved === undefined) return
    latestValue.current = resolved
    setValueInternal(resolved)
    writeStored(selectedGame + "." + key, resolved)
  }

  return [value, setValue]
}

export default useLocalStorage

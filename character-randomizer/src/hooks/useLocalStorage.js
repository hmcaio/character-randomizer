import { useState } from 'react'

function useLocalStorage(selectedGame, key, defaultValue) {
  const [value, setValueInternal] = useState(() => {
    return JSON.parse(localStorage.getItem(selectedGame + "." + key)) || defaultValue
  })

  const setValue = (newValue) => {
    setValueInternal(newValue)
    localStorage.setItem(selectedGame + "." + key, JSON.stringify(newValue))
  }

  return [value, setValue]
}

export default useLocalStorage

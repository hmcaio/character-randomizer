import { useState } from 'react'
import appData from "../data/app-data.json"

function useLocalStorage2(key, defaultValue) {
  const [value, setValueInternal] = useState(() => {
    const selectedGame = localStorage.getItem("selectedGame") || Object.keys(appData)[0]
    return JSON.parse(localStorage.getItem(selectedGame + "." + key)) || defaultValue
  })

  const setValue = (newValue) => {
    setValueInternal(newValue)
    const selectedGame = localStorage.getItem("selectedGame") || Object.keys(appData)[0]
    localStorage.setItem(selectedGame + "." + key, JSON.stringify(newValue))
  }

  return [value, setValue]
}

export default useLocalStorage2
import { useState, useEffect } from 'react'

export function getStorageValue(key, defaultValue) {
  const saved = localStorage.getItem(key)
  const initial = JSON.parse(saved)
  console.log("getStorageValue (" + key + ", " + defaultValue + ") - " + initial)
  return initial || defaultValue
}

function useLocalStorage(key, defaultValue) {
  console.log("useLocalStorage call key=" + key + ", defaultValue=" + defaultValue)
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue)
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
    console.log("useEffect set (" + key + ", " + value + ")")
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage
import { createContext, useEffect, useState } from "react";
import appData from "../data/app-data.json"

export const AppContext = createContext({
  selectedGame: "",
  randomizerConfig: { characterSlots: "team", isRepetitionAllowed: false },
  owned: [],
  setSelectedGame: () => {},
  setRandomizerConfig: () => {},
  setOwned: () => {}
})

export default function AppContextProvider({ children }) {
  const [owned, setOwned] = useState([])

  const [selectedGame, setSelectedGame] = useState(() => localStorage.getItem("selectedGame") || Object.keys(appData)[0])
  const [randomizerConfig, setRandomizerConfig] = useState(() => {
    const activeKey = localStorage.getItem("selectedGame") || Object.keys(appData)[0]
    return JSON.parse(localStorage.getItem(activeKey + ".config")) || { characterSlots: "team", isRepetitionAllowed: false }
  })

  const updateRandomizerConfig = (newValue) => {
    setRandomizerConfig(newValue)
    localStorage.setItem(selectedGame + ".config", JSON.stringify(newValue))
  }

  useEffect(() => {
    localStorage.setItem("selectedGame", selectedGame)

    const valFromNewKey = JSON.parse(localStorage.getItem(selectedGame + ".config")) || { characterSlots: "team", isRepetitionAllowed: false }
    console.log("selectedGame=" + selectedGame + ", valFromNewKey=" + valFromNewKey)
    updateRandomizerConfig(valFromNewKey)
  }, [selectedGame])

  function handleGameChange(selectedGame) {
    setSelectedGame(() => selectedGame)
    console.log("Game changed " + selectedGame)
  }

  function handleRandomizerConfigChange(config) {
    updateRandomizerConfig(config)
    console.log("RandomizerConfig changed " + config)
  }

  function handleOwnedChange(owned) {
    setOwned(owned)
    console.log("Owned changed " + owned)
  }

  const ctxValue = {
    selectedGame: selectedGame,
    randomizerConfig: randomizerConfig,
    owned: owned,
    setSelectedGame: handleGameChange,
    setRandomizerConfig: handleRandomizerConfigChange,
    setOwned: handleOwnedChange
  }

  return (
    <AppContext value={ctxValue}>
      {children}
    </AppContext>
  )
}
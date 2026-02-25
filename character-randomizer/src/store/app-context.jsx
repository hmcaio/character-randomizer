import { createContext, useEffect, useState } from "react";
import appData from "../data/app-data.json"
import useLocalStorage2 from "../hooks/useLocalStorage2";

export const AppContext = createContext({
  selectedGame: "",
  randomizerConfig: { characterSlots: "team", isRepetitionAllowed: false },
  owned: [],
  selected: [],
  setSelectedGame: () => {},
  setRandomizerConfig: () => {},
  setOwned: () => {},
  setSelected: () => {}
})

export default function AppContextProvider({ children }) {
  const [selectedGame, setSelectedGame] = useState(() => localStorage.getItem("selectedGame") || Object.keys(appData)[0])
  const [randomizerConfig, setRandomizerConfig] = useLocalStorage2("config", { characterSlots: "team", isRepetitionAllowed: false })
  const [owned, setOwned] = useLocalStorage2("owned", [])
  const [selected, setSelected] = useLocalStorage2("selected", [])

  useEffect(() => {
    localStorage.setItem("selectedGame", selectedGame)

    const newRandomizedConfig = JSON.parse(localStorage.getItem(selectedGame + ".config")) || { characterSlots: "team", isRepetitionAllowed: false }
    console.log("selectedGame=" + selectedGame + ", newRandomizedConfig=" + newRandomizedConfig)
    setRandomizerConfig(newRandomizedConfig)

    const newOwned = JSON.parse(localStorage.getItem(selectedGame + ".owned")) || []
    console.log("selectedGame=" + selectedGame + ", newOwned=" + newOwned)
    setOwned(newOwned)

    const newSelected = JSON.parse(localStorage.getItem(selectedGame + ".selected")) || []
    console.log("selectedGame=" + selectedGame + ", newSelected=" + newSelected)
    setSelected(newSelected)

  }, [selectedGame])

  function handleGameChange(selectedGame) {
    setSelectedGame(() => selectedGame)
    console.log("Game changed " + selectedGame)
  }

  function handleRandomizerConfigChange(config) {
    setRandomizerConfig(config)
    console.log("RandomizerConfig changed " + config)
  }

  function handleOwnedChange(owned) {
    setOwned(owned)
    console.log("Owned changed " + owned)
  }

  function handleSelectedChange(selected) {
    setSelected(selected)
    console.log("Selected changed " + selected)
  }

  const ctxValue = {
    selectedGame: selectedGame,
    randomizerConfig: randomizerConfig,
    owned: owned,
    selected: selected,
    setSelectedGame: handleGameChange,
    setRandomizerConfig: handleRandomizerConfigChange,
    setOwned: handleOwnedChange,
    setSelected: handleSelectedChange
  }

  return (
    <AppContext value={ctxValue}>
      {children}
    </AppContext>
  )
}
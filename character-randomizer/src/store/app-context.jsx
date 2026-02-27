import { createContext, useEffect, useState } from "react";
import appData from "../data/app-data.json"
import useLocalStorage from "../hooks/useLocalStorage";

export const AppContext = createContext({
  selectedGame: "",
  randomizerConfig: { characterSlots: "team", isRepetitionAllowed: false },
  owned: [],
  selectionHistory: [],
  selected: [],
  setSelectedGame: () => {},
  setRandomizerConfig: () => {},
  setOwned: () => {},
  setSelectionHistory: () => {},
  setSelected: () => {}
})

export default function AppContextProvider({ children }) {
  const [selectedGame, setSelectedGame] = useState(() => localStorage.getItem("selectedGame") || Object.keys(appData)[0])
  const [randomizerConfig, setRandomizerConfig] = useLocalStorage("config", { characterSlots: "team", isRepetitionAllowed: false })
  const [owned, setOwned] = useLocalStorage("owned", appData[selectedGame].characters.map((c) => c.id))
  const [selectionHistory, setSelectionHistory] = useLocalStorage("selectionHistory", [])
  const [selected, setSelected] = useLocalStorage("selected", [])

  useEffect(() => {
    localStorage.setItem("selectedGame", selectedGame)

    const newRandomizedConfig = JSON.parse(localStorage.getItem(selectedGame + ".config")) || { characterSlots: "team", isRepetitionAllowed: false }
    console.log("selectedGame=" + selectedGame + ", newRandomizedConfig=" + newRandomizedConfig)
    setRandomizerConfig(newRandomizedConfig)

    const newOwned = JSON.parse(localStorage.getItem(selectedGame + ".owned")) || appData[selectedGame].characters.map((c) => c.id)
    console.log("selectedGame=" + selectedGame + ", newOwned=" + newOwned)
    setOwned(newOwned)

    const newSelectionHistory = JSON.parse(localStorage.getItem(selectedGame + ".selectionHistory")) || []
    console.log("selectedGame=" + selectedGame + ", newSelectionHistory=" + newSelectionHistory)
    setSelectionHistory(newSelectionHistory)

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

  function handleSelectionHistoryChange(selectionHistory) {
    setSelectionHistory(selectionHistory)
    console.log("SelectionHistory changed " + selectionHistory)
  }

  function handleSelectedChange(selected) {
    setSelected(selected)
    console.log("Selected changed " + selected)
  }

  const ctxValue = {
    selectedGame: selectedGame,
    randomizerConfig: randomizerConfig,
    owned: owned,
    selectionHistory: selectionHistory,
    selected: selected,
    setSelectedGame: handleGameChange,
    setRandomizerConfig: handleRandomizerConfigChange,
    setOwned: handleOwnedChange,
    setSelectionHistory: handleSelectionHistoryChange,
    setSelected: handleSelectedChange
  }

  return (
    <AppContext value={ctxValue}>
      {children}
    </AppContext>
  )
}
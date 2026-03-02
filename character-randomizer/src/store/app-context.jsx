import { createContext, useEffect, useState } from "react";
import appData from "../data/app-data.json"
import useLocalStorage from "../hooks/useLocalStorage";
import log from 'loglevel'

export const AppContext = createContext({
  selectedGame: "",
  randomizerConfig: { characterSlots: "team", isRepetitionAllowed: false },
  owned: [],
  selectionHistory: [],
  selected: [],
  isDrawerOpen: false,
  setSelectedGame: () => {},
  setRandomizerConfig: () => {},
  setOwned: () => {},
  setSelectionHistory: () => {},
  setSelected: () => {},
  setIsDrawerOpen: () => {}
})

export default function AppContextProvider({ children }) {
  const [selectedGame, setSelectedGame] = useState(() => localStorage.getItem("selectedGame") || Object.keys(appData)[0])
  const [randomizerConfig, setRandomizerConfig] = useLocalStorage("config", { characterSlots: "team", isRepetitionAllowed: false })
  const [owned, setOwned] = useLocalStorage("owned", appData[selectedGame].characters.map((c) => c.id))
  const [selectionHistory, setSelectionHistory] = useLocalStorage("selectionHistory", [])
  const [selected, setSelected] = useLocalStorage("selected", [])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem("selectedGame", selectedGame)

    const newRandomizedConfig = JSON.parse(localStorage.getItem(selectedGame + ".config")) || { characterSlots: "team", isRepetitionAllowed: false }
    log.debug("selectedGame=" + selectedGame + ", newRandomizedConfig=" + newRandomizedConfig)
    setRandomizerConfig(newRandomizedConfig)

    const newOwned = JSON.parse(localStorage.getItem(selectedGame + ".owned")) || appData[selectedGame].characters.map((c) => c.id)
    log.debug("selectedGame=" + selectedGame + ", newOwned=" + newOwned)
    setOwned(newOwned)

    const newSelectionHistory = JSON.parse(localStorage.getItem(selectedGame + ".selectionHistory")) || []
    log.debug("selectedGame=" + selectedGame + ", newSelectionHistory=" + newSelectionHistory)
    setSelectionHistory(newSelectionHistory)

    const newSelected = JSON.parse(localStorage.getItem(selectedGame + ".selected")) || []
    log.debug("selectedGame=" + selectedGame + ", newSelected=" + newSelected)
    setSelected(newSelected)

  }, [selectedGame])

  function handleGameChange(selectedGame) {
    setSelectedGame(() => selectedGame)
    log.debug("Game changed " + selectedGame)
  }

  function handleRandomizerConfigChange(config) {
    setRandomizerConfig(config)
    log.debug("RandomizerConfig changed " + config)
  }

  function handleOwnedChange(owned) {
    setOwned(owned)
    log.debug("Owned changed " + owned)
  }

  function handleSelectionHistoryChange(selectionHistory) {
    setSelectionHistory(selectionHistory)
    log.debug("SelectionHistory changed " + selectionHistory)
  }

  function handleSelectedChange(selected) {
    setSelected(selected)
    log.debug("Selected changed " + selected)
  }

  function handleDrawerStateChange(isDrawerOpen) {
    setIsDrawerOpen(isDrawerOpen)
    log.debug("isDrawerOpen changed " + isDrawerOpen)
  }

  const ctxValue = {
    selectedGame: selectedGame,
    randomizerConfig: randomizerConfig,
    owned: owned,
    selectionHistory: selectionHistory,
    selected: selected,
    isDrawerOpen: isDrawerOpen,
    setSelectedGame: handleGameChange,
    setRandomizerConfig: handleRandomizerConfigChange,
    setOwned: handleOwnedChange,
    setSelectionHistory: handleSelectionHistoryChange,
    setSelected: handleSelectedChange,
    setIsDrawerOpen: handleDrawerStateChange
  }

  return (
    <AppContext value={ctxValue}>
      {children}
    </AppContext>
  )
}
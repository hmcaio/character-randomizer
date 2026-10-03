import { createContext, useContext, useEffect, useState } from "react";
import { GameDataContext } from "./game-data-context";
import useLocalStorage from "../hooks/useLocalStorage";
import { readStored } from "../utils/storage";
import log from 'loglevel'

const DEFAULT_RANDOMIZER_CONFIG = { characterSlots: "team", isRepetitionAllowed: false }

// "selectedGame" is stored as a raw string, not JSON. Falls back to the first
// game when the stored id is missing or no longer exists in appData.
function readSelectedGame(appData) {
  const fallback = Object.keys(appData)[0]
  try {
    const stored = localStorage.getItem("selectedGame")
    return stored !== null && Object.hasOwn(appData, stored) ? stored : fallback
  } catch (err) {
    log.warn(`readSelectedGame failed: ${err}`)
    return fallback
  }
}

export const AppContext = createContext({
  appData: {},
  selectedGame: "",
  randomizerConfig: DEFAULT_RANDOMIZER_CONFIG,
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
  const { appData } = useContext(GameDataContext)
  const [selectedGame, setSelectedGame] = useState(() => readSelectedGame(appData))
  const [storedRandomizerConfig, setRandomizerConfig] = useLocalStorage(selectedGame, "config", DEFAULT_RANDOMIZER_CONFIG)
  // Fills fields missing from configs saved by older versions.
  const randomizerConfig = { ...DEFAULT_RANDOMIZER_CONFIG, ...storedRandomizerConfig }
  const [owned, setOwned] = useLocalStorage(selectedGame, "owned", appData[selectedGame].characters.map((c) => c.id))
  const [selectionHistory, setSelectionHistory] = useLocalStorage(selectedGame, "selectionHistory", [])
  const [selected, setSelected] = useLocalStorage(selectedGame, "selected", [])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem("selectedGame", selectedGame)
    } catch (err) {
      log.warn(`Saving selectedGame failed: ${err}`)
    }

    const newRandomizedConfig = readStored(selectedGame + ".config", DEFAULT_RANDOMIZER_CONFIG)
    log.debug("selectedGame=" + selectedGame + ", newRandomizedConfig=" + newRandomizedConfig)
    setRandomizerConfig(newRandomizedConfig)

    const newOwned = readStored(selectedGame + ".owned", appData[selectedGame].characters.map((c) => c.id))
    log.debug("selectedGame=" + selectedGame + ", newOwned=" + newOwned)
    setOwned(newOwned)

    const newSelectionHistory = readStored(selectedGame + ".selectionHistory", [])
    log.debug("selectedGame=" + selectedGame + ", newSelectionHistory=" + newSelectionHistory)
    setSelectionHistory(newSelectionHistory)

    const newSelected = readStored(selectedGame + ".selected", [])
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
    appData: appData,
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
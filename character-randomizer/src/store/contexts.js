import { createContext } from "react"

export const DEFAULT_RANDOMIZER_CONFIG = { characterSlots: "team", isRepetitionAllowed: false }

export const GameDataContext = createContext({ appData: null })

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

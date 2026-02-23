import { createContext, useState } from "react";
import appData from "../data/app-data.json"
import useLocalStorage from "../hooks/useLocalStorage";

export const AppContext = createContext({
  selectedGame: "",
  characterSlots: 1,
  owned: [],
  setSelectedGame: () => {},
  setCharacterSlots: () => {},
  setOwned: () => {}
})

export default function AppContextProvider({ children }) {
  const [selectedGame, setSelectedGame] = useLocalStorage("selectedGame", Object.keys(appData)[0])
  const [characterSlots, setCharacterSlots] = useState(appData[selectedGame].teamCharacterCount)  // TODO: Local storage
  const [owned, setOwned] = useState([])  // TODO: Local storage

  function handleGameChange(selectedGame) {
    setSelectedGame(() => selectedGame)
    console.log("Game changed " + selectedGame);
  }

  function handleCharacterSlotsChange(numberOfSlots) {
    setCharacterSlots(numberOfSlots)
    console.log("Slots changed " + numberOfSlots);
  }

  function handleOwnedChange(owned) {
    setOwned(owned)
    console.log("Owned changed " + owned);
  }

  const ctxValue = {
    selectedGame: selectedGame,
    characterSlots: characterSlots,
    owned: owned,
    setSelectedGame: handleGameChange,
    setCharacterSlots: handleCharacterSlotsChange,
    setOwned: handleOwnedChange
  }

  return (
    <AppContext value={ctxValue}>
      {children}
    </AppContext>
  )
}
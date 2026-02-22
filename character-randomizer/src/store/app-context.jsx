import { createContext, useState } from "react";
import appData from "../data/app-data.json"
import useLocalStorage from "../hooks/useLocalStorage";

export const AppContext = createContext({
  currentGame: "",
  characterSlots: 1,
  owned: [],
  setCurrentGame: () => {},
  setCharacterSlots: () => {},
  setOwned: () => {}
})

export default function AppContextProvider({ children }) {
  const [currentGame, setCurrentGame] = useLocalStorage("currentGame", Object.keys(appData)[0])
  const [characterSlots, setCharacterSlots] = useState(appData[currentGame].teamCharacterCount)  // TODO: Local storage
  const [owned, setOwned] = useState([])  // TODO: Local storage

  function handleGameChange(selectedGame) {
    setCurrentGame(() => selectedGame)
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
    currentGame: currentGame,
    characterSlots: characterSlots,
    owned: owned,
    setCurrentGame: handleGameChange,
    setCharacterSlots: handleCharacterSlotsChange,
    setOwned: handleOwnedChange
  }

  return (
    <AppContext value={ctxValue}>
      {children}
    </AppContext>
  )
}
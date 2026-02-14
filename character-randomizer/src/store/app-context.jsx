import { createContext, useState } from "react";
import appData from "../data/app-data.json"

export const AppContext = createContext({
  currentGame: "",
  characterSlots: 1,
  setCurrentGame: () => {},
  setCharacterSlots: () => {}
})

export default function AppContextProvider({ children }) {
  const [currentGame, setCurrentGame] = useState(Object.keys(appData)[0])
  const [characterSlots, setCharacterSlots] = useState(appData[currentGame].teamCharacterCount)

  function handleGameChange(selectedGame) {
    setCurrentGame(() => selectedGame)
    console.log("Game changed " + selectedGame);
  }

  function handleCharacterSlotsChange(numberOfSlots) {
    setCharacterSlots(numberOfSlots)
    console.log("Slots changed " + numberOfSlots);
  }

  const ctxValue = {
    currentGame: currentGame,
    characterSlots: characterSlots,
    setCurrentGame: handleGameChange,
    setCharacterSlots: handleCharacterSlotsChange
  }

  return (
    <AppContext value={ctxValue}>
      {children}
    </AppContext>
  )
}
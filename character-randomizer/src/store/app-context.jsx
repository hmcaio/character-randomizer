import { createContext, useState } from "react";

export const AppContext = createContext({
  currentGame: "",
  changeGame: () => {}
})

export default function AppContextProvider({ children }) {
  const [currentGame, setCurrentGame] = useState("")

  function handleGameChange(selectedGame) {
    setCurrentGame(() => selectedGame)
    console.log("Game changed " + selectedGame);
  }

  const ctxValue = {
    currentGame: currentGame,
    changeGame: handleGameChange
  }

  return (
    <AppContext value={ctxValue}>
      {children}
    </AppContext>
  )
}
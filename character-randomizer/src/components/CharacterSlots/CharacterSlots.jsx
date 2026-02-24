import { useContext, useState } from 'react'
import CharacterCard from "../CharacterCard/CharacterCard"
import ImageList from '@mui/material/ImageList';
import Paper from "@mui/material/Paper"
import Button from '@mui/material/Button';
import { AppContext } from '../../store/app-context';
import appData from "../../data/app-data.json"

function CharacterSlots() {
  const { selectedGame, randomizerConfig } = useContext(AppContext)
  const { selectedCharacters, setSelectedCharacters} = useState([])
  const characterSlots = randomizerConfig.characterSlots === "single" ? 1 : appData[selectedGame].teamCharacterCount

  console.log("from CharacterSlots selectedCharacters?.length=" + selectedCharacters?.length + ", selectedGame=" + selectedGame + ", characterSlots=" + randomizerConfig.characterSlots)

  return (
    <Paper variant="elevation" elevation={3} sx={{ padding: '16px' }}>
      <ImageList 
        id="character-slots"
        sx={{ width: '100%', height: 'fit-content', marginX: 'auto' }}
        cols={characterSlots}
        gap={16}
      >
        {selectedCharacters
        ? selectedCharacters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))
        : (Array.from({ length: characterSlots })).map((character, index) => (
          <CharacterCard key={index} />
        ))
        }
      </ImageList>

      <Button variant="contained" onClick={() => { }} sx={{ marginY: '16px' }}>
        Randomize
      </Button>

    </Paper>
  )
}

export default CharacterSlots
import { useContext, useState } from 'react'
import CharacterCard from "../CharacterCard/CharacterCard"
import ImageList from '@mui/material/ImageList';
import Paper from "@mui/material/Paper"
import Button from '@mui/material/Button';
import { AppContext } from '../../store/app-context';
import appData from "../../data/app-data.json"

function shuffleArray(array) {
  for (let i = array.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomizedCharacters(allCharacters, owned, selectedCharacters, n) {
  console.log(`getRandomizedCharacters allCharacters=${JSON.stringify(allCharacters.map((c) => c.id))}, owned=${JSON.stringify(owned)}, selectedCharacters=${JSON.stringify(selectedCharacters)}, n=${n}`)

  const pool = allCharacters
    .filter((character) => owned.includes(character.id) && !selectedCharacters.includes(character.id))

  console.log(`getRandomizedCharacters pool=${JSON.stringify(pool.map((c) => c.id))}`)

  return shuffleArray(pool).slice(0, n)
}

function CharacterSlots() {
  const { selectedGame, randomizerConfig, owned, selected, setSelected } = useContext(AppContext)
  const [ selectedCharacters, setSelectedCharacters ] = useState([])
  const characterSlots = randomizerConfig.characterSlots === "single" ? 1 : appData[selectedGame].teamCharacterCount

  console.log("from CharacterSlots selectedCharacters.length=" + selectedCharacters.length + ", selectedGame=" + selectedGame + ", characterSlots=" + randomizerConfig.characterSlots)

  return (
    <Paper variant="elevation" elevation={3} sx={{ padding: '16px' }}>
      <ImageList
        id="character-slots"
        sx={{ width: '100%', height: 'fit-content', marginX: 'auto' }}
        cols={characterSlots}
        gap={16}
      >
        {selectedCharacters.length !== 0
          ? selectedCharacters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))
          : (Array.from({ length: characterSlots })).map((character, index) => (
            <CharacterCard key={index} />
          ))
        }
      </ImageList>

      <Button
        variant="contained"
        sx={{ marginY: '16px' }}
        onClick={() => {
          const randomizedCharacters = getRandomizedCharacters(
            appData[selectedGame].characters,
            owned,
            randomizerConfig.isRepetitionAllowed ? [] : selected,
            characterSlots
          )
          console.log(`randomizedCharacters=${JSON.stringify(randomizedCharacters.map((c) => c.id))}, new=${JSON.stringify([...(new Set([...selected, ...(randomizedCharacters.map((c) => c.id))]))])}`)
          setSelectedCharacters(randomizedCharacters)
          setSelected([...(new Set([...selected, ...(randomizedCharacters.map((c) => c.id))]))])
        }}
      >
        Randomize
      </Button>

    </Paper>
  )
}

export default CharacterSlots
import { useContext, useState } from 'react'
import Paper from "@mui/material/Paper"
import Button from '@mui/material/Button';
import { AppContext } from '../../store/app-context';
import appData from "../../data/app-data.json"
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import CharacterSlot from '../CharacterSlot/CharacterSlot';
import Container from '@mui/material/Container';

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
  const { selectedGame, randomizerConfig, owned, selectionHistory, setSelectionHistory, selected, setSelected } = useContext(AppContext)
  const characterSlots = randomizerConfig.characterSlots === "single" ? 1 : appData[selectedGame].teamCharacterCount
  const [snackBarOpen, setSnackBarOpen] = useState(false)

  console.log("from CharacterSlots selectedCharacters.length=" + selected.length + ", selectedGame=" + selectedGame + ", characterSlots=" + randomizerConfig.characterSlots)

  function handleRandomizeClick() {
    if (randomizerConfig.isRepetitionAllowed) {
      const randomizedCharacters = getRandomizedCharacters(
        appData[selectedGame].characters,
        owned,
        [],
        characterSlots
      )
      console.log(`randomizedCharacters=${JSON.stringify(randomizedCharacters.map((c) => c.id))}`)
      setSelected(randomizedCharacters)

    } else {
      let updatedSelectionHistory = [...selectionHistory]
      if (updatedSelectionHistory.length === owned.length) {
        updatedSelectionHistory = []
        setSnackBarOpen(true)
      }

      const randomizedCharacters = getRandomizedCharacters(
        appData[selectedGame].characters,
        owned,
        updatedSelectionHistory,
        characterSlots
      )

      console.log(`randomizedCharacters=${JSON.stringify(randomizedCharacters.map((c) => c.id))}, new=${JSON.stringify([...(new Set([...updatedSelectionHistory, ...(randomizedCharacters.map((c) => c.id))]))])}`)
      setSelected(randomizedCharacters)
      setSelectionHistory([...(new Set([...updatedSelectionHistory, ...(randomizedCharacters.map((c) => c.id))]))])
    }
  }

  function handleCloseSnackBar(event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setSnackBarOpen(false)
  }

  return (
    <Paper variant="elevation" elevation={3} sx={{ padding: '16px' }}>
      <Stack direction="column" spacing={2}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
        >
          {Array.from({ length: characterSlots }, (v, i) => i).map((i) => i < selected.length
            ? <CharacterSlot key={selected[i].id} character={selected[i]} />
            : <CharacterSlot key={i} />
          )}
        </Stack>

        <Container>
          <Button
            variant="contained"
            onClick={handleRandomizeClick}
          >
            Randomize
          </Button>
        </Container>
      </Stack>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackBarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackBar}
        message="All characters randomized. The pool was reset."
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackBar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Paper>
  )
}

export default CharacterSlots
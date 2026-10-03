import { useContext, useState } from 'react'
import Paper from "@mui/material/Paper"
import Button from '@mui/material/Button';
import { AppContext } from '../../store/app-context';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import CharacterSlot from '../CharacterSlot/CharacterSlot';
import Container from '@mui/material/Container';
import log from 'loglevel'
import { nextDraw } from '../../utils/randomizer'

function CharacterSlots() {
  const { appData, selectedGame, randomizerConfig, owned, selectionHistory, setSelectionHistory, selected, setSelected } = useContext(AppContext)
  const characterSlots = randomizerConfig.characterSlots === "single" ? 1 : appData[selectedGame].teamCharacterCount
  const [snackBarOpen, setSnackBarOpen] = useState(false)

  log.debug("from CharacterSlots selectedCharacters.length=" + selected.length + ", selectedGame=" + selectedGame + ", characterSlots=" + randomizerConfig.characterSlots)

  function handleRandomizeClick() {
    const { drawn, newHistory, poolReset } = nextDraw({
      characters: appData[selectedGame].characters,
      owned,
      selectionHistory,
      isRepetitionAllowed: randomizerConfig.isRepetitionAllowed,
      n: characterSlots
    })

    log.debug(`randomizedCharacters=${JSON.stringify(drawn.map((c) => c.id))}`)
    if (poolReset) {
      setSnackBarOpen(true)
    }
    setSelected(drawn)
    if (!randomizerConfig.isRepetitionAllowed) {
      setSelectionHistory(newHistory)
    }
  }

  function handleCloseSnackBar(event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setSnackBarOpen(false)
  }

  return (
    <Paper variant="elevation" elevation={3} sx={{ paddingY: 2, paddingX: 4 }}>
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
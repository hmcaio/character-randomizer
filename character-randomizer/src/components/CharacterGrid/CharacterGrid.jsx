import { useContext } from 'react'
import classes from './CharacterGrid.module.css'
import CharacterCard from '../CharacterCard/CharacterCard'
import Grid from '@mui/material/Grid'
import Paper from "@mui/material/Paper"
import { AppContext } from '../../store/app-context'
import log from 'loglevel'

function CharacterGrid() {
  const { appData, selectedGame, owned, setOwned, selectionHistory, randomizerConfig } = useContext(AppContext)

  log.debug("from CharacterGrid")

  function handleClick(characterId) {
    if (owned.includes(characterId)) {
      setOwned(owned.filter((item) => item !== characterId))
    } else {
      setOwned([...owned, characterId])
    }
  }

  return (
    <Paper variant="elevation" elevation={3} sx={{ padding: '16px' }} >
      <Grid 
        container
        justifyContent="center"
        spacing={2}
        columns={60}
      >
        {appData[selectedGame].characters.map((character) => (
          <Grid key={character.id} size={{ xs: 20, sm: 12, md: 15, lg: 12 }}>
            <CharacterCard 
              key={character.id}
              character={character}
              owned={owned.includes(character.id)}
              selected={!randomizerConfig.isRepetitionAllowed && selectionHistory.includes(character.id)}
              onClick={handleClick}
            />
          </Grid>
        ))}
      </Grid>

    </Paper>
  )
}

export default CharacterGrid
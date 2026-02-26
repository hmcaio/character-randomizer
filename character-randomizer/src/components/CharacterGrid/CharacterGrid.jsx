import { useContext } from 'react'
import classes from './CharacterGrid.module.css';
import CharacterCard from '../CharacterCard/CharacterCard'
import Grid from '@mui/material/Grid';
import Paper from "@mui/material/Paper"
import appData from "../../data/app-data.json"
import { AppContext } from '../../store/app-context'

function CharacterGrid() {
  const { selectedGame, owned, setOwned, selected, randomizerConfig } = useContext(AppContext)

  console.log("from CharacterGrid")

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
        sx={{ marginTop: '16px' }}
      >
        {appData[selectedGame].characters.map((character) => (
          <Grid key={character.id}>
            <CharacterCard 
              key={character.id}
              character={character}
              owned={owned.includes(character.id)}
              selected={!randomizerConfig.isRepetitionAllowed && selected.includes(character.id)}
              onClick={handleClick}
            />
          </Grid>
        ))}
      </Grid>

    </Paper>
  )
}

export default CharacterGrid
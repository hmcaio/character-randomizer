import { useContext } from 'react'
import classes from './CharacterGrid.module.css';
import ImageList from '@mui/material/ImageList';
import CharacterCard from '../CharacterCard/CharacterCard'
import Grid from '@mui/material/Grid';
import Paper from "@mui/material/Paper"
import appData from "../../data/app-data.json"
import { AppContext } from '../../store/app-context'

function CharacterGrid() {
  const { currentGame } = useContext(AppContext)

  console.log("from CharacterGrid")

  return (
    <Paper variant="elevation" elevation={3} sx={{ padding: '16px' }} >
      {/* <ImageList id="character-grid" cols={5} gap={16}>
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </ImageList> */}

      <Grid 
        container
        justifyContent="center"
        spacing={2}
        sx={{ marginTop: '16px' }}
      >
        {appData[currentGame].characters.map((character) => (
          <Grid key={character.id}>
            <CharacterCard key={character.id} character={character} status={character.id % 2 === 0 ? 'owned' : 'not owned'} />
          </Grid>
        ))}
      </Grid>

    </Paper>
  )
}

export default CharacterGrid
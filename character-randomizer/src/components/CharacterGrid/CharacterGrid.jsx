import classes from './CharacterGrid.module.css';
import ImageList from '@mui/material/ImageList';
import CharacterCard from '../CharacterCard/CharacterCard'
import Grid from '@mui/material/Grid';
import Paper from "@mui/material/Paper"

function CharacterGrid({ characters }) {
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
        {characters.map((character) => (
          <Grid key={character.id}>
            <CharacterCard key={character.id} character={character} />
          </Grid>
        ))}
      </Grid>

    </Paper>
  )
}

export default CharacterGrid
import CharacterCard from "../CharacterCard/CharacterCard"
import ImageList from '@mui/material/ImageList';
import Paper from "@mui/material/Paper"
import Button from '@mui/material/Button';

function CharacterSlots({ selectedCharacters }) {
  return (
    <Paper variant="elevation" elevation={3} sx={{ padding: '16px' }}>
      <ImageList 
        id="character-slots"
        sx={{ width: '100%', height: 'fit-content', marginX: 'auto' }}
        cols={selectedCharacters.length}
        gap={16}
      >
        {selectedCharacters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </ImageList>

      <Button variant="contained" onClick={() => { }} sx={{ marginY: '16px' }}>
        Randomize
      </Button>

    </Paper>
  )
}

export default CharacterSlots
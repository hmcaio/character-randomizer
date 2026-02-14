import classes from './CharacterCard.module.css';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

function CharacterCard({ character }) {
  return (
    <ImageListItem sx={{ width: 128, height: 128 }}>
      <img
        src={`${character.img}?w=128&h=128&fit=crop&auto=format`}
        srcSet={`${character.img}?w=128&h=128&fit=crop&auto=format&dpr=2 2x`}
        alt={character.name}
        loading="lazy"
      />
      <ImageListItemBar
        title={character.name}
        position='below'
      />
    </ImageListItem>
  )
}

export default CharacterCard
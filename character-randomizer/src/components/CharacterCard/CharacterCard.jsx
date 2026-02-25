import classes from './CharacterCard.module.css';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function CharacterCard({ character, owned, selected, onClick }) {
  const characterName = character ? character.name : "character"
  const opacity = owned ? 1 : 0.5
  const characterImg = character
    ? <img
        src={`${character.img}?w=128&h=128&fit=crop&auto=format`}
        srcSet={`${character.img}?w=128&h=128&fit=crop&auto=format&dpr=2 2x`}
        alt={characterName}
        loading="lazy"
      />
    : <PersonIcon sx={{ width: 128, height: 128 }} />

  return (
    <ImageListItem
      sx={{ width: 128, height: 128, opacity: opacity }}
      onClick={() => onClick(character.id)}
      style={{ cursor: 'pointer' }}
    >
      {characterImg}
      <ImageListItemBar
        title={characterName}
        position='below'
        sx={{ alignItems: 'center' }}
        actionIcon={
          selected && <CheckCircleIcon sx={{ color: 'lightgreen' }} />
        }
      />
    </ImageListItem>
  )
}

export default CharacterCard
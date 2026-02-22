import classes from './CharacterCard.module.css';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import PersonIcon from '@mui/icons-material/Person';

function CharacterCard({ character, status }) {
  console.log("character=" + character)
  const characterName = character ? character.name : "character"
  const opacity = status === 'not owned' ? 0.5 : 1
  const characterImg = character
    ? <img
        src={`${character.img}?w=128&h=128&fit=crop&auto=format`}
        srcSet={`${character.img}?w=128&h=128&fit=crop&auto=format&dpr=2 2x`}
        alt={characterName}
        loading="lazy"
      />
    : <PersonIcon sx={{ width: 128, height: 128 }} />

  return (
    <ImageListItem sx={{ width: 128, height: 128, opacity: opacity }}>
      {characterImg}
      <ImageListItemBar
        title={characterName}
        position='below'
      />
    </ImageListItem>
  )
}

export default CharacterCard
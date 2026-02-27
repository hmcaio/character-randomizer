import classes from './CharacterCard.module.css';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

function CharacterCard({ character, owned, selected, onClick }) {
  const characterName = character ? character.name : "Character"
  const opacity = owned ? 1 : 0.5
  const characterImg = character
    ? <CardMedia
        component="img"
        height='128'
        image={`${character.img}?w=160&fit=crop&auto=format`}
        sx={{ 
          objectFit: 'cover', // Ensures the image fills the height nicely
        }}
      />
    : <PersonIcon
        style={{ height: 'inherit', width: 'inherit' }}
      />

  return (
    <Card
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: opacity }}
      onClick={() => onClick(character.id)}
      style={{ cursor: 'pointer' }}
    >
      <Box 
        sx={{ 
          position: 'relative'
        }}
      >
        {characterImg}
        {selected && <CheckCircleIcon sx={{ 
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'lightgreen',
          // color: 'primary-main',
          backgroundColor: 'black',
          borderRadius: '50%',
          boxShadow: 2
        }} />}
      </Box>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Tooltip title={characterName}>
          <Typography variant="subtitle1" noWrap align='center'>
            {characterName}
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  )
}

export default CharacterCard
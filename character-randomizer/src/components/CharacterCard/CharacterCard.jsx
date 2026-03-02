import classes from './CharacterCard.module.css';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import log from 'loglevel'

function CharacterCard({ character, owned, selected, onClick }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const opacity = owned ? 1 : 0.5

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
        {!isLoaded && 
          <Skeleton
            variant='rectangular'
            height={128}
            animation='wave'
          />
        }
        <CardMedia
          component="img"
          height='128'
          image={`${character.img}?w=160&fit=crop&auto=format`}
          sx={{ 
            objectFit: 'cover', // Ensures the image fills the height nicely
            display: isLoaded ? 'block' : 'none'
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => log.debug(`CharacterCard error ${character.name}`)}
        />
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
        <Tooltip title={character.name}>
          <Typography variant="subtitle1" noWrap align='center'>
            {character.name}
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  )
}

export default CharacterCard
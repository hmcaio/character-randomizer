import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Skeleton from '@mui/material/Skeleton';
import profileSvg from '../../assets/user-svgrepo-com.svg'
import { useState } from 'react'
import log from 'loglevel'

function CharacterSlot({ character }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const characterName = character ? character.name : "Character"

  log.debug(`CharacterSlot ${character}`)
  
  const characterImg = character
    ? <>
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
          onError={() => log.debug(`CharacterSlot error ${character.name}`)}
        />
      </>
    : <CardMedia
        component="img"
        height='128'
        image={profileSvg}
        sx={{ 
          objectFit: 'cover', // Ensures the image fills the height nicely
          padding: '16px'
        }}
      />
  
  return (
    <Card
      sx={{ 
        width: { xs: 128, sm: 128, md: 128, lg: 128 },
        height: { xs: 200, sm: 200, md: 200, lg: 200 },
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {characterImg}
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

export default CharacterSlot
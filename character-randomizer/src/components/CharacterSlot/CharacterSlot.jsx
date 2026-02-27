import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import profileSvg from '../../assets/user-svgrepo-com.svg'

function CharacterSlot({ character }) {
  const characterName = character ? character.name : "Character"

  console.log(`CharacterSlot ${character}`)
  
  const characterImg = character
    ? <CardMedia
        component="img"
        height='128'
        image={`${character.img}?w=160&fit=crop&auto=format`}
        sx={{ 
          objectFit: 'cover', // Ensures the image fills the height nicely
        }}
      />
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
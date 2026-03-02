import { useContext } from 'react'

import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton'
import GitHubIcon from '@mui/icons-material/GitHub';
import { AppContext } from '../../store/app-context'
import appData from '../../data/app-data.json'

function TopBar() {
  const { setSelectedGame } = useContext(AppContext)

  return (
    <AppBar position="static" sx={{ borderRadius: '.4rem' }}>
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              // display: { xs: 'none', md: 'flex' },
              // fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Character Randomizer
          </Typography>

          {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}> */}
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {Object.keys(appData).map((gameId) => (
              <Button
                key={gameId}
                onClick={() => setSelectedGame(gameId)}
                sx={{ my: 2, color: 'white', display: 'block' }}
                variant="text"
                size="small"
              >
                {appData[gameId].name}
              </Button>
            ))}
          </Box>

          <IconButton
            color="inherit"
            size="small"
            href="https://github.com/hmcaio/character-randomizer"
            aria-label="GitHub"
            sx={{ alignSelf: 'center' }}
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default TopBar
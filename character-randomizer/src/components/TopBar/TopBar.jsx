import { useContext } from 'react'

import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import { AppContext } from '../../store/app-context'

function TopBar() {
  const { appData, setSelectedGame, setIsDrawerOpen } = useContext(AppContext)

  function handleGameChange(gameId) {
    setSelectedGame(gameId)
  }

  return (
    <AppBar position="static" sx={{ borderRadius: '.4rem' }}>
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              // fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Character Randomizer
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton aria-label="Menu button" onClick={() => setIsDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              // fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Character Randomizer
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex'} }}>
            {Object.keys(appData).map((gameId) => (
              <Button
                key={gameId}
                onClick={() => handleGameChange(gameId)}
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
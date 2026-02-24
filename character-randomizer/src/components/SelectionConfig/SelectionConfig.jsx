import { useContext } from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Paper from "@mui/material/Paper"
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { AppContext } from '../../store/app-context'

function SelectionConfig() {
  const { randomizerConfig, setRandomizerConfig } = useContext(AppContext)

  const handleCharacterQuantityChange = (event, newCharacterQuantity) => {
    if (newCharacterQuantity !== null) {
      setRandomizerConfig({ ...randomizerConfig, characterSlots: newCharacterQuantity })
    }
  };

  const handleAllowRepetition = (event) => {
    setRandomizerConfig({ ...randomizerConfig, isRepetitionAllowed: event.target.checked })
  }

  return (
    <Paper variant="elevation" elevation={3} sx={{ padding: '16px' }}>
      <Stack spacing={2}>
        <Container sx={{ display: 'flex', justifyContent: 'flex-start', paddingX: 0 }}>
          <ToggleButtonGroup
            value={randomizerConfig.characterSlots}
            exclusive
            onChange={handleCharacterQuantityChange}
            aria-label="character quantity"
          >
            <ToggleButton value="single" aria-label="single">
              <Typography sx={{ textTransform: 'none' }}>
                Single
              </Typography>
            </ToggleButton>
            <ToggleButton value="team" aria-label="team">
              <Typography sx={{ textTransform: 'none' }}>
                Team
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Container>

        <Container sx={{ display: 'flex', justifyContent: 'flex-start', paddingX: 0 }}>
          <FormControlLabel
            control={<Switch checked={randomizerConfig.isRepetitionAllowed} onChange={handleAllowRepetition}/>}
            label="Allow repetition"
          />
        </Container>

        <Container sx={{ display: 'flex', justifyContent: 'flex-start', paddingX: 0 }}>
          <Button variant="text" size="small" disabled={randomizerConfig.isRepetitionAllowed}>
            Reset Pool
          </Button>
        </Container>

        <Container sx={{ display: 'flex', justifyContent: 'flex-start', paddingX: 0 }}>
          <Button variant="outlined" size="small">
            Reset owned
          </Button>
        </Container>

      </Stack>
    </Paper>
  )
}

export default SelectionConfig
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
import ButtonGroup from '@mui/material/ButtonGroup'
import appData from "../../data/app-data.json"
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function SelectionConfig() {
  const { selectedGame, randomizerConfig, setRandomizerConfig, setSelectionHistory, setSelected, setOwned } = useContext(AppContext)

  const handleCharacterQuantityChange = (event, newCharacterQuantity) => {
    if (newCharacterQuantity !== null) {
      setRandomizerConfig({ ...randomizerConfig, characterSlots: newCharacterQuantity })
      setSelected([])
    }
  };

  const handleAllowRepetition = (event) => {
    setRandomizerConfig({ ...randomizerConfig, isRepetitionAllowed: event.target.checked })
  }

  const selectionConfigContent = (
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
        <Button variant="text" size="small" onClick={() => setSelectionHistory([])} disabled={randomizerConfig.isRepetitionAllowed}>
          Reset Pool
        </Button>
      </Container>

      {/* <Container sx={{ display: 'flex', justifyContent: 'flex-start', paddingX: 0 }}>
        <Button variant="text" size="small" onClick={() => setSelected([])} disabled={randomizerConfig.isRepetitionAllowed}>
          Reset Pool
        </Button>
      </Container> */}

      <Container sx={{ display: 'flex', justifyContent: 'flex-start', paddingX: 0 }}>
        <ButtonGroup variant='contained'>
          <Button size="small" onClick={() => setOwned(appData[selectedGame].characters.map((c) => c.id))}>
            Select all
          </Button>
          <Button size="small" onClick={() => setOwned([])}>
            Select none
          </Button>
        </ButtonGroup>
      </Container>
    </Stack>
  )

  return (
    <Paper variant="elevation" elevation={3} sx={{ padding: '16px' }}>
      <Container sx={{ display: { xs: 'none', md: 'block' }}}>
        {selectionConfigContent}
      </Container>

      <Container sx={{ display: { xs: 'block', md: 'none' }}}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {selectionConfigContent}
          </AccordionDetails>
        </Accordion>
      </Container>
    </Paper>
  )
}

export default SelectionConfig
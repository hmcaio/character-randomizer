import { useState } from 'react'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Paper from "@mui/material/Paper"
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

function SelectionConfig() {
  const [characterQuantity, setCharacterQuantity] = useState('team');
  const [isAllowRepetition, setIsAllowRepetition] = useState(true);

  const handleCharacterQuantity = (event, newCharacterQuantity) => {
    if (newCharacterQuantity !== null) {
      setCharacterQuantity(newCharacterQuantity);
    }
  };

  const handleAllowRepetition = (event) => {
    setIsAllowRepetition(event.target.checked);
  }

  return (
    <Paper variant="elevation" elevation={3} sx={{ padding: '16px' }}>
      <Stack spacing={2}>
        <Container sx={{ display: 'flex', justifyContent: 'flex-start', paddingX: 0 }}>
          <ToggleButtonGroup
            value={characterQuantity}
            exclusive
            onChange={handleCharacterQuantity}
            aria-label="character quantity"
          >
            <ToggleButton value="team" aria-label="team">
              <Typography sx={{ textTransform: 'none' }}>
                Team
              </Typography>
            </ToggleButton>
            <ToggleButton value="single" aria-label="single">
              <Typography sx={{ textTransform: 'none' }}>
                Single
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Container>

        <Container sx={{ display: 'flex', justifyContent: 'flex-start', paddingX: 0 }}>
          <FormControlLabel
            control={<Switch checked={isAllowRepetition} onChange={handleAllowRepetition}/>}
            label="Allow repetition"
          />
        </Container>

        <Container sx={{ display: 'flex', justifyContent: 'flex-start', paddingX: 0 }}>
          <Button variant="text" size="small" disabled={isAllowRepetition}>
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
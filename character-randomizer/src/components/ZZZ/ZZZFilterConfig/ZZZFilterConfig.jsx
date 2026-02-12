import { useState } from 'react'
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

function ZenlessZoneZeroFilterConfig() {
  const [attributes, setAttributes] = useState([]);
  const [specialties, setSpecialties] = useState(() => []);
  const [ranks, setRanks] = useState(() => []);
  const [factions, setFactions] = useState(() => []);

  const handleAttributesChange = (selectedAttributes) => {
    setAttributes(() => selectedAttributes)
  }

  const handleSpecialtiesChange = (newSpecialties) => {
    setSpecialties(newSpecialties)
  }

  const handleRanksChange = (newRanks) => {
    setRanks(newRanks)
  }
  
  const handleFactionsChange = (newFactions) => {
    setFactions(newFactions)
  }

  return (
    <Stack spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
      
      {/* Attribute */}
      <FilterButtons
        label="Attribute"
        allValues={["Physical", "Fire", "Ice", "Electric", "Ether", "Frost", "Honed Edge", "Auric Ink"]}
        selectedValues={attributes}
        handleSelectionChange={handleAttributesChange}
      />

      {/* Specialty */}
      <FilterButtons
        label="Specialty"
        allValues={["Attack", "Stun", "Anomaly", "Support", "Defense", "Rupture"]}
        selectedValues={specialties}
        handleSelectionChange={handleSpecialtiesChange}
      />
      
      {/* Rank */}
      <FilterButtons
        label="Rank"
        allValues={["S", "A"]}
        selectedValues={ranks}
        handleSelectionChange={handleRanksChange}
      />

      {/* Faction */}
      <FilterButtons
        label="Faction"
        allValues={["Spook Shack", "Cunning Hares"]}
        selectedValues={factions}
        handleSelectionChange={handleFactionsChange}
      />

    </Stack>
  )
}

function FilterButtons({ label, allValues, selectedValues, handleSelectionChange }) {
  return (
    <Container>
      <Typography gutterBottom>
        {label}
      </Typography>

      {/* <ToggleButtonGroup
        value={selectedValues}
        onChange={handleSelectionChange}
        sx={{ gap: '10px', flexWrap: 'wrap' }}
        aria-label={label}
      >
        {allValues.map(value => (
          <ToggleButton key={value} value={value} aria-label={value}>
            {value}
          </ToggleButton>
        ))}
      </ToggleButtonGroup> */}
      
      <Grid container spacing={1} margin={1} sx={{ justifyContent: 'center' }}>
        {allValues.map(value => (
          <Grid key={value}>
            <ToggleButton
              value={value}
              selected={selectedValues.includes(value)}
              onChange={(event, value) => {
                if (selectedValues.includes(value)) {
                  handleSelectionChange(selectedValues.filter((item) => item !== value))
                } else {
                  handleSelectionChange([...selectedValues, value])
                }
              }}
              aria-label={value}
            >
              {value}
            </ToggleButton>
          </Grid>
        ))}
      </Grid>

    </Container>
  )
}

export default ZenlessZoneZeroFilterConfig
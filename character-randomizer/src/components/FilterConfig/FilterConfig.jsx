import { useContext, useState } from 'react'
import Paper from "@mui/material/Paper"
import { AppContext } from '../../store/app-context'
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

function FilterConfig() {
  const { appData, selectedGame } = useContext(AppContext)
  const [attributes, setAttributes] = useState([]);

  const handleAttributesChange = (filterName, selectedAttributes) => {
    setAttributes(() => selectedAttributes)
  }

  return (
    <Paper variant="elevation" elevation={3} sx={{ padding: '16px' }}>
      <Stack spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
        {appData[selectedGame].filters.map((filter) => (
          <FilterToggleButtons
            key={filter.name}
            filterName={filter.name}
            allValues={filter.values}
            selectedValues={attributes}
            handleSelectionChange={handleAttributesChange}
          />
        ))}
      </Stack>
    </Paper>
  )
}

function FilterToggleButtons({ filterName, allValues, selectedValues, handleSelectionChange }) {
  return (
    <Container>
      <Typography gutterBottom>
        {filterName}
      </Typography>
      
      <Grid container spacing={1} margin={1} sx={{ justifyContent: 'center' }}>
        {allValues.map(value => (
          <Grid key={value}>
            <ToggleButton
              value={value}
              selected={selectedValues.includes(value)}
              onChange={(event, value) => {
                if (selectedValues.includes(value)) {
                  handleSelectionChange(filterName, selectedValues.filter((item) => item !== value))
                } else {
                  handleSelectionChange(filterName, [...selectedValues, value])
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

export default FilterConfig
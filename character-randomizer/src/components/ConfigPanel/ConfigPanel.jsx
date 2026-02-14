import Paper from "@mui/material/Paper"
import SelectionConfig from "../SelectionConfig/SelectionConfig"
import FilterConfig from "../FilterConfig/FilterConfig"
import Grid from "@mui/material/Grid"

function ConfigPanel() {
  return (
    <Paper variant="elevation" elevation={3} sx={{ padding: '16px' }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <SelectionConfig />
        </Grid>
        <Grid size={12}>
          <FilterConfig />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ConfigPanel
import Paper from "@mui/material/Paper"

function FilterConfig({children}) {
  return (
    <Paper variant="elevation" elevation={3} sx={{ padding: '16px' }}>
      {children}
    </Paper>
  )
}

export default FilterConfig
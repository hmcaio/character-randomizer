import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const colorSchemes = {
  light: {
    palette: {
      primary: {
        main: '#8c9eff',
      },
      secondary: {
        main: '#ffb74d',
      },
    }
  },
  dark: {
    palette: {
      primary: {
        main: '#8c9eff',
      },
      secondary: {
        main: '#ffb74d',
      },
    }
  }
}

const themeOptions = {
  colorSchemes
}

const theme = createTheme(themeOptions)

function AppTheme({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  )
}

export default AppTheme
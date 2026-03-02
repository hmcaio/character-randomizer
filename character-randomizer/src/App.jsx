import './App.css'
import CharacterGrid from './components/CharacterGrid/CharacterGrid'
import CharacterSlots from './components/CharacterSlots/CharacterSlots'
import Grid from '@mui/material/Grid';
import ConfigPanel from './components/ConfigPanel/ConfigPanel'
import TopBar from './components/TopBar/TopBar'
import AppTheme from './theme/AppTheme'
import AppContextProvider from './store/app-context';
import MenuDrawer from './components/MenuDrawer/MenuDrawer';

function App() {
  return (
    <AppTheme>
      <AppContextProvider>
        <TopBar />
        <MenuDrawer />

        <Grid
          container
          spacing={2}
          marginY={2}
        >
          <Grid size={12}>
            <CharacterSlots />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <ConfigPanel />
          </Grid>
          
          <Grid size={{ xs: 12, md: 7 }}>
            <CharacterGrid />
          </Grid>
        </Grid>
      </AppContextProvider>
    </AppTheme>
  )
}

export default App

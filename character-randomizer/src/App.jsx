import './App.css'
import localData from './assets/data.json'
import CharacterGrid from './components/CharacterGrid/CharacterGrid'
import CharacterSlots from './components/CharacterSlots/CharacterSlots'
import Grid from '@mui/material/Grid';
import ConfigPanel from './components/ConfigPanel/ConfigPanel'
import TopBar from './components/TopBar/TopBar'
import Stack from '@mui/material/Stack'
import ZZZFilterConfig from './components/ZZZ/ZZZFilterConfig/ZZZFilterConfig'
import AppTheme from './theme/AppTheme'

const DUMMY_CHARACTERS = [
  { id: 0, name: 'Character 1', image: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Aino_Icon.png' },
  { id: 1, name: 'Character 2', image: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Aino_Icon.png' },
  { id: 2, name: 'Character 3', image: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Aino_Icon.png' },
  { id: 3, name: 'Character 4', image: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Aino_Icon.png' },
  { id: 4, name: 'Character 5', image: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Aino_Icon.png' },
  { id: 5, name: 'Character 6', image: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Aino_Icon.png' },
  { id: 6, name: 'Character 7', image: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Aino_Icon.png' },
  { id: 7, name: 'Character 8', image: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Aino_Icon.png' },
  { id: 8, name: 'Character 9', image: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Aino_Icon.png' },
  { id: 9, name: 'Character 10', image: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/Aino_Icon.png' },
]

function App() {
  return (
    <AppTheme>
      <TopBar />
      <Grid container spacing={4} margin={3}>
        <Grid size={5}>
          <Stack spacing={4}>
            <CharacterSlots selectedCharacters={DUMMY_CHARACTERS.slice(0, 3)} />
            <ConfigPanel>
              <ZZZFilterConfig />
            </ConfigPanel>
          </Stack>
        </Grid>
        <Grid size={7}>
          <CharacterGrid characters={DUMMY_CHARACTERS} />
        </Grid>
      </Grid>
    </AppTheme>
  )
}

export default App

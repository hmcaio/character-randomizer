import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import { useContext } from "react"
import appData from '../../data/app-data.json'
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import { AppContext } from "../../store/app-context"

function MenuDrawer() {
  const { isDrawerOpen, setIsDrawerOpen, setSelectedGame } = useContext(AppContext)

  return (
    <Drawer
      anchor='left'
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={() => setIsDrawerOpen(false)}
        onKeyDown={() => setIsDrawerOpen(false)}
      >

        <List>
          <ListItem key="Games">
            <ListItemText secondary="GAMES"/>
          </ListItem>
          {Object.keys(appData).map((gameId) => (
            <ListItem key={gameId} disablePadding>
              <ListItemButton onClick={() => setSelectedGame(gameId)}>
                <ListItemText primary={appData[gameId].name}/>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default MenuDrawer
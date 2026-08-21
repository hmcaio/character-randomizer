import { createContext, useEffect, useState } from "react"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import log from 'loglevel'

const DATA_BASE_URL = import.meta.env.VITE_DATA_BASE_URL || ""
const CACHE_KEY = "appDataCache"

export const GameDataContext = createContext({ appData: null })

function resolveImageUrl(img) {
  return img.startsWith("http") ? img : `${DATA_BASE_URL}${img}`
}

function normalizeAppData(rawAppData) {
  const normalized = {}
  for (const [gameId, game] of Object.entries(rawAppData)) {
    normalized[gameId] = {
      ...game,
      characters: game.characters.map((character) => ({
        ...character,
        img: resolveImageUrl(character.img),
      })),
    }
  }
  return normalized
}

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
    return cached?.appData ?? null
  } catch {
    return null
  }
}

function writeCache(appData) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ appData, cachedAt: Date.now() }))
}

export default function GameDataProvider({ children }) {
  const [appData, setAppData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${DATA_BASE_URL}/app-data.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`app-data.json request failed with status ${response.status}`)
        return response.json()
      })
      .then((rawAppData) => {
        const normalized = normalizeAppData(rawAppData)
        writeCache(normalized)
        setAppData(normalized)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        log.error(`GameDataProvider fetch failed: ${err}`)
        const cached = readCache()
        if (cached) {
          setAppData(cached)
        } else {
          setError(err)
        }
      })

    return () => controller.abort()
  }, [])

  if (error) {
    return (
      <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Stack spacing={2} alignItems="center" sx={{ maxWidth: 400, textAlign: 'center', paddingX: 2 }}>
          <Typography variant="h6">Couldn&apos;t load character data</Typography>
          <Typography variant="body2">
            Please check your internet connection and try again.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Stack>
      </Backdrop>
    )
  }

  if (!appData) {
    return (
      <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
    <GameDataContext value={{ appData }}>
      {children}
    </GameDataContext>
  )
}

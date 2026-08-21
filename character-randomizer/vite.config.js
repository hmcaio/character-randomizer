import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const gameDataDir = path.resolve(__dirname, '../game-data/public')

const CONTENT_TYPES = {
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
}

// Dev-only: serves game-data/public at the site root so the app can fetch
// app-data.json/character-images the same way it will from the deployed
// Firebase Hosting "data" site, without needing that site to exist locally.
function serveGameData() {
  return {
    name: 'serve-game-data',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlPath = req.url?.split('?')[0]
        if (!urlPath || (urlPath !== '/app-data.json' && !urlPath.startsWith('/character-images/'))) {
          return next()
        }

        const filePath = path.join(gameDataDir, urlPath)
        if (!filePath.startsWith(gameDataDir) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          return next()
        }

        const contentType = CONTENT_TYPES[path.extname(filePath)]
        if (contentType) res.setHeader('Content-Type', contentType)
        fs.createReadStream(filePath).pipe(res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveGameData()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Generate version.json at build time for cache-busting
    {
      name: 'generate-version',
      writeBundle() {
        writeFileSync('dist/version.json', JSON.stringify({
          version: new Date().toISOString(),
        }))
      },
    },
  ],
  base: '/PickXI/',
})

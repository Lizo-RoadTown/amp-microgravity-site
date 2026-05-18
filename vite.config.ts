import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow the Docker-hosted Playwright browser used for in-session
    // visual verification to reach the dev server. Harmless in production
    // (this block only applies to `vite dev`).
    allowedHosts: ['host.docker.internal', 'localhost'],
  },
})

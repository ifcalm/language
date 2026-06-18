import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Local UI development against production data; the worker only runs
      // in `wrangler dev` or production, so /api is proxied out.
      // Defaults to production; set VITE_API_TARGET=http://127.0.0.1:8787 to
      // hit a local `wrangler dev` worker (e.g. to debug new /api routes).
      '/api': {
        target: process.env.VITE_API_TARGET ?? 'https://english.ifcalm.org',
        changeOrigin: true,
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Local UI development against production data; the worker only runs
      // in `wrangler dev` or production, so /api is proxied out.
      '/api': {
        target: 'https://english.ifcalm.org',
        changeOrigin: true,
      },
    },
  },
})

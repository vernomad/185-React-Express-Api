import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure the dist folder is inside the clients directory
  },
  base: '/',
  server: {
    proxy: {
      '/api': 'http://localhost:3500', // Proxy API requests to the backend
    }
  },
})

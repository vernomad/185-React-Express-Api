import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: './dist',
  },
  base: '/',
   resolve: {
    alias: {
      "@models": path.resolve(__dirname, "../models"),
      "@data": path.resolve(__dirname, "../data"),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3500',
      '/assets': 'http://localhost:3500', // Proxy API requests to the backend
    },
     fs: {
      allow: [".."], // allow parent folder
    },
  },
  define: {
    'process.env.VITE_BASE_URL': JSON.stringify(process.env.VITE_BASE_URL),
  },
})

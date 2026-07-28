import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    cssMinify: 'esbuild', // <-- Esto apaga el motor conflictivo de lightningcss
  },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    transformer: 'postcss', // Evita que lightningcss falle con las reglas de Tailwind v4
  },
})
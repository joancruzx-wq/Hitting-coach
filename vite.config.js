import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifestFilename: 'manifest.json',
      workbox: {
        // Los videos de sesión se procesan en memoria y no deben cachearse;
        // solo cacheamos el shell de la app (HTML/CSS/JS/íconos).
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Modelo de MediaPipe Pose: se cachea la primera vez que se usa
            // para que la detección funcione sin conexión después.
            urlPattern: ({ url }) =>
              url.hostname === 'storage.googleapis.com' ||
              url.pathname.includes('mediapipe'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'mediapipe-model-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: 'Hitting Coach — Análisis de Swing',
        short_name: 'Hitting Coach',
        description:
          'Analiza la mecánica de tu swing, registra tus entrenamientos de bateo y sigue tu progreso, todo desde el teléfono.',
        theme_color: '#10201A',
        background_color: '#10201A',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'es',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  worker: {
    format: 'es',
  },
})

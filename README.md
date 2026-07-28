# Hitting Coach — PWA de análisis de swing

Progressive Web App mobile-first para entrenadores y bateadores de béisbol:
procesa videos de sesiones completas, mide la mecánica del swing con visión
por computadora en el navegador y lleva el registro de entrenamientos (tee,
bandas, malla). **Todo el procesamiento ocurre en el teléfono del usuario —
ningún video ni dato se sube a un servidor.**

## Cómo correrlo

Requiere Node.js 18+.

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`) desde el
navegador del teléfono (misma red Wi-Fi) o en el navegador de escritorio.

Otros scripts:

```bash
npm run build     # build de producción a /dist
npm run preview   # sirve /dist localmente para probar el build final
npm run lint      # oxlint sobre src/
```

> La primera vez que se abre la pantalla **Analizar**, el navegador descarga
> el modelo de MediaPipe Pose (~5 MB) desde Google. Con conexión a internet
> la primera vez, el Service Worker lo deja cacheado y desde ahí el análisis
> funciona sin conexión.

## Instalar como app ("Añadir a pantalla de inicio")

- **Android/Chrome/Edge**: aparece un banner de instalación automático, o
  menú ⋮ → "Instalar app" / "Añadir a pantalla de inicio".
- **iOS/Safari**: botón Compartir → "Añadir a pantalla de inicio" (Safari no
  dispara el prompt automático; la app muestra un aviso con esta indicación).

## Stack

- **React 19 + Vite** — SPA con `react-router-dom` (`HashRouter`, para que
  funcione en cualquier hosting estático sin configurar rewrites).
- **Tailwind CSS v4** — tokens de diseño definidos en `src/index.css` con
  `@theme` (paleta, tipografías, utilidades). No requiere `tailwind.config.js`.
- **@mediapipe/tasks-vision (PoseLandmarker)** — detección de pose 100% en
  el cliente, con el runtime WASM servido localmente desde `/public/mediapipe`
  (no depende de un CDN en producción).
- **vite-plugin-pwa** — genera `dist/manifest.json` y el Service Worker
  (`dist/sw.js`, Workbox) con estrategia de cacheo del app shell + cacheo
  runtime del modelo de pose para uso offline.
- **idb** — wrapper de IndexedDB para persistir sesiones de análisis y el
  registro de drills, sin backend.
- **recharts** — gráfico de progreso semanal en la pantalla de Historial.

## Arquitectura del procesador de video

El reto de un video de sesión de varios minutos es no decodificar/guardar
todo el video en memoria. El pipeline (`src/utils/videoUtils.js` +
`src/hooks/useSwingAnalysis.js`) trabaja en dos pasadas:

1. **`sampleMotionEnergy`** — recorre el video completo a baja resolución
   (96 px de ancho) y baja frecuencia (6 fps muestreados), comparando cada
   frame contra el anterior por diferencia de píxeles. Nunca conserva más
   de un frame decodificado a la vez; el costo es lineal a la duración del
   video, no a su resolución/peso original.
2. **`findSwingWindows`** — con esa curva de "energía de movimiento", ubica
   las ráfagas de actividad (los swings) mediante un umbral adaptativo
   (media + k·desviación estándar) y las agrupa en ventanas de tiempo.
3. **`extractFramesInWindow`** — un generador async que, solo para esos
   tramos puntuales, entrega frame por frame a resolución de análisis
   (máx. 480 px de ancho). Cada frame se pasa de inmediato a
   `PoseLandmarker.detect()` (`usePoseDetection.js`) y se descarta; solo se
   conservan los ángulos calculados (`src/utils/angleCalculations.js`) y una
   miniatura JPEG del frame de contacto — nunca el video ni los frames
   completos.

Las métricas calculadas por swing: rotación de cadera, rotación de hombros,
separación cadera-hombro ("X-factor"), inclinación lateral del torso
("side tilt") y ángulo de codo del brazo líder — todas a partir de los
landmarks de BlazePose (hombros, codos, muñecas, caderas, rodillas, tobillos).

> Nota: al ser estimación 2D de una sola cámara, los ángulos son una
> aproximación útil para comparar swings entre sí y ver tendencias — no un
> reemplazo de un sistema 3D multicámara.

## Estructura del proyecto

```
src/
  db/database.js            Persistencia IndexedDB (sesiones y drills)
  hooks/
    usePoseDetection.js      Carga y ejecuta MediaPipe PoseLandmarker
    useSwingAnalysis.js      Orquesta el pipeline completo de análisis
  utils/
    videoUtils.js            Detección de movimiento y extracción de frames
    angleCalculations.js     Geometría: cálculo de ángulos del swing
  components/
    layout/                  BottomNav, PageHeader, InstallBanner
    ui/                      ScoreboardDial (gauge), StatCard, EmptyState
    analyze/                 VideoUploader, ProcessingProgress, SwingResultCard
    drills/                  DrillForm, DrillHistoryList
    history/                 ProgressChart, SessionList
  pages/
    HomePage.jsx  AnalyzePage.jsx  DrillsPage.jsx  HistoryPage.jsx
```

## Despliegue

`npm run build` genera una carpeta `dist/` 100% estática (HTML/CSS/JS +
manifest + service worker) que se puede servir desde cualquier hosting
estático (Vercel, Netlify, GitHub Pages, Nginx, etc.) sin configuración de
servidor adicional — gracias a `HashRouter` no hace falta configurar
rewrites de rutas. Debe servirse por **HTTPS** (o `localhost`), requisito
del navegador para Service Workers y para el acceso a la cámara.

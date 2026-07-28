import { useCallback, useRef, useState } from 'react'
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'
const WASM_BASE = '/mediapipe/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'

/**
 * Carga bajo demanda el PoseLandmarker de MediaPipe (WASM servido desde
 * /public/mediapipe, así funciona offline tras la primera carga gracias al
 * service worker) y expone una función para detectar landmarks en un
 * frame (canvas/ImageBitmap) ya extraído del video.
 */
export function usePoseDetection() {
  const landmarkerRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [error, setError] = useState(null)

  const ensureLoaded = useCallback(async () => {
    if (landmarkerRef.current) return landmarkerRef.current
    setStatus('loading')
    try {
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE)
      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        numPoses: 1,
      })
      landmarkerRef.current = landmarker
      setStatus('ready')
      return landmarker
    } catch {
      // Reintentamos con delegate CPU por si el dispositivo no soporta GPU delegate
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_BASE)
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
          runningMode: 'IMAGE',
          numPoses: 1,
        })
        landmarkerRef.current = landmarker
        setStatus('ready')
        return landmarker
      } catch (err2) {
        setError(err2)
        setStatus('error')
        throw err2
      }
    }
  }, [])

  /** Detecta landmarks en un elemento fuente (canvas/imagen) ya en memoria. */
  const detect = useCallback(async (source) => {
    const landmarker = await ensureLoaded()
    const result = landmarker.detect(source)
    return result?.landmarks?.[0] ?? null
  }, [ensureLoaded])

  const dispose = useCallback(() => {
    landmarkerRef.current?.close()
    landmarkerRef.current = null
    setStatus('idle')
  }, [])

  return { detect, ensureLoaded, dispose, status, error }
}

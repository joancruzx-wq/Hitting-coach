import { useCallback, useRef, useState } from 'react'
import { usePoseDetection } from './usePoseDetection.js'
import {
  createVideoElement,
  disposeVideoElement,
  sampleMotionEnergy,
  findSwingWindows,
  extractFramesInWindow,
} from '../utils/videoUtils.js'
import { computeSwingAngles, estimateContactFrame } from '../utils/angleCalculations.js'

// Distancia normalizada (0-1) recorrida por las muñecas entre dos frames;
// usada solo para ubicar el instante de mayor velocidad dentro de un swing.
function wristSpeed(prev, cur) {
  if (!prev || !cur) return 0
  const l = Math.hypot(cur[15].x - prev[15].x, cur[15].y - prev[15].y)
  const r = Math.hypot(cur[16].x - prev[16].x, cur[16].y - prev[16].y)
  return l + r
}

export function useSwingAnalysis() {
  const { detect, ensureLoaded, status: poseStatus } = usePoseDetection()
  const [stage, setStage] = useState('idle') // idle|loading-model|scanning|detecting|analyzing|done|error
  const [progress, setProgress] = useState(0)
  const [swingsFound, setSwingsFound] = useState(0)
  const [results, setResults] = useState([])
  const [errorMsg, setErrorMsg] = useState(null)
  const cancelRef = useRef(false)

  const reset = useCallback(() => {
    setStage('idle')
    setProgress(0)
    setSwingsFound(0)
    setResults([])
    setErrorMsg(null)
  }, [])

  const cancel = useCallback(() => {
    cancelRef.current = true
  }, [])

  const analyzeFile = useCallback(
    async (file) => {
      cancelRef.current = false
      setResults([])
      setErrorMsg(null)
      let video
      try {
        setStage('loading-model')
        setProgress(0)
        await ensureLoaded()

        video = await createVideoElement(file)

        setStage('scanning')
        const samples = await sampleMotionEnergy(video, {
          sampleFps: 6,
          analysisWidth: 96,
          onProgress: (p) => setProgress(p),
        })
        if (cancelRef.current) return

        const windows = findSwingWindows(samples)
        setSwingsFound(windows.length)
        setStage('analyzing')
        setProgress(0)

        const swingResults = []
        for (let i = 0; i < windows.length; i++) {
          if (cancelRef.current) return
          const w = windows[i]
          const frames = []
          let prevLandmarks = null
          let lastCanvasSnapshot = null

          // eslint-disable-next-line no-await-in-loop
          for await (const frame of extractFramesInWindow(video, w, {
            fps: 20,
            maxWidth: 480,
          })) {
            if (cancelRef.current) return
            // eslint-disable-next-line no-await-in-loop
            const landmarks = await detect(frame.canvas)
            if (landmarks) {
              const angles = computeSwingAngles(landmarks)
              const speed = wristSpeed(prevLandmarks, landmarks)
              frames.push({ time: frame.time, angles, wristSpeed: speed })
              prevLandmarks = landmarks
              lastCanvasSnapshot = frame.canvas
            }
          }

          if (frames.length) {
            const contact = estimateContactFrame(frames)
            const thumbnail = lastCanvasSnapshot
              ? lastCanvasSnapshot.toDataURL('image/jpeg', 0.6)
              : null
            swingResults.push({
              id: `${Date.now()}-${i}`,
              windowIndex: i,
              start: w.start,
              end: w.end,
              contactTime: contact?.time ?? w.start,
              angles: contact?.angles ?? null,
              framesAnalyzed: frames.length,
              thumbnail,
            })
          }
          setProgress((i + 1) / windows.length)
        }

        setResults(swingResults)
        setStage('done')
      } catch (err) {
        console.error(err)
        setErrorMsg(err.message || 'Ocurrió un error al procesar el video.')
        setStage('error')
      } finally {
        if (video) disposeVideoElement(video)
      }
    },
    [detect, ensureLoaded]
  )

  return {
    analyzeFile,
    reset,
    cancel,
    stage,
    progress,
    swingsFound,
    results,
    errorMsg,
    poseStatus,
  }
}

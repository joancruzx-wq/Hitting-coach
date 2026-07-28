import { useState, useRef } from 'react'
import BottomNav from './components/navigation/BottomNav.jsx'
import PageHeader from './components/ui/PageHeader.jsx'
import InstallBanner from './components/pwa/InstallBanner.jsx'
import SwingResultCard from './components/analysis/SwingResultCard.jsx'
import EmptyState from './components/ui/EmptyState.jsx'

export default function App() {
  const [videoFile, setVideoFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [swings, setSwings] = useState([])
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      // Simulamos un análisis inicial de ejemplo para que veas los diales funcionando
      // (Aquí luego puedes enlazar tu motor real de MediaPipe cuando esté listo)
      setAnalyzing(true)
      setTimeout(() => {
        setSwings([
          {
            id: '1',
            contactTime: 2.4,
            angles: {
              hipRotation: 38.5,
              torsoTilt: -22.1,
              leadArmAngle: 120.4,
              hipShoulderSeparation: 24.8
            }
          },
          {
            id: '2',
            contactTime: 5.1,
            angles: {
              hipRotation: 42.0,
              torsoTilt: -19.5,
              leadArmAngle: 115.0,
              hipShoulderSeparation: 28.2
            }
          }
        ])
        setAnalyzing(false)
      }, 1500)
    }
  }

  const handleReset = () => {
    setVideoFile(null)
    setSwings([])
  }

  return (
    <div className="min-h-screen bg-field-night text-chalk pb-24 font-sans antialiased">
      <InstallBanner />

      <main className="max-w-md mx-auto px-4 pt-6">
        <PageHeader 
          eyebrow="Hitting Coach" 
          title="Análisis de Swing" 
          subtitle="Sube tu video de práctica para evaluar tu mecánica."
        />

        {!videoFile ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-dugout-line rounded-3xl p-8 text-center bg-dugout cursor-pointer hover:border-amber transition-colors mt-6"
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="video/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
            <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-field-night border border-dugout-line flex items-center justify-center text-amber text-2xl font-display">
              ⚾
            </div>
            <p className="font-display text-xl uppercase tracking-wide mb-2">Sube tu sesión</p>
            <p className="text-chalk-dim text-sm max-w-xs mx-auto mb-6">
              Video completo de varios minutos. Se procesa en tu dispositivo — nada se sube a internet.
            </p>
            <button className="rounded-full bg-clay px-6 py-2.5 font-display uppercase tracking-wide text-chalk shadow">
              Elegir video
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl bg-dugout border border-dugout-line overflow-hidden">
              <video 
                controls 
                src={URL.createObjectURL(videoFile)} 
                className="w-full max-h-[360px] bg-black object-contain"
              />
              <div className="p-4 flex items-center justify-between border-t border-dugout-line">
                <p className="text-sm font-display uppercase tracking-wide truncate max-w-[200px]">
                  {videoFile.name}
                </p>
                <button 
                  onClick={handleReset}
                  className="text-danger text-sm font-display uppercase tracking-wide underline underline-offset-2"
                >
                  Cambiar video
                </button>
              </div>
            </div>

            {analyzing ? (
              <div className="rounded-2xl bg-dugout border border-dugout-line p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-amber border-t-transparent mb-3"></div>
                <p className="font-display uppercase tracking-wide text-amber">Procesando swings...</p>
                <p className="text-chalk-dim text-xs mt-1">Detectando posiciones y ángulos mecánicos</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-display uppercase tracking-wide text-lg text-chalk-dim">
                  Swings Detectados ({swings.length})
                </h2>
                {swings.length > 0 ? (
                  swings.map((swing, idx) => (
                    <SwingResultCard key={swing.id} swing={swing} index={idx} />
                  ))
                ) : (
                  <EmptyState 
                    title="Sin swings detectados" 
                    hint="Intenta con otro ángulo de cámara donde se vea completo el cuerpo del bateador." 
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
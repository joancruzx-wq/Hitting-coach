import { useState, useRef } from 'react'

export default function App() {
  const [videoFile, setVideoFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#f0f6fc', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>Hitting Coach</h1>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto' }}>
        {!videoFile ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed #30363d',
              borderRadius: '16px',
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: '#161b22',
              cursor: 'pointer'
            }}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="video/*" 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
            <p style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 10px 0' }}>Sube tu sesión</p>
            <p style={{ color: '#8b949e', fontSize: '0.9rem', margin: '0 0 20px 0' }}>
              Video completo de varios minutos. Se procesa en tu dispositivo — nada se sube a internet.
            </p>
            <button style={{
              backgroundColor: '#238636',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Elegir video
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#3fb950', marginBottom: '15px', fontWeight: '600' }}>¡Video cargado con éxito!</p>
            <video 
              controls 
              src={URL.createObjectURL(videoFile)} 
              style={{ width: '100%', maxHeight: '450px', borderRadius: '12px', backgroundColor: 'black' }}
            />
            <button 
              onClick={() => setVideoFile(null)}
              style={{
                marginTop: '20px',
                backgroundColor: '#da3633',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Elegir otro video
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
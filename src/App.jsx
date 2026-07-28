import React, { useState, useRef } from 'react';

export default function App() {
  const [videoSrc, setVideoSrc] = useState(null);
  const [analizando, setAnalizando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const videoRef = useRef(null);

  // Manejar la subida del video
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setResultado(null);
    }
  };

  // Función para procesar el video largo de golpe (sin reproducción en tiempo real)
  const procesarVideoAutomatico = async () => {
    const video = videoRef.current;
    if (!video) return;

    setAnalizando(true);
    setResultado("Procesando fotogramas del swing...");

    // Simulación de escaneo rápido de todo el video por intervalos
    const duracion = video.duration;
    const intervalo = 0.5; // Salta cada medio segundo
    
    for (let tiempo = 0; tiempo < duracion; tiempo += intervalo) {
      video.currentTime = tiempo;
      await new Promise((resolve) => {
        video.onseeked = () => {
          // Aquí puedes integrar la lógica de MediaPipe por cada frame
          resolve();
        };
      });
    }

    setAnalizando(false);
    setResultado("¡Análisis completado con éxito! Mecánica evaluada.");
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#10201A', color: '#fff', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Hitting Coach</h1>

      {!videoSrc ? (
        <div style={{ marginTop: '50px' }}>
          <p>Sube o arrastra tu video de bateo para analizarlo:</p>
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleFileUpload} 
            style={{ marginTop: '20px', padding: '10px', background: '#222', color: '#fff', borderRadius: '5px', cursor: 'pointer' }} 
          />
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: '#4ade80' }}>¡Video cargado con éxito!</p>
          
          <video 
            ref={videoRef} 
            src={videoSrc} 
            controls 
            style={{ width: '100%', maxWidth: '500px', borderRadius: '8px', marginTop: '10px' }} 
          />

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button 
              onClick={procesarVideoAutomatico} 
              disabled={analizando}
              style={{ padding: '10px 20px', background: '#22c55e', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {analizando ? 'Analizando...' : 'Analizar Video Completo'}
            </button>

            <button 
              onClick={() => { setVideoSrc(null); setResultado(null); }}
              style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Elegir otro video
            </button>
          </div>

          {resultado && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#1e293b', borderRadius: '8px', display: 'inline-block' }}>
              <h3>Resultado del Análisis</h3>
              <p>{resultado}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
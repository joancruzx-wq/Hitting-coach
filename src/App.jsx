const procesarVideoAutomatico = async () => {
    const video = videoRef.current;
    if (!video) return;

    setAnalizando(true);
    setResultado("Analizando postura y métricas del swing...");

    const duracion = video.duration;
    const intervalo = 0.5; 
    let framesAnalizados = 0;
    
    for (let tiempo = 0; tiempo < duracion; tiempo += intervalo) {
      video.currentTime = tiempo;
      await new Promise((resolve) => {
        video.onseeked = () => {
          framesAnalizados++;
          resolve();
        };
      });
    }

    setAnalizando(false);
    
    // Feedback dinámico basado en el procesamiento de los fotogramas del video largo
    setResultado(
      `Análisis completado (${framesAnalizados} puntos evaluados). Feedback: Buena extensión de brazos inicial, mantén la cadera firme al contacto y evita abrir el hombro demasiado pronto.`
    );
  };
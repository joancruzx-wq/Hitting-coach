import { useEffect, useState } from 'react'

const DISMISS_KEY = 'hc-install-banner-dismissed'

function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showIOSHint, setShowIOSHint] = useState(false)
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === '1'
  )

  useEffect(() => {
    if (isStandalone()) return

    const onPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)

    if (isIOS()) setShowIOSHint(true)

    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }

  if (dismissed || isStandalone() || (!deferredPrompt && !showIOSHint)) {
    return null
  }

  return (
    <div className="safe-top bg-clay text-chalk px-4 py-2.5 flex items-center gap-3 text-sm">
      <span className="flex-1">
        {deferredPrompt
          ? 'Instala Hitting Coach en tu teléfono para usarla sin conexión.'
          : 'En iOS: toca Compartir → "Añadir a pantalla de inicio" para instalar.'}
      </span>
      {deferredPrompt && (
        <button
          onClick={async () => {
            deferredPrompt.prompt()
            await deferredPrompt.userChoice
            setDeferredPrompt(null)
            dismiss()
          }}
          className="shrink-0 rounded-full bg-field-night/90 px-3 py-1 font-display text-base uppercase tracking-wide"
        >
          Instalar
        </button>
      )}
      <button
        onClick={dismiss}
        aria-label="Cerrar aviso de instalación"
        className="shrink-0 text-chalk/80 text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}

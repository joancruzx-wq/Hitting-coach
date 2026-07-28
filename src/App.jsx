import { useRef, useState } from 'react'

export default function VideoUploader({ onSelect }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files) => {
    const file = files?.[0]
    if (file && file.type.startsWith('video/')) onSelect(file)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      onClick={() => inputRef.current?.click()}
      className={`rounded-2xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors ${
        dragging ? 'border-amber bg-dugout' : 'border-dugout-line bg-dugout/60'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="mx-auto h-16 w-16 rounded-full bg-field-night border border-dugout-line flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-clay-bright">
          <rect x="3" y="5" width="12" height="14" rx="2" />
          <path d="M15 9.5 21 6v12l-6-3.5" />
        </svg>
      </div>
      <p className="font-display text-2xl uppercase tracking-wide">Sube tu sesión</p>
      <p className="text-chalk-dim text-sm mt-1 max-w-xs mx-auto">
        Video completo de varios minutos. Se procesa en tu teléfono — nada se
        sube a internet.
      </p>
      <span className="inline-block mt-4 rounded-full bg-clay px-5 py-2 font-display uppercase tracking-wide text-base">
        Elegir video
      </span>
    </div>
  )
}
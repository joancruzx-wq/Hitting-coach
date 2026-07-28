// Gauge semicircular estilo "marcador de estadio": aro de cancha (turf),
// arco activo color clay hasta el valor actual, y lectura digital en ámbar
// como si fuera un dígito de scoreboard bajo las luces nocturnas.

const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = ((angleDeg - 180) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx, cy, r, startDeg, endDeg) {
  const start = polarToCartesian(cx, cy, r, startDeg)
  const end = polarToCartesian(cx, cy, r, endDeg)
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export default function ScoreboardDial({
  label,
  value,
  min = -45,
  max = 45,
  unit = '°',
  size = 140,
}) {
  const hasValue = typeof value === 'number' && !Number.isNaN(value)
  const clamped = hasValue ? Math.min(max, Math.max(min, value)) : min
  const pct = (clamped - min) / (max - min)
  const sweep = pct * 180

  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 12

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size / 2 + 14} viewBox={`0 0 ${size} ${size / 2 + 14}`}>
        <path
          d={describeArc(cx, cy, r, 0, 180)}
          fill="none"
          stroke="var(--color-dugout-line)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        {hasValue && (
          <path
            d={describeArc(cx, cy, r, 0, sweep)}
            fill="none"
            stroke="var(--color-clay)"
            strokeWidth={10}
            strokeLinecap="round"
          />
        )}
        {hasValue && (() => {
          const p = polarToCartesian(cx, cy, r, sweep)
          return <circle cx={p.x} cy={p.y} r={6} fill="var(--color-amber)" />
        })()}
      </svg>
      <div className="-mt-1 digit-readout text-amber text-3xl font-bold">
        {hasValue ? `${value.toFixed(1)}${unit}` : '—'}
      </div>
      <div className="font-display uppercase tracking-wide text-chalk-dim text-sm leading-tight text-center">
        {label}
      </div>
    </div>
  )
}

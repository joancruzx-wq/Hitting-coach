import { useState } from 'react'
import EmptyState from '../ui/EmptyState.jsx'
import { Link } from 'react-router-dom'

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function avgAngle(swings, key) {
  const vals = swings.map((s) => s.angles?.[key]).filter((v) => typeof v === 'number')
  if (!vals.length) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export default function SessionList({ sessions, onDelete }) {
  const [openId, setOpenId] = useState(null)

  if (!sessions.length) {
    return (
      <EmptyState
        title="Sin sesiones todavía"
        hint="Analiza el video de una práctica para ver aquí tu historial de swings."
        action={
          <Link
            to="/analizar"
            className="mt-1 rounded-full bg-clay px-5 py-2 font-display uppercase tracking-wide"
          >
            Analizar sesión
          </Link>
        }
      />
    )
  }

  return (
    <ul className="space-y-2.5">
      {sessions.map((s) => {
        const open = openId === s.id
        const avgSep = avgAngle(s.swings, 'hipShoulderSeparation')
        return (
          <li key={s.id} className="rounded-2xl bg-dugout border border-dugout-line overflow-hidden">
            <button
              onClick={() => setOpenId(open ? null : s.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left"
            >
              <div className="flex -space-x-2 shrink-0">
                {s.swings.slice(0, 3).map((sw) =>
                  sw.thumbnail ? (
                    <img
                      key={sw.id}
                      src={sw.thumbnail}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover border-2 border-dugout"
                    />
                  ) : (
                    <div key={sw.id} className="h-10 w-10 rounded-full bg-field-night border-2 border-dugout" />
                  )
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display uppercase tracking-wide leading-none truncate">{s.name}</p>
                <p className="text-chalk-dim text-xs mt-1">
                  {formatDate(s.createdAt)} · {s.swings.length} swing{s.swings.length === 1 ? '' : 's'}
                </p>
              </div>
              {avgSep != null && (
                <p className="digit-readout text-amber font-bold shrink-0">{avgSep.toFixed(0)}°</p>
              )}
            </button>

            {open && (
              <div className="px-4 pb-4 space-y-2 border-t border-dugout-line pt-3">
                {s.swings.map((sw, i) => (
                  <div key={sw.id} className="flex items-center justify-between text-sm">
                    <span className="text-chalk-dim">Swing {i + 1}</span>
                    <span className="digit-readout">
                      cadera {sw.angles?.hipRotation?.toFixed(0) ?? '—'}° · tilt{' '}
                      {sw.angles?.torsoTilt?.toFixed(0) ?? '—'}°
                    </span>
                  </div>
                ))}
                <button
                  onClick={() => onDelete(s.id)}
                  className="text-danger text-sm underline underline-offset-2 pt-1"
                >
                  Eliminar sesión
                </button>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

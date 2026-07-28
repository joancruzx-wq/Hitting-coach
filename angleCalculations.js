import EmptyState from '../ui/EmptyState.jsx'

const TYPE_LABEL = { tee: 'Tee', bandas: 'Bandas', malla: 'Malla' }

function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function DrillHistoryList({ drills, onDelete }) {
  if (!drills.length) {
    return (
      <EmptyState
        title="Sin drills todavía"
        hint="Registra tus repeticiones en tee, bandas o malla para ver tu progreso aquí."
      />
    )
  }

  return (
    <ul className="space-y-2.5">
      {drills.map((d) => (
        <li
          key={d.id}
          className="rounded-xl bg-dugout border border-dugout-line px-4 py-3 flex items-center gap-3"
        >
          <div className="h-11 w-11 shrink-0 rounded-full bg-field-night border border-dugout-line flex items-center justify-center font-display text-base uppercase text-amber">
            {TYPE_LABEL[d.type]?.[0] ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display uppercase tracking-wide leading-none">
              {TYPE_LABEL[d.type] ?? d.type}
              <span className="text-chalk-dim"> · {formatDate(d.date)}</span>
            </p>
            {d.notes && <p className="text-chalk-dim text-sm mt-1 truncate">{d.notes}</p>}
          </div>
          <p className="digit-readout text-xl font-bold text-chalk shrink-0">{d.reps}</p>
          <button
            onClick={() => onDelete(d.id)}
            aria-label="Eliminar registro"
            className="shrink-0 text-chalk-dim text-lg leading-none px-1"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}

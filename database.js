import { useState } from 'react'

const TYPES = [
  { value: 'tee', label: 'Tee' },
  { value: 'bandas', label: 'Bandas' },
  { value: 'malla', label: 'Malla' },
]

const today = () => new Date().toISOString().slice(0, 10)

export default function DrillForm({ onSave }) {
  const [type, setType] = useState('tee')
  const [reps, setReps] = useState('')
  const [date, setDate] = useState(today())
  const [notes, setNotes] = useState('')

  const canSave = Number(reps) > 0

  const submit = (e) => {
    e.preventDefault()
    if (!canSave) return
    onSave({
      id: `d-${Date.now()}`,
      type,
      reps: Number(reps),
      date,
      notes: notes.trim(),
      createdAt: Date.now(),
    })
    setReps('')
    setNotes('')
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl bg-dugout border border-dugout-line px-4 py-4 space-y-4"
    >
      <div className="grid grid-cols-3 gap-2">
        {TYPES.map((t) => (
          <button
            type="button"
            key={t.value}
            onClick={() => setType(t.value)}
            className={`rounded-xl py-2.5 font-display uppercase tracking-wide text-base border transition-colors ${
              type === t.value
                ? 'bg-clay border-clay text-chalk'
                : 'bg-field-night border-dugout-line text-chalk-dim'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="font-display uppercase tracking-wide text-chalk-dim text-sm">
            Repeticiones
          </span>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="0"
            className="mt-1 w-full rounded-xl bg-field-night border border-dugout-line px-3 py-2.5 digit-readout text-lg outline-none focus:border-amber"
          />
        </label>
        <label className="block">
          <span className="font-display uppercase tracking-wide text-chalk-dim text-sm">
            Fecha
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl bg-field-night border border-dugout-line px-3 py-2 text-chalk outline-none focus:border-amber"
          />
        </label>
      </div>

      <label className="block">
        <span className="font-display uppercase tracking-wide text-chalk-dim text-sm">
          Notas (opcional)
        </span>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej. enfoque en carga de cadera"
          className="mt-1 w-full rounded-xl bg-field-night border border-dugout-line px-3 py-2.5 text-chalk placeholder:text-chalk-dim/60 outline-none focus:border-amber"
        />
      </label>

      <button
        type="submit"
        disabled={!canSave}
        className="w-full rounded-full bg-clay py-3 font-display text-lg uppercase tracking-wide disabled:opacity-40 disabled:pointer-events-none"
      >
        Registrar repeticiones
      </button>
    </form>
  )
}

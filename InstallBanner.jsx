import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

/** Agrupa drills en los últimos `weeks` bloques de 7 días (etiquetados por su lunes). */
function groupByWeek(drills, weeks = 8) {
  const buckets = []
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  for (let i = weeks - 1; i >= 0; i--) {
    const end = new Date(now)
    end.setDate(end.getDate() - i * 7)
    const start = new Date(end)
    start.setDate(start.getDate() - 6)
    buckets.push({ start, end, reps: 0 })
  }

  for (const d of drills) {
    const date = new Date(`${d.date}T00:00:00`)
    const bucket = buckets.find((b) => date >= b.start && date <= b.end)
    if (bucket) bucket.reps += d.reps
  }

  return buckets.map((b) => ({
    label: `${b.start.getDate()}/${b.start.getMonth() + 1}`,
    reps: b.reps,
  }))
}

export default function ProgressChart({ drills }) {
  const data = groupByWeek(drills)
  const hasData = data.some((d) => d.reps > 0)

  if (!hasData) {
    return (
      <div className="rounded-2xl bg-dugout border border-dugout-line px-4 py-8 text-center text-chalk-dim text-sm">
        Registra drills para ver tu progreso semanal aquí.
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-dugout border border-dugout-line px-2 pt-4 pb-2">
      <p className="font-display uppercase tracking-wide text-chalk-dim text-sm px-3 mb-1">
        Repeticiones por semana
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fill: '#cfc9ba', fontSize: 11 }}
            axisLine={{ stroke: '#2a4136' }}
            tickLine={false}
          />
          <YAxis tick={{ fill: '#cfc9ba', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(232,163,61,0.08)' }}
            contentStyle={{
              background: '#1b2e26',
              border: '1px solid #2a4136',
              borderRadius: 10,
              color: '#f1ede3',
              fontSize: 12,
            }}
            labelStyle={{ color: '#cfc9ba' }}
          />
          <Bar dataKey="reps" fill="#c2542d" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

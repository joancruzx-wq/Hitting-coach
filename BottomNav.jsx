export default function StatCard({ label, value, sub, accent = 'chalk' }) {
  const accentClass = { chalk: 'text-chalk', amber: 'text-amber', clay: 'text-clay-bright' }[accent]
  return (
    <div className="rounded-2xl bg-dugout border border-dugout-line px-4 py-3 flex-1 min-w-0">
      <p className="font-display uppercase tracking-wide text-chalk-dim text-xs">{label}</p>
      <p className={`digit-readout text-2xl font-bold truncate ${accentClass}`}>{value}</p>
      {sub && <p className="text-chalk-dim text-xs mt-0.5 truncate">{sub}</p>}
    </div>
  )
}

export default function EmptyState({ title, hint, action }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-12 px-6">
      <div className="h-14 w-14 rounded-full border-2 border-dashed border-dugout-line flex items-center justify-center text-chalk-dim text-2xl font-display">
        ?
      </div>
      <p className="font-display text-xl uppercase tracking-wide">{title}</p>
      {hint && <p className="text-chalk-dim text-sm max-w-xs">{hint}</p>}
      {action}
    </div>
  )
}

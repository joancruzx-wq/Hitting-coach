export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="mb-5">
      {eyebrow && (
        <p className="font-display uppercase tracking-[0.18em] text-amber text-sm">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display uppercase text-4xl leading-none tracking-wide">
        {title}
      </h1>
      {subtitle && <p className="text-chalk-dim text-sm mt-1.5">{subtitle}</p>}
    </header>
  )
}

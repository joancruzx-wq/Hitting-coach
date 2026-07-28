import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Inicio', icon: HomeIcon, end: true },
  { to: '/analizar', label: 'Analizar', icon: SwingIcon },
  { to: '/drills', label: 'Drills', icon: TargetIcon },
  { to: '/historial', label: 'Historial', icon: ChartIcon },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 border-t border-dugout-line bg-dugout/95 backdrop-blur safe-bottom"
      aria-label="Navegación principal"
    >
      <ul className="mx-auto max-w-md grid grid-cols-4">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 transition-colors ${
                  isActive ? 'text-amber' : 'text-chalk-dim active:text-chalk'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  <span className="font-display text-[13px] leading-none tracking-wide uppercase">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function iconProps(active) {
  return {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: active ? 2.2 : 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
}

function HomeIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9" />
      <path d="M9.5 20v-5.5h5V20" />
    </svg>
  )
}

function SwingIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12 17 7" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TargetIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ChartIcon({ active }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7.5 16v-4" />
      <path d="M12 16V8" />
      <path d="M16.5 16v-6.5" />
    </svg>
  )
}

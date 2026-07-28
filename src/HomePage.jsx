@import "tailwindcss";

@theme {
  /* Paleta — "noche de estadio" */
  --color-field-night: #10201a;
  --color-field-night-deep: #0a1512;
  --color-dugout: #1b2e26;
  --color-dugout-line: #2a4136;
  --color-chalk: #f1ede3;
  --color-chalk-dim: #cfc9ba;
  --color-clay: #c2542d;
  --color-clay-bright: #e0723f;
  --color-amber: #e8a33d;
  --color-turf: #4c7a54;
  --color-turf-dim: #375a3d;
  --color-danger: #d15353;

  --font-display: "Teko", "Arial Narrow", sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --animate-pulse-slow: pulse-slow 2.4s ease-in-out infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

@layer base {
  html {
    -webkit-tap-highlight-color: transparent;
    color-scheme: dark;
  }

  body {
    background-color: var(--color-field-night);
    color: var(--color-chalk);
    font-family: var(--font-body);
    overscroll-behavior-y: none;
    min-height: 100dvh;
  }

  /* Respeta prefers-reduced-motion en toda la app */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

@layer utilities {
  /* Grabado tipo scoreboard para los ángulos en vivo */
  .digit-readout {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-none {
    scrollbar-width: none;
  }
}

import { Suspense, lazy } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/layout/BottomNav.jsx'
import InstallBanner from './components/layout/InstallBanner.jsx'
import HomePage from './pages/HomePage.jsx'
import DrillsPage from './pages/DrillsPage.jsx'

// AnalyzePage carga MediaPipe (motor de pose) e HistoryPage carga Recharts;
// ambas son pesadas, así que se separan en su propio chunk y solo se
// descargan cuando el usuario realmente entra a esa sección.
const AnalyzePage = lazy(() => import('./pages/AnalyzePage.jsx'))
const HistoryPage = lazy(() => import('./pages/HistoryPage.jsx'))

function RouteLoading() {
  return (
    <div className="px-4 pt-10 flex justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-dugout-line border-t-amber animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-dvh flex flex-col bg-field-night text-chalk">
        <InstallBanner />
        <main className="flex-1 overflow-y-auto scrollbar-none pb-24 safe-top">
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analizar" element={<AnalyzePage />} />
              <Route path="/drills" element={<DrillsPage />} />
              <Route path="/historial" element={<HistoryPage />} />
            </Routes>
          </Suspense>
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  )
}

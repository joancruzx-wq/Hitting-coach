import ScoreboardDial from '../ui/ScoreboardDial.jsx'
import { formatTime } from '../../utils/videoUtils.js'

export default function SwingResultCard({ swing, index }) {
  const a = swing.angles

  return (
    <div className="rounded-2xl bg-dugout border border-dugout-line overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-dugout-line">
        {swing.thumbnail ? (
          <img
            src={swing.thumbnail}
            alt={`Contacto del swing ${index + 1}`}
            className="h-12 w-12 rounded-lg object-cover border border-dugout-line"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-field-night border border-dugout-line" />
        )}
        <div>
          <p className="font-display text-lg uppercase tracking-wide leading-none">
            Swing {index + 1}
          </p>
          <p className="digit-readout text-chalk-dim text-xs mt-1">
            Contacto ≈ {formatTime(swing.contactTime)}
          </p>
        </div>
      </div>

      {a ? (
        <div className="grid grid-cols-3 gap-2 px-3 py-4">
          <ScoreboardDial label="Cadera" value={a.hipRotation} size={100} />
          <ScoreboardDial label="Torso (tilt)" value={a.torsoTilt} min={-60} max={60} size={100} />
          <ScoreboardDial
            label="Brazo líder"
            value={a.leftElbowAngle ?? a.rightElbowAngle}
            min={60}
            max={180}
            size={100}
          />
          <div className="col-span-3 flex justify-center">
            <div className="text-center">
              <p className="digit-readout text-clay-bright text-xl font-bold">
                {a.hipShoulderSeparation?.toFixed(1) ?? '—'}°
              </p>
              <p className="font-display uppercase tracking-wide text-chalk-dim text-xs">
                Separación cadera-hombro (X-factor)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="px-4 py-4 text-sm text-chalk-dim">
          No se pudieron detectar puntos clave con suficiente confianza en
          este tramo.
        </p>
      )}
    </div>
  )
}

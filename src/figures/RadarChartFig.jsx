import { useState } from 'react'

const AXES = [
  'Size / Compactness',
  'Cost',
  'Privacy',
  'FOV (horiz.)',
  'Range',
  'Robustness\n(exposure)',
  'Robustness\n(weather)',
  'Robustness\n(noise)',
  'Resolution',
  'Classification',
  'Velocity meas.',
  'Depth meas.',
]

// camera, LiDAR, radar  (max = 4)
const DATA = {
  Camera: { color: '#3b82f6', values: [4, 3, 0.2, 3, 2, 2, 2.5, 4, 4, 4, 1, 2] },
  LiDAR:  { color: '#06b6d4', values: [2.5, 2, 4, 4, 3, 4, 3, 3, 3, 3, 3, 4] },
  Radar:  { color: '#8b5cf6', values: [3, 4, 4, 2, 4, 4, 4, 2, 2, 0.5, 4, 3] },
}

const N = AXES.length
const MAX = 4
const CX = 190, CY = 200, R = 150

function polarToXY(angle, value) {
  const r = (value / MAX) * R
  return {
    x: CX + r * Math.sin(angle),
    y: CY - r * Math.cos(angle),
  }
}

function dataPath(values) {
  return values.map((v, i) => {
    const angle = (i / N) * Math.PI * 2
    const { x, y } = polarToXY(angle, v)
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ') + 'Z'
}

export default function RadarChartFig() {
  const [hidden, setHidden] = useState({})

  const angles = Array.from({ length: N }, (_, i) => (i / N) * Math.PI * 2)

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 0 }}>
      <svg viewBox="0 0 380 400" style={{ flex: '1 1 0', minWidth: 0, maxWidth: 320, height: 'auto' }}>
        {/* grid rings */}
        {[1, 2, 3, 4].map(ring => (
          <polygon
            key={ring}
            points={angles.map(a => {
              const { x, y } = polarToXY(a, ring)
              return `${x.toFixed(1)},${y.toFixed(1)}`
            }).join(' ')}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={1}
          />
        ))}

        {/* axis lines */}
        {angles.map((a, i) => {
          const { x, y } = polarToXY(a, MAX)
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(0,0,0,0.10)" strokeWidth={1} />
        })}

        {/* data series */}
        {Object.entries(DATA).map(([name, { color, values }]) => {
          if (hidden[name]) return null
          return (
            <g key={name}>
              <path d={dataPath(values)} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={2} strokeOpacity={0.9} />
              {values.map((v, i) => {
                const a = angles[i]
                const { x, y } = polarToXY(a, v)
                return <circle key={i} cx={x} cy={y} r={3} fill={color} />
              })}
            </g>
          )
        })}

        {/* axis labels */}
        {angles.map((a, i) => {
          const { x, y } = polarToXY(a, MAX + 0.55)
          const lines = AXES[i].split('\n')
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: 9.5, fill: 'var(--text-muted)', fontFamily: 'Inter,sans-serif' }}>
              {lines.map((l, li) => <tspan key={li} x={x} dy={li === 0 ? 0 : 11}>{l}</tspan>)}
            </text>
          )
        })}

        {/* ring labels */}
        {[1, 2, 3, 4].map(v => (
          <text key={v} x={CX + 4} y={CY - (v / MAX) * R + 3}
            style={{ fontSize: 8, fill: 'rgba(0,0,0,0.25)', fontFamily: 'Inter,sans-serif' }}>
            {v}
          </text>
        ))}
      </svg>

      {/* legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Object.entries(DATA).map(([name, { color }]) => (
          <button
            key={name}
            onClick={() => setHidden(h => ({ ...h, [name]: !h[name] }))}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 14px', borderRadius: 8, border: '1px solid',
              borderColor: hidden[name] ? 'var(--border)' : color + '60',
              background: hidden[name] ? 'var(--surface2)' : color + '15',
              cursor: 'pointer', fontFamily: 'inherit',
              opacity: hidden[name] ? 0.4 : 1, transition: 'all .15s'
            }}
          >
            <span style={{ width: 14, height: 14, borderRadius: 3, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: hidden[name] ? 'var(--text-muted)' : 'var(--text)' }}>{name}</span>
          </button>
        ))}
        <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.5 }}>
          Higher = more advantageous.<br/>
          Comparison for Autonomous<br/>Driving domain.
        </div>
      </div>
    </div>
  )
}

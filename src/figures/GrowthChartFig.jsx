import { useEffect, useRef, useState } from 'react'

const PUB_DATA = [
  { y: 2015, v: 838 }, { y: 2016, v: 824 }, { y: 2017, v: 1381 },
  { y: 2018, v: 1413 }, { y: 2019, v: 1865 }, { y: 2020, v: 3911 },
  { y: 2021, v: 3710 }, { y: 2022, v: 4277 }, { y: 2023, v: 5856 }, { y: 2024, v: 6261 },
]
const CIT_DATA = [
  { y: 2015, v: 13292 }, { y: 2016, v: 16464 }, { y: 2017, v: 19989 },
  { y: 2018, v: 25814 }, { y: 2019, v: 34279 }, { y: 2020, v: 47492 },
  { y: 2021, v: 68001 }, { y: 2022, v: 91450 }, { y: 2023, v: 120983 }, { y: 2024, v: 142158 },
]

function LineChart({ data, color, label, valueFormatter }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let start = null
    const dur = 1200
    const raf = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / dur, 1)
      setProgress(p)
      if (p < 1) requestAnimationFrame(raf)
    }
    const id = requestAnimationFrame(raf)
    return () => cancelAnimationFrame(id)
  }, [])

  const W = 300, H = 160, PL = 20, PR = 10, PT = 15, PB = 28
  const pw = W - PL - PR, ph = H - PT - PB
  const maxV = Math.max(...data.map(d => d.v))
  const minV = 0

  const toX = (i) => PL + (i / (data.length - 1)) * pw
  const toY = (v) => PT + ph - ((v - minV) / (maxV - minV)) * ph

  const drawnCount = Math.max(1, Math.round(progress * data.length))
  const drawnData = data.slice(0, drawnCount)

  const pathD = drawnData.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(d.v).toFixed(1)}`).join(' ')
  const areaD = pathD + ` L${toX(drawnCount - 1).toFixed(1)},${(PT + ph).toFixed(1)} L${PL},${(PT + ph).toFixed(1)} Z`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color, textAlign: 'center' }}>{label}</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {/* gridlines */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f}
            x1={PL} y1={PT + ph - f * ph}
            x2={PL + pw} y2={PT + ph - f * ph}
            stroke="rgba(0,0,0,0.08)" strokeWidth={1}
          />
        ))}
        {/* area */}
        <path d={areaD} fill={`url(#grad-${label})`} />
        {/* line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {/* x labels */}
        {data.map((d, i) => (
          i % 3 === 0 && (
            <text key={d.y} x={toX(i)} y={H - 4}
              textAnchor="middle" style={{ fontSize: 8, fill: 'var(--text-dim)', fontFamily: 'Inter,sans-serif' }}>
              {d.y}
            </text>
          )
        ))}
        {/* last value */}
        {drawnCount >= data.length && (
          <>
            <circle cx={toX(data.length - 1)} cy={toY(data[data.length - 1].v)} r={4} fill={color} />
            <text
              x={toX(data.length - 1) - 4} y={toY(data[data.length - 1].v) - 8}
              textAnchor="end"
              style={{ fontSize: 9, fill: color, fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>
              {valueFormatter(data[data.length - 1].v)}
            </text>
          </>
        )}
      </svg>
    </div>
  )
}

export default function GrowthChartFig() {
  return (
    <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 0, alignItems: 'center' }}>
      <LineChart data={PUB_DATA} color="var(--cyan)" label="Publications / year"
        valueFormatter={v => `${(v/1000).toFixed(1)}k`} />
      <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />
      <LineChart data={CIT_DATA} color="var(--purple)" label="Citations / year"
        valueFormatter={v => `${Math.round(v/1000)}k`} />
    </div>
  )
}

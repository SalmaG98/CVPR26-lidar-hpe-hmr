import { useState, useEffect, useRef } from 'react'

/**
 * Wall / facade projection at a fixed distance.
 *
 * RMB: interactive — beam count (32/64/128), V-FOV, H-FOV, pts/rev sliders.
 *   Active scan area is scaled proportionally: aW = canvas_w × (hFov/360),
 *   aH = canvas_h × (vFov/90), centred vertically.
 *
 * NRS: Lissajous / rosette trajectory — unchanged.
 */

// ── RMB ───────────────────────────────────────────────────────────────────────

function drawRMB(ctx, w, h, t, { numBeams, vFov, hFov, ptsPerRev }) {
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#020508'
  ctx.fillRect(0, 0, w, h)

  const pad = { l: 20, r: 10, t: 10, b: 28 }
  const pw  = w - pad.l - pad.r
  const ph  = h - pad.t - pad.b

  // Active area proportional to selected FOV
  const hFrac = hFov / 360
  const vFrac = vFov / 90    // 90° = maximum reference V-FOV
  const aW = pw * hFrac
  const aH = ph * vFrac
  const aX = pad.l
  const aY = pad.t + (ph - aH) / 2   // vertically centred

  // Faint full-canvas reference grid
  ctx.strokeStyle = 'rgba(6,182,212,0.025)'
  ctx.lineWidth = 0.5
  for (let i = 0; i <= 6; i++) {
    ctx.beginPath()
    ctx.moveTo(pad.l + (i / 6) * pw, pad.t)
    ctx.lineTo(pad.l + (i / 6) * pw, pad.t + ph)
    ctx.stroke()
  }
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath()
    ctx.moveTo(pad.l, pad.t + (i / 4) * ph)
    ctx.lineTo(pad.l + pw, pad.t + (i / 4) * ph)
    ctx.stroke()
  }

  // Active area border (dashed)
  ctx.strokeStyle = 'rgba(6,182,212,0.18)'
  ctx.lineWidth = 0.8
  ctx.setLineDash([3, 3])
  ctx.strokeRect(aX, aY, aW, aH)
  ctx.setLineDash([])

  // Sweep
  const sweepFrac = (t * 0.007) % 1.0
  const sweepX    = aX + sweepFrac * aW

  // Trailing glow
  const grd = ctx.createLinearGradient(Math.max(aX, sweepX - 55), 0, sweepX + 2, 0)
  grd.addColorStop(0, 'rgba(6,182,212,0)')
  grd.addColorStop(1, 'rgba(6,182,212,0.17)')
  ctx.fillStyle = grd
  ctx.fillRect(Math.max(aX, sweepX - 55), aY, Math.min(57, sweepX - aX), aH)

  // Beam guide lines
  for (let b = 0; b < numBeams; b++) {
    const y = aY + (b / Math.max(numBeams - 1, 1)) * aH
    ctx.beginPath(); ctx.moveTo(aX, y); ctx.lineTo(aX + aW, y)
    ctx.strokeStyle = 'rgba(6,182,212,0.06)'
    ctx.lineWidth = 0.5
    ctx.stroke()
  }

  // Dots — dot radius shrinks as beam count increases
  const dotR        = numBeams <= 32 ? 1.7 : numBeams <= 64 ? 1.1 : 0.7
  const dotsVisible = Math.max(6, Math.min(54, Math.round(54 * hFrac * ptsPerRev / 1024)))

  for (let b = 0; b < numBeams; b++) {
    const y = aY + (b / Math.max(numBeams - 1, 1)) * aH
    for (let d = 0; d < dotsVisible; d++) {
      const x = aX + (d / Math.max(dotsVisible - 1, 1)) * aW
      if (x > sweepX) continue
      const lag = sweepFrac - d / Math.max(dotsVisible - 1, 1)
      const age = Math.max(0.18, 1 - lag * 0.6)
      ctx.beginPath()
      ctx.arc(x, y, dotR, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(6,182,212,${age * 0.9})`
      ctx.fill()
    }
  }

  // Sweep line
  ctx.beginPath()
  ctx.moveTo(sweepX, aY)
  ctx.lineTo(sweepX, aY + aH)
  ctx.strokeStyle = 'rgba(6,182,212,0.75)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Derived angular resolutions
  const vAngRes = (vFov / Math.max(numBeams - 1, 1)).toFixed(2)
  const hAngRes = (360 / ptsPerRev).toFixed(3)

  ctx.font = '8.5px Inter,sans-serif'
  ctx.fillStyle = 'rgba(6,182,212,0.50)'
  ctx.textAlign = 'center'
  ctx.fillText(`← ${hFov}° H-FOV →`, aX + aW / 2, h - 15)
  ctx.fillText(`H: ${hAngRes}°/pt  ·  V: ${vAngRes}°/beam`, aX + aW / 2, h - 4)
  ctx.textAlign = 'left'

  // V-FOV side label (rotated)
  if (aH > 22) {
    ctx.save()
    ctx.translate(10, aY + aH / 2 + 3)
    ctx.rotate(-Math.PI / 2)
    ctx.fillStyle = 'rgba(6,182,212,0.38)'
    ctx.fillText(`${vFov}°`, 0, 0)
    ctx.restore()
  }
}

// ── NRS ───────────────────────────────────────────────────────────────────────

function drawNRS(ctx, w, h, t) {
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#020508'
  ctx.fillRect(0, 0, w, h)

  const cx = w / 2, cy = h / 2
  const rx = w * 0.42, ry = h * 0.40

  ctx.beginPath()
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(139,92,246,0.08)'
  ctx.lineWidth = 1
  ctx.stroke()

  const totalPts = 1400
  const pts = []
  for (let i = 0; i < totalPts; i++) {
    const s = (i / totalPts) * Math.PI * 20
    pts.push({
      x: cx + rx * Math.cos(s) * Math.cos(s * 0.51),
      y: cy + ry * Math.sin(s) * Math.cos(s * 0.51),
    })
  }

  const drawn = Math.floor(((t * 1.1) % totalPts))

  if (drawn > 1) {
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < drawn; i++) ctx.lineTo(pts[i].x, pts[i].y)
    ctx.strokeStyle = 'rgba(139,92,246,0.6)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  if (drawn < pts.length) {
    const p = pts[drawn]
    ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(139,92,246,0.3)'; ctx.fill()
    ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
    ctx.fillStyle = '#8b5cf6'; ctx.fill()
  }

  if (drawn > totalPts * 0.88) {
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
    ctx.strokeStyle = 'rgba(139,92,246,0.22)'
    ctx.lineWidth = 0.7
    ctx.stroke()
  }

  ctx.font = '9px Inter,sans-serif'
  ctx.fillStyle = 'rgba(139,92,246,0.5)'
  ctx.textAlign = 'center'
  ctx.fillText('Rosette / Lissajous trajectory (wall view)', cx, h - 3)
  ctx.textAlign = 'left'
}

// ── Canvas ────────────────────────────────────────────────────────────────────

function ScanCanvas({ type, t, rmbParams }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    if (type === 'rmb') drawRMB(ctx, c.width, c.height, t, rmbParams)
    else                drawNRS(ctx, c.width, c.height, t)
  })   // runs every render — animation tick drives constant redraws anyway

  return (
    <canvas ref={ref} width={360} height={210}
      style={{
        width: '100%', borderRadius: 8,
        background: '#020508', border: '1px solid var(--border)',
        display: 'block',
      }} />
  )
}

// ── Compact slider for RMB controls ──────────────────────────────────────────

function CtrlSlider({ label, value, min, max, step, onChange, display, hint }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 40, flexShrink: 0 }}>
          {label}
        </span>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--cyan)', cursor: 'pointer', height: 3 }}
        />
        <span style={{
          fontSize: 10, color: 'var(--cyan)', width: 58, textAlign: 'right',
          flexShrink: 0, fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace',
        }}>
          {display}
        </span>
      </div>
      {hint && (
        <div style={{ fontSize: 9, color: 'var(--text-dim)', paddingLeft: 45, marginTop: 1 }}>
          {hint}
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ScanPatternFig() {
  const tickRef = useRef(0)
  const [t, setT] = useState(0)

  // RMB interactive parameters
  const [numBeams,  setNumBeams]  = useState(32)
  const [vFov,      setVFov]      = useState(45)    // degrees, 10–90
  const [hFov,      setHFov]      = useState(360)   // degrees, 60–360
  const [ptsPerRev, setPtsPerRev] = useState(1024)  // pts/revolution

  useEffect(() => {
    let raf
    const loop = () => { tickRef.current++; setT(tickRef.current); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const vAngRes = (vFov  / Math.max(numBeams - 1, 1)).toFixed(2)
  const hAngRes = (360   / ptsPerRev).toFixed(3)
  const rmbParams = { numBeams, vFov, hFov, ptsPerRev }

  const cyan = 'var(--cyan)'
  const em   = 'var(--emerald)'

  return (
    <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 0, overflow: 'hidden' }}>

      {/* ── RMB ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>

        {/* Title */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: cyan }}>Rotating Multi-Beam (RMB)</span>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            Uniform concentric sweep — Ouster OS0/OS1, Velodyne
          </div>
        </div>

        {/* Canvas — overflows are clipped so controls always stay visible */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', borderRadius: 8 }}>
          <ScanCanvas type="rmb" t={t} rmbParams={rmbParams} />
        </div>

        {/* Controls — compact two-row strip, always below the canvas */}
        <div style={{
          flexShrink: 0,
          display: 'flex', flexDirection: 'column', gap: 4,
          background: 'var(--surface2)', borderRadius: 6, padding: '6px 10px',
          border: '1px solid var(--border)',
        }}>
          {/* Row 1: beam toggle buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>Beams</span>
            {[32, 64, 128].map(n => (
              <button key={n} onClick={() => setNumBeams(n)} style={{
                padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 11, fontWeight: 600, border: '1px solid',
                borderColor: numBeams === n ? 'var(--cyan)' : 'var(--border)',
                background: numBeams === n ? 'rgba(6,182,212,0.15)' : 'transparent',
                color: numBeams === n ? 'var(--cyan)' : 'var(--text-muted)',
                transition: 'all .12s',
              }}>{n}</button>
            ))}
            <span style={{ fontSize: 9.5, color: 'var(--text-dim)', marginLeft: 'auto' }}>
              V-res: {vAngRes}°/beam
            </span>
          </div>

          {/* Row 2: three sliders side by side */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <CtrlSlider label="V-FOV" value={vFov} min={10} max={90} step={5}
                onChange={setVFov} display={`${vFov}°`} hint={null} />
            </div>
            <div style={{ flex: 1 }}>
              <CtrlSlider label="H-FOV" value={hFov} min={60} max={360} step={30}
                onChange={setHFov} display={`${hFov}°`} hint={null} />
            </div>
            <div style={{ flex: 1 }}>
              <CtrlSlider label="H-res" value={ptsPerRev} min={512} max={2048} step={64}
                onChange={setPtsPerRev} display={`${ptsPerRev} p/r`} hint={null} />
            </div>
          </div>
        </div>

        {/* Reactive chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, flexShrink: 0 }}>
          {[
            [`${numBeams} beams`, cyan],
            [`${hFov}° H-FOV`, cyan],
            [`V-res ${vAngRes}°/beam`, em],
            [`H-res ${hAngRes}°/pt`, em],
          ].map(([l, c]) => (
            <span key={l} style={{
              fontSize: 11, padding: '2px 7px', borderRadius: 4,
              border: `1px solid ${c}40`, color: c, background: `${c}15`,
            }}>{l}</span>
          ))}
        </div>
      </div>

      <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch', flexShrink: 0 }} />

      {/* ── NRS (unchanged) ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#8b5cf6' }}>Non-Repetitive Scanning (NRS)</span>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            Rosette / Lissajous pattern — Livox MID-40/100
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <ScanCanvas type="nrs" t={t} rmbParams={null} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, flexShrink: 0 }}>
          {[['3 beams', '#8b5cf6'], ['98°×38° FOV', '#8b5cf6'], ['Denser over time', em]].map(([l, c]) => (
            <span key={l} style={{
              fontSize: 11, padding: '2px 7px', borderRadius: 4,
              border: `1px solid ${c}40`, color: c, background: `${c}15`,
            }}>{l}</span>
          ))}
        </div>
      </div>

    </div>
  )
}

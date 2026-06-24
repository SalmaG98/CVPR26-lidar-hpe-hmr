import { useState, useEffect, useRef, useCallback } from 'react'
import { Slide } from './S00_Intro.jsx'
import { loadSMPL, renderSMPL } from '../figures/smplLBS.js'

const ACC = '#3b82f6'

// Real beta semantics measured from the neutral SMPL model:
//  β₀  +2σ → height +0.20m, width +0.22m  → overall body size
//  β₁  +2σ → height +0.02m, width -0.01m  → tall-slim ↔ short-wide
//  β₂  +2σ → height +0.03m, width -0.04m  → depth / proportion
//  β₃-β₉  < ±0.006m on any axis           → fine-grained shape details
const BETA_LABELS = [
  { label: 'β₀  Body size',       hint: 'height +10cm, width +11cm per σ' },
  { label: 'β₁  Tall vs wide',    hint: '+σ → taller & narrower' },
  { label: 'β₂  Proportions',     hint: '+σ → slightly taller, slimmer' },
  { label: 'β₃  Shape detail',    hint: 'PCA component 4 (subtle)' },
  { label: 'β₄  Shape detail',    hint: 'PCA component 5 (subtle)' },
  { label: 'β₅  Shape detail',    hint: 'PCA component 6 (subtle)' },
  { label: 'β₆  Shape detail',    hint: 'PCA component 7 (subtle)' },
  { label: 'β₇  Shape detail',    hint: 'PCA component 8 (subtle)' },
  { label: 'β₈  Shape detail',    hint: 'PCA component 9 (subtle)' },
  { label: 'β₉  Shape detail',    hint: 'PCA component 10 (subtle)' },
]

// ─── Slider ───────────────────────────────────────────────────────────────────
function Slider({ label, hint, value, min, max, step = 0.01, onChange, color = '#3b82f6', fmt }) {
  const display = fmt ? fmt(value) : value.toFixed(2)
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 110, flexShrink: 0 }}>
          {label}
        </span>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: color, cursor: 'pointer', height: 4 }}
        />
        <span style={{
          fontSize: 10, color: 'var(--text-dim)', width: 38, textAlign: 'right',
          fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace',
        }}>
          {display}
        </span>
      </div>
      {hint && (
        <div style={{ fontSize: 9, color: 'var(--text-dim)', paddingLeft: 116, lineHeight: 1.2, marginTop: 1 }}>
          {hint}
        </div>
      )}
    </div>
  )
}

function SectionHeader({ children, color }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '.07em',
      textTransform: 'uppercase', color: color || 'var(--text-muted)',
      marginBottom: 6, marginTop: 2,
    }}>
      {children}
    </div>
  )
}

// ─── Canvas component ─────────────────────────────────────────────────────────
function SMPLCanvas({ smplRef, loaded, params, W, H }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!loaded || !smplRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const { betas, theta, yaw, pitch, tx, ty, tz } = params
    renderSMPL(ctx, W, H, smplRef.current, betas, theta, {
      globalYaw: yaw, globalPitch: pitch,
      tx, ty, tz,
      camZ: 3.2,
      meshColor: [55, 120, 210],
      drawSkeleton: true,
    })
  })  // run on every render (params change triggers re-render via useState)

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} width={W} height={H}
        style={{ width: W, height: H, display: 'block', borderRadius: 8 }} />
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface2)', borderRadius: 8,
          fontSize: 13, color: 'var(--text-muted)',
        }}>
          Loading SMPL model…
        </div>
      )}
    </div>
  )
}

// ─── Main slide ───────────────────────────────────────────────────────────────
export function SMPLExplorerSlide({ slideNum, total }) {
  const smplRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [loadErr, setLoadErr] = useState(null)

  // Root translation
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const [tz, setTz] = useState(0)

  // SMPL shape betas (10)
  const [betas, setBetas] = useState(Array(10).fill(0))
  const updateBeta = (i, v) => setBetas(b => { const nb = [...b]; nb[i] = v; return nb })

  // SMPL pose theta (key joints)
  const [theta, setTheta] = useState({
    spineX: 0, spineZ: 0,
    lArmZ:  0.28, rArmZ: -0.28,
    lArmX:  0,    rArmX:  0,
    lLegX:  0,    rLegX:  0,
    lKneeX: 0,    rKneeX: 0,
  })
  const updateTheta = (k, v) => setTheta(t => ({ ...t, [k]: v }))

  // Load SMPL binary data once
  useEffect(() => {
    loadSMPL()
      .then(data => { smplRef.current = data; setLoaded(true) })
      .catch(e => setLoadErr(e.message))
  }, [])

  const deg = r => `${(r * 180 / Math.PI).toFixed(0)}°`

  const params = { tx, ty, tz, yaw: 0, pitch: 0, betas, theta }

  return (
    <Slide
      section="Introduction" accent={ACC}
      title="SMPL — Skinned Multi-Person Linear Model"
      subtitle="Real mesh from SMPL_NEUTRAL.pkl · LBS computed in-browser · 6890 vertices · 13776 faces"
      refs={['Loper et al., SMPL: A Skinned Multi-Person Linear Model, SIGGRAPH Asia 2015']}
      slideNum={slideNum} total={total}
    >
      {loadErr && (
        <div style={{ color: '#ef4444', fontSize: 12, padding: 8 }}>
          Failed to load SMPL model: {loadErr}
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, gap: 14, minHeight: 0 }}>

        {/* ── Canvas ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', background: 'var(--surface3)', borderRadius: 10,
          border: '1px solid var(--border)', padding: 10, flexShrink: 0,
        }}>
          <SMPLCanvas smplRef={smplRef} loaded={loaded} params={params} W={310} H={420} />
          <div style={{
            marginTop: 6, fontSize: 10, color: 'var(--text-muted)',
            fontFamily: 'monospace', textAlign: 'center', lineHeight: 1.8,
          }}>
            {'M(θ,β) = W(T(β) + B'}
            <sub>P</sub>
            {'(θ) + B'}
            <sub>S</sub>
            {'(β), J(β), θ, 𝒲)'}
          </div>
          <div style={{ marginTop: 3, fontSize: 9, color: 'var(--text-dim)', textAlign: 'center' }}>
            SMPL_NEUTRAL · 10 shape PCA components used
          </div>
        </div>

        {/* ── Controls ── */}
        <div style={{ flex: 1, display: 'flex', gap: 10, minHeight: 0 }}>

          {/* Left controls column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', minHeight: 0 }}>

            {/* Root translation */}
            <div className="card" style={{ padding: '8px 12px' }}>
              <SectionHeader color="#06b6d4">Root translation + t</SectionHeader>
              <Slider label="t x" value={tx} min={-0.5} max={0.5} onChange={setTx} color="#06b6d4" />
              <Slider label="t y" value={ty} min={-0.5} max={0.5} onChange={setTy} color="#06b6d4" />
              <Slider label="t z" value={tz} min={-0.5} max={0.5} onChange={setTz} color="#06b6d4" />
            </div>

            {/* Shape betas */}
            <div className="card" style={{ padding: '8px 12px' }}>
              <SectionHeader color="#8b5cf6">
                Shape β — real SMPL PCA basis
              </SectionHeader>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 6, lineHeight: 1.4 }}>
                β₀ captures 75% of body shape variance in the SMPL dataset.
                All 10 components are independent PCA directions.
              </div>
              {BETA_LABELS.map(({ label, hint }, i) => (
                <Slider key={i} label={label} hint={hint} value={betas[i]}
                  min={-3} max={3} step={0.05}
                  onChange={v => updateBeta(i, v)} color="#8b5cf6" />
              ))}
            </div>
          </div>

          {/* Right controls column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', minHeight: 0 }}>

            {/* Pose theta */}
            <div className="card" style={{ padding: '8px 12px' }}>
              <SectionHeader color="#10b981">
                Pose θ — joint rotations (24 joints × 3D rotation)
              </SectionHeader>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 6, lineHeight: 1.4 }}>
                θ ∈ ℝ⁷² (axis-angle per joint). Controls shown for key joints.
              </div>
              {[
                ['Spine lateral',  'spineZ', -0.5,  0.5,  0.02, deg],
                ['Spine forward',  'spineX', -0.4,  0.6,  0.02, deg],
                ['L arm raise',    'lArmZ',  -0.2,  2.0,  0.02, deg],
                ['R arm raise',    'rArmZ',  -2.0,  0.2,  0.02, deg],
                ['L arm twist',    'lArmX',  -1.2,  1.2,  0.02, deg],
                ['R arm twist',    'rArmX',  -1.2,  1.2,  0.02, deg],
                ['L leg swing',    'lLegX',  -1.2,  0.6,  0.02, deg],
                ['R leg swing',    'rLegX',  -0.6,  1.2,  0.02, deg],
                ['L knee bend',    'lKneeX', -2.0,  0.0,  0.02, deg],
                ['R knee bend',    'rKneeX', -2.0,  0.0,  0.02, deg],
              ].map(([label, key, min, max, step, fmt]) => (
                <Slider key={key} label={label} value={theta[key]}
                  min={min} max={max} step={step}
                  onChange={v => updateTheta(key, v)} color="#10b981" fmt={fmt} />
              ))}
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setTx(0); setTy(0); setTz(0)
                setBetas(Array(10).fill(0))
                setTheta({
                  spineX: 0, spineZ: 0,
                  lArmZ: 0.28, rArmZ: -0.28,
                  lArmX: 0, rArmX: 0,
                  lLegX: 0, rLegX: 0,
                  lKneeX: 0, rKneeX: 0,
                })
              }}
              style={{
                padding: '6px 0', borderRadius: 6, border: '1px solid var(--border)',
                background: 'var(--surface2)', color: 'var(--text-muted)',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
              }}
            >
              Reset to T-pose
            </button>
          </div>
        </div>
      </div>
    </Slide>
  )
}

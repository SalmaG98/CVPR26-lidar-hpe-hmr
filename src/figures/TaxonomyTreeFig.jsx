/**
 * Survey Taxonomy Tree — border-left connector approach.
 * No position:absolute, no overflow:hidden clipping.
 */

const BORDER = '1px solid var(--border)'

function HConn({ w = 14 }) {
  return <div style={{ width: w, height: 1, background: 'var(--border)', flexShrink: 0 }} />
}

function VGroup({ children, rowPad = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderLeft: BORDER }}>
      {children.map((child, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: `${rowPad}px 0` }}>
          <HConn w={16} />
          {child}
        </div>
      ))}
    </div>
  )
}

function Leaf({ label, color }) {
  return (
    <div style={{
      padding: '3px 9px', borderRadius: 5, fontSize: 10.5,
      background: `color-mix(in srgb, ${color} 10%, var(--surface2))`,
      border: `1px solid ${color}30`,
      color: 'var(--text-muted)', whiteSpace: 'nowrap',
    }}>{label}</div>
  )
}

function Branch({ label, color, leaves }) {
  const multi = leaves.length > 1
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{
        padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
        background: `color-mix(in srgb, ${color} 15%, var(--surface3))`,
        border: `1px solid ${color}40`,
        color: 'var(--text)', whiteSpace: 'nowrap', flexShrink: 0,
      }}>{label}</div>
      <HConn w={8} />
      {multi
        ? <VGroup rowPad={3}>{leaves.map(l => <Leaf key={l} label={l} color={color} />)}</VGroup>
        : <Leaf label={leaves[0]} color={color} />}
    </div>
  )
}

function Section({ label, color, branches }) {
  const multi = branches.length > 1
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{
        padding: '6px 11px', borderRadius: 7, fontSize: 12, fontWeight: 700,
        background: `color-mix(in srgb, ${color} 18%, var(--surface3))`,
        border: `1px solid ${color}50`,
        color: 'var(--text)', whiteSpace: 'pre', textAlign: 'center',
        lineHeight: 1.3, flexShrink: 0,
      }}>{label}</div>
      <HConn w={8} />
      {multi
        ? <VGroup rowPad={4}>{branches.map((b, i) => <Branch key={i} {...b} />)}</VGroup>
        : <Branch {...branches[0]} />}
    </div>
  )
}

const SECTIONS = [
  {
    label: '3D HPE from\nLiDAR', color: '#10b981',
    branches: [
      { label: 'Supervised HPE', color: '#10b981',
        leaves: ['Sparsity-conscious Design', 'Transformers as Backbone', 'Supervision Beyond Pose', 'Learning from Synthetic Data'] },
      { label: 'Weakly-supervised HPE', color: '#06b6d4',
        leaves: ['Bridging the Annotation Gap', 'Bridging Modalities via Fusion'] },
      { label: 'Unsupervised HPE', color: '#8b5cf6',
        leaves: ['GC-KPL'] },
    ],
  },
  {
    label: '3D HMR from\nLiDAR', color: '#f59e0b',
    branches: [
      { label: 'LiDAR-only HMR', color: '#f59e0b',
        leaves: ['Sparse-to-Dense Reconstruction', 'Spatio-temporal Modeling', 'Distillation-based Prior'] },
      { label: 'Multi-modal HMR', color: '#ef4444',
        leaves: ['Calibration-free Fusion', 'LiDAR + IMU/RGB Fusion', 'Multi-modal Optimization'] },
    ],
  },
]

export default function TaxonomyTreeFig() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flex: 1, minHeight: 0, padding: '4px 8px', overflowX: 'auto',
    }}>
      {/* Root node */}
      <div style={{
        padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 800,
        background: 'color-mix(in srgb, var(--cyan) 18%, var(--surface3))',
        border: '2px solid color-mix(in srgb, var(--cyan) 50%, transparent)',
        color: 'var(--text)', textAlign: 'center', whiteSpace: 'nowrap', flexShrink: 0,
      }}>LiDAR-based<br/>3D HPE / HMR</div>

      {/* Root → backbone connector */}
      <HConn w={20} />

      {/* Backbone — border-left is the vertical line */}
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: BORDER }}>
        {SECTIONS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
            <HConn w={22} />
            <Section {...s} />
          </div>
        ))}
      </div>
    </div>
  )
}

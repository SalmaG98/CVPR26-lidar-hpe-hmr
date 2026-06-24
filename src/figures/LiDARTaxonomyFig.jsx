/**
 * LiDAR Sensor Taxonomy — border-left connector approach.
 * No position:absolute lines, no overflow:hidden clipping.
 * Each level uses borderLeft on a flex-column container as the
 * vertical connector; horizontal connectors are plain divs.
 */

const BORDER = '1px solid var(--border)'
const CONN_COLOR = 'var(--border)'

// ── Shared connector primitives ──────────────────────────────────────────────

function HConn({ w = 14 }) {
  return <div style={{ width: w, height: 1, background: CONN_COLOR, flexShrink: 0 }} />
}

function VGroup({ children, gap = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderLeft: BORDER }}>
      {children.map((child, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: `${gap}px 0` }}>
          <HConn w={14} />
          {child}
        </div>
      ))}
    </div>
  )
}

// ── Node types ───────────────────────────────────────────────────────────────

function Leaf({ label }) {
  return (
    <div style={{
      padding: '3px 9px', borderRadius: 5, fontSize: 11,
      background: 'var(--surface2)', border: BORDER,
      color: 'var(--text-muted)', whiteSpace: 'nowrap',
    }}>{label}</div>
  )
}

function SubBranch({ label, leaves }) {
  const multi = leaves.length > 1
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{
        padding: '3px 9px', borderRadius: 5, fontSize: 11, fontWeight: 600,
        background: 'var(--surface3)', border: BORDER,
        color: 'var(--text-muted)', whiteSpace: 'nowrap',
      }}>{label}</div>
      <HConn w={8} />
      {multi
        ? <VGroup gap={3}>{leaves.map(l => <Leaf key={l} label={l} />)}</VGroup>
        : <Leaf label={leaves[0]} />}
    </div>
  )
}

function CategoryBranch({ label, color, leaves, children: subBranches }) {
  const isLeaves = !!leaves
  const items = isLeaves ? leaves : subBranches
  const multi = items.length > 1

  const categoryLabel = (
    <div style={{
      padding: '5px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 700,
      background: `color-mix(in srgb, ${color} 18%, var(--surface3))`,
      border: `1px solid ${color}50`, color: 'var(--text)',
      whiteSpace: 'pre', textAlign: 'center', lineHeight: 1.4, flexShrink: 0,
    }}>{label}</div>
  )

  const renderItem = (item, i) =>
    isLeaves ? <Leaf key={i} label={item} /> : <SubBranch key={i} {...item} />

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {categoryLabel}
      <HConn w={8} />
      {multi
        ? <VGroup gap={3}>{items.map(renderItem)}</VGroup>
        : renderItem(items[0], 0)}
    </div>
  )
}

// ── Data ─────────────────────────────────────────────────────────────────────

const TREE = [
  {
    label: 'Scanning\nPattern', color: '#06b6d4',
    leaves: ['Non-Repetitive Scanning (NRS)', 'Rotating Multi-Beam (RMB)', 'Flash (no scanning)'],
  },
  {
    label: 'Beam Steering\nTechnology', color: '#8b5cf6',
    children: [
      { label: 'Mechanical',      leaves: ['Rotating/Oscillating Mirror', 'Rotating LiDAR Head'] },
      { label: 'Quasi-Solid-State', leaves: ['MEMS', 'Wedge (Risley) Prism'] },
      { label: 'Solid-State',     leaves: ['Optical Phased Array (OPA)'] },
    ],
  },
  {
    label: 'Sensing\nTechnology', color: '#f59e0b',
    leaves: ['Pulse (ToF)', 'AMCW (phase-shift ToF)', 'FMCW (velocity+distance)'],
  },
]

// ── Root ─────────────────────────────────────────────────────────────────────

export default function LiDARTaxonomyFig() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flex: 1, minHeight: 0, padding: '0 8px',
    }}>
      {/* Root node */}
      <div style={{
        padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 800,
        background: 'color-mix(in srgb, var(--cyan) 20%, var(--surface3))',
        border: '2px solid color-mix(in srgb, var(--cyan) 50%, transparent)',
        color: 'var(--text)', textAlign: 'center', whiteSpace: 'nowrap', flexShrink: 0,
      }}>LiDAR<br/>Categories</div>

      {/* Root → backbone connector */}
      <HConn w={20} />

      {/* Backbone — border-left is the vertical connector line */}
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: BORDER }}>
        {TREE.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '9px 0' }}>
            <HConn w={20} />
            <CategoryBranch {...t} />
          </div>
        ))}
      </div>
    </div>
  )
}

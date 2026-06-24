function Node({ label, color = 'var(--surface3)', textColor = 'var(--text)', size = 'md', bold = false }) {
  const s = size === 'sm' ? { fontSize: 11, padding: '3px 9px' }
          : size === 'lg' ? { fontSize: 14, padding: '7px 14px' }
          : { fontSize: 12, padding: '5px 11px' }
  return (
    <div style={{
      background: color, border: '1px solid rgba(0,0,0,0.12)',
      borderRadius: 7, ...s, color: textColor,
      fontWeight: bold ? 700 : 500, whiteSpace: 'nowrap',
      fontFamily: 'Inter,sans-serif', lineHeight: 1.3, textAlign: 'center'
    }}>
      {label}
    </div>
  )
}

function Branch({ children, dir = 'h', gap = 8 }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: dir === 'h' ? 'row' : 'column',
      gap, alignItems: dir === 'h' ? 'center' : 'flex-start'
    }}>
      {children}
    </div>
  )
}

function Connector({ dir = 'h' }) {
  if (dir === 'h') return <div style={{ width: 20, height: 1, background: 'var(--border)', flexShrink: 0 }} />
  return <div style={{ width: 1, height: 12, background: 'var(--border)', marginLeft: 16 }} />
}

function VBranch({ parent, children, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {parent}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginLeft: 0, position: 'relative' }}>
        {children.map((child, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 24, height: i === 0 ? 1 : 1, background: 'var(--border)', flexShrink: 0,
              borderTop: i === 0 ? '1px solid var(--border)' : 'none',
              position: 'relative'
            }}/>
            {child}
          </div>
        ))}
        {/* vertical connector bar */}
        <div style={{
          position: 'absolute', left: 0, top: 12, bottom: 12,
          width: 1, background: 'var(--border)'
        }}/>
      </div>
    </div>
  )
}

export default function SensorTaxonomyFig() {
  const col = (hex, alpha=0.18) => `color-mix(in srgb, ${hex} ${alpha*100}%, var(--surface3))`

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 0, padding: 8 }}>
      <svg viewBox="0 0 680 360" style={{ width: '100%', maxHeight: 320, overflow: 'visible' }}>
        <foreignObject x="0" y="0" width="680" height="360">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>

              {/* Root */}
              <div style={{ background: 'color-mix(in srgb,var(--cyan) 20%,var(--surface3))', border: '1px solid var(--cyan)40', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                Spatial<br/>Sensors
              </div>

              {/* vertical connector from root */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0, marginLeft: 0 }}>
                <div style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 1, background: 'var(--border)' }} />

                {/* Passive */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '6px 0' }}>
                  <div style={{ width: 24, height: 1, background: 'var(--border)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <div style={{ background: col('#8b5cf6'), border: '1px solid #8b5cf640', borderRadius: 7, padding: '5px 11px', fontSize: 12, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                      Passive
                    </div>
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', marginLeft: 0 }}>
                      <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'var(--border)' }} />
                      {['Camera', 'Stereo-vision'].map((l, i) => (
                        <div key={l} style={{ display: 'flex', alignItems: 'center', padding: '3px 0' }}>
                          <div style={{ width: 20, height: 1, background: 'var(--border)' }} />
                          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 9px', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '6px 0' }}>
                  <div style={{ width: 24, height: 1, background: 'var(--border)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <div style={{ background: col('#06b6d4'), border: '1px solid #06b6d440', borderRadius: 7, padding: '5px 11px', fontSize: 12, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                      Active
                    </div>
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', marginLeft: 0 }}>
                      <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'var(--border)' }} />
                      {[
                        ['Structured light', '#06b6d4'],
                        ['ToF Camera', '#06b6d4'],
                        ['Ultrasound', 'var(--text-dim)'],
                        ['RADAR', '#8b5cf6'],
                        ['LiDAR', '#06b6d4'],
                      ].map(([l, c]) => (
                        <div key={l} style={{ display: 'flex', alignItems: 'center', padding: '3px 0' }}>
                          <div style={{ width: 20, height: 1, background: 'var(--border)' }} />
                          <div style={{
                            background: l === 'LiDAR' ? 'color-mix(in srgb,var(--cyan) 18%,var(--surface2))' : 'var(--surface2)',
                            border: `1px solid ${l === 'LiDAR' ? 'var(--cyan)50' : 'var(--border)'}`,
                            borderRadius: 6, padding: '3px 9px', fontSize: 11,
                            color: l === 'LiDAR' ? 'var(--cyan)' : 'var(--text-muted)',
                            fontWeight: l === 'LiDAR' ? 700 : 400,
                            whiteSpace: 'nowrap'
                          }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  )
}

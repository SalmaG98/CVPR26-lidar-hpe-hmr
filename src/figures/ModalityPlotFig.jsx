const HPE = '#10b981'
const HMR = '#f59e0b'

/* Each cell: { hpe: [...], hmr: [...] } */
const CELLS = {
  sup_lidar:   { hpe: ['LidPose','LPFormer','VoxelKP','LiDAR-HMP','DAPT','UniPVU'],
                 hmr: ['LiDAR-HMR','NE-3D-HPE','LiDARCap','LiDARCapV2','LiveHPS','LiveHPS++'] },
  sup_both:    { hpe: ['MMVP','HUM3DIL'],
                 hmr: ['FreeCap','LiP','SMPLify-3D','PEAR-Proj'] },
  ws_lidar:    { hpe: [],  hmr: ['ReMP'] },
  ws_both:     { hpe: ['HPERL','WS-HPE','WS-Fusion','FusionPose','LiCamPose'],
                 hmr: ['SLOPER4D*','Human-M3*','HSC4D*','CIMI4D*'] },
  unsup_lidar: { hpe: ['GC-KPL'], hmr: [] },
}

const COLS = {
  sup:   { x: 66,  w: 218 },
  ws:    { x: 292, w: 205 },
  unsup: { x: 505, w: 130 },
}
const ROWS = {
  lidar: { y: 218, h: 165 },
  both:  { y: 38,  h: 170 },
}

function CellMethods({ cx, cy, hpe, hmr, cellW }) {
  // split the cell width: HPE on left, HMR on right (or centered if only one type)
  const hasHpe = hpe.length > 0
  const hasHmr = hmr.length > 0
  const hpeX = hasHpe && hasHmr ? cx - cellW * 0.22 : cx
  const hmrX = hasHpe && hasHmr ? cx + cellW * 0.22 : cx
  const lineH = 13

  return (
    <>
      {hpe.map((m, i) => (
        <text key={m} x={hpeX} y={cy - (hpe.length - 1) * lineH / 2 + i * lineH}
          textAnchor="middle" fontSize={10} fontWeight={600} fill={HPE} opacity={0.92}
          fontFamily="Inter,system-ui,sans-serif">{m}</text>
      ))}
      {hmr.map((m, i) => (
        <text key={m} x={hmrX} y={cy - (hmr.length - 1) * lineH / 2 + i * lineH}
          textAnchor="middle" fontSize={10} fontWeight={600} fill={HMR} opacity={0.92}
          fontFamily="Inter,system-ui,sans-serif">{m}</text>
      ))}
    </>
  )
}

export default function ModalityPlotFig() {
  const W = 660, H = 420

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: 380, fontFamily: 'Inter,system-ui,sans-serif' }}>

        {/* ── background cell fills ── */}
        {[
          { l:'sup',  r:'lidar', fill:'#3b82f622' },
          { l:'sup',  r:'both',  fill:'#3b82f61a' },
          { l:'ws',   r:'lidar', fill:'#8b5cf620' },
          { l:'ws',   r:'both',  fill:'#8b5cf61a' },
          { l:'unsup',r:'lidar', fill:'#06b6d415' },
        ].map(({ l, r, fill }) => {
          const col = COLS[l], row = ROWS[r]
          return <rect key={`${l}-${r}`} x={col.x} y={row.y} width={col.w} height={row.h} rx={4} fill={fill} />
        })}


        {/* ── axis labels ── */}
        <text x={175} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill="rgba(0,0,0,.55)">SUPERVISED</text>
        <text x={394} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill="rgba(0,0,0,.50)">WEAKLY-SUPERVISED</text>
        <text x={568} y={22} textAnchor="middle" fontSize={9}  fontWeight={700} fill="rgba(0,0,0,.40)">UNSUP.</text>

        <text x={28} y={125} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="rgba(0,0,0,.45)" transform="rotate(-90,28,125)">LiDAR + RGB/IMU</text>
        <text x={28} y={300} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="rgba(0,0,0,.45)" transform="rotate(-90,28,300)">LiDAR only</text>

        {/* axis arrows */}
        <line x1={60} y1={H-32} x2={W-8} y2={H-32} stroke="rgba(0,0,0,.22)" strokeWidth={1.5}/>
        <polygon points={`${W-8},${H-35} ${W-8},${H-29} ${W-3},${H-32}`} fill="rgba(0,0,0,.22)"/>
        <text x={W-3} y={H-25} fontSize={8} fill="rgba(0,0,0,.35)">LEARNING</text>

        <line x1={60} y1={H-32} x2={60} y2={18} stroke="rgba(0,0,0,.22)" strokeWidth={1.5}/>
        <polygon points="57,18 63,18 60,14" fill="rgba(0,0,0,.22)"/>
        <text x={5} y={14} fontSize={8} fill="rgba(0,0,0,.35)">MODALITY</text>

        {/* ── method names ── */}
        <CellMethods
          cx={COLS.sup.x + COLS.sup.w / 2} cy={ROWS.lidar.y + ROWS.lidar.h / 2}
          cellW={COLS.sup.w} {...CELLS.sup_lidar} />
        <CellMethods
          cx={COLS.sup.x + COLS.sup.w / 2} cy={ROWS.both.y + ROWS.both.h / 2}
          cellW={COLS.sup.w} {...CELLS.sup_both} />
        <CellMethods
          cx={COLS.ws.x + COLS.ws.w / 2} cy={ROWS.lidar.y + ROWS.lidar.h / 2}
          cellW={COLS.ws.w} {...CELLS.ws_lidar} />
        <CellMethods
          cx={COLS.ws.x + COLS.ws.w / 2} cy={ROWS.both.y + ROWS.both.h / 2}
          cellW={COLS.ws.w} {...CELLS.ws_both} />
        <CellMethods
          cx={COLS.unsup.x + COLS.unsup.w / 2} cy={ROWS.lidar.y + ROWS.lidar.h / 2}
          cellW={COLS.unsup.w} {...CELLS.unsup_lidar} />

        {/* ── legend ── */}
        <rect x={420} y={H - 30} width={9} height={9} rx={2} fill={HPE}/>
        <text x={433} y={H - 23} fontSize={10} fill={HPE} fontWeight={600}>HPE methods</text>
        <rect x={520} y={H - 30} width={9} height={9} rx={2} fill={HMR}/>
        <text x={533} y={H - 23} fontSize={10} fill={HMR} fontWeight={600}>HMR methods</text>
        <text x={66}  y={H - 23} fontSize={8.5} fill="rgba(0,0,0,.35)" fontStyle="italic">* dataset annotation pipeline only</text>
      </svg>
    </div>
  )
}

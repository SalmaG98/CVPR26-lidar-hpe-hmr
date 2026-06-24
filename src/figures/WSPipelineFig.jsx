/* Native recreation of the weakly-supervised HPE pipeline figure */
export default function WSPipelineFig() {
  const BOX = ({ x, y, w, h, label, sub, color = 'var(--surface3)', border = 'var(--border)', dashed = false, textColor = 'var(--text)' }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={color}
        stroke={border}
        strokeWidth={1.5}
        strokeDasharray={dashed ? '6,3' : 'none'}
      />
      <text x={x + w / 2} y={y + h / 2 - (sub ? 7 : 0)}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={12} fontWeight={600} fill={textColor} fontFamily="Inter,system-ui,sans-serif">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 9}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={10} fontWeight={400} fill="var(--text-muted)" fontFamily="Inter,system-ui,sans-serif">
          {sub}
        </text>
      )}
    </g>
  )

  const Arrow = ({ x1, y1, x2, y2, dashed = false, color = 'var(--text-dim)' }) => {
    const dx = x2 - x1, dy = y2 - y1
    const len = Math.sqrt(dx * dx + dy * dy)
    const ux = dx / len, uy = dy / len
    const hx = x2 - ux * 10, hy = y2 - uy * 10
    const px = -uy * 5, py = ux * 5
    return (
      <g>
        <line x1={x1} y1={y1} x2={hx} y2={hy}
          stroke={color} strokeWidth={1.5}
          strokeDasharray={dashed ? '5,3' : 'none'} />
        <polygon points={`${x2},${y2} ${hx + px},${hy + py} ${hx - px},${hy - py}`}
          fill={color} />
      </g>
    )
  }

  const Label = ({ x, y, text, color = 'var(--amber)', italic = false }) => (
    <text x={x} y={y} textAnchor="middle" fontSize={11}
      fontStyle={italic ? 'italic' : 'normal'}
      fontWeight={600} fill={color} fontFamily="Inter,system-ui,sans-serif">
      {text}
    </text>
  )

  const W = 720, H = 280

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxHeight: 260, fontFamily: 'Inter,system-ui,sans-serif' }}>

        {/* ── Input modalities (left column) ── */}
        {/* RGB image icon */}
        <rect x={14} y={55} width={72} height={52} rx={5} fill="#3b82f618" stroke="#3b82f640" strokeWidth={1.5}/>
        <text x={50} y={77} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">RGB</text>
        <text x={50} y={91} textAnchor="middle" fontSize={10} fill="var(--text-muted)">Image</text>

        {/* LiDAR point cloud icon */}
        <rect x={14} y={170} width={72} height={52} rx={5} fill="#06b6d418" stroke="#06b6d440" strokeWidth={1.5}/>
        <text x={50} y={192} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--cyan)">LiDAR</text>
        <text x={50} y={206} textAnchor="middle" fontSize={10} fill="var(--text-muted)">Point Cloud</text>

        {/* ── 2D Pose Estimator ── */}
        <BOX x={120} y={46} w={118} h={68} label="Off-the-shelf" sub="2D Pose Estimator"
          color="#3b82f618" border="#3b82f650" dashed={true} textColor="#3b82f6" />

        {/* ── 3D Feature Extractor ── */}
        <BOX x={120} y={160} w={118} h={68} label="3D Feature" sub="Extractor (F₃D)"
          color="#06b6d418" border="#06b6d450" dashed={false} textColor="var(--cyan)" />

        {/* ── Fusion network ── */}
        <BOX x={300} y={95} w={130} h={88} label="Fusion Network"
          color="#8b5cf618" border="#8b5cf650" dashed={true} />
        <text x={365} y={158} textAnchor="middle" fontSize={9.5} fill="var(--text-muted)" fontFamily="Inter,sans-serif">attention / dense layer /</text>
        <text x={365} y={170} textAnchor="middle" fontSize={9.5} fill="var(--text-muted)" fontFamily="Inter,sans-serif">transformer</text>

        {/* ── Output ── */}
        <BOX x={498} y={110} w={100} h={58} label="P̂₃D" sub="3D Poses"
          color="#10b98118" border="#10b98150" textColor="#10b981" />

        {/* ── Supervision signal (top) ── */}
        <BOX x={300} y={16} w={130} h={40} label="P₂D / F₂D" dashed={true}
          color="#f59e0b15" border="#f59e0b50" textColor="#f59e0b" />

        {/* ── Arrows ── */}
        {/* RGB → 2D estimator */}
        <Arrow x1={86} y1={81} x2={120} y2={81} />
        {/* LiDAR → 3D extractor */}
        <Arrow x1={86} y1={194} x2={120} y2={194} />
        {/* 2D estimator → P2D/F2D */}
        <Arrow x1={179} y1={80} x2={179} y2={56} color="#f59e0b" dashed={true} />
        <Arrow x1={238} y1={80} x2={300} y2={46} color="#f59e0b" dashed={true} />
        {/* P2D/F2D → Fusion */}
        <Arrow x1={365} y1={56} x2={365} y2={95} color="#f59e0b" />
        {/* 2D estimator → Fusion (direct) */}
        <Arrow x1={238} y1={80} x2={300} y2={120} color="#3b82f6" dashed={true} />
        {/* 3D extractor → Fusion */}
        <Arrow x1={238} y1={194} x2={300} y2={170} color="var(--cyan)" />
        {/* Fusion → Output */}
        <Arrow x1={430} y1={139} x2={498} y2={139} color="#10b981" />

        {/* ── Edge labels ── */}
        <Label x={265} y={55} text="P₂D" color="#f59e0b" />
        <Label x={262} y={112} text="F₂D" color="#3b82f6" italic={true} />
        <Label x={262} y={186} text="F₃D" color="var(--cyan)" />
        <Label x={464} y={132} text="P̂₃D" color="#10b981" />

        {/* ── Legend ── */}
        <rect x={14} y={240} width={12} height={3} fill="#8b5cf6" rx={1}/>
        <text x={30} y={246} fontSize={9.5} fill="var(--text-muted)">optional block</text>
        <rect x={110} y={238} width={14} height={1} fill="var(--text-dim)"/>
        <polygon points="124,238 124,242 128,240" fill="var(--text-dim)"/>
        <text x={133} y={246} fontSize={9.5} fill="var(--text-muted)">data flow</text>
        <rect x={200} y={238} width={14} height={1} fill="var(--text-dim)" strokeDasharray="4,2"/>
        <line x1={200} y1={240} x2={214} y2={240} stroke="var(--text-dim)" strokeWidth={1} strokeDasharray="4,2"/>
        <polygon points="214,238 214,242 218,240" fill="var(--text-dim)"/>
        <text x={223} y={246} fontSize={9.5} fill="var(--text-muted)">optional flow</text>

        {/* ── Supervision annotation ── */}
        <text x={365} y={10} textAnchor="middle" fontSize={9.5} fill="#f59e0b" fontWeight={600}>2D supervision signal</text>
        <text x={365} y={265} textAnchor="middle" fontSize={9.5} fill="var(--text-dim)" fontStyle="italic">
          GT annotations or pseudo-labels from off-the-shelf detectors (AlphaPose, ViTPose, OpenPose)
        </text>
      </svg>
    </div>
  )
}

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Skeleton definition ───────────────────────────────────────────────────────

const GT_JOINTS = [
  { id:0,  x:100, y:135 }, // pelvis
  { id:1,  x:82,  y:160 }, // l-hip
  { id:2,  x:118, y:160 }, // r-hip
  { id:3,  x:100, y:108 }, // spine
  { id:4,  x:70,  y:198 }, // l-knee
  { id:5,  x:130, y:198 }, // r-knee
  { id:6,  x:100, y:82  }, // neck
  { id:7,  x:63,  y:238 }, // l-ankle
  { id:8,  x:137, y:238 }, // r-ankle
  { id:9,  x:100, y:56  }, // head
  { id:10, x:68,  y:90  }, // l-shoulder
  { id:11, x:132, y:90  }, // r-shoulder
  { id:12, x:45,  y:132 }, // l-elbow
  { id:13, x:155, y:132 }, // r-elbow
  { id:14, x:30,  y:170 }, // l-wrist
  { id:15, x:170, y:170 }, // r-wrist
]

const PRED_OFFSETS = [
  { dx:8,  dy:-7  }, { dx:12, dy:9  }, { dx:-5, dy:8  },
  { dx:3,  dy:-11 }, { dx:14, dy:6  }, { dx:-8, dy:11 },
  { dx:6,  dy:-5  }, { dx:17, dy:9  }, { dx:-11,dy:6  },
  { dx:4,  dy:-8  }, { dx:10, dy:7  }, { dx:-7, dy:10 },
  { dx:13, dy:-5  }, { dx:-9, dy:8  }, { dx:15, dy:4  },
  { dx:-6, dy:13  },
]

const BONES = [
  [0,1],[0,2],[0,3],[1,4],[2,5],[3,6],[4,7],[5,8],
  [6,9],[6,10],[6,11],[10,12],[11,13],[12,14],[13,15],
]

const RAW_PRED = GT_JOINTS.map((j, i) => ({
  id: j.id, x: j.x + PRED_OFFSETS[i].dx, y: j.y + PRED_OFFSETS[i].dy,
}))

function Skeleton({ joints, color, opacity = 1, sw = 1.5 }) {
  return (
    <g opacity={opacity}>
      {BONES.map(([a,b]) => (
        <line key={`${a}-${b}`} x1={joints[a].x} y1={joints[a].y}
          x2={joints[b].x} y2={joints[b].y}
          stroke={color} strokeWidth={sw} strokeOpacity={0.75} />
      ))}
      {joints.map(j => <circle key={j.id} cx={j.x} cy={j.y} r={3} fill={color} fillOpacity={0.9}/>)}
    </g>
  )
}

// ── 2D Procrustes ─────────────────────────────────────────────────────────────

function procrustes2D(gtJ, prJ) {
  const n = gtJ.length
  const gtCx = gtJ.reduce((s,j)=>s+j.x,0)/n
  const gtCy = gtJ.reduce((s,j)=>s+j.y,0)/n
  const prCx = prJ.reduce((s,j)=>s+j.x,0)/n
  const prCy = prJ.reduce((s,j)=>s+j.y,0)/n

  const gtC = gtJ.map(j=>({x:j.x-gtCx, y:j.y-gtCy}))
  const prC = prJ.map(j=>({x:j.x-prCx, y:j.y-prCy}))

  const gtSc = Math.sqrt(gtC.reduce((s,j)=>s+j.x**2+j.y**2,0)/n)
  const prSc = Math.sqrt(prC.reduce((s,j)=>s+j.x**2+j.y**2,0)/n)
  const scale = gtSc / prSc

  const gtN = gtC.map(j=>({x:j.x/gtSc, y:j.y/gtSc}))
  const prN = prC.map(j=>({x:j.x/prSc, y:j.y/prSc}))

  let sc = 0, cc = 0
  for (let i=0;i<n;i++) {
    sc += gtN[i].x*prN[i].y - gtN[i].y*prN[i].x
    cc += gtN[i].x*prN[i].x + gtN[i].y*prN[i].y
  }
  const theta = Math.atan2(sc, cc)
  const cos = Math.cos(-theta), sin = Math.sin(-theta)

  return prJ.map((j,i) => {
    const cx = j.x-prCx, cy = j.y-prCy
    const sx = cx*scale, sy = cy*scale
    return { ...j, x: cos*sx - sin*sy + gtCx, y: sin*sx + cos*sy + gtCy }
  })
}

// ── Human body point cloud along skeleton ─────────────────────────────────────

function bodyCloud(joints, nPerBone = 7, jitter = 2.5) {
  const pts = []
  for (const [a,b] of BONES) {
    const ja = joints[a], jb = joints[b]
    for (let k = 0; k <= nPerBone; k++) {
      const t = k / nPerBone
      pts.push({
        x: ja.x + (jb.x-ja.x)*t + (Math.random()-.5)*jitter,
        y: ja.y + (jb.y-ja.y)*t + (Math.random()-.5)*jitter,
      })
    }
  }
  return pts
}

// ── MPJPE ─────────────────────────────────────────────────────────────────────

function MPJPEViz() {
  const [show, setShow] = useState(false)
  useEffect(()=>{ const t=setTimeout(()=>setShow(true),400); return()=>clearTimeout(t) },[])

  const errors = GT_JOINTS.map((j,i) => ({
    gtx:j.x, gty:j.y,
    px:RAW_PRED[i].x, py:RAW_PRED[i].y,
    err:Math.sqrt(PRED_OFFSETS[i].dx**2+PRED_OFFSETS[i].dy**2),
  }))
  const mpjpe = (errors.reduce((s,e)=>s+e.err,0)/errors.length).toFixed(1)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'center'}}>
      <svg viewBox="0 0 200 275" style={{width:185}}>
        <Skeleton joints={GT_JOINTS} color="#10b981" sw={2}/>
        <Skeleton joints={RAW_PRED}  color="#ef4444" sw={1.5} opacity={0.9}/>
        {show && errors.map((e,i)=>(
          <line key={i} x1={e.gtx} y1={e.gty} x2={e.px} y2={e.py}
            stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="3,2" strokeOpacity={0.85}/>
        ))}
        <rect x={4} y={256} width={10} height={3} fill="#10b981"/>
        <text x={18} y={260} fontSize={8.5} fill="var(--text-muted)">GT</text>
        <rect x={50} y={256} width={10} height={3} fill="#ef4444"/>
        <text x={64} y={260} fontSize={8.5} fill="var(--text-muted)">Prediction</text>
        <line x1={4} y1={270} x2={14} y2={270} stroke="#f59e0b" strokeDasharray="3,2" strokeWidth={1.2}/>
        <text x={18} y={273} fontSize={8.5} fill="var(--text-muted)">Joint error eᵢ</text>
      </svg>
      <div style={{textAlign:'center'}}>
        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:13,color:'var(--text-muted)'}}>
          MPJPE = <span style={{color:'#f59e0b',fontWeight:700}}>{mpjpe} mm</span>
        </div>
        <div style={{fontSize:10,color:'var(--text-dim)',marginTop:2}}>
          (1/N)·∑ ‖p̂ᵢ − pᵢ‖₂ · average over all joints
        </div>
      </div>
    </div>
  )
}

// ── PA-MPJPE — real Procrustes ────────────────────────────────────────────────

function PAMPJPEViz() {
  const [phase, setPhase] = useState('raw')  // 'raw' | 'aligning' | 'aligned'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('aligning'), 600)
    const t2 = setTimeout(() => setPhase('aligned'),  1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Raw prediction: shifted + slightly rotated + scaled global offset
  const globalDx = 28, globalDy = -18, globalAngle = 0.18, globalScale = 0.88
  const cos0 = Math.cos(globalAngle), sin0 = Math.sin(globalAngle)
  const cx0 = RAW_PRED.reduce((s,j)=>s+j.x,0)/RAW_PRED.length
  const cy0 = RAW_PRED.reduce((s,j)=>s+j.y,0)/RAW_PRED.length
  const rawGlobal = RAW_PRED.map(j => {
    const dx = (j.x-cx0)*globalScale, dy = (j.y-cy0)*globalScale
    return { ...j, x: cos0*dx - sin0*dy + cx0 + globalDx,
                    y: sin0*dx + cos0*dy + cy0 + globalDy }
  })

  // Procrustes-aligned prediction
  const aligned = procrustes2D(GT_JOINTS, rawGlobal)

  const displayPred = phase === 'raw' ? rawGlobal : aligned
  const residuals = aligned.map((j,i) => ({
    gtx: GT_JOINTS[i].x, gty: GT_JOINTS[i].y, px: j.x, py: j.y,
    err: Math.sqrt((j.x-GT_JOINTS[i].x)**2+(j.y-GT_JOINTS[i].y)**2),
  }))
  const paMpjpe = (residuals.reduce((s,e)=>s+e.err,0)/residuals.length).toFixed(1)
  const rawMpjpe = (rawGlobal.reduce((s,j,i)=>
    s+Math.sqrt((j.x-GT_JOINTS[i].x)**2+(j.y-GT_JOINTS[i].y)**2),0)/rawGlobal.length).toFixed(1)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'center'}}>
      <svg viewBox="0 0 200 280" style={{width:185}}>
        <Skeleton joints={GT_JOINTS}   color="#10b981" sw={2}/>
        <g style={{transition:'all 0.9s cubic-bezier(.4,0,.2,1)'}}>
          <Skeleton joints={displayPred} color="#3b82f6" sw={1.5} opacity={0.9}/>
        </g>
        {phase === 'aligned' && residuals.map((e,i) => (
          <line key={i} x1={e.gtx} y1={e.gty} x2={e.px} y2={e.py}
            stroke="#f59e0b" strokeWidth={1} strokeDasharray="3,2" strokeOpacity={0.7}/>
        ))}
        <text x={100} y={272} textAnchor="middle" fontSize={9.5}
          fill={phase==='aligned'?'#10b981':'#3b82f6'}>
          {phase==='raw' ? 'raw prediction (global offset)' :
           phase==='aligning' ? 'applying Procrustes Tr(·) …' :
           'after alignment: scale · rotate · translate'}
        </text>
      </svg>
      <div style={{textAlign:'center'}}>
        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:12,color:'var(--text-muted)',lineHeight:1.8}}>
          MPJPE = <span style={{color:'#ef4444'}}>{rawMpjpe} mm</span>
          {' → '}PA-MPJPE = <span style={{color:'#10b981',fontWeight:700}}>{paMpjpe} mm</span>
        </div>
        <div style={{fontSize:10,color:'var(--text-dim)',marginTop:2}}>
          Tr(·) = arg min similarity transform · removes global offset from score
        </div>
      </div>
    </div>
  )
}

// ── PCK ───────────────────────────────────────────────────────────────────────

function PCKViz() {
  const [delta, setDelta] = useState(50)
  const correct = GT_JOINTS.filter((_,i) => {
    const e = Math.sqrt(PRED_OFFSETS[i].dx**2+PRED_OFFSETS[i].dy**2)
    return e <= delta/3
  }).length

  return (
    <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'center'}}>
      <svg viewBox="0 0 200 268" style={{width:185}}>
        <Skeleton joints={GT_JOINTS} color="#10b981" sw={2}/>
        <Skeleton joints={RAW_PRED}  color="#ef4444" sw={1.5} opacity={0.9}/>
        {GT_JOINTS.map((j,i) => {
          const err = Math.sqrt(PRED_OFFSETS[i].dx**2+PRED_OFFSETS[i].dy**2)
          const ok = err <= delta/3
          return (
            <circle key={j.id} cx={j.x} cy={j.y} r={delta/3}
              fill={ok?'#10b98115':'#ef444415'}
              stroke={ok?'#10b981':'#ef4444'}
              strokeWidth={0.8} strokeOpacity={0.5}/>
          )
        })}
        <text x={4} y={265} fontSize={9} fill="var(--text-muted)">
          PCK@δ = {((correct/GT_JOINTS.length)*100).toFixed(0)}%  ({correct}/{GT_JOINTS.length} joints within δ)
        </text>
      </svg>
      <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:'center'}}>
        <input type="range" min={20} max={80} value={delta}
          onChange={e=>setDelta(+e.target.value)}
          style={{width:150,accentColor:'var(--cyan)'}}/>
        <div style={{fontSize:11,color:'var(--text-muted)'}}>δ = {delta} mm threshold</div>
      </div>
    </div>
  )
}

// ── Chamfer Distance — human body cloud ───────────────────────────────────────

const SEED = 42
function seededRand(seed) {
  let s = seed
  return () => { s = (s*1103515245+12345)&0x7fffffff; return s/0x7fffffff }
}

// Pre-generate point clouds with a fixed seed so they don't flicker
const rand1 = seededRand(SEED)
const rand2 = seededRand(SEED+1)
const bodyPtsR = BONES.flatMap(([a,b]) => {
  const ja=GT_JOINTS[a], jb=GT_JOINTS[b]
  return Array.from({length:7},(_,k)=>{
    const t=k/6
    return {x:ja.x+(jb.x-ja.x)*t+(rand1()-.5)*3, y:ja.y+(jb.y-ja.y)*t+(rand1()-.5)*3}
  })
})
// Q: same body but shifted, slightly scaled
const bodyPtsQ = BONES.flatMap(([a,b]) => {
  const dx=22, dy=-8, sc=0.92
  const cx=100, cy=130
  const ja={x:(GT_JOINTS[a].x-cx)*sc+cx+dx, y:(GT_JOINTS[a].y-cy)*sc+cy+dy}
  const jb={x:(GT_JOINTS[b].x-cx)*sc+cx+dx, y:(GT_JOINTS[b].y-cy)*sc+cy+dy}
  return Array.from({length:6},(_,k)=>{
    const t=k/5
    return {x:ja.x+(jb.x-ja.x)*t+(rand2()-.5)*3, y:ja.y+(jb.y-ja.y)*t+(rand2()-.5)*3}
  })
})

// Precompute per-point nearest distances for the distance value display
const _rqDist = bodyPtsR.reduce((s,r)=>{
  const d=bodyPtsQ.reduce((bd,q)=>Math.min(bd,Math.sqrt((q.x-r.x)**2+(q.y-r.y)**2)),Infinity)
  return s+d
},0)/bodyPtsR.length
const _qrDist = bodyPtsQ.reduce((s,q)=>{
  const d=bodyPtsR.reduce((bd,r)=>Math.min(bd,Math.sqrt((r.x-q.x)**2+(r.y-q.y)**2)),Infinity)
  return s+d
},0)/bodyPtsQ.length

// Per-source-point nearest index lookup (precomputed)
const _nnRtoQ = bodyPtsR.map(r =>
  bodyPtsQ.reduce((best,q,i)=>{
    const d=Math.sqrt((q.x-r.x)**2+(q.y-r.y)**2)
    return d<best.d?{i,d}:best
  },{i:0,d:Infinity})
)
const _nnQtoR = bodyPtsQ.map(q =>
  bodyPtsR.reduce((best,r,i)=>{
    const d=Math.sqrt((r.x-q.x)**2+(r.y-q.y)**2)
    return d<best.d?{i,d}:best
  },{i:0,d:Infinity})
)

function ChamferViz() {
  const [mode, setMode] = useState('sym')  // 'sym' | 'asym-rq'
  const [tick, setTick] = useState(0)
  const rafRef = useRef()
  const lastRef = useRef(0)

  // ~11 fps — slow enough to read each step
  useEffect(()=>{
    const loop = (t) => {
      if (t - lastRef.current >= 90) { lastRef.current = t; setTick(n=>n+1) }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  },[])

  // Animation sequence:
  //   SEARCH ticks: show faint lines to ALL target pts (evaluating candidates)
  //   NEAREST ticks: collapse to single bright line to nearest
  const SEARCH  = 9
  const NEAREST = 14
  const TPP     = SEARCH + NEAREST  // ticks per source point

  // sym mode: first sweep all R→Q, then all Q→R, repeat
  const fwdLen = bodyPtsR.length  // R→Q pass
  const bwdLen = bodyPtsQ.length  // Q→R pass

  let srcPts, tgtPts, nnLookup, ptIdx, localTick, isRtoQ

  if (mode === 'sym') {
    const total = (fwdLen + bwdLen) * TPP
    const t = tick % total
    if (t < fwdLen * TPP) {
      ptIdx = Math.floor(t / TPP);  localTick = t % TPP
      srcPts = bodyPtsR; tgtPts = bodyPtsQ; nnLookup = _nnRtoQ; isRtoQ = true
    } else {
      const bt = t - fwdLen * TPP
      ptIdx = Math.floor(bt / TPP); localTick = bt % TPP
      srcPts = bodyPtsQ; tgtPts = bodyPtsR; nnLookup = _nnQtoR; isRtoQ = false
    }
  } else {
    // asym-rq: R→Q (GT mesh → Pred cloud)
    const total = fwdLen * TPP
    const t = tick % total
    ptIdx = Math.floor(t / TPP); localTick = t % TPP
    srcPts = bodyPtsR; tgtPts = bodyPtsQ; nnLookup = _nnRtoQ; isRtoQ = true
  }

  const phase   = localTick < SEARCH ? 'search' : 'nearest'
  const safeIdx = ptIdx % srcPts.length
  const query   = srcPts[safeIdx]
  const nn      = nnLookup[safeIdx]   // {i, d}

  const srcIsR  = isRtoQ
  const symCD   = ((_rqDist + _qrDist) / 2).toFixed(1)
  const dirCD   = (isRtoQ ? _rqDist : _qrDist).toFixed(1)

  const dirLabel  = mode === 'sym'
    ? (isRtoQ ? 'R → Q  (GT → Pred)' : 'Q → R  (Pred → GT)')
    : 'R → Q  (GT mesh → Pred cloud)'

  return (
    <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'center'}}>
      <div style={{display:'flex',gap:4}}>
        {[['sym','Bidirectional'],['asym-rq','GT → Pred']].map(([v,label])=>(
          <button key={v} onClick={()=>{ setMode(v); setTick(0) }} style={{
            padding:'3px 9px', borderRadius:5, cursor:'pointer',
            fontFamily:'inherit', fontSize:10.5, border:'1px solid',
            borderColor:mode===v?'var(--accent)':'var(--border)',
            background:mode===v?'color-mix(in srgb,var(--accent) 15%,transparent)':'var(--surface2)',
            color:mode===v?'var(--accent)':'var(--text-muted)',
          }}>{label}</button>
        ))}
      </div>

      <svg viewBox="0 0 200 272" style={{width:190}}>
        {/* Direction label */}
        <text x={100} y={12} textAnchor="middle" fontSize={8} fill="var(--text-muted)"
          fontStyle="italic">{dirLabel}</text>

        {/* Legend */}
        <circle cx={28} cy={24} r={2.5} fill="#10b981"/>
        <text x={33} y={27} fontSize={7.5} fill="#10b981" fontWeight={600}>GT mesh (R)</text>
        <circle cx={118} cy={24} r={2.5} fill="#3b82f6"/>
        <text x={123} y={27} fontSize={7.5} fill="#3b82f6" fontWeight={600}>Pred cloud (Q)</text>

        {/* R points */}
        {bodyPtsR.map((p,i)=>{
          const isQuery  = srcIsR  && i === safeIdx
          const isNearest= !srcIsR && phase==='nearest' && i === nn.i
          return (
            <circle key={`r${i}`} cx={p.x+2} cy={p.y+16} r={isQuery||isNearest?3.2:2}
              fill="#10b981" opacity={isQuery||isNearest?1:0.38}/>
          )
        })}

        {/* Q points */}
        {bodyPtsQ.map((p,i)=>{
          const isQuery  = !srcIsR && i === safeIdx
          const isNearest= srcIsR  && phase==='nearest' && i === nn.i
          return (
            <circle key={`q${i}`} cx={p.x+2} cy={p.y+16} r={isQuery||isNearest?3.2:2}
              fill="#3b82f6" opacity={isQuery||isNearest?1:0.38}/>
          )
        })}

        {/* SEARCH phase: faint lines from query to every target point */}
        {phase === 'search' && tgtPts.map((p,i) => {
          const isNN = i === nn.i
          return (
            <line key={i}
              x1={query.x+2} y1={query.y+16}
              x2={p.x+2}     y2={p.y+16}
              stroke={isNN ? '#f59e0b' : 'var(--text-dim)'}
              strokeWidth={isNN ? 1 : 0.5}
              strokeOpacity={isNN ? 0.55 : 0.28}
              strokeDasharray="2,2"/>
          )
        })}

        {/* NEAREST phase: single bright line to nearest */}
        {phase === 'nearest' && (
          <line
            x1={query.x+2} y1={query.y+16}
            x2={tgtPts[nn.i].x+2} y2={tgtPts[nn.i].y+16}
            stroke="#f59e0b" strokeWidth={1.8} strokeDasharray="3,2"/>
        )}

        {/* Query point ring */}
        <circle cx={query.x+2} cy={query.y+16} r={5.5} fill="none"
          stroke={srcIsR?'#10b981':'#3b82f6'} strokeWidth={1.5}/>

        {/* Nearest target ring */}
        {phase === 'nearest' && (
          <circle cx={tgtPts[nn.i].x+2} cy={tgtPts[nn.i].y+16} r={5.5} fill="none"
            stroke="#f59e0b" strokeWidth={1.5}/>
        )}

        {/* Status line */}
        <text x={100} y={265} textAnchor="middle" fontSize={8.5}
          fill={phase==='search'?'var(--text-dim)':'#f59e0b'}>
          {phase === 'search'
            ? `evaluating ${tgtPts.length} candidates…`
            : `nearest = ${nn.d.toFixed(1)} mm`}
        </text>
      </svg>

      <div style={{textAlign:'center',fontFamily:'JetBrains Mono,monospace',fontSize:11.5,color:'var(--text-muted)'}}>
        {mode === 'sym'
          ? <>CD = <span style={{color:'#f59e0b',fontWeight:700}}>{symCD} mm</span>
              <span style={{fontSize:10,fontFamily:'inherit'}}> (avg both passes)</span></>
          : <>CD(R→Q) = <span style={{color:'#f59e0b',fontWeight:700}}>{dirCD} mm</span>
              <span style={{fontSize:10,fontFamily:'inherit'}}> · GT→Pred</span></>}
      </div>
    </div>
  )
}

// ── Angular Error — SMPL joint rotation error ─────────────────────────────────

const JOINT_NAMES_SHORT = [
  'Pelvis','L Hip','R Hip','Spine1','L Knee','R Knee',
  'Neck','L Ankle','R Ankle','Head',
  'L Shld','R Shld','L Elbow','R Elbow','L Wrist','R Wrist',
]

// Simulated "GT" rotation angles (degrees) per joint
const GT_ANGLES = [0,-12,14,5,-25,28,3,15,-18,0,-45,40,-60,58,-10,8]
// Simulated pred rotation angles (GT + noise)
const PRED_ANGLE_OFFSETS = [4,-8,6,12,-7,9,5,13,-11,2,8,-10,15,-7,6,-14]

function AngularErrorViz() {
  const [selJoint, setSelJoint] = useState(4)  // L knee

  const gtAngle   = GT_ANGLES[selJoint]
  const predAngle = GT_ANGLES[selJoint] + PRED_ANGLE_OFFSETS[selJoint]
  const errAngle  = Math.abs(PRED_ANGLE_OFFSETS[selJoint])

  const toRad = d => d * Math.PI / 180
  const cx = 100, cy = 150, r = 48

  const drawArrow = (angleDeg, color, label) => {
    const a = toRad(-angleDeg)  // SVG y-down
    const x2 = cx + r * Math.sin(a)
    const y2 = cy - r * Math.cos(a)
    const lx = cx + (r+14) * Math.sin(a)
    const ly = cy - (r+14) * Math.cos(a)
    return (
      <g key={label}>
        <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={2.5}/>
        <circle cx={x2} cy={y2} r={3} fill={color}/>
        <text x={lx} y={ly+3} textAnchor="middle" fontSize={8.5} fill={color} fontWeight={600}>{label}</text>
      </g>
    )
  }

  // Arc showing error angle
  const a0 = toRad(-gtAngle), a1 = toRad(-predAngle)
  const x0 = cx + r * 0.6 * Math.sin(a0), y0 = cy - r * 0.6 * Math.cos(a0)
  const x1 = cx + r * 0.6 * Math.sin(a1), y1 = cy - r * 0.6 * Math.cos(a1)
  const largeArc = errAngle > 180 ? 1 : 0
  const sweep = (a1 - a0 + 2*Math.PI) % (2*Math.PI) < Math.PI ? 1 : 0

  return (
    <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
      {/* joint selector */}
      <div style={{display:'flex',flexDirection:'column',gap:2,maxHeight:280,overflowY:'auto'}}>
        {GT_JOINTS.map((j,i) => (
          <button key={i} onClick={()=>setSelJoint(i)} style={{
            padding:'2px 7px', borderRadius:4, cursor:'pointer', textAlign:'left',
            fontFamily:'inherit', fontSize:10, border:'1px solid',
            borderColor:selJoint===i?'var(--accent)':'var(--border)',
            background:selJoint===i?'color-mix(in srgb,var(--accent) 15%,transparent)':'transparent',
            color:selJoint===i?'var(--accent)':'var(--text-muted)',
            whiteSpace:'nowrap',
          }}>{JOINT_NAMES_SHORT[i]}</button>
        ))}
      </div>

      {/* viz */}
      <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'center',flex:1}}>
        {/* skeleton with highlighted joint */}
        <svg viewBox="0 0 200 265" style={{width:180}}>
          <Skeleton joints={GT_JOINTS}  color="#10b981" sw={1.5}/>
          <Skeleton joints={RAW_PRED}   color="#ef4444" sw={1} opacity={0.6}/>
          {/* highlighted joint */}
          <circle cx={GT_JOINTS[selJoint].x} cy={GT_JOINTS[selJoint].y}
            r={7} fill="none" stroke="#f59e0b" strokeWidth={2}/>
        </svg>

        {/* rotation dial */}
        <svg viewBox="0 0 200 210" style={{width:180}}>
          {/* reference circle */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={1} strokeDasharray="3,3"/>
          <line x1={cx} y1={cy-r} x2={cx} y2={cy+r} stroke="var(--border)" strokeWidth={0.5} strokeOpacity={0.5}/>
          <line x1={cx-r} y1={cy} x2={cx+r} y2={cy} stroke="var(--border)" strokeWidth={0.5} strokeOpacity={0.5}/>

          {/* error arc */}
          <path d={`M ${x0} ${y0} A ${r*0.6} ${r*0.6} 0 ${largeArc} ${sweep} ${x1} ${y1}`}
            fill="none" stroke="#f59e0b" strokeWidth={3} strokeLinecap="round"/>

          {drawArrow(gtAngle, '#10b981', 'GT')}
          {drawArrow(predAngle, '#ef4444', 'Pred')}

          <text x={cx} y={cy+r+20} textAnchor="middle" fontSize={10} fill="var(--text-muted)">
            {JOINT_NAMES_SHORT[selJoint]} joint rotation
          </text>
        </svg>

        <div style={{textAlign:'center',fontFamily:'JetBrains Mono,monospace',fontSize:12,color:'var(--text-muted)'}}>
          Angular err = <span style={{color:'#f59e0b',fontWeight:700}}>{errAngle}°</span>
        </div>
        <div style={{fontSize:10,color:'var(--text-dim)',textAlign:'center'}}>
          err = arccos( (tr(R_GT^T · R̂) − 1) / 2 ) — evaluates local pose quality
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

const TABS = ['MPJPE', 'PA-MPJPE', 'PCK', 'Chamfer Dist.', 'Angular Error']

export default function MetricsVizFig() {
  const [tab, setTab] = useState(0)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:10,flex:1,minHeight:0}}>
      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
        {TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)} style={{
            padding:'4px 12px', borderRadius:6, cursor:'pointer',
            fontFamily:'inherit', fontSize:12, fontWeight:600, border:'1px solid',
            borderColor:tab===i?'var(--accent)':'var(--border)',
            background:tab===i?'color-mix(in srgb,var(--accent) 18%,transparent)':'var(--surface2)',
            color:tab===i?'var(--accent)':'var(--text-muted)', transition:'all .15s',
          }}>{t}</button>
        ))}
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
        {tab===0 && <MPJPEViz      key="mpjpe"/>}
        {tab===1 && <PAMPJPEViz   key="pa"/>}
        {tab===2 && <PCKViz       key="pck"/>}
        {tab===3 && <ChamferViz   key="cd"/>}
        {tab===4 && <AngularErrorViz key="ang"/>}
      </div>
    </div>
  )
}

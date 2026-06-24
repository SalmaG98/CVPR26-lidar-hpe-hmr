import { Slide } from './S00_Intro.jsx'
import MetricsVizFig from '../figures/MetricsVizFig.jsx'

const ACC = '#ec4899'

/* S7.1 — Metrics introduction */
export function MetricsIntroSlide({ slideNum, total }) {
  return (
    <Slide section="§7 Benchmarks" accent={ACC}
      title="Evaluation Metrics Overview"
      subtitle="All metrics used across surveyed HPE and HMR methods — unified definitions"
      slideNum={slideNum} total={total}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div className="card" style={{ flex: 1 }}>
          <div className="h3">Metric categories</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
            {[
              { cat: 'Joint-based (HPE)', metrics: ['MPJPE', 'PA-MPJPE', 'PCK@δ', 'PEM', 'OKS'], c: '#10b981' },
              { cat: 'Mesh-based (HMR)', metrics: ['MPVPE', 'PA-MPVPE', 'MPERE', 'Angular Error'], c: '#f59e0b' },
              { cat: 'Temporal', metrics: ['ADE', 'Accel Err', 'LAE', 'LLE'], c: '#3b82f6' },
              { cat: 'Geometric', metrics: ['Chamfer Distance', 'SU-CD'], c: '#8b5cf6' },
            ].map(({ cat, metrics, c }) => (
              <div key={cat} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 4, borderRadius: 2, background: c, alignSelf: 'stretch', flexShrink: 0 }}/>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: c, marginBottom: 8 }}>{cat}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {metrics.map(m => <span key={m} style={{ fontSize: 14, padding: '4px 12px', borderRadius: 5, border: `1px solid ${c}40`, color: c, background: c + '15', fontWeight: 600 }}>{m}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S7.2 — MPJPE & PA-MPJPE interactive */
export function MPJPESlide({ slideNum, total }) {
  return (
    <Slide section="§7 Benchmarks" accent={ACC}
      title="Core Metrics: MPJPE & PA-MPJPE"
      subtitle="The two most widely used metrics — interactive visualization"
      refs={["Galaaoui et al. 2025, unified metric definitions (Sec. 7)"]}
      slideNum={slideNum} total={total}>
      <div className="two-col two-col-4060" style={{ flex: 1 }}>
        <div className="col">
          <div className="card">
            <div className="h3">MPJPE (Mean Per-Joint Position Error)</div>
            <div className="equation" style={{ margin: '8px 0' }}>
              MPJPE = (1/N) Σᵢ ‖ p̂ᵢ − pᵢ ‖₂
            </div>
            <ul className="bullet-list">
              <li><span>Evaluates global 3D pose accuracy in metric space (mm)</span></li>
              <li><span>Sensitive to global translation and rotation errors</span></li>
              <li><span>Also called G-MPJPE in global pose estimation context</span></li>
              <li><span>Temporal: averaged over all frames T</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">PA-MPJPE (Procrustes-Aligned)</div>
            <div className="equation" style={{ margin: '8px 0' }}>
              PA-MPJPE = (1/N) Σᵢ ‖ Tr(p̂ᵢ) − pᵢ ‖₂
            </div>
            <ul className="bullet-list">
              <li><span>Applies Procrustes alignment Tr(·): translation + rotation (± scale)</span></li>
              <li><span>Measures <em>pure pose</em> accuracy — removes global alignment errors</span></li>
              <li><span>Also called J Err(P) or J Err(PS) in some papers (SMPL-derived joints)</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Interpretation</div>
            <ul className="bullet-list">
              <li><span>MPJPE − PA-MPJPE gap → how much global positioning contributes to error</span></li>
              <li><span>For outdoor LiDAR: MPJPE more relevant (absolute position matters for AV safety)</span></li>
            </ul>
          </div>
        </div>
        <div className="col" style={{ alignItems: 'center' }}>
          <MetricsVizFig />
        </div>
      </div>
    </Slide>
  )
}

/* S7.3 — PCK & PEM & OKS */
export function PCKPEMSlide({ slideNum, total }) {
  return (
    <Slide section="§7 Benchmarks" accent={ACC}
      title="Threshold-based Metrics: PCK, PEM, OKS"
      refs={["WOD pose challenge, Sun et al. 2020"]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">PCK @ δ (Percentage of Correct Keypoints)</div>
            <div className="equation" style={{ margin: '8px 0' }}>
              PCK@δ = (100/N) Σᵢ 𝟙(‖ p̂ᵢ − pᵢ ‖₂ ≤ δ)
            </div>
            <ul className="bullet-list">
              <li><span>Measures the percentage of joints within distance δ from ground truth</span></li>
              <li><span>Common thresholds: δ = 30mm, 50mm, 100mm (absolute) or % of body size</span></li>
              <li><span>More intuitive than MPJPE — directly answers "how many joints are correct?"</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">PEM (Waymo-specific)</div>
            <div className="equation" style={{ margin: '8px 0', fontSize: 12 }}>
              PEM = (Σᵢ∈X ‖p̂ᵢ−pᵢ‖₂ + C·|Y|) / (|X| + |Y|)
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              X = matched keypoints, Y = unmatched (FP+FN), C = constant penalty.<br/>
              Penalizes both wrong predictions AND missed detections — designed for detection+estimation pipeline evaluation.
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">OKS (Object Keypoint Similarity)</div>
            <div className="equation" style={{ margin: '8px 0', fontSize: 12 }}>
              OKS = (1/N) Σᵢ exp(−‖p̂ᵢ−pᵢ‖₂² / 2s²kᵢ²)
            </div>
            <ul className="bullet-list">
              <li><span>kᵢ: per-joint constant (COCO) accounting for visibility and localization difficulty</span></li>
              <li><span>s: scale of the person (bounding box area)</span></li>
              <li><span>Ranges 0 to 1; higher = better alignment</span></li>
              <li><span><strong>OKS-AP:</strong> average precision over multiple OKS thresholds</span></li>
              <li><span><strong>OKS-Acc:</strong> fraction of keypoints above a fixed OKS threshold</span></li>
            </ul>
          </div>
          <div className="card card-accent">
            <div className="h3">When each metric is used</div>
            <table className="data-table" style={{ fontSize: 11 }}>
              <thead><tr><th>Metric</th><th>Dataset</th><th>Task</th></tr></thead>
              <tbody>
                {[['MPJPE','SLOPER4D, Human-M3','HPE/HMR'],['PA-MPJPE','SLOPER4D, Human-M3','HPE/HMR'],['PCK@50mm','Human-M3','HPE'],['PEM','WOD','HPE'],['OKS-AP','WOD','HPE'],].map(r=><tr key={r[0]}><td style={{color:ACC,fontWeight:700}}>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S7.4 — Mesh metrics */
export function MeshMetricsSlide({ slideNum, total }) {
  return (
    <Slide section="§7 Benchmarks" accent={ACC}
      title="Mesh Metrics: MPVPE, MPERE, Angular Error"
      subtitle="Evaluating full-body surface quality in Human Mesh Recovery"
      refs={["SMPL, Loper et al. 2023"]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">MPVPE (Mean Per-Vertex Position Error)</div>
            <div className="equation" style={{ margin: '8px 0' }}>
              MPVPE = (1/M) Σᵢ ‖ v̂ᵢ − vᵢ ‖₂
            </div>
            <ul className="bullet-list">
              <li><span>Mesh-level counterpart to MPJPE — evaluates all 6890 SMPL vertices</span></li>
              <li><span>Also called V Err(PST) when vertices are obtained from SMPL with pose+shape+translation</span></li>
              <li><span>PA-MPVPE: same after Procrustes alignment</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">MPERE (Mean Per-Edge Relative Error)</div>
            <div className="equation" style={{ margin: '8px 0' }}>
              MPERE = (1/E) Σᵢ |êᵢ − eᵢ| / eᵢ
            </div>
            <ul className="bullet-list">
              <li><span>Evaluates relative accuracy of mesh connectivity — important for non-parametric methods</span></li>
              <li><span>Useful for assessing short edge accuracy in densely connected regions</span></li>
              <li><span>Not affected by global translation</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">Angular Error</div>
            <div className="equation" style={{ margin: '8px 0', fontSize: 12 }}>
              Ang Err = (1/N) Σᵢ arccos((tr(Rᵢᵀ R̂ᵢ) − 1) / 2)
            </div>
            <ul className="bullet-list">
              <li><span>Measures distance between predicted and ground-truth rotation matrices</span></li>
              <li><span>Evaluates local pose accuracy (joint angle quality) independently of position</span></li>
              <li><span>Expressed in degrees or radians</span></li>
            </ul>
          </div>
          <div className="card card-accent">
            <div className="h3">Temporal & geometric metrics</div>
            <ul className="bullet-list">
              <li><span><strong>ADE:</strong> average trajectory error over time T</span></li>
              <li><span><strong>Accel Err:</strong> acceleration error — smoothness of predicted motion</span></li>
              <li><span><strong>LAE / LLE:</strong> limb angle / length errors — limb-level accuracy</span></li>
              <li><span><strong>CD:</strong> bidirectional Chamfer distance between predicted mesh and LiDAR cloud</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* ── Shared tag helpers ──────────────────────────────────────────────────── */
function SupTag({ v }) {
  const c = v === 'Sup.' ? '#10b981' : v === 'WS.' ? '#06b6d4' : '#8b5cf6'
  return (
    <span style={{
      display: 'inline-block', fontSize: 11, padding: '2px 8px', borderRadius: 4,
      border: `1px solid ${c}40`, color: c, background: c + '18', fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>{v}</span>
  )
}
function TaskTag({ v }) {
  const c = v === 'HPE' ? '#10b981' : v === 'HMR' ? '#f59e0b' : '#3b82f6'
  return (
    <span style={{
      display: 'inline-block', fontSize: 11, padding: '2px 8px', borderRadius: 4,
      border: `1px solid ${c}40`, color: c, background: c + '18', fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>{v}</span>
  )
}

function bestOf(rows, key) {
  const vals = rows.map(r => parseFloat(r[key])).filter(v => !isNaN(v))
  return vals.length ? Math.min(...vals).toFixed(1) : null
}
function bestOfMax(rows, key) {
  const vals = rows.map(r => parseFloat(r[key])).filter(v => !isNaN(v))
  return vals.length ? Math.max(...vals).toFixed(1) : null
}

/* S7.5 — Benchmark Results WOD */
export function BenchmarkWODSlide({ slideNum, total }) {
  const rows = [
    { m: 'HUM3DIL',      sup: 'Sup.', task: 'HPE', pem: '122.4', oks: '—'   },
    { m: 'LPFormer',     sup: 'Sup.', task: 'HPE', pem: '95.3',  oks: '—'   },
    { m: 'VoxelKP',      sup: 'Sup.', task: 'HPE', pem: '89.1',  oks: '—'   },
    { m: 'DAPT',         sup: 'Sup.', task: 'HPE', pem: '81.6',  oks: '—'   },
    { m: 'UniPVU-Human', sup: 'Sup.', task: 'HPE', pem: '78.4',  oks: '—'   },
    { m: 'LidPose',      sup: 'Sup.', task: 'HPE', pem: '—',     oks: '42.1' },
    { m: 'HPERL',        sup: 'WS.',  task: 'HPE', pem: '—',     oks: '33.2' },
    { m: 'FusionPose',   sup: 'WS.',  task: 'HPE', pem: '—',     oks: '—'   },
  ]
  const bestPem = bestOf(rows, 'pem')
  const bestOks = bestOfMax(rows, 'oks')
  return (
    <Slide section="§7 Benchmarks" accent={ACC}
      title="Benchmark: Waymo Open Dataset"
      subtitle="WOD validation — primary metric PEM↓ (also OKS-AP↑)"
      slideNum={slideNum} total={total}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="data-table" style={{ fontSize: 13 }}>
          <thead>
            <tr><th>Method</th><th>Sup.</th><th>Task</th><th>PEM↓</th><th>OKS-AP↑</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.m}>
                <td style={{ fontWeight: 700, color: ACC }}>{r.m}</td>
                <td><SupTag v={r.sup} /></td>
                <td><TaskTag v={r.task} /></td>
                <td className={r.pem !== '—' && r.pem === bestPem ? 'best' : ''}>{r.pem}</td>
                <td className={r.oks !== '—' && r.oks === bestOks ? 'best' : ''}>{r.oks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Slide>
  )
}

/* S7.6 — Benchmark SLOPER4D */
export function BenchmarkSLOPERSlide({ slideNum, total }) {
  const rows = [
    { m: 'LiDARCap',   sup: 'Sup.',   task: 'HMR', mpjpe: '135.3', mpvpe: '147.2' },
    { m: 'NE-3D-HPE',  sup: 'Sup.',   task: 'HMR', mpjpe: '108.6', mpvpe: '118.9' },
    { m: 'LiveHPS',    sup: 'Sup.',   task: 'HMR', mpjpe: '98.2',  mpvpe: '109.3' },
    { m: 'LiveHPS++',  sup: 'Sup.',   task: 'HMR', mpjpe: '91.5',  mpvpe: '103.1' },
    { m: 'WS-HPE',     sup: 'WS.',    task: 'HPE', mpjpe: '88.7',  mpvpe: '—'     },
    { m: 'GC-KPL',     sup: 'Unsup.', task: 'HPE', mpjpe: '95.2',  mpvpe: '—'     },
    { m: 'LiCamPose',  sup: 'WS.',    task: 'HPE', mpjpe: '72.4',  mpvpe: '—'     },
  ]
  const bestMpjpe = bestOf(rows, 'mpjpe')
  const bestMpvpe = bestOf(rows, 'mpvpe')
  return (
    <Slide section="§7 Benchmarks" accent={ACC}
      title="Benchmark: SLOPER4D"
      subtitle="MPJPE and MPVPE in mm — lower is better"
      slideNum={slideNum} total={total}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="data-table" style={{ fontSize: 13 }}>
          <thead>
            <tr><th>Method</th><th>Sup.</th><th>Task</th><th>MPJPE↓</th><th>MPVPE↓</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.m}>
                <td style={{ fontWeight: 700, color: '#8b5cf6' }}>{r.m}</td>
                <td><SupTag v={r.sup} /></td>
                <td><TaskTag v={r.task} /></td>
                <td className={r.mpjpe !== '—' && r.mpjpe === bestMpjpe ? 'best' : ''}>{r.mpjpe}</td>
                <td className={r.mpvpe !== '—' && r.mpvpe === bestMpvpe ? 'best' : ''}>{r.mpvpe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Slide>
  )
}

/* S7.7 — Benchmark Human-M3 */
export function BenchmarkHumanM3Slide({ slideNum, total }) {
  const rows = [
    { m: 'MMVP',       sup: 'Sup.', task: 'HPE', mpjpe: '82.1', mpvpe: '—'    },
    { m: 'LPFormer',   sup: 'Sup.', task: 'HPE', mpjpe: '68.4', mpvpe: '—'    },
    { m: 'LiDAR-HMR',  sup: 'Sup.', task: 'HMR', mpjpe: '74.2', mpvpe: '82.5' },
    { m: 'FusionPose', sup: 'WS.',  task: 'HPE', mpjpe: '71.8', mpvpe: '—'    },
    { m: 'LiCamPose',  sup: 'WS.',  task: 'HPE', mpjpe: '61.3', mpvpe: '—'    },
  ]
  const bestMpjpe = bestOf(rows, 'mpjpe')
  const bestMpvpe = bestOf(rows, 'mpvpe')
  return (
    <Slide section="§7 Benchmarks" accent={ACC}
      title="Benchmark: Human-M3"
      subtitle="MPJPE and MPVPE in mm — lower is better"
      slideNum={slideNum} total={total}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="data-table" style={{ fontSize: 13 }}>
          <thead>
            <tr><th>Method</th><th>Sup.</th><th>Task</th><th>MPJPE↓</th><th>MPVPE↓</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.m}>
                <td style={{ fontWeight: 700, color: '#10b981' }}>{r.m}</td>
                <td><SupTag v={r.sup} /></td>
                <td><TaskTag v={r.task} /></td>
                <td className={r.mpjpe !== '—' && r.mpjpe === bestMpjpe ? 'best' : ''}>{r.mpjpe}</td>
                <td className={r.mpvpe !== '—' && r.mpvpe === bestMpvpe ? 'best' : ''}>{r.mpvpe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Slide>
  )
}

/* S7.7 — Interactive metrics demo */
export function MetricsInteractiveSlide({ slideNum, total }) {
  return (
    <Slide section="§7 Benchmarks" accent={ACC}
      title="Metrics — Interactive Visualizer"
      subtitle="Click the tabs to see each metric in action"
      slideNum={slideNum} total={total}>
      <div style={{ flex: 1, display: 'flex', gap: 16 }}>
        <div style={{ flex: 2, minHeight: 0 }}>
          <MetricsVizFig />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="card card-accent">
            <div className="h3">MPJPE</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Euclidean distance per joint, averaged. <br/>Green = GT, Red = Prediction, Yellow = error vectors.</div>
          </div>
          <div className="card">
            <div className="h3">PA-MPJPE</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>After Procrustes alignment. Watch the prediction skeleton snap to the GT after alignment.</div>
          </div>
          <div className="card">
            <div className="h3">PCK @ δ</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Drag the slider to change threshold δ. Green circles = correct joints, red = incorrect.</div>
          </div>
          <div className="card">
            <div className="h3">Chamfer Distance</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Animated: for each point in set R (mesh), find nearest neighbor in set Q (LiDAR cloud).</div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

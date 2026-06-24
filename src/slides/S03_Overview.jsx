import { Slide } from './S00_Intro.jsx'
import TaxonomyTreeFig from '../figures/TaxonomyTreeFig.jsx'
import ModalityPlotFig from '../figures/ModalityPlotFig.jsx'

const ACC = '#06b6d4'

/* S3.1 — Survey Contributions */
export function SurveyContribsSlide({ slideNum, total }) {
  return (
    <Slide section="§3 Overview" accent={ACC}
      title="Survey Contributions"
      subtitle="A comprehensive review of 3D HPE and HMR from in-the-wild LiDAR point clouds"
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          {[
            { n: '1', t: 'Sensor taxonomy', d: 'Camera, LiDAR, RADAR — LiDAR subtypes by pattern, steering, sensing.' },
            { n: '2', t: 'Method taxonomy', d: '32 methods structured by design choices, strengths, limits.' },
            { n: '3', t: 'Extensive review', d: '32 studies (2019–2025): architecture, training, evaluation.' },
            { n: '4', t: 'Dataset descriptions', d: 'Waymo, SLOPER4D, Human-M3 — stats, diversity, density.' },
          ].map(({ n, t, d }) => (
            <div key={n} className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: ACC + '60', lineHeight: 1, flexShrink: 0 }}>0{n}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: ACC, marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="col">
          {[
            { n: '5', t: 'Unified metrics', d: 'MPJPE, PA-MPJPE, PCK, MPVPE, Chamfer formalised.' },
            { n: '6', t: 'Benchmarks', d: 'Fair comparison tables on WOD, SLOPER4D, Human-M3.' },
            { n: '7', t: 'Future directions', d: 'Data scarcity, domain adaptation, weakly-supervised HMR.' },
            { n: '8', t: 'Companion repository', d: 'github.com/valeoai/3D-Human-Pose-Shape-Estimation-from-LiDAR' },
          ].map(({ n, t, d }) => (
            <div key={n} className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: ACC + '60', lineHeight: 1, flexShrink: 0 }}>0{n}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: ACC, marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  )
}

/* S3.2 — Taxonomy tree */
export function TaxonomySlide({ slideNum, total }) {
  return (
    <Slide section="§3 Overview" accent={ACC}
      title="Systematic Taxonomy of Methods"
      subtitle="Classification derived from common trends across 32 surveyed methods"
      refs={["Galaaoui et al. 2025, LiDAR HPE/HMR Survey"]}
      slideNum={slideNum} total={total}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex' }}>
          <TaxonomyTreeFig />
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <div className="card" style={{ flex: 1, borderColor: '#10b98130' }}>
            <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginBottom: 4 }}>HPE Methods (17)</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>LidPose, LPFormer, VoxelKP, LiDAR-HMP, DAPT, UniPVU, MMVP, HUM3DIL, HPERL, WS-HPE, WS-Fusion, FusionPose, LiCamPose, SA-VR, GC-KPL, ReMP</div>
          </div>
          <div className="card" style={{ flex: 1, borderColor: '#f59e0b30' }}>
            <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, marginBottom: 4 }}>HMR Methods (15)</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>LiDAR-HMR, NE-3D-HPE, LiDARCap, LiveHPS, LiveHPS++, LiDARCapV2, FreeCap, SMPLify-3D, LiP, HmPEAR, SLOPER4D, Human-M3, HSC4D, CIMI4D</div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S3.3 — Methods summary table */
export function MethodsSummarySlide({ slideNum, total }) {
  const rows = [
    ['LidPose','2024','LiDAR','–','–','Sup.','✓ real-time','RMB/NRS'],
    ['LPFormer','2024','LiDAR','BEV+voxel','–','Sup.','–','RMB'],
    ['VoxelKP','2023','LiDAR','3D voxels','–','Sup.','–','RMB'],
    ['HUM3DIL','2022','LiDAR+RGB','depth','✓','Sup.','–','RMB'],
    ['MMVP','2023','LiDAR+RGB','voxels','–','Sup.','–','RMB/NRS'],
    ['DAPT','2025','LiDAR','–','–','Sup.','–','RMB'],
    ['HPERL','2021','LiDAR+RGB','BEV','–','Weak','–','RMB'],
    ['WS-HPE','2022','LiDAR+RGB','–','–','Weak','–','RMB'],
    ['FusionPose','2023','LiDAR+RGB','–','✓','Weak','–','RMB'],
    ['LiCamPose','2025','LiDAR+RGB','voxels','✓','Weak','–','NRS'],
    ['GC-KPL','2023','LiDAR','–','–','Unsup.','–','RMB'],
    ['LiDAR-HMR','2025','LiDAR','–','–','Sup.','–','RMB'],
    ['LiDARCap','2022','LiDAR','–','✓','Sup.','–','RMB'],
    ['LiveHPS','2024','LiDAR','–','✓','Sup.','✓','RMB'],
    ['ReMP','2025','LiDAR','–','–','Weak','–','RMB'],
    ['FreeCap','2025','LiDAR+RGB','–','✓','Sup.','–','RMB'],
  ]
  return (
    <Slide section="§3 Overview" accent={ACC}
      title="Methods at a Glance"
      subtitle="Selected methods — full table in the paper (Table 1)"
      slideNum={slideNum} total={total}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="data-table" style={{ fontSize: 11 }}>
          <thead>
            <tr>
              <th>Method</th><th>Year</th><th>Input</th><th>Aux repr.</th>
              <th>Temporal</th><th>Supervision</th><th>RT</th><th>LiDAR type</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r[0]}>
                <td style={{ fontWeight: 700, color: ACC }}>{r[0]}</td>
                {r.slice(1).map((c, i) => <td key={i}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Slide>
  )
}

/* S3.4 — Modality × Learning plot */
export function ModalityLearningSlide({ slideNum, total }) {
  return (
    <Slide section="§3 Overview" accent={ACC}
      title="Modality × Supervision Distribution"
      subtitle="Where methods cluster — and where gaps remain"
      refs={["Galaaoui et al. 2025, LiDAR HPE/HMR Survey (Fig. 4)"]}
      slideNum={slideNum} total={total}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <ModalityPlotFig />
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="card" style={{ flex: 1, borderColor: '#10b98130' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginBottom: 4 }}>Key observation 1</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>All WS-HPE methods use LiDAR + RGB — none LiDAR-only.</div>
          </div>
          <div className="card" style={{ flex: 1, borderColor: '#f59e0b30' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>Key observation 2</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>WS-HMR nearly unexplored — all HMR methods are fully supervised.</div>
          </div>
          <div className="card" style={{ flex: 1, borderColor: '#6366f130' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', marginBottom: 4 }}>Key observation 3</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Unsupervised LiDAR-only HPE: only GC-KPL exists.</div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S3.5a — Point-cloud backbones & representation */
export function ArchitecturesSlide({ slideNum, total }) {
  return (
    <Slide section="§3 Overview" accent={ACC}
      title="Architecture Landscape: Point-cloud Representations"
      subtitle="How methods encode the raw LiDAR input"
      slideNum={slideNum} total={total}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, flex: 1 }}>
        {[
          {
            t: 'PointNet / PointNet++', c: '#06b6d4',
            users: ['LiDARCap', 'LiveHPS', 'LiP', 'GC-KPL', 'ReMP', 'NE-3D-HPE'],
            desc: 'Permutation-invariant; most widely adopted for unordered point clouds.',
          },
          {
            t: 'Sparse 3D Voxels', c: '#8b5cf6',
            users: ['VoxelKP', 'LPFormer'],
            desc: 'Sparse 3D convolutions; LPFormer adds BEV for multi-scale features.',
          },
          {
            t: 'Range Image / 2D', c: '#f59e0b',
            users: ['LidPose'],
            desc: 'Spherical projection → 2D CNN/ViT; efficient for RMB sensors.',
          },
          {
            t: 'BEV (Bird\'s Eye View)', c: '#10b981',
            users: ['HPERL', 'LPFormer', 'SA-VR'],
            desc: 'Top-down 2D projection via PointPillars; fast for detection.',
          },
          {
            t: 'Volumetric Voxels', c: '#ef4444',
            users: ['MMVP', 'LiCamPose'],
            desc: 'Dense 3D grids fusing LiDAR + RGB heatmaps; natural multi-modal fusion.',
          },
          {
            t: 'Transformer (full scene)', c: '#3b82f6',
            users: ['DAPT', 'UniPVU-Human'],
            desc: 'PTv3 U-Net; global field, learnable joint anchors for varying density.',
          },
        ].map(({ t, c, users, desc }) => (
          <div key={t} className="card" style={{ borderColor: c + '40' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: c, marginBottom: 6 }}>{t}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 8 }}>{desc}</div>
            <div className="method-grid">
              {users.map(m => (
                <span key={m} className="method-chip" style={{ borderColor: c + '50', color: c, background: c + '12', fontSize: 10 }}>{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* S3.5b — Temporal modeling & SMPL integration */
export function ArchitecturesSMPLSlide({ slideNum, total }) {
  return (
    <Slide section="§3 Overview" accent={ACC}
      title="Architecture Landscape: Temporal Modeling & SMPL integration"
      subtitle="How methods handle motion sequences and produce mesh outputs"
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Temporal modeling</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {[
                { t: 'bi-GRU', u: 'LiDARCap, LiP, LiveHPS, HmPEAR', d: 'Bidirectional RNN; captures past and future frame context.' },
                { t: 'ST-GCN', u: 'LiDARCap, NE-3D-HPE, LiDARCapV2', d: 'Joint-to-joint and frame-to-frame graph convolutions.' },
                { t: 'Spatial + Temporal Transformer', u: 'LiDAR-HMP', d: 'Alternating intra-frame and inter-frame transformers.' },
                { t: 'Consecutive Pose Optimizer', u: 'LiveHPS, LiveHPS++', d: 'Joint attention over skeleton neighbors; enforces coherence.' },
              ].map(({ t, u, d }) => (
                <div key={t} style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 3, borderRadius: 2, background: ACC, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: ACC }}>{t} <span style={{ fontWeight: 400, color: 'var(--text-dim)', fontSize: 11 }}>— {u}</span></div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.35 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">SMPL integration strategies</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {[
                { t: 'IK Solver → ST-GCN → SMPL', u: 'LiDARCap, LiDARCapV2, LiveHPS, NE-3D-HPE', d: 'Keypoints → IK via ST-GCN → joint rotations → SMPL.' },
                // { t: 'Direct rotation regression', u: 'NE-3D-HPE', d: 'Directly regresses SMPL rotations; no separate IK stage.' },
                { t: 'Graphormer densification', u: 'LiDAR-HMR', d: 'Upsample coarse skeleton to 6890 mesh vertices via transformer.' },
                { t: 'Latent prior distillation', u: 'ReMP', d: 'PointNet → frozen Motion VAE latent → decode (θ, β, t).' },
                { t: 'L-BFGS optimisation', u: 'SLOPER4D, Human-M3, SMPLify-3D', d: 'Iterative SMPL fit to LiDAR + 2D; used in annotation pipelines.' },
              ].map(({ t, u, d }) => (
                <div key={t} style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 3, borderRadius: 2, background: '#f59e0b', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>{t} <span style={{ fontWeight: 400, color: 'var(--text-dim)', fontSize: 11 }}>— {u}</span></div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.35 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S3.6 — Synthetic data */
export function SyntheticDataSlide({ slideNum, total }) {
  return (
    <Slide section="§3 Overview" accent={ACC}
      title="Synthetic LiDAR Data Generation"
      subtitle="A key strategy for overcoming annotation scarcity"
      refs={["AMASS, Mahmood et al. 2019", "SMPL, Loper et al. 2023"]}
      slideNum={slideNum} total={total}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 10, minHeight: 0 }}>
        <div className="two-col two-col-4060" style={{ flex: 1, minHeight: 0 }}>
          <div className="col">
            <div className="card card-accent">
              <div className="h3">The pipeline</div>
              <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  'Sample SMPL (θ, β) from AMASS / CMU mocap',
                  'Generate 3D mesh M ∈ ℝ^{6890×3}',
                  'Simulate LiDAR scan via ray casting',
                  'Label points with SMPL part map; augment noise/occlusion',
                ].map((s, i) => (
                  <li key={i} style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    <span style={{ color: ACC, fontWeight: 700 }}>{i + 1}.</span> {s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="card">
              <div className="h3">Challenges</div>
              <ul className="bullet-list">
                <li><span><strong>Domain gap:</strong> AMASS indoor vs WOD/SLOPER4D outdoor</span></li>
                <li><span><strong>Realism gap:</strong> ray casting misses real noise and weather</span></li>
              </ul>
            </div>
          </div>
          <div className="col">
            <div className="fig-pdf" style={{ flex: 1, minHeight: 0 }}>
              <iframe src="figures/ray_casting_low_ior.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit&zoom=page-fit" title="Ray casting pipeline" />
            </div>
            <div className="fig-caption">Synthetic LiDAR via SMPL mesh ray casting</div>
          </div>
        </div>
        <div className="card" style={{ flexShrink: 0 }}>
          <div className="h3">Methods using synthetic pre-training</div>
          <div className="method-grid">
            {['DAPT','UniPVU-Human','GC-KPL','ReMP','LiCamPose'].map(m => (
              <span key={m} className="method-chip" style={{ borderColor: ACC + '60', color: ACC, background: ACC + '15' }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S3.7 — Pre-training strategy */
export function PretrainingSlide({ slideNum, total }) {
  return (
    <Slide section="§3 Overview" accent={ACC}
      title="Pre-training & Fine-tuning Strategy"
      subtitle="Two-stage training: synthetic pre-training → real-data fine-tuning"
      refs={["GC-KPL, Weng et al. 2023", "UniPVU, Xu et al. 2024", "ReMP, Jang et al. 2025"]}
      slideNum={slideNum} total={total}>
      <div className="two-col two-col-4060" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Stage 1 — Synthetic pre-training</div>
            <ul className="bullet-list">
              <li><span>Train on ray-cast SMPL + AMASS — no annotation cost</span></li>
              <li><span>Learns body structure and sparsity patterns</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Stage 2 — Real-data fine-tuning</div>
            <ul className="bullet-list">
              <li><span>Fine-tune with 1–10% of labelled real data</span></li>
              <li><span>Significantly outperforms training from scratch</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Methods using this strategy</div>
            <table className="data-table" style={{ fontSize: 11 }}>
              <thead><tr><th>Method</th><th>Pre-train source</th><th>Task</th></tr></thead>
              <tbody>
                {[['GC-KPL','Synthetic','HPE (unsup)'],['UniPVU','AMASS+synth','HPE'],['DAPT','SMPL+synth','HPE'],['ReMP','AMASS+CMU','HMR'],['LiCamPose','Synthetic NRS','HPE (WS)']].map(r=>(
                  <tr key={r[0]}><td style={{color:ACC,fontWeight:700}}>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col">
          <div className="fig-pdf" style={{ flex: 1, minHeight: 0 }}>
            <iframe src="figures/pretraining.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit&zoom=page-fit" title="Pre-training overview" />
          </div>
          <div className="fig-caption">Synthetic pre-training pipeline (GC-KPL, ReMP, UniPVU-Human)</div>
        </div>
      </div>
    </Slide>
  )
}

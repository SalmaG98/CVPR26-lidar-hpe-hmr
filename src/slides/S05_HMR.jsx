import { Slide } from './S00_Intro.jsx'

const ACC = '#f59e0b'

/* S5.1 — HMR categories */
export function HMRCategoriesSlide({ slideNum, total }) {
  return (
    <Slide section="§5 HMR from LiDAR" accent={ACC}
      title="3D HMR from LiDAR — Categories"
      subtitle="Going beyond joints to full-body mesh recovery"
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">LiDAR-only HMR</div>
            <ul className="bullet-list">
              <li><span>Output: SMPL (θ, β, t) parameters → 3D mesh</span></li>
              <li><span>Sub-types: sparse-to-dense, spatio-temporal, distillation prior</span></li>
            </ul>
            <div className="method-grid" style={{ marginTop: 8 }}>
              {['LiDAR-HMR','NE-3D-HPE','LiDARCap','LiDARCapV2','LiveHPS','LiveHPS++','ReMP'].map(m => (
                <span key={m} className="method-chip" style={{ borderColor: ACC + '50', color: ACC, background: ACC + '15', fontSize: 11 }}>{m}</span>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="h3">Common training pipeline</div>
            <ul className="bullet-list">
              <li><span>PointNet++ → bi-GRU → coarse keypoints → ST-GCN → SMPL solver</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">Multi-modal HMR</div>
            <ul className="bullet-list">
              <li><span>Combines LiDAR with RGB cameras and/or IMUs</span></li>
              <li><span>Paradigms: calibration-free, hierarchical fusion, optimization pipelines</span></li>
            </ul>
            <div className="method-grid" style={{ marginTop: 8 }}>
              {['FreeCap','SMPLify-3D','LiP','HmPEAR','SLOPER4D*','Human-M3*','HSC4D*','CIMI4D*'].map(m => (
                <span key={m} className="method-chip" style={{ borderColor: '#ef444450', color: '#ef4444', background: '#ef444415', fontSize: 11 }}>{m}</span>
              ))}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 6 }}>* dataset papers whose annotation pipeline performs HMR</div>
          </div>
          <div className="card card-accent">
            <div className="h3">Why HMR is harder from LiDAR</div>
            <ul className="bullet-list">
              <li><span>Sparse cloud → ambiguous mesh surface without shape priors</span></li>
              <li><span>Temporal coherence critical to avoid frame-to-frame jitter</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S5.2 — LiDAR-only HMR: sparse to dense */
export function SparseToDenseSlide({ slideNum, total }) {
  return (
    <Slide section="§5 HMR from LiDAR" accent={ACC}
      title="LiDAR-only HMR: Sparse-to-Dense Reconstruction"
      subtitle="LiDAR-HMR: cascaded pose estimation → dense mesh recovery"
      refs={["Fan et al. 3D Human Mesh Recovery from LiDAR. IEEE Trans. Multimedia 2025","Wu et al. Point Transformer V2. NeurIPS 2022","Lin et al. End-to-End Human Pose and Mesh Reconstruction with Transformers. CVPR 2021"]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">LiDAR-HMR (2025)</div>
            <ul className="bullet-list">
              <li><span><strong>Stage 1 — PRN:</strong> PointTransformerV2 + voting → sparse keypoints</span></li>
              <li><span><strong>Stage 2 — MRN:</strong> Graphormer iteratively densifies keypoints to full mesh</span></li>
              <li><span>Intermediate supervision at multiple mesh resolutions stabilises training</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Design intuition</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ padding: '6px 10px', borderRadius: 6, background: '#3b82f620', border: '1px solid #3b82f640', fontSize: 12, color: '#3b82f6', fontWeight: 700 }}>LiDAR point cloud</div>
                <div style={{ fontSize: 16, color: 'var(--text-dim)' }}>→</div>
                <div style={{ padding: '6px 10px', borderRadius: 6, background: ACC + '20', border: `1px solid ${ACC}40`, fontSize: 12, color: ACC, fontWeight: 700 }}>Sparse joints</div>
                <div style={{ fontSize: 16, color: 'var(--text-dim)' }}>→</div>
                <div style={{ padding: '6px 10px', borderRadius: 6, background: '#10b98120', border: '1px solid #10b98140', fontSize: 12, color: '#10b981', fontWeight: 700 }}>Dense mesh</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Solve sparse joints first, then condition mesh recovery on skeleton structure.
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">Graphormer for mesh recovery</div>
            <ul className="bullet-list">
              <li><span>Models joint-to-vertex and vertex-to-vertex relations via graph + mesh inputs</span></li>
              <li><span>Progressively upsamples from coarse to full mesh resolution</span></li>
            </ul>
          </div>
          <div className="card card-accent">
            <div className="h3">Challenge: coarse-to-fine misalignment</div>
            <ul className="bullet-list">
              <li><span>PRN errors propagate to MRN — cascade is sensitive to keypoint quality</span></li>
              <li><span>Independent PRN supervision decouples keypoint and mesh training</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S5.3 — Spatio-temporal HMR */
export function SpatioTemporalHMRSlide({ slideNum, total }) {
  return (
    <Slide section="§5 HMR from LiDAR" accent={ACC}
      title="LiDAR-only HMR: Spatio-temporal Modeling"
      subtitle="LiDARCap, NE-3D-HPE, LiveHPS: using temporal context for robust mesh recovery"
      refs={["Li et al. LiDARCap: Long-range Markerless 3D Human Motion Capture with LiDAR. CVPR 2022","Zhang et al. Neighborhood-Enhanced 3D Human Pose Estimation with Monocular LiDAR. AAAI 2024","Ren et al. LiveHPS: LiDAR-based Scene-level Human Pose and Shape Estimation. CVPR 2024","Ren et al. LiveHPS++: Robust and Coherent Motion Capture in Dynamic Free Environment. ECCV 2024"]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="method-card card" style={{ borderColor: ACC + '40' }}>
            <div className="method-name" style={{ color: ACC }}>LiDARCap (2022)</div>
            <ul className="bullet-list" style={{ marginTop: 4 }}>
              <li><span>PointNet++ per-frame → bi-GRU → coarse joints → IK Solver (ST-GCN) → SMPL mesh</span></li>
              <li><span>Multi-loss: keypoints + SMPL joints + body pose angles</span></li>
            </ul>
          </div>
          <div className="method-card card">
            <div className="method-name" style={{ color: '#06b6d4' }}>NE-3D-HPE (2024)</div>
            <ul className="bullet-list" style={{ marginTop: 4 }}>
              <li><span>Explicit context: Scanning Neighbors (3SN) + Background Neighbors (3BN)</span></li>
              <li><span>Coherence-Fuse attention + ST-CGN for joint rotation prediction</span></li>
            </ul>
          </div>
          <div className="method-card card" style={{ borderColor: '#ef444440' }}>
            <div className="method-name" style={{ color: '#ef4444' }}>LiDARCapV2 (2024)</div>
            <ul className="bullet-list" style={{ marginTop: 4 }}>
              <li><span>Extends LiDARCap for occlusion and human-object interaction</span></li>
              <li><span>AgNoiseSegment: noise-augmented segmentation for partial visibility</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="method-card card" style={{ borderColor: '#ec489940' }}>
            <div className="method-name" style={{ color: '#ec4899' }}>LiveHPS (2024)</div>
            <ul className="bullet-list" style={{ marginTop: 4 }}>
              <li><span>PointNet-GRU tracker + Vertex-guided Adaptive Distillation (KL divergence)</span></li>
              <li><span>Consecutive Pose Optimizer: joint attends to neighbors + temporal window</span></li>
            </ul>
          </div>
          <div className="method-card card" style={{ borderColor: '#6366f140' }}>
            <div className="method-name" style={{ color: '#6366f1' }}>LiveHPS++ (2024)</div>
            <ul className="bullet-list" style={{ marginTop: 4 }}>
              <li><span>Trajectory-guided Body Tracker for extreme noise and dynamic interactions</span></li>
              <li><span>Kinematic-aware Pose Optimizer refines candidates from prior timesteps</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S5.4 — Common HMR Pipeline */
export function CommonHMRPipelineSlide({ slideNum, total }) {
  return (
    <Slide section="§5 HMR from LiDAR" accent={ACC}
      title="Common LiDAR-based HMR Training Pipeline"
      refs={["Galaaoui et al. 2025, LiDAR HPE/HMR Survey (Fig. 3)"]}
      slideNum={slideNum} total={total}>
      <div className="two-col two-col-4060" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Pipeline stages</div>
            <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                ['Feature extraction', 'PointNet/PointNet++ per frame → F_3D(t)'],
                ['Temporal fusion', 'bi-GRU → F\'_3D(t) + global F_3D_global'],
                ['Modality fusion', 'If multi-modal: fuse RGB/IMU representations'],
                ['Coarse keypoints', 'MLP decoder → preliminary 3D joints P_3D(t)'],
                ['Pose optimizer', 'ST-GCN or attention → P_3D_refined(t)'],
                ['SMPL solver', 'IK / attention → (θ, β, t) → mesh'],
              ].map(([t, d], i) => (
                <li key={t} style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  <span style={{ color: ACC, fontWeight: 700 }}>{i+1}. {t}: </span>{d}
                </li>
              ))}
            </ol>
          </div>
          <div className="card">
            <div className="h3">Multi-loss supervision</div>
            <div className="equation">
              L = L_kpts + λ₁·L_smpl_joints<br/>+ λ₂·L_pose_angles + λ₃·L_shape
            </div>
          </div>
        </div>
        <div className="col">
          <div className="fig-pdf" style={{ flex: 1, minHeight: 0 }}>
            <iframe src="/figures/HMR_common_pipeline_reshaped.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit&zoom=page-fit" title="HMR pipeline" />
          </div>
          <div className="fig-caption">Common training pipeline for LiDAR-based HMR methods (from the paper)</div>
        </div>
      </div>
    </Slide>
  )
}

/* S5.5 — ReMP */
export function ReMPSlide({ slideNum, total }) {
  return (
    <Slide section="§5 HMR from LiDAR" accent={ACC}
      title="Distillation-based Latent Prior: ReMP"
      subtitle="Reusable Motion Prior — weak supervision via cross-modal distillation"
      refs={["Jang & Kim. Reusable Motion Prior for Multi-domain 3D Human Pose Estimation. WACV 2025","Mahmood et al. AMASS: Archive of Motion Capture as Surface Shapes. ICCV 2019"]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Key idea</div>
            <ul className="bullet-list">
              <li><span>Frozen motion prior (VAE on AMASS) distilled into a LiDAR encoder</span></li>
              <li><span>No real LiDAR labels needed; prior generalises across modalities</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Architecture</div>
            <ul className="bullet-list">
              <li><span>PointNet per-frame encoder aligned to frozen VAE latents via transformer</span></li>
              <li><span>Trained on synthetic LiDAR (ray-cast from CMU MoCap)</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">Training objective</div>
            <div className="equation" style={{ fontSize: 12 }}>
              L = L_pose + L_vel + L_trans + L_verts + L_joints + β·L_KL
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
              KL divergence aligns LiDAR features to motion prior latent distribution.
            </div>
          </div>
          <div className="card card-accent">
            <div className="h3">Key results</div>
            <ul className="bullet-list">
              <li><span>Strong synthetic-to-real generalisation</span></li>
              <li><span>Swap LiDAR → IMU → depth at inference, same decoder</span></li>
              <li><span>Only LiDAR HMR method with weakly-supervised-style training</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S5.6 — Multi-modal HMR */
export function MultimodalHMRSlide({ slideNum, total }) {
  return (
    <Slide section="§5 HMR from LiDAR" accent={ACC}
      title="Multi-modal HMR: Calibration-free Fusion"
      subtitle="FreeCap and SMPLify-3D: unconstrained environments, no fixed sensor setup"
      refs={["Xue et al. FreeCap: Hybrid Calibration-Free Motion Capture in Open Environments. AAAI 2025","Ren et al. LiP: Large-scale Human Motion Capture by Sparse Inertial and LiDAR Sensors. TVCG 2023"]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">FreeCap (2025)</div>
            <ul className="bullet-list">
              <li><span>Pose-aware cross-sensor matching via 2D+3D cosine similarity + Hungarian matching</span></li>
              <li><span>Sensor-expandable optimizer: per-modality self-attention + bidirectional cross-attention</span></li>
              <li><span>No pre-calibration between LiDAR and cameras</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">SMPLify-3D (2024)</div>
            <ul className="bullet-list">
              <li><span>Extends CLIFF image predictions using LiDAR as refinement signal</span></li>
              <li><span>ICP on backface-culled visible SMPL faces + Chamfer + reprojection losses</span></li>
            </ul>
          </div>
          <div className="card card-accent">
            <div className="h3">LiDAR + IMU: LiP</div>
            <ul className="bullet-list">
              <li><span>Single LiDAR + 4 sparse IMUs → full body MoCap</span></li>
              <li><span>Hierarchical IK integrates IMU readings; LiDAR corrects trajectory drift</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S5.7 — Optimization pipelines */
export function OptimizationPipelinesSlide({ slideNum, total }) {
  return (
    <Slide section="§5 HMR from LiDAR" accent={ACC}
      title="Multi-modal Optimization Pipelines"
      subtitle="Dataset annotation frameworks: SLOPER4D, HSC4D, CIMI4D, Human-M3"
      refs={["Dai et al. SLOPER4D: A Scene-Aware Dataset for Global 4D Human Pose Estimation. CVPR 2023","Dai et al. HSC4D: Human-centered 4D Scene Capture in Large-scale Space. CVPR 2022","Fan et al. Human-M3: A Multi-view Multi-modal Dataset for 3D HPE in Outdoor Scenes. CVPRW 2023"]}
      slideNum={slideNum} total={total}>
      <div className="two-col two-col-4060" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Common optimization pipeline</div>
            <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              {[
                'Synchronise and calibrate sensors (LiDAR, RGB, IMU)',
                '2D pose estimation on images → P_2D(t)',
                'IMU-based SMPL init → θ_init(t)',
                'LiDAR SLAM → 3D scene + trajectory',
                'Optimisation loop: 2D reprojection + Chamfer + VPoser prior + smoothness',
              ].map((s, i) => (
                <li key={i} style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <span style={{ color: ACC, fontWeight: 700 }}>{i+1}. </span>{s}
                </li>
              ))}
            </ol>
          </div>
          <div className="card">
            <div className="h3">Dataset annotations</div>
            <table className="data-table" style={{ fontSize: 11 }}>
              <thead><tr><th>Dataset</th><th>Sensors</th><th>Unique feature</th></tr></thead>
              <tbody>
                {[
                  ['HSC4D','LiDAR+IMU','Foot contact states, scene SLAM'],
                  ['SLOPER4D','LiDAR+IMU+RGB','Scene mesh + multi-modal sync'],
                  ['CIMI4D','LiDAR+IMU+RGB','Climbing activity, frame-sync'],
                  ['Human-M3','4×LiDAR+4×Camera','PointPillars detect + VPoser opt.'],
                ].map(r => <tr key={r[0]}><td style={{color:ACC,fontWeight:700}}>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col">
          <div className="fig-pdf" style={{ flex: 1, minHeight: 0 }}>
            <iframe src="/figures/Optimization_common_pipeline.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit&zoom=page-fit" title="Optimization pipeline" />
          </div>
          <div className="fig-caption">Common multi-modal optimization pipeline used by dataset annotation methods (from the paper)</div>
        </div>
      </div>
    </Slide>
  )
}

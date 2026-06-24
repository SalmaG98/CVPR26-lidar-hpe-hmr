import { Slide } from './S00_Intro.jsx'

const ACC = '#10b981'

/* S4.1 — HPE Categories */
export function HPECategoriesSlide({ slideNum, total }) {
  return (
    <Slide section="§4 HPE from LiDAR" accent={ACC}
      title="3D HPE from LiDAR — Categories"
      subtitle="Three learning paradigms based on supervision level"
      slideNum={slideNum} total={total}>
      <div style={{ display: 'flex', gap: 16, flex: 1 }}>
        {[
          {
            t: 'Supervised', n: '10 methods', c: '#10b981',
            desc: 'Full 3D pose annotations; state-of-the-art performance.',
            subs: ['Sparsity-conscious Design','Transformers as Backbone','Supervision Beyond Pose','Learning from Synthetic Data'],
            methods: ['LidPose','LPFormer','VoxelKP','LiDAR-HMP','DAPT','UniPVU','MMVP','HUM3DIL'],
          },
          {
            t: 'Weakly-supervised', n: '5 methods', c: '#06b6d4',
            desc: 'Only 2D keypoint annotations; all methods are multi-modal.',
            subs: ['Annotation Gap Bridging','Modality Fusion'],
            methods: ['HPERL','WS-HPE','WS-Fusion','FusionPose','LiCamPose'],
          },
          {
            t: 'Unsupervised', n: '1 method', c: '#8b5cf6',
            desc: 'No pose labels; relies on geometric priors and synthetic pre-training.',
            subs: ['Geometric Priors','Self-supervised Losses'],
            methods: ['GC-KPL'],
          },
        ].map(({ t, n, c, desc, subs, methods }) => (
          <div key={t} className="card" style={{ flex: 1, borderColor: c + '40', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: c }}>{t}</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{n}</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>Sub-categories</div>
              {subs.map(s => <div key={s} style={{ fontSize: 11, color: c, padding: '2px 0', borderLeft: `2px solid ${c}40`, paddingLeft: 8, marginBottom: 2 }}>{s}</div>)}
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>Methods</div>
              <div className="method-grid">
                {methods.map(m => <span key={m} className="method-chip" style={{ borderColor: c + '50', color: c, background: c + '15', fontSize: 11 }}>{m}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* S4.2 — Sparsity-conscious */
export function SparsityConsciousSlide({ slideNum, total }) {
  return (
    <Slide section="§4 HPE from LiDAR" accent={ACC}
      title="Supervised HPE: Sparsity-conscious Design"
      subtitle="Methods that explicitly confront LiDAR point cloud sparsity and irregularity"
      refs={[
        "Kovács et al. Real-Time 3D Human Pose Estimation in Sparse Lidar Point Clouds. Sensors 2024",
        "Ye et al. LiDAR Pose Estimation Transformer with Multi-Task Network. ICRA 2024",
        "Shi & Wonka. A Voxel-based Network for Human Keypoint Estimation in LiDAR. ICCV 2023",
        "Han et al. Towards Practical Human Motion Prediction with LiDAR Point Clouds. ACM MM 2024",
        "Zanfir et al. Semi-supervised Multi-modal 3D Human Pose Estimation for Autonomous Driving. CoRL 2022",
      ]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="method-card card-accent" style={{ borderColor: ACC + '40' }}>
            <div className="method-name" style={{ color: ACC }}>LidPose (2024)</div>
            <ul className="bullet-list" style={{ marginTop: 6 }}>
              <li><span>Range-image projection + Mixture-of-Gaussians foreground separation</span></li>
              <li><span>ViT-inspired transformer on multi-channel features; real-time capable</span></li>
            </ul>
          </div>
          <div className="method-card card">
            <div className="method-name" style={{ color: ACC }}>LPFormer (2024)</div>
            <ul className="bullet-list" style={{ marginTop: 6 }}>
              <li><span>Top-down: BEV + sparse-3D-voxel person detection</span></li>
              <li><span>Keypoint Transformer attends inside predicted 3D boxes</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="method-card card">
            <div className="method-name" style={{ color: ACC }}>VoxelKP (2023)</div>
            <ul className="bullet-list" style={{ marginTop: 6 }}>
              <li><span>End-to-end; sparse 3D convolutions; no prior bounding box</span></li>
              <li><span>Sparse-Selective-Kernel + Sparse-Box Attention for multi-scale features</span></li>
            </ul>
          </div>
          <div className="method-card card">
            <div className="method-name" style={{ color: ACC }}>LiDAR-HMP (2024)</div>
            <ul className="bullet-list" style={{ marginTop: 6 }}>
              <li><span>End-to-end motion forecasting from raw point cloud sequences</span></li>
              <li><span>STFormer (spatial) + TTFormer (temporal) feature pipeline</span></li>
            </ul>
          </div>
          <div className="method-card card">
            <div className="method-name" style={{ color: ACC }}>MMVP & HUM3DIL — fusion with RGB</div>
            <ul className="bullet-list" style={{ marginTop: 6 }}>
              <li><span>HUM3DIL: pixel-aligned RGB features projected onto LiDAR points</span></li>
              <li><span>MMVP: 2D heatmaps lifted to 3D fused with voxelised LiDAR</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S4.3 — DAPT & UniPVU */
export function DAPTUniPVUSlide({ slideNum, total }) {
  return (
    <Slide section="§4 HPE from LiDAR" accent={ACC}
      title="Supervised HPE: Density-aware & Pre-trained Transformers"
      subtitle="DAPT and UniPVU-Human: learning transferable human representations"
      refs={[
        "An et al. Pre-Training a Density-Aware Pose Transformer for Robust LiDAR-based 3D Human Pose Estimation. AAAI 2025",
        "Xu et al. A Unified Framework for Human-centric Point Cloud Video Understanding. CVPR 2024",
        "Wu et al. Point Transformer V3. CVPR 2024",
      ]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">DAPT — Density-Aware Pose Transformer (2025)</div>
            <ul className="bullet-list">
              <li><span>PTv3-based U-Net with learnable joint anchors across density levels</span></li>
              <li><span>Outputs 1D heatmaps per axis — avoids regression instability under sparsity</span></li>
              <li><span>Synthetic pre-training on SMPL + ray-cast pipeline</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">UniPVU-Human (2024)</div>
            <ul className="bullet-list">
              <li><span><strong>Stage 1 (synthetic):</strong> body part segmentation + inter-frame motion flow</span></li>
              <li><span><strong>Stage 2:</strong> spatio-temporal masking self-supervised learning on real data</span></li>
              <li><span>Injects geometric + temporal priors before downstream fine-tuning</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Common thread</div>
            <ul className="bullet-list">
              <li><span>Both learn from synthetic data first to address annotation bottleneck</span></li>
              <li><span>Both show strong improvement in low-data regimes</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S4.4 — Supervision beyond pose */
export function AuxiliarySupervisionSlide({ slideNum, total }) {
  return (
    <Slide section="§4 HPE from LiDAR" accent={ACC}
      title="Supervised HPE: Supervision Beyond Pose"
      subtitle="Auxiliary tasks that guide learning toward richer, more structured representations"
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Why auxiliary tasks?</div>
            <ul className="bullet-list">
              <li><span>Sparse keypoint supervision alone is insufficient for robust learning</span></li>
              <li><span>Auxiliary tasks provide dense signals; removed at inference</span></li>
            </ul>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { method: 'LPFormer', task: 'Body part segmentation', benefit: 'Robustness to occlusions' },
              { method: 'LiDAR-HMP', task: 'Future point cloud prediction', benefit: 'Forces motion dynamics learning' },
              { method: 'HUM3DIL', task: '2D keypoint reprojection', benefit: 'Multi-view constraint' },
              { method: 'DAPT', task: 'Part segmentation (synthetic)', benefit: 'Semantic grounding for sparse inputs' },
            ].map(({ method, task, benefit }) => (
              <div key={method} className="card" style={{ padding: '8px 10px' }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: ACC }}>{method}</div>
                <div style={{ fontSize: 11, color: 'var(--text)', marginTop: 2 }}>{task}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2, fontStyle: 'italic' }}>{benefit}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">Multi-task loss formulation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <div className="equation">
                L_total = L_pose + λ₁·L_seg + λ₂·L_aux
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                L_aux is method-specific: future point cloud, motion flow, or 2D projection loss.
              </div>
            </div>
          </div>
          <div className="card">
            <div className="h3">Projection-based 2D supervision</div>
            <ul className="bullet-list">
              <li><span>Project 3D predictions to image plane → compare with 2D annotations</span></li>
              <li><span>Bridges the gap between abundant 2D and scarce 3D labels</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S4.5 — WS overview */
export function WSHPEOverviewSlide({ slideNum, total }) {
  return (
    <Slide section="§4 HPE from LiDAR" accent={ACC}
      title="Weakly-supervised HPE: Overview"
      subtitle="Bypassing expensive 3D labels using 2D annotations and multi-modal cues"
      refs={[
        "Fürst et al. 3D Human Pose Estimation from RGB and LiDAR. ICPR 2021",
        "Zheng et al. Multi-Modal 3D Human Pose Estimation with 2D Weak Supervision in Autonomous Driving. CVPRW 2022",
        "Bauer et al. Weakly Supervised Multi-Modal 3D Human Body Pose Estimation for Autonomous Driving. IEEE IV 2023",
      ]}
      slideNum={slideNum} total={total}>
      <div className="two-col two-col-4060" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Core challenge</div>
            <ul className="bullet-list">
              <li><span>3D pose annotation is expensive and rare outdoors</span></li>
              <li><span>2D annotations are cheap; goal is to learn 3D from 2D guidance</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Weak supervision strategies</div>
            <ul className="bullet-list">
              <li><span><strong>Projection consistency:</strong> reproject 3D prediction → compare with 2D</span></li>
              <li><span><strong>Geometric constraints:</strong> bone length, symmetry, angle limits</span></li>
              <li><span><strong>Pseudo-labeling:</strong> generate 3D pseudo-labels from 2D</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Key observation</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              All WS methods are <span className="highlight">multi-modal</span> — they need RGB images to extract 2D pose cues. No WS method uses LiDAR alone.
            </div>
          </div>
        </div>
        <div className="col" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="fig-pdf" style={{ flex: 1, minHeight: 0 }}>
            <iframe
              src="figures/ws_pipeline.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit&zoom=page-fit"
              title="WS pipeline"
            />
          </div>
          <div className="fig-caption">
            Common WS pipeline: 2D pose cues (P₂D / F₂D) from off-the-shelf detectors fused with 3D LiDAR features → P̂₃D. Dashed = optional blocks.
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S4.6 — WS methods deep dive */
export function WSMethodsSlide({ slideNum, total }) {
  return (
    <Slide section="§4 HPE from LiDAR" accent={ACC}
      title="Weakly-supervised HPE: Methods"
      subtitle="From ground-truth 2D labels to fully pseudo-label-driven training"
      refs={[
        "Cong et al. Weakly Supervised 3D Multi-Person Pose Estimation for Large-Scale Scenes. AAAI 2023",
        "Pan et al. Combining Multi-View LiDAR and RGB Cameras for Robust 3D Human Pose Estimation. WACV 2025",
        "Fang et al. AlphaPose: Whole-Body Regional Multi-Person Pose Estimation. TPAMI 2022",
        "Xu et al. ViTPose: Simple Vision Transformer Baselines for Human Pose Estimation. NeurIPS 2022",
      ]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          {[
            {
              name: 'HPERL (2021)', c: '#3b82f6',
              desc: 'GT 2D annotations + LCRNet anchors. RoI-Align BEV+image fusion. VGG-16 backbone.'
            },
            {
              name: 'WS-HPE (2022)', c: '#06b6d4',
              desc: '3D pseudo-labels from GT 2D via nearest projected LiDAR points. PointNet + auxiliary segmentation.'
            },
            {
              name: 'WS-Fusion (2023)', c: '#8b5cf6',
              desc: 'Entirely pseudo-labels from AlphaPose. Dual-branch LiDAR + lifted-2D fused via dense layer.'
            },
          ].map(({ name, c, desc }) => (
            <div key={name} className="method-card card" style={{ borderColor: c + '40' }}>
              <div className="method-name" style={{ color: c }}>{name}</div>
              <div className="method-desc">{desc}</div>
            </div>
          ))}
        </div>
        <div className="col">
          {[
            {
              name: 'FusionPose (2023)', c: '#f59e0b',
              desc: 'IPAFusion calibration-free cross-attention + GRU temporal module. Three losses: motion map, projection, joint stability.'
            },
            {
              name: 'LiCamPose (2025)', c: '#10b981',
              desc: 'Volumetric RGB+LiDAR fusion via V2V-Net. Entropy-based pseudo-label filtering + geometric constraints.'
            },
            {
              name: 'SA-VR (2024)', c: '#ec4899',
              desc: 'Sports analysis built on LiCamPose. Multi-view tracking via PointPillars BEV.'
            },
          ].map(({ name, c, desc }) => (
            <div key={name} className="method-card card" style={{ borderColor: c + '40' }}>
              <div className="method-name" style={{ color: c }}>{name}</div>
              <div className="method-desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  )
}

/* S4.7 — Fusion strategies */
export function FusionStrategiesSlide({ slideNum, total }) {
  return (
    <Slide section="§4 HPE from LiDAR" accent={ACC}
      title="Modality Fusion Strategies in WS-HPE"
      subtitle="When and how to merge 2D image and 3D LiDAR features"
      slideNum={slideNum} total={total}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { stage: 'Early Fusion', c: '#10b981', methods: ['WS-HPE'], desc: 'Project 2D heatmaps onto LiDAR points as extra feature channels.', pros: 'Dense semantic cues per point', cons: 'Requires precise calibration' },
            { stage: 'Mid Fusion', c: '#06b6d4', methods: ['HPERL','FusionPose'], desc: 'Fuse at object/feature level via RoI-Align or learned cross-attention.', pros: 'Flexible, handles imperfect alignment', cons: 'More complex design' },
            { stage: 'Late Fusion', c: '#8b5cf6', methods: ['WS-Fusion','LiCamPose'], desc: 'Each modality predicts independently; combine via dense layer or shared voxel space.', pros: 'Modular, easy to add modalities', cons: 'Misses cross-modal low-level cues' },
          ].map(({ stage, c, methods, desc, pros, cons }) => (
            <div key={stage} className="card" style={{ flex: 1, borderColor: c + '40' }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: c, marginBottom: 6 }}>{stage}</div>
              <div className="method-grid" style={{ marginBottom: 6 }}>
                {methods.map(m => <span key={m} className="method-chip" style={{ borderColor: c + '50', color: c, background: c + '15', fontSize: 11 }}>{m}</span>)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 6 }}>{desc}</div>
              <div style={{ fontSize: 11, color: '#10b981' }}>+ {pros}</div>
              <div style={{ fontSize: 11, color: '#ef4444' }}>– {cons}</div>
            </div>
          ))}
        </div>
        <div className="card card-accent">
          <div className="h3">Key insight on alignment</div>
          <ul className="bullet-list">
            <li><span>Early/mid fusion requires camera-LiDAR calibration (intrinsics + extrinsics)</span></li>
            <li><span>Learned attention or volumetric spaces (FusionPose, LiCamPose) can relax calibration dependency</span></li>
          </ul>
        </div>
      </div>
    </Slide>
  )
}

/* S4.8 — Unsupervised */
export function UnsupervisedHPESlide({ slideNum, total }) {
  return (
    <Slide section="§4 HPE from LiDAR" accent={ACC}
      title="Unsupervised HPE: GC-KPL"
      subtitle="Learning pose from raw LiDAR sequences without any labels"
      refs={["Weng et al. 3D Human Keypoints Estimation from Point Clouds in the Wild without Human Labels. CVPR 2023"]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">GC-KPL (2023)</div>
            <ul className="bullet-list">
              <li><span>Stage 1: synthetic supervised pre-training</span></li>
              <li><span>Stage 2: self-supervised refinement on real unlabelled data via 4 geometric losses</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">The 4 self-supervised losses</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'Flow loss', desc: 'Temporal consistency of limb surface points across frames' },
                { name: 'Point-to-Limb loss', desc: 'Body part points close to predicted limb axis' },
                { name: 'Symmetry loss', desc: 'Similar radial distances at same axial position' },
                { name: 'Joint-to-Part loss', desc: 'Predicted joint near geometric center of body surface' },
              ].map(({ name, desc }) => (
                <div key={name} style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 4, borderRadius: 2, background: ACC, flexShrink: 0 }}/>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: ACC }}>{name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">Evaluation</div>
            <ul className="bullet-list">
              <li><span>MPJPE after Hungarian matching of predicted vs. annotated keypoints</span></li>
              <li><span>Fine-tune with 1–10% labels — strong gains over supervised-only baselines</span></li>
            </ul>
          </div>
          <div className="card card-accent">
            <div className="h3">Research gap</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              GC-KPL is the <strong>only</strong> unsupervised LiDAR HPE method. Open opportunities:
            </div>
            <ul className="bullet-list" style={{ marginTop: 8 }}>
              <li><span>Self-supervised pre-training from unlabelled outdoor scans</span></li>
              <li><span>Contrastive learning for human LiDAR representations</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

import SMPLVizFig from '../figures/SMPLVizFig.jsx'

/* ── Shared slide shell ──────────────────────── */
export function Slide({ section, accent, title, subtitle, children, slideNum, total, noDivider, refs }) {
  return (
    <div className="slide" style={{ '--accent': accent }}>
      <div className="slide-header">
        <span className="section-badge" style={{ '--accent': accent }}>{section}</span>
        <span className="slide-num">{slideNum} / {total}</span>
      </div>
      <div className="slide-title">{title}</div>
      {subtitle && <div className="slide-subtitle">{subtitle}</div>}
      {!noDivider && <div className="slide-divider" />}
      <div className="slide-body">{children}</div>
      {refs && refs.length > 0 && (
        <div className="slide-refs">
          <span style={{ fontSize: 9.5, color: 'var(--text-dim)', fontWeight: 600, marginRight: 4 }}>Refs:</span>
          {refs.map((r, i) => <span key={i} className="ref-item">{r}</span>)}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* S0.1 — Title                                               */
/* ─────────────────────────────────────────────────────────── */
export function TitleSlide({ slideNum, total }) {
  const dots = [
    { w: 300, h: 300, top: '-80px', right: '-60px', delay: '0s' },
    { w: 200, h: 200, bottom: '60px', left: '-50px', delay: '1.5s' },
    { w: 150, h: 150, top: '40%', left: '30%', delay: '3s' },
  ]
  return (
    <div className="slide title-slide" style={{ '--accent': '#06b6d4' }}>
      <div className="title-bg">
        {dots.map((d, i) => (
          <div key={i} className="title-bg-dot"
            style={{ width: d.w, height: d.h, top: d.top, bottom: d.bottom, left: d.left, right: d.right, animationDelay: d.delay }} />
        ))}
      </div>
      <div className="title-badge">CVPR 2026 Tutorial — June 3, Denver</div>
      <h1>
        LiDAR-based 3D Human Pose<br/>
        & <span>Shape Estimation</span>
      </h1>
      <div className="authors">
        <strong>Salma Galaaoui</strong> — valeo.ai / IMAGINE Lab ENPC<br />
        Romain Brégier — NAVER LABS Europe &nbsp;·&nbsp;
        István Sárándi — University of Tübingen &nbsp;·&nbsp;
        Fabien Baradel — valeo.ai &nbsp;·&nbsp;
        David Picard — IMAGINE Lab ENPC<br />
        Nermin Samet — valeo.ai
      </div>
      <div className="event-info">
        <span className="event-chip">Session 3: 3:45 – 4:45 PM</span>
        <span className="event-chip">Mile High 2B, Colorado Convention Center</span>
        <span className="event-chip">github.com/valeoai/3D-Human-Pose-Shape-Estimation-from-LiDAR</span>
      </div>
      <div style={{ position: 'absolute', bottom: 56, right: 28, fontSize: 11, color: 'var(--text-dim)' }}>
        {slideNum} / {total}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* S0.2 — Agenda                                              */
/* ─────────────────────────────────────────────────────────── */
export function AgendaSlide({ slideNum, total }) {
  const sections = [
    { num: '01', title: 'Introduction', sub: 'HPE & HMR task, SMPL, LiDAR motivation', time: '~8 min', accent: '#3b82f6' },
    { num: '02', title: 'Background', sub: 'Sensors taxonomy, LiDAR types, scanning patterns', time: '~8 min', accent: '#8b5cf6' },
    { num: '03', title: 'Survey Overview', sub: 'Taxonomy, architecture trends, supervision spectrum', time: '~6 min', accent: '#06b6d4' },
    { num: '04', title: '3D HPE from LiDAR', sub: 'Supervised, weakly-supervised, unsupervised methods', time: '~12 min', accent: '#10b981' },
    { num: '05', title: '3D HMR from LiDAR', sub: 'LiDAR-only, multi-modal, optimization pipelines', time: '~10 min', accent: '#f59e0b' },
    { num: '06', title: 'Datasets', sub: 'WOD, SLOPER4D, Human-M3, comparative analysis', time: '~8 min', accent: '#ef4444' },
    { num: '07', title: 'Benchmarks & Metrics', sub: 'All metrics explained + SOTA results', time: '~8 min', accent: '#ec4899' },
    { num: '08', title: 'Future Directions', sub: 'Open challenges, research opportunities', time: '~4 min', accent: '#6366f1' },
  ]
  return (
    <Slide section="Agenda" accent="#06b6d4" title="Tutorial Overview" slideNum={slideNum} total={total}>
      <div className="agenda-grid">
        {sections.map(s => (
          <div key={s.num} className="agenda-item" style={{ '--accent': s.accent, borderColor: s.accent + '30' }}>
            <div className="agenda-num" style={{ color: s.accent + '60' }}>{s.num}</div>
            <div className="agenda-title" style={{ color: s.accent }}>{s.title}</div>
            <div className="agenda-sub">{s.sub}</div>
            <div className="agenda-time">{s.time}</div>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* S0.3 — What is 3D HPE from LiDAR?                         */
/* ─────────────────────────────────────────────────────────── */
export function WhatIsHPESlide({ slideNum, total }) {
  return (
    <Slide section="Introduction" accent="#3b82f6"
      title="3D Human Pose Estimation from LiDAR"
      subtitle="Predicting 3D joint coordinates from LiDAR point clouds"
      slideNum={slideNum} total={total}>
      <div style={{ display: 'flex', gap: 20, flex: 1 }}>
        <div className="col" style={{ flex: 1 }}>
          <div className="card card-accent">
            <div className="h3">Task Definition</div>
            <ul className="bullet-list">
              <li><span><strong>Input:</strong> 3D LiDAR point cloud of a scene with one or more persons</span></li>
              <li><span><strong>Output:</strong> 3D coordinates of <span className="highlight">N keypoints</span> (joints) per person in 3D space</span></li>
              <li><span>Typical joint sets: 14 (WOD), 21 (SLOPER4D), 17 (COCO)</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Why not just use cameras?</div>
            <ul className="bullet-list">
              <li><span><span className="highlight">Depth ambiguity:</span> 2D cameras lose the Z axis — requires scale priors or stereo setups</span></li>
              <li><span><span className="highlight">Lighting invariance:</span> LiDAR works day/night, in fog, rain</span></li>
              <li><span><span className="highlight">Privacy:</span> no facial/texture data captured</span></li>
              <li><span><span className="highlight">Absolute 3D:</span> positions in metric world coordinates, critical for AV safety</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Applications</div>
            <div className="method-grid">
              {['Autonomous driving','Behavior analysis','Sports analytics','Human-robot interaction','Smart cities','Healthcare'].map(a => (
                <span key={a} className="method-chip" style={{ borderColor: '#3b82f660', color: '#3b82f6', background: '#3b82f615' }}>{a}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* S0.4 — What is 3D HMR?                                    */
/* ─────────────────────────────────────────────────────────── */
export function WhatIsHMRSlide({ slideNum, total }) {
  return (
    <Slide section="Introduction" accent="#3b82f6"
      title="3D Human Mesh Recovery from LiDAR"
      subtitle="Reconstructing a full body surface mesh, not just joints"
      slideNum={slideNum} total={total}>
      <div className="two-col two-col-4060" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">HPE vs HMR</div>
            <ul className="bullet-list">
              <li><span><strong>HPE:</strong> sparse set of 3D keypoints (skeleton)</span></li>
              <li><span><strong>HMR:</strong> dense 3D mesh — full body surface geometry (~6890 vertices for SMPL)</span></li>
              <li><span>HMR is strictly harder: requires body shape, pose params, and a parametric model</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">SMPL Model</div>
            <ul className="bullet-list">
              <li><span><strong>θ</strong> — pose parameters: joint angle rotations (72D)</span></li>
              <li><span><strong>β</strong> — shape parameters: body morphology (10D PCA)</span></li>
              <li><span>Output: mesh with 6890 vertices and 13776 faces</span></li>
              <li><span>Extensions: MANO (hands), FLAME (face), SMPL-X (unified)</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Why HMR matters</div>
            <ul className="bullet-list">
              <li><span>Enables cloth fitting, avatar creation, gait analysis</span></li>
              <li><span>Richer signal for action recognition and scene interaction</span></li>
              <li><span>From LiDAR: geometric accuracy + privacy preservation</span></li>
            </ul>
          </div>
        </div>
        <div className="col" style={{ alignItems: 'center' }}>
          <SMPLVizFig width={240} height={330} />
        </div>
      </div>
    </Slide>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* S0.5 — LiDAR Challenges                                    */
/* ─────────────────────────────────────────────────────────── */
export function ChallengesSlide({ slideNum, total }) {
  return (
    <Slide section="Introduction" accent="#3b82f6"
      title="LiDAR Point Cloud Challenges"
      subtitle="Why extracting human pose from LiDAR is non-trivial"
      slideNum={slideNum} total={total}>
      <div className="two-col two-col-6040" style={{ flex: 1 }}>
        <div className="col">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
            {[
              { t: 'Sparsity', d: 'Pedestrian at 15 m → ~300–600 pts. Missing limbs, concave surfaces.', c: '#ef4444' },
              { t: 'Occlusion', d: 'Other people, vehicles, and self-occlusion hide body parts entirely.', c: '#f59e0b' },
              { t: 'Non-uniformity', d: 'RMB sensors: denser at equator. NRS: time-dependent, irregular sampling.', c: '#8b5cf6' },
              { t: 'Noise', d: 'Weather (rain, fog) and glass surfaces cause erroneous returns.', c: '#06b6d4' },
              { t: 'Scale variability', d: '20 m → sparse scan; 2 m → dense. Models must handle this range.', c: '#10b981' },
              { t: 'Dataset scarcity', d: 'Few labelled datasets vs millions of RGB images with 2D/3D poses.', c: '#ec4899' },
            ].map(({ t, d, c }) => (
              <div key={t} className="card" style={{ borderColor: c + '40' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: c, marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {[
              ['rgb_1557962430313036.png','human1.png','314 pts @ 16.7 m'],
              ['rgb_1557962431112927.png','human2.png','416 pts @ 13.9 m'],
              ['rgb_1557962431812796.png','human3.png','617 pts @ 10.8 m'],
            ].map(([rgb, pc, lbl]) => (
              <div key={lbl} style={{ display: 'flex', gap: 8, flex: 1, minHeight: 0 }}>
                <div className="fig-container" style={{ flex: 1 }}>
                  <img src={`figures/lidar_hpc_subfigures/${rgb}`} alt="" style={{ objectFit: 'cover' }}/>
                </div>
                <div className="fig-container" style={{ flex: 1 }}>
                  <img src={`figures/lidar_hpc_subfigures/${pc}`} alt="" style={{ objectFit: 'contain', padding: 4 }}/>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-dim)', writing: 'vertical', alignSelf: 'center', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{lbl}</span>
              </div>
            ))}
          </div>
          <div className="fig-caption">Waymo Open Dataset. Point density grows as distance decreases.</div>
        </div>
      </div>
    </Slide>
  )
}

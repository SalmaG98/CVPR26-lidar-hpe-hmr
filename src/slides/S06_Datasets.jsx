import { Slide } from './S00_Intro.jsx'

const ACC = '#ef4444'

/* S6.1 — Datasets overview */
export function DatasetsOverviewSlide({ slideNum, total }) {
  return (
    <Slide section="§6 Datasets" accent={ACC}
      title="LiDAR Datasets for 3D HPE and HMR"
      subtitle="Three primary benchmarks plus additional public resources"
      slideNum={slideNum} total={total}>
      <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
        {[
          { name: 'Waymo Open Dataset', short: 'WOD', year: 2019, sensor: 'RMB 64-beam', scene: 'AV street driving', size: '230k frames / 998 scenes', c: '#3b82f6', unique: 'Largest coverage, AV context, 9.9k 3D instances' },
          { name: 'SLOPER4D', short: 'SLOPER', year: 2023, sensor: 'Ouster OS-1 128-beam', scene: 'Urban outdoor following', size: '42.3k frames / 6 seqs', c: '#8b5cf6', unique: 'SMPL mesh + global scene, person-worn LiDAR, IMU sync' },
          { name: 'Human-M3', short: 'H-M3', year: 2024, sensor: 'Livox MID-100 NRS', scene: 'Multi-person interaction', size: '12.2k frames / 4 scenes', c: '#10b981', unique: 'Multi-LiDAR fusion, NRS pattern, 237 subjects' },
        ].map(({ name, short, year, sensor, scene, size, c, unique }) => (
          <div key={name} className="card" style={{ flex: 1, borderColor: c + '40', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: c }}>{name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{short} · {year}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[['Sensor', sensor],['Scene', scene],['Size', size]].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', width: 48, flexShrink: 0 }}>{k}:</span>
                  <span style={{ fontSize: 11, color: 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: c, marginBottom: 2 }}>Unique feature:</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{unique}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="fig-pdf wide" style={{ flex: 1, height: 'auto', minHeight: 160 }}>
        <iframe src="figures/datasets_figure_plasma.pdf#toolbar=0&navpanes=0&scrollbar=0&view=Fit&zoom=page-fit" title="Dataset comparison" />
      </div>
      <div className="fig-caption">Scene and human instance comparison across WOD, SLOPER4D, and Human-M3 (from the paper)</div>
    </Slide>
  )
}

/* S6.2 — Waymo Open Dataset */
export function WODSlide({ slideNum, total }) {
  return (
    <Slide section="§6 Datasets" accent={ACC}
      title="Waymo Open Dataset (WOD)"
      subtitle="Large-scale autonomous driving dataset with 3D human pose annotations"
      refs={["Waymo Open Dataset, Sun et al. 2020"]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Data collection</div>
            <ul className="bullet-list">
              <li><span>5 in-house LiDAR units per vehicle: 1 mid-range roof (70m, 25.2°×120° FoV) + 4 short-range (20m, 25.2°×20° FoV)</span></li>
              <li><span>5 synchronized RGB cameras (front, front-L/R, side-L/R)</span></li>
              <li><span>10 Hz, only first 2 LiDAR returns retained</span></li>
              <li><span>Locations: San Francisco, Phoenix, Mountain View — day and night</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Annotations</div>
            <ul className="bullet-list">
              <li><span><strong>14 human keypoints</strong> in 3D (custom joint set)</span></li>
              <li><span>3D bounding boxes, camera labels, tracking IDs</span></li>
              <li><span>Stored in Apache Parquet format</span></li>
              <li><span>20-second sequences at 10 Hz</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">Statistics</div>
            <table className="data-table" style={{ fontSize: 12 }}>
              <tbody>
                {[
                  ['# keypoints','14'],
                  ['# scenes','998'],
                  ['# LiDAR frames','230,000'],
                  ['# subjects','23,600'],
                  ['# 3D instances','9,900'],
                  ['Sequence length','20 s'],
                  ['Area coverage','76M m²'],
                  ['Avg. pts/person','384 pts'],
                  ['Avg. sensor dist.','14.5 m'],
                  ['3D pose diversity','22.0 cm'],
                  ['Train split','~800 scenes'],
                  ['Val split','~200 scenes'],
                ].map(([k,v]) => <tr key={k}><td style={{fontWeight:600}}>{k}</td><td>{v}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S6.3 — SLOPER4D */
export function SLOPER4DSlide({ slideNum, total }) {
  return (
    <Slide section="§6 Datasets" accent={ACC}
      title="SLOPER4D"
      subtitle="First multi-modal outdoor HPE dataset with synchronized LiDAR, IMU, and RGB"
      refs={["SLOPER4D, Dai et al. 2023", "Ouster OS-1 datasheet"]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Setup</div>
            <ul className="bullet-list">
              <li><span>Head-mounted <strong>Ouster OS-1</strong> (128-beam, 90m, 360°×42.2° FoV) mounted at 45° — captures full body in motion</span></li>
              <li><span>Operator follows subject with the sensor</span></li>
              <li><span>Subject wears multiple IMUs for precise MoCap</span></li>
              <li><span>All modalities synchronized and subsampled to 20 Hz</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Annotation pipeline</div>
            <ul className="bullet-list">
              <li><span>MoCap from IMUs → initial SMPL θ_init(t)</span></li>
              <li><span>RGB: Detectron2 + DeepSort → 2D keypoints + tracking</span></li>
              <li><span>VDB-Fusion → clean scene point cloud (removes moving artifacts)</span></li>
              <li><span>Joint optimization: 2D reprojection + LiDAR Chamfer + smoothness → L-BFGS</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">Statistics</div>
            <table className="data-table" style={{ fontSize: 12 }}>
              <tbody>
                {[
                  ['# keypoints','21'],
                  ['# seqs (public)','6 of 15'],
                  ['# LiDAR frames','42,300'],
                  ['# subjects','12'],
                  ['# 3D instances','—'],
                  ['Sequence length','102–441 s'],
                  ['Area coverage','2–13k m²'],
                  ['Avg. pts/person','967 pts'],
                  ['Avg. sensor dist.','4.33 m'],
                  ['3D pose diversity','22.9 cm'],
                ].map(([k,v]) => <tr key={k}><td style={{fontWeight:600}}>{k}</td><td>{v}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="card card-accent">
            <div className="h3">Key characteristics</div>
            <ul className="bullet-list">
              <li><span>Densest point clouds of the three (128 beams, close range ~4.33m)</span></li>
              <li><span>Real-world challenges: occlusions, dynamic backgrounds, varied lighting</span></li>
              <li><span>Only 6 sequences publicly released — no official train/test split in public release</span></li>
              <li><span>Highest pose diversity score (22.9 cm) — widest range of body configurations</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S6.4 — Human-M3 */
export function HumanM3Slide({ slideNum, total }) {
  return (
    <Slide section="§6 Datasets" accent={ACC}
      title="Human-M3"
      subtitle="Multi-view, multi-LiDAR outdoor benchmark with NRS scanning pattern"
      refs={["Human-M3, Fan et al. 2023", "Livox MID-100 datasheet"]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Setup</div>
            <ul className="bullet-list">
              <li><span>4 diagonally-opposed <strong>Livox MID-100</strong> (NRS rosette pattern, 3 beams, 90m range, 98°×38° FoV)</span></li>
              <li><span>4 cameras, each mounted above its LiDAR for co-planar FoV alignment</span></li>
              <li><span>Fixed sensor setup — subjects move freely within the scene</span></li>
              <li><span>All streams synchronized at 10 Hz</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Annotation pipeline</div>
            <ul className="bullet-list">
              <li><span>PointPillars + AB3DMOT → 3D detection + tracking in LiDAR</span></li>
              <li><span>ViTPose → high-resolution 2D keypoints from projected images</span></li>
              <li><span>Temporal optimization: 2D reprojection + Chamfer + VPoser prior + smoothness → L-BFGS</span></li>
              <li><span>Test set manually reviewed and corrected</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">Statistics</div>
            <table className="data-table" style={{ fontSize: 12 }}>
              <tbody>
                {[
                  ['# keypoints','15'],
                  ['# scenes','4'],
                  ['# LiDAR frames','12,200'],
                  ['# subjects','237'],
                  ['# 3D instances','89,000'],
                  ['Sequence length','12–45 s'],
                  ['Area coverage','111.5k m²'],
                  ['Avg. pts/person','369 pts'],
                  ['Avg. sensor dist.','—'],
                  ['3D pose diversity','22.3 cm'],
                ].map(([k,v]) => <tr key={k}><td style={{fontWeight:600}}>{k}</td><td>{v}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="card card-accent">
            <div className="h3">Key characteristics</div>
            <ul className="bullet-list">
              <li><span>NRS pattern: sparser per frame but post-processing fuses 4 views → no self-occlusion</span></li>
              <li><span>Largest number of subjects (237) and 3D instances (89k)</span></li>
              <li><span>4 scenes: 2 basketball courts, 1 urban intersection, 1 plaza</span></li>
              <li><span>Official split: 90% train, 10% test (final frames)</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S6.5 — Comparative analysis */
export function DatasetStatsSlide({ slideNum, total }) {
  return (
    <Slide section="§6 Datasets" accent={ACC}
      title="Comparative Dataset Analysis"
      subtitle="Intrinsic and extrinsic characteristics across the three primary benchmarks"
      slideNum={slideNum} total={total}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>Extrinsic characteristics</div>
            <table className="data-table" style={{ fontSize: 11 }}>
              <thead>
                <tr><th>Property</th><th style={{color:'#3b82f6'}}>WOD</th><th style={{color:'#8b5cf6'}}>SLOPER4D</th><th style={{color:'#10b981'}}>Human-M3</th></tr>
              </thead>
              <tbody>
                {[
                  ['Area (m²)','76M','2–13k','111.5k*'],
                  ['# scenes','998','6','4'],
                  ['# subjects','23.6k','12','237*'],
                  ['# 3D instances','9.9k*','33k*','89k*'],
                  ['# LiDAR frames','230k','42.3k*','12.2k*'],
                  ['Seq. length (s)','20','102–441*','12–45*'],
                ].map(r => <tr key={r[0]}><td style={{fontWeight:600}}>{r[0]}</td>{r.slice(1).map((c,i)=><td key={i}>{c.replace('*','')}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>Acquisition characteristics</div>
            <table className="data-table" style={{ fontSize: 11 }}>
              <thead>
                <tr><th>Property</th><th style={{color:'#3b82f6'}}>WOD</th><th style={{color:'#8b5cf6'}}>SLOPER4D</th><th style={{color:'#10b981'}}>Human-M3</th></tr>
              </thead>
              <tbody>
                {[
                  ['# beams','64*','128','3†'],
                  ['PC resolution','169600*','131072','80928*'],
                  ['Range (m)','20/75','90','90'],
                  ['Framerate (Hz)','10','20','10'],
                  ['Scan pattern','RMB','RMB','NRS'],
                ].map(r => <tr key={r[0]}><td style={{fontWeight:600}}>{r[0]}</td>{r.slice(1).map((c,i)=><td key={i}>{c}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card card-accent">
          <div className="h3">Intrinsic diversity</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { name: 'WOD', pts: '384', dist: '14.5m', div: '22.0 cm', c: '#3b82f6' },
              { name: 'SLOPER4D', pts: '967', dist: '4.33m', div: '22.9 cm', c: '#8b5cf6' },
              { name: 'Human-M3', pts: '369', dist: '—', div: '22.3 cm', c: '#10b981' },
            ].map(({ name, pts, dist, div, c }) => (
              <div key={name} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: c }}>{name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Avg pts/person: <span style={{ color: 'var(--text)' }}>{pts}</span></div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Avg sensor dist: <span style={{ color: 'var(--text)' }}>{dist}</span></div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pose diversity: <span style={{ color: 'var(--text)' }}>{div}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S6.6 — Other datasets */
export function OtherDatasetsSlide({ slideNum, total }) {
  return (
    <Slide section="§6 Datasets" accent={ACC}
      title="Other Public Datasets"
      subtitle="Additional resources for LiDAR-based HPE and HMR research"
      slideNum={slideNum} total={total}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1 }}>
        {[
          {
            name: 'LiDARHuman26M (2022)', c: '#3b82f6',
            stats: '184,048 frames · 13 subjects · 12–28m range',
            desc: 'Synchronized LiDAR + RGB + IMU. SMPL params + 3D joints. 20 daily activities. Used for synthetic pre-training by DAPT, UniPVU.',
          },
          {
            name: 'HmPEAR (2024)', c: '#8b5cf6',
            stats: '300k+ frames · 25 subjects · 128-beam LiDAR',
            desc: '3D HPE + Human Action Recognition (HAR). 40 daily actions, 10 scenes, varying lighting. SMPL meshes + actions + bounding boxes. PEAR-Proj model.',
          },
          {
            name: 'HSC4D (2022)', c: '#f59e0b',
            stats: '250k IMU frames (100Hz) · 50k LiDAR frames (20Hz)',
            desc: 'Human-centered 4D dataset: SMPL params + scene SLAM trajectories + foot contact states. Colorized 3D scene from Trimble TX5 scanner. Annotation basis for SLOPER4D.',
          },
          {
            name: 'PedX (2019)', c: '#10b981',
            stats: '5k stereo image pairs · 2.5k LiDAR frames · 14k instances',
            desc: 'Static vehicle setup: 4 cameras + 4 roof-mounted LiDARs. 2D/3D keypoints + SMPL models + segmentation. Urban intersection scenarios.',
          },
          {
            name: 'CIMI4D (2023)', c: '#ec4899',
            stats: 'Extension of HSC4D · climbing activity',
            desc: 'Humans climbing a fixed structure. Frame-level synchronization (vs. sequence-level in HSC4D). Adds RGB modality. Unique human-scene interaction challenge.',
          },
          {
            name: 'LIPD (2023)', c: '#06b6d4',
            stats: 'Long-range LiDAR-IMU dataset',
            desc: 'Introduced with the LiP method. Single LiDAR + 4 sparse IMUs. Long-range outdoor scenes. Designed for marker-less MoCap with minimal sensor setup.',
          },
        ].map(({ name, c, stats, desc }) => (
          <div key={name} className="card" style={{ borderColor: c + '40' }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: c }}>{name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', margin: '3px 0' }}>{stats}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</div>
          </div>
        ))}
      </div>
    </Slide>
  )
}

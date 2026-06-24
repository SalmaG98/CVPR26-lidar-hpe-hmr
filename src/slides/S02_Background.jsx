import { Slide } from './S00_Intro.jsx'
import SensorTaxonomyFig from '../figures/SensorTaxonomyFig.jsx'
import LiDARTaxonomyFig from '../figures/LiDARTaxonomyFig.jsx'
import RadarChartFig from '../figures/RadarChartFig.jsx'
import ScanPatternFig from '../figures/ScanPatternFig.jsx'
import GrowthChartFig from '../figures/GrowthChartFig.jsx'

const ACC = '#8b5cf6'

/* S2.1 — HPE from Images */
export function BackgroundHPEImgSlide({ slideNum, total }) {
  return (
    <Slide section="§2 Background" accent={ACC}
      title="3D HPE from Images: A Brief History"
      subtitle="From hand-crafted to deep learning and beyond"
      refs={["Loper et al. 2023, SMPL", "Pavlakos et al. 2019, SMPL-X / SMPLify-X"]}
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Deterministic Methods</div>
            <ul className="bullet-list">
              <li><span>2D keypoint detection → 3D lift (VideoPose3D)</span></li>
              <li><span>Temporal: transformers for smooth sequences (PoseFormer)</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Generative Methods</div>
            <ul className="bullet-list">
              <li><span><em>Depth ambiguity:</em> many 3D poses share one 2D projection</span></li>
              <li><span>SOTA: diffusion models (D3DP, DiffPose)</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Limitations for LiDAR context</div>
            <ul className="bullet-list">
              <li><span>No absolute depth without stereo</span></li>
              <li><span>Privacy: captures face and identity data</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">3D HMR from Images</div>
            <ul className="bullet-list">
              <li><span><strong>Parametric:</strong> regress SMPL θ, β (HMR, SPIN, CLIFF)</span></li>
              <li><span><strong>Temporal:</strong> TCMR, MotionBERT for smooth sequences</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Key SMPL extensions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
              {[
                ['SMPL', 'body (6890v)', '#8b5cf6'],
                ['MANO', 'hands (778v)', '#06b6d4'],
                ['FLAME', 'face', '#f59e0b'],
                ['SMPL-X', 'unified body+hands+face', '#10b981'],
              ].map(([n, d, c]) => (
                <div key={n} className="method-card" style={{ borderColor: c + '40' }}>
                  <div className="method-name" style={{ color: c }}>{n}</div>
                  <div className="method-desc">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S2.2 — The LiDAR advantage */
export function LiDARAdvantageSlide({ slideNum, total }) {
  return (
    <Slide section="§2 Background" accent={ACC}
      title="LiDAR's Advantage wrt. RGB"
      subtitle="Why LiDAR is increasingly used for human perception in the wild"
      slideNum={slideNum} total={total}>
      <div style={{ display: 'flex', gap: 16, flex: 1 }}>
        <div className="card card-accent" style={{ flex: 1 }}>
          <div className="h3">Key Properties of LiDAR</div>
          <ul className="bullet-list">
            <li><span><span className="highlight">Metric 3D geometry:</span> absolute distance — no scale ambiguity</span></li>
            <li><span><span className="highlight">Lighting invariance:</span> active sensor, works at night</span></li>
            <li><span><span className="highlight">Privacy-preserving:</span> no texture or face data</span></li>
          </ul>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <div className="h3">Why LiDAR for Human Perception?</div>
          <ul className="bullet-list">
            <li><span><strong>Metric depth:</strong> absolute 3D, no stereo rig needed</span></li>
            <li><span><strong>Privacy by design:</strong> no colour or facial data (GDPR-safe)</span></li>
            <li><span><strong>Growing ecosystem:</strong> Waymo, SLOPER4D, Human-M3 enable deep learning</span></li>
          </ul>
        </div>
      </div>
    </Slide>
  )
}

/* S2.3 — Passive vs Active Sensors */
export function SensorTaxonomySlide({ slideNum, total }) {
  return (
    <Slide section="§2 Background" accent={ACC}
      title="Passive vs Active Spatial Sensors"
      subtitle="Taxonomy of sensors used in embodied AI and autonomous driving"
      refs={["Marti et al. 2019, Review of Sensor Technologies", "Li et al. 2020, LiDAR for Autonomous Driving"]}
      slideNum={slideNum} total={total}>
      <div className="two-col two-col-6040" style={{ flex: 1 }}>
        <div className="col" style={{ justifyContent: 'center' }}>
          <SensorTaxonomyFig />
        </div>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Passive sensors</div>
            <ul className="bullet-list">
              <li><span><strong>Cameras:</strong> no depth without stereo</span></li>
              <li><span><strong>Stereo:</strong> depth from disparity; fails on textureless surfaces</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Active sensors</div>
            <ul className="bullet-list">
              <li><span><strong>RADAR:</strong> long-range, velocity; poor angular resolution</span></li>
              <li><span><strong>LiDAR:</strong> laser pulses; high-res 3D, long range, all-weather</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Multi-sensor fusion</div>
            <ul className="bullet-list">
              <li><span>LiDAR + camera + RADAR covers individual weaknesses</span></li>
              <li><span>Key calibration challenge: sync and domain gap</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S2.4 — LiDAR Technology Basics */
export function LiDARBasicsSlide({ slideNum, total }) {
  return (
    <Slide section="§2 Background" accent={ACC}
      title="LiDAR: Technology Basics"
      subtitle="Time-of-Flight principle and how LiDAR produces 3D point clouds"
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent" style={{ flex: 1 }}>
            <div className="h3">Time-of-Flight Principle</div>
            <ul className="bullet-list">
              <li><span>Distance: <span className="highlight">d = c · t / 2</span></span></li>
              <li><span>Each return: (x, y, z, intensity, ring_id, timestamp)</span></li>
            </ul>
          </div>
          <div className="card" style={{ flex: 1 }}>
            <div className="h3">3 axes of LiDAR categorization</div>
            <ul className="bullet-list">
              <li><span><strong>Scanning pattern:</strong> RMB / NRS / Flash</span></li>
              <li><span><strong>Beam steering:</strong> mechanical / MEMS / OPA</span></li>
              <li><span><strong>Sensing tech:</strong> Pulse ToF / AMCW / FMCW</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="card" style={{ flex: 1 }}>
            <div className="h3">Beam steering technologies</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {[
                { t: 'Mechanical', d: 'Rotating head. High reliability. Ouster, Velodyne.', c: '#06b6d4' },
                { t: 'MEMS (Quasi-solid)', d: 'Micro mirrors. Compact, low power. RoboSense, Luminar.', c: '#8b5cf6' },
                { t: 'Risley Prism (Quasi-solid)', d: 'Rosette scan pattern. Livox MID-40/100.', c: '#f59e0b' },
                { t: 'OPA (Solid-state)', d: 'No moving parts. Research stage; future AV candidate.', c: '#10b981' },
              ].map(({ t, d, c }) => (
                <div key={t} className="method-card" style={{ borderColor: c + '40' }}>
                  <div className="method-name" style={{ color: c }}>{t}</div>
                  <div className="method-desc">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S2.5 — Scanning Patterns */
export function ScanningPatternsSlide({ slideNum, total }) {
  return (
    <Slide section="§2 Background" accent={ACC}
      title="LiDAR Scanning Patterns"
      subtitle="RMB vs NRS: the two dominant patterns in HPE/HMR research"
      refs={["Ouster OS0 datasheet", "Livox MID-100 datasheet", "Li et al. 2022, Progress Review Solid-State LiDAR"]}
      slideNum={slideNum} total={total}>
      <ScanPatternFig />
      <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
        <div className="card" style={{ flex: 1, borderColor: 'var(--cyan)30' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--cyan)' }}>RMB datasets:</strong> Waymo (64-beam), SLOPER4D (128-beam), LiDARHuman26M
          </div>
        </div>
        <div className="card" style={{ flex: 1, borderColor: '#8b5cf630' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <strong style={{ color: '#8b5cf6' }}>NRS datasets:</strong> Human-M3 (Livox MID-100) — sparse per frame, integrates over time
          </div>
        </div>
        <div className="card" style={{ flex: 1, borderColor: '#10b98130' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <strong style={{ color: '#10b981' }}>Key difference:</strong> RMB = uniform density; NRS = temporal integration required
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S2.6 — LiDAR Taxonomy */
export function LiDARTaxonomySlide({ slideNum, total }) {
  return (
    <Slide section="§2 Background" accent={ACC}
      title="LiDAR Sensor Taxonomy"
      subtitle="Three non-orthogonal axes for categorizing LiDAR sensors"
      refs={["Li et al. 2020, LiDAR for AV", "Li et al. 2022, Solid-State LiDAR Review"]}
      slideNum={slideNum} total={total}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <LiDARTaxonomyFig />
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Ouster OS0', spec: 'RMB · Mechanical · Pulse ToF · 32–128 beams · 35m', c: '#06b6d4' },
            { label: 'Livox MID-100', spec: 'NRS · Risley Prism · Pulse ToF · 3-beam · 90m', c: '#8b5cf6' },
            { label: 'Waymo in-house', spec: 'RMB · Mechanical · Pulse ToF · 64-beam · 75m', c: '#f59e0b' },
          ].map(({ label, spec, c }) => (
            <div key={label} className="card" style={{ flex: 1, borderColor: c + '40' }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: c }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{spec}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  )
}

/* S2.7 — Sensor Comparison */
export function SensorComparisonSlide({ slideNum, total }) {
  return (
    <Slide section="§2 Background" accent={ACC}
      title="Sensor Comparison: Camera vs LiDAR vs Radar"
      subtitle="Performance across 12 criteria for autonomous driving"
      refs={["Vargas et al. 2021, Overview of AVs", "Marti et al. 2019, Sensor Tech Review"]}
      slideNum={slideNum} total={total}>
      <RadarChartFig />
    </Slide>
  )
}

/* S2.8 — LiDAR Limitations */
export function LiDARLimitationsSlide({ slideNum, total }) {
  return (
    <Slide section="§2 Background" accent={ACC}
      title="LiDAR Limitations in Real Deployments"
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Weather-induced noise</div>
            <ul className="bullet-list">
              <li><span>Fog / rain / snow: backscatter and signal attenuation</span></li>
              <li><span>Sparser, noisier scans degrade HPE accuracy</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Material-dependent reflectivity</div>
            <ul className="bullet-list">
              <li><span>Glass: near-transparent → missing returns</span></li>
              <li><span>Dark clothing: weak signal; signs: detector saturation</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Occlusion patterns</div>
            <ul className="bullet-list">
              <li><span>Only sensor-facing surfaces captured (self-occlusion)</span></li>
              <li><span>Cars and walls block lower-body points</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="h3">RADAR comparison</div>
            <ul className="bullet-list">
              <li><span>Weather-robust but cannot resolve pedestrian limbs</span></li>
              <li><span>Metal amplifies signal; glass nearly invisible</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">Camera comparison</div>
            <ul className="bullet-list">
              <li><span>High texture; no absolute depth; restricted FoV</span></li>
              <li><span>Fails under glare, overexposure, adversarial patches</span></li>
            </ul>
          </div>
          <div className="card card-accent">
            <div className="h3">Solution: Multi-sensor fusion</div>
            <ul className="bullet-list">
              <li><span>LiDAR + camera + RADAR covers individual weaknesses</span></li>
              <li><span>Challenge: calibration, sync, domain gap</span></li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S2.9 — Datasets overview early */
export function EarlyDatasetsSlide({ slideNum, total }) {
  return (
    <Slide section="§2 Background" accent={ACC}
      title="Enabling Datasets for LiDAR HPE/HMR"
      subtitle="Before annotated LiDAR datasets existed, RGB-D cameras dominated"
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">Historical context</div>
            <ul className="bullet-list">
              <li><span>Pre-2019: Kinect RGB-D dominated 3D pose data</span></li>
              <li><span>No annotated outdoor LiDAR data — main bottleneck</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">The turning point</div>
            <ul className="bullet-list">
              <li><span>2020: Waymo — 230k LiDAR frames with 3D pose labels</span></li>
              <li><span>2022–23: SLOPER4D, Human-M3, CIMI4D add SMPL labels</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Survey scope (2019–2025): 32 methods</div>
            <table className="data-table">
              <thead><tr><th>Year</th><th>Dataset</th><th>LiDAR Type</th><th>Annotation</th></tr></thead>
              <tbody>
                {[
                  ['2019','PedX','RMB','2D/3D kpts, SMPL'],
                  ['2020','Waymo OD','RMB (64-beam)','3D joints'],
                  ['2022','HSC4D','Wearable RMB','SMPL, scene'],
                  ['2022','LiDARHuman26M','RMB (128-beam)','SMPL+joints'],
                  ['2023','SLOPER4D','RMB (OS-1)','SMPL+joints'],
                  ['2023','Human-M3','NRS (Livox)','SMPL+joints'],
                  ['2024','HmPEAR','RMB (128-beam)','SMPL+action'],
                ].map(r => <tr key={r[0]+r[1]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Slide>
  )
}

/* S2.10 — Growing interest + scope */
export function GrowingInterestSlide({ slideNum, total }) {
  return (
    <Slide section="§2 Background" accent={ACC}
      title="Growing Research Interest"
      subtitle="Publications & citations on '3D human pose estimation from LiDAR point clouds' (dimensions.ai)"
      slideNum={slideNum} total={total}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <GrowthChartFig />
      </div>
    </Slide>
  )
}

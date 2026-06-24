import { Slide } from './S00_Intro.jsx'
import { QRCodeSVG } from 'qrcode.react'

const ACC = '#6366f1'

/* S8.1 — Future directions */
export function FutureDirectionsSlide({ slideNum, total }) {
  return (
    <Slide section="§8 Future" accent={ACC}
      title="Open Challenges & Future Directions"
      slideNum={slideNum} total={total}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, flex: 1 }}>
        {[
          {
            t: 'Data Scarcity', c: '#3b82f6',
            items: [
              'LiDAR-only weakly-supervised HPE/HMR — only one method',
              'Self-supervised pre-training from unlabelled outdoor scans (nuScenes, KITTI)',
              'Temporal coherence as supervision signal without labels',
              'Weakly-supervised HMR — entirely unexplored territory',
            ]
          },
          {
            t: 'Realistic Synthetic Data', c: '#8b5cf6',
            items: [
              'AMASS is mostly indoor; outdoor poses are underrepresented',
              'Ray casting misses real sensor noise, multipath, weather effects',
              'Generative models (diffusion) for realistic LiDAR simulation',
              'Domain adaptation: synthetic → real without annotation',
            ]
          },
          {
            t: 'Domain Adaptation', c: '#06b6d4',
            items: [
              'Sensor domain gap: WOD ↔ SLOPER4D fail to cross-generalize',
              'Scan pattern gap: RMB vs NRS produce structurally different point clouds',
              'Cross-dataset generalisation without re-annotation',
              'Robust architectures across beam counts and sampling densities',
            ]
          },
          {
            t: 'Calibration-free Fusion', c: '#10b981',
            items: [
              'Most multi-modal methods depend on accurate camera-LiDAR calibration',
              'Calibration drifts in real deployments',
              'Learnable alignment modules are promising but underexplored',
              'End-to-end training with implicit geometric registration',
            ]
          },
          {
            t: 'Robustness in the Wild', c: '#f59e0b',
            items: [
              'Adverse weather: fog, rain, snow significantly degrade LiDAR HPE',
              'Long-tail scenarios: unusual poses, crowded scenes, night',
              'Human-object interaction: sitting, climbing, carrying objects',
              'Wearable LiDAR motion artifacts',
            ]
          },
          {
            t: 'Efficient & Real-time Methods', c: '#ec4899',
            items: [
              'Only LidPose and LiveHPS claim real-time operation',
              'Transformer-heavy architectures are typically not real-time',
              'Edge deployment on AV SoC (System-on-Chip)',
              'Knowledge distillation from large to compact models',
            ]
          },
        ].map(({ t, c, items }) => (
          <div key={t} className="card" style={{ borderColor: c + '40' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: c, marginBottom: 8 }}>{t}</div>
            <ul className="bullet-list">
              {items.map(item => <li key={item}><span style={{ fontSize: 11 }}>{item}</span></li>)}
            </ul>
          </div>
        ))}
      </div>
    </Slide>
  )
}

/* S8.2 — Summary & Thank you */
export function SummarySlide({ slideNum, total }) {
  return (
    <Slide section="Closing" accent={ACC}
      title="Summary & Key Takeaways"
      slideNum={slideNum} total={total}>
      <div className="two-col" style={{ flex: 1 }}>
        <div className="col">
          <div className="card card-accent">
            <div className="h3">What we covered</div>
            <ul className="bullet-list">
              <li><span><strong>Task:</strong> 3D HPE and HMR from LiDAR — unique advantages (depth, privacy, range) and challenges (sparsity, occlusion)</span></li>
              <li><span><strong>Sensors:</strong> Active/passive taxonomy, LiDAR types (RMB vs NRS), scanning patterns, sensing technologies</span></li>
              <li><span><strong>Methods:</strong> 32 papers across supervised, weakly-supervised, unsupervised paradigms</span></li>
              <li><span><strong>Datasets:</strong> WOD, SLOPER4D, Human-M3 — each captures a different sensor/scenario regime</span></li>
              <li><span><strong>Metrics:</strong> Unified definitions — MPJPE, PA-MPJPE, PCK, PEM, MPVPE, Chamfer, and temporal metrics</span></li>
            </ul>
          </div>
          <div className="card">
            <div className="h3">The big picture</div>
            <ul className="bullet-list">
              <li><span>LiDAR HPE/HMR is a young field — most methods published 2022–2025</span></li>
              <li><span>Weakly-supervised HMR is entirely open — no method exists yet</span></li>
              <li><span>Sensor-to-sensor generalisation is a key unsolved problem</span></li>
              <li><span>Foundation models + LiDAR is an underexplored but promising direction</span></li>
            </ul>
          </div>
        </div>
        <div className="col">
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', lineHeight: 1.3 }}>
              Thank you!
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Salma Galaaoui<br/>
              <span style={{ color: ACC }}>galaaoui.salma@gmail.com</span>
            </div>
            <div style={{ width: '100%', height: 1, background: 'var(--border)' }}/>
            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', justifyContent: 'center' }}>
              {/* Paper QR */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <QRCodeSVG
                  value="https://arxiv.org/abs/2509.12197"
                  size={110}
                  bgColor="#f4f7fc"
                  fgColor="#1e2a3a"
                  level="M"
                />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>arXiv paper</div>
                <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono,monospace', color: 'var(--text-dim)' }}>arxiv.org/abs/2509.12197</div>
              </div>
              {/* GitHub QR */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <QRCodeSVG
                  value="https://github.com/valeoai/3D-Human-Pose-Shape-Estimation-from-LiDAR"
                  size={110}
                  bgColor="#f4f7fc"
                  fgColor="#1e2a3a"
                  level="M"
                />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>GitHub repository</div>
                <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono,monospace', color: 'var(--text-dim)' }}>github.com/valeoai/...</div>
              </div>
            </div>
            <div style={{ width: '100%', height: 1, background: 'var(--border)' }}/>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Collaborators: Romain Brégier, Nermin Samet,<br/>Fabien Baradel, David Picard, István Sárándi<br/>
              <span style={{ color: 'var(--text-dim)' }}>valeo.ai · IMAGINE Lab ENPC · Univ. Tübingen · NAVER LABS</span>
            </div>
          </div>
        </div>
      </div>
    </Slide>
  )
}

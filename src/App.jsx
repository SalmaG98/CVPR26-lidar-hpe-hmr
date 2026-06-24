import { useState, useEffect, useCallback, useRef } from 'react'
import { allSlides } from './slides/index.js'

/* ─── Progress bar ─────────────────────────────── */
function ProgressBar({ current, total, accent }) {
  const pct = total > 1 ? (current / (total - 1)) * 100 : 0
  return (
    <div className="progress-bar-track">
      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: accent }} />
    </div>
  )
}

/* ─── Overview modal ───────────────────────────── */
function Overview({ slides, current, onSelect, onClose }) {
  return (
    <div className="overview-modal" onClick={onClose}>
      <button className="overview-close" onClick={onClose}>Close  ✕</button>
      <div className="overview-grid" onClick={e => e.stopPropagation()}>
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`overview-thumb${i === current ? ' active' : ''}`}
            style={{ '--accent': s.accent }}
            onClick={() => onSelect(i)}
          >
            <div className="overview-thumb-num">#{i + 1}</div>
            <div className="overview-thumb-title">{s.title}</div>
            <div className="overview-thumb-section">{s.section}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Nav bar ──────────────────────────────────── */
function NavBar({ current, total, accent, onPrev, onNext, onOverview }) {
  return (
    <div className="nav-bar">
      <button className="nav-btn" onClick={onPrev} disabled={current === 0}>
        ← Prev
      </button>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className="nav-overview-btn" onClick={onOverview}>Overview</button>
        <span className="nav-counter">{current + 1} / {total}</span>
      </div>

      <button className="nav-btn" onClick={onNext} disabled={current === total - 1}>
        Next →
      </button>
    </div>
  )
}

/* ─── App ──────────────────────────────────────── */
export default function App() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState('idle') // 'idle' | 'exit' | 'enter'
  const [showOverview, setShowOverview] = useState(false)
  const pendingIdx = useRef(null)

  const goTo = useCallback((next) => {
    if (next < 0 || next >= allSlides.length) return
    if (phase !== 'idle') return
    pendingIdx.current = next
    setPhase('exit')
  }, [phase])

  useEffect(() => {
    if (phase === 'exit') {
      const t = setTimeout(() => {
        setIdx(pendingIdx.current)
        setPhase('enter')
      }, 200)
      return () => clearTimeout(t)
    }
    if (phase === 'enter') {
      const t = setTimeout(() => setPhase('idle'), 300)
      return () => clearTimeout(t)
    }
  }, [phase])

  useEffect(() => {
    const onKey = (e) => {
      if (showOverview) {
        if (e.key === 'Escape') setShowOverview(false)
        return
      }
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goTo(idx + 1) }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(idx - 1) }
      if (e.key === 'Escape') setShowOverview(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, goTo, showOverview])

  const slide = allSlides[idx]
  const SlideComp = slide.component
  const accent = slide.accent || 'var(--cyan)'

  return (
    <div className="app" style={{ '--accent': accent }}>
      <ProgressBar current={idx} total={allSlides.length} accent={accent} />

      <div className="slide-viewport">
        <div
          className={`slide-wrapper ${
            phase === 'exit' ? 'anim-exit' : phase === 'enter' ? 'anim-enter' : ''
          }`}
        >
          <SlideComp slideNum={idx + 1} total={allSlides.length} />
        </div>
      </div>

      <NavBar
        current={idx}
        total={allSlides.length}
        accent={accent}
        onPrev={() => goTo(idx - 1)}
        onNext={() => goTo(idx + 1)}
        onOverview={() => setShowOverview(true)}
      />

      {showOverview && (
        <Overview
          slides={allSlides}
          current={idx}
          onSelect={(i) => { goTo(i); setShowOverview(false) }}
          onClose={() => setShowOverview(false)}
        />
      )}
    </div>
  )
}

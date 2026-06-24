import { useState, useEffect, useRef } from 'react'
import {
  T_POSE, PARENTS, computeFK, drawBody, axisAngleMat,
} from './smpl3d.js'

export default function SMPLVizFig({ width = 320, height = 420 }) {
  const [mode, setMode] = useState('skeleton')
  const canvasRef  = useRef(null)
  const animRef    = useRef(null)
  const tickRef    = useRef(0)
  const modeRef    = useRef(mode)

  useEffect(() => { modeRef.current = mode }, [mode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const frame = () => {
      tickRef.current++
      const t = tickRef.current

      // Gentle sway: arms oscillate, spine follows slightly
      const sway  = Math.sin(t * 0.025) * 0.18
      const sway2 = Math.sin(t * 0.025 + 0.3) * 0.06

      const thetaMats = Array(24).fill(null)
      thetaMats[16] = axisAngleMat([0,0,1],  sway)    // L shoulder Z
      thetaMats[17] = axisAngleMat([0,0,1], -sway)    // R shoulder Z
      thetaMats[6]  = axisAngleMat([0,0,1],  sway2)   // Spine2

      const joints = computeFK(T_POSE, thetaMats)

      const skelColor = modeRef.current === 'both' ? [245,158,11] : [6,182,212]
      drawBody(ctx, canvas.width, canvas.height, joints, modeRef.current, {
        meshFill:   [59,130,246],
        meshStroke: [6,182,212],
        skelColor,
        camZ: 2.6,
        offsetY: -0.10,
      })

      animRef.current = requestAnimationFrame(frame)
    }

    animRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animRef.current)
  }, [])   // single animation loop; reads modeRef on every frame

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'center' }}>
      {/* toggle buttons */}
      <div style={{ display:'flex', gap:8 }}>
        {['skeleton','mesh','both'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding:'4px 12px', borderRadius:6, cursor:'pointer',
            fontFamily:'inherit', fontSize:12, fontWeight:600, border:'1px solid',
            borderColor: mode===m ? 'var(--accent)' : 'var(--border)',
            background:  mode===m
              ? 'color-mix(in srgb, var(--accent) 20%, transparent)'
              : 'var(--surface2)',
            color: mode===m ? 'var(--accent)' : 'var(--text-muted)',
            transition:'all .15s',
          }}>{m}</button>
        ))}
      </div>

      <canvas ref={canvasRef} width={width} height={height}
        style={{ width, height, display:'block' }} />

      <div style={{ display:'flex', gap:16, fontSize:11, color:'var(--text-muted)' }}>
        {mode !== 'skeleton' && (
          <span style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:12, height:12, background:'#3b82f6', borderRadius:2,
              opacity:0.5, display:'inline-block' }} />
            Mesh (~7k vertices)
          </span>
        )}
        {mode !== 'mesh' && (
          <span style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:12, height:3,
              background: mode==='both' ? '#f59e0b' : 'var(--cyan)',
              display:'inline-block', borderRadius:1 }} />
            Skeleton (24 joints)
          </span>
        )}
      </div>
    </div>
  )
}

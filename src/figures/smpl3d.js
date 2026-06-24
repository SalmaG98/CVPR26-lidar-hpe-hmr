/* Shared SMPL-like 3D rendering utilities */

// ─── Math ───────────────────────────────────────────────────────────────────
export const dot3    = (a,b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2]
export const cross3  = (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
export const sub3    = (a,b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]]
export const add3    = (a,b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]]
export const scale3  = (a,s) => [a[0]*s,    a[1]*s,    a[2]*s]
export const norm3   = a => { const l=Math.sqrt(dot3(a,a)); return l<1e-9?[0,1,0]:scale3(a,1/l) }
export const matVec3 = (M,v) => [
  M[0]*v[0]+M[1]*v[1]+M[2]*v[2],
  M[3]*v[0]+M[4]*v[1]+M[5]*v[2],
  M[6]*v[0]+M[7]*v[1]+M[8]*v[2],
]
export const matMul = (A,B) => {
  const C = new Array(9)
  for (let i=0;i<3;i++) for (let j=0;j<3;j++)
    C[i*3+j] = A[i*3+0]*B[0*3+j]+A[i*3+1]*B[1*3+j]+A[i*3+2]*B[2*3+j]
  return C
}
export const I3 = [1,0,0, 0,1,0, 0,0,1]

export function axisAngleMat(axis, angle) {
  const k = norm3(axis), c = Math.cos(angle), s = Math.sin(angle), t = 1-c
  const [kx,ky,kz] = k
  return [
    t*kx*kx+c,     t*kx*ky-s*kz, t*kx*kz+s*ky,
    t*kx*ky+s*kz,  t*ky*ky+c,    t*ky*kz-s*kx,
    t*kx*kz-s*ky,  t*ky*kz+s*kx, t*kz*kz+c,
  ]
}

// ─── SMPL skeleton ──────────────────────────────────────────────────────────
// 24 joints, Y-up, pelvis at origin, human ~1.5 units tall
export const T_POSE = [
  [ 0.000,  0.000,  0.000], // 0  Pelvis
  [-0.095, -0.050,  0.000], // 1  L Hip
  [ 0.095, -0.050,  0.000], // 2  R Hip
  [ 0.000,  0.135,  0.000], // 3  Spine1
  [-0.100, -0.400,  0.000], // 4  L Knee
  [ 0.100, -0.400,  0.000], // 5  R Knee
  [ 0.000,  0.270,  0.000], // 6  Spine2
  [-0.100, -0.760,  0.000], // 7  L Ankle
  [ 0.100, -0.760,  0.000], // 8  R Ankle
  [ 0.000,  0.400,  0.000], // 9  Spine3 / chest
  [-0.110, -0.810,  0.090], // 10 L Toe
  [ 0.110, -0.810,  0.090], // 11 R Toe
  [ 0.000,  0.550,  0.000], // 12 Neck
  [-0.075,  0.495,  0.000], // 13 L Collar
  [ 0.075,  0.495,  0.000], // 14 R Collar
  [ 0.000,  0.700,  0.000], // 15 Head top
  [-0.290,  0.485,  0.000], // 16 L Shoulder
  [ 0.290,  0.485,  0.000], // 17 R Shoulder
  [-0.540,  0.485,  0.000], // 18 L Elbow
  [ 0.540,  0.485,  0.000], // 19 R Elbow
  [-0.775,  0.485,  0.000], // 20 L Wrist
  [ 0.775,  0.485,  0.000], // 21 R Wrist
  [-0.830,  0.485, -0.030], // 22 L Hand
  [ 0.830,  0.485, -0.030], // 23 R Hand
]

export const PARENTS = [-1,0,0,0,1,2,3,4,5,6,7,8,9,9,9,12,13,14,16,17,18,19,20,21]

export const BONES = [
  [0,1],[0,2],[0,3],[1,4],[2,5],[3,6],[4,7],[5,8],
  [6,9],[7,10],[8,11],[9,12],[9,13],[9,14],[12,15],
  [13,16],[14,17],[16,18],[17,19],[18,20],[19,21],[20,22],[21,23],
]

export const JOINT_NAMES = [
  'Pelvis','L Hip','R Hip','Spine1','L Knee','R Knee','Spine2',
  'L Ankle','R Ankle','Spine3','L Toe','R Toe','Neck',
  'L Collar','R Collar','Head','L Shoulder','R Shoulder',
  'L Elbow','R Elbow','L Wrist','R Wrist','L Hand','R Hand',
]

const BONE_R_MAP = {
  '0-1':0.070, '0-2':0.070, '0-3':0.090, '1-4':0.065, '2-5':0.065,
  '3-6':0.090, '4-7':0.055, '5-8':0.055, '6-9':0.095, '7-10':0.035,
  '8-11':0.035,'9-12':0.060,'9-13':0.070,'9-14':0.070,'12-15':0.075,
  '13-16':0.052,'14-17':0.052,'16-18':0.042,'17-19':0.042,
  '18-20':0.036,'19-21':0.036,'20-22':0.028,'21-23':0.028,
}
export const getBoneR = (a, b) =>
  BONE_R_MAP[`${a}-${b}`] || BONE_R_MAP[`${b}-${a}`] || 0.05

// ─── Forward Kinematics ─────────────────────────────────────────────────────
export function computeFK(tPose, thetaMats) {
  const n = tPose.length
  const wPos = [], wRot = []
  for (let i = 0; i < n; i++) {
    const p = PARENTS[i]
    const lR = thetaMats[i] || I3
    if (p < 0) {
      wPos[i] = [...tPose[i]]
      wRot[i] = lR
    } else {
      const off = sub3(tPose[i], tPose[p])
      wPos[i] = add3(wPos[p], matVec3(wRot[p], off))
      wRot[i] = matMul(wRot[p], lR)
    }
  }
  return wPos
}

// ─── Beta deformation ────────────────────────────────────────────────────────
// Approximate SMPL shape blend shapes with linear scaling
export function applyBetas(betas) {
  const [b0=0, b1=0, b2=0, b3=0, b4=0] = betas
  return T_POSE.map((j, i) => {
    let [x, y, z] = j
    // β0: height — scale all Y offsets
    y *= (1 + b0 * 0.10)
    // β1: width — scale X offsets
    x *= (1 + b1 * 0.09)
    // β2: arm length — extend elbow, wrist, hand joints outward
    if ([18,19,20,21,22,23].includes(i)) {
      const sign = x >= 0 ? 1 : -1
      x += sign * b2 * 0.07
    }
    // β3: leg length — push ankle, toe joints further down
    if ([4,5].includes(i)) { y -= b3 * 0.05 }
    if ([7,8].includes(i)) { y -= b3 * 0.10 }
    if ([10,11].includes(i)) { y -= b3 * 0.11 }
    // β4: torso depth — move spine/chest joints forward/back
    if ([3,6,9,12,13,14].includes(i)) { z += b4 * 0.04 }
    return [x, y, z]
  })
}

// ─── Geometry ────────────────────────────────────────────────────────────────
const N_SEG = 10  // cylinder segments

export function makeCylinder(a, b, r) {
  const dir = norm3(sub3(b, a))
  let perp = Math.abs(dir[0]) < 0.9 ? [1,0,0] : [0,1,0]
  const d = dot3(perp, dir)
  perp = norm3(sub3(perp, scale3(dir, d)))
  const perp2 = cross3(dir, perp)

  const rA = [], rB = [], ns = []
  for (let i = 0; i < N_SEG; i++) {
    const ang = (i / N_SEG) * Math.PI * 2
    const c = Math.cos(ang), s = Math.sin(ang)
    const n = [c*perp[0]+s*perp2[0], c*perp[1]+s*perp2[1], c*perp[2]+s*perp2[2]]
    ns.push(n)
    rA.push(add3(a, scale3(n, r)))
    rB.push(add3(b, scale3(n, r)))
  }

  const tris = []
  for (let i = 0; i < N_SEG; i++) {
    const j = (i+1) % N_SEG
    const nAvg = norm3(add3(ns[i], ns[j]))
    tris.push({ verts:[rA[i], rA[j], rB[i]], normal: nAvg })
    tris.push({ verts:[rA[j], rB[j], rB[i]], normal: nAvg })
  }
  return tris
}

const LAT = 7, LON = 10
export function makeSphere(center, r) {
  const tris = []
  for (let lat = 0; lat < LAT; lat++) {
    const t0 = (lat/LAT)*Math.PI, t1 = ((lat+1)/LAT)*Math.PI
    for (let lon = 0; lon < LON; lon++) {
      const p0 = (lon/LON)*Math.PI*2, p1 = ((lon+1)/LON)*Math.PI*2
      const v = (t,p) => {
        const n = [Math.sin(t)*Math.cos(p), Math.cos(t), Math.sin(t)*Math.sin(p)]
        return { v: add3(center, scale3(n, r)), n }
      }
      const a=v(t0,p0),b=v(t0,p1),c=v(t1,p0),d=v(t1,p1)
      const nAvg = norm3(add3(add3(a.n,b.n),add3(c.n,d.n)))
      tris.push({ verts:[a.v,b.v,c.v], normal:nAvg })
      tris.push({ verts:[b.v,d.v,c.v], normal:nAvg })
    }
  }
  return tris
}

// ─── Canvas Renderer ─────────────────────────────────────────────────────────
const LIGHT = norm3([0.4, 0.8, 1.0])

export function drawBody(ctx, W, H, joints, mode, opts = {}) {
  const {
    meshFill = [59,130,246],
    meshStroke = [6,182,212],
    skelColor = [6,182,212],
    camZ = 2.6,
    offsetY = -0.15,
    scale: userScale,
  } = opts

  const scale = userScale || H * 0.36
  const cx = W/2, cy = H/2

  const proj = ([x,y,z]) => {
    const pz = z + camZ
    const f = camZ * scale
    return [cx + x*f/pz, cy - (y+offsetY)*f/pz, pz]
  }

  ctx.clearRect(0, 0, W, H)

  // ── Mesh ──
  if (mode === 'mesh' || mode === 'both') {
    const allTris = []

    for (const [a,b] of BONES) {
      const r = getBoneR(a,b)
      for (const tri of makeCylinder(joints[a], joints[b], r)) {
        const ps = tri.verts.map(proj)
        const avgZ = (ps[0][2]+ps[1][2]+ps[2][2])/3
        const lumi = Math.max(0.1, dot3(tri.normal, LIGHT))
        allTris.push({ ps, avgZ, lumi })
      }
    }
    // Head sphere
    const headDir = norm3(sub3(joints[15], joints[12]))
    const headCenter = add3(joints[12], scale3(headDir, 0.13))
    for (const tri of makeSphere(headCenter, 0.12)) {
      const ps = tri.verts.map(proj)
      const avgZ = (ps[0][2]+ps[1][2]+ps[2][2])/3
      const lumi = Math.max(0.1, dot3(tri.normal, LIGHT))
      allTris.push({ ps, avgZ, lumi })
    }

    allTris.sort((a,b) => b.avgZ - a.avgZ)

    const [mr,mg,mb] = meshFill
    const [sr,sg,sb] = meshStroke
    for (const { ps, lumi } of allTris) {
      ctx.beginPath()
      ctx.moveTo(ps[0][0], ps[0][1])
      ctx.lineTo(ps[1][0], ps[1][1])
      ctx.lineTo(ps[2][0], ps[2][1])
      ctx.closePath()
      ctx.fillStyle = `rgba(${mr},${mg},${mb},${(0.25+0.75*lumi)*0.8})`
      ctx.fill()
      ctx.strokeStyle = `rgba(${sr},${sg},${sb},${lumi*0.25})`
      ctx.lineWidth = 0.5
      ctx.stroke()
    }
  }

  // ── Skeleton ──
  if (mode === 'skeleton' || mode === 'both') {
    const [r,g,b] = skelColor
    const alpha = mode === 'both' ? 0.85 : 1.0
    for (const [a,bj] of BONES) {
      const pa = proj(joints[a]), pb = proj(joints[bj])
      ctx.beginPath()
      ctx.moveTo(pa[0], pa[1])
      ctx.lineTo(pb[0], pb[1])
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
      ctx.lineWidth = mode === 'both' ? 1.8 : 2.5
      ctx.stroke()
    }
    for (const j of joints) {
      const pj = proj(j)
      ctx.beginPath()
      ctx.arc(pj[0], pj[1], mode === 'both' ? 3 : 4, 0, Math.PI*2)
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
      ctx.fill()
    }
  }
}

/**
 * Real SMPL Linear Blend Skinning renderer for canvas2D.
 * Loads pre-baked binary assets from /smpl/ and performs LBS in JS.
 *
 * Binary asset layout (all saved by numpy .tofile(), C-order):
 *   vtemplate.bin   float32  (6890, 3)      T-pose vertices
 *   shapedirs10.bin float32  (6890, 3, 10)  first-10 shape blend shapes
 *   weights.bin     float32  (6890, 24)     skinning weights
 *   faces.bin       uint32   (13776, 3)     triangle face indices
 *   smpl_meta.json           J_rest, J_shapedirs, parents
 */

const N_VERTS  = 6890
const N_FACES  = 13776
const N_JOINTS = 24
const N_BETAS  = 10

// ─── Math helpers (all inline for perf) ──────────────────────────────────────

function axisAngleMat9(ax, ay, az, angle, out, offset) {
  const len = Math.sqrt(ax*ax + ay*ay + az*az)
  if (len < 1e-9) { out[offset]=1;out[offset+1]=0;out[offset+2]=0; out[offset+3]=0;out[offset+4]=1;out[offset+5]=0; out[offset+6]=0;out[offset+7]=0;out[offset+8]=1; return }
  ax/=len; ay/=len; az/=len
  const c=Math.cos(angle), s=Math.sin(angle), t=1-c
  out[offset+0] = t*ax*ax+c;     out[offset+1] = t*ax*ay-s*az; out[offset+2] = t*ax*az+s*ay
  out[offset+3] = t*ax*ay+s*az;  out[offset+4] = t*ay*ay+c;    out[offset+5] = t*ay*az-s*ax
  out[offset+6] = t*ax*az-s*ay;  out[offset+7] = t*ay*az+s*ax; out[offset+8] = t*az*az+c
}

// out[oC] = A[oA] @ B[oB]  (3×3 matrices stored flat, row-major)
function matmul9(A, oA, B, oB, out, oC) {
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    out[oC+r*3+c] = A[oA+r*3+0]*B[oB+c] + A[oA+r*3+1]*B[oB+3+c] + A[oA+r*3+2]*B[oB+6+c]
  }
}

// ─── Data loading ─────────────────────────────────────────────────────────────

export async function loadSMPL() {
  const [vtBuf, sdBuf, wtBuf, faBuf, metaRes] = await Promise.all([
    fetch('/smpl/vtemplate.bin').then(r => r.arrayBuffer()),
    fetch('/smpl/shapedirs10.bin').then(r => r.arrayBuffer()),
    fetch('/smpl/weights.bin').then(r => r.arrayBuffer()),
    fetch('/smpl/faces.bin').then(r => r.arrayBuffer()),
    fetch('/smpl/smpl_meta.json').then(r => r.json()),
  ])
  return {
    vT:     new Float32Array(vtBuf),   // (6890*3)
    sd10:   new Float32Array(sdBuf),   // (6890*3*10) index = v*30 + c*10 + b
    wt:     new Float32Array(wtBuf),   // (6890*24)   index = v*24 + j
    faces:  new Uint32Array(faBuf),    // (13776*3)
    meta:   metaRes,                   // { J_rest, J_shapedirs, parents }
  }
}

// ─── Core LBS ─────────────────────────────────────────────────────────────────

/**
 * Full SMPL forward pass.
 * Returns Float32Array of length N_VERTS*3 with world-space posed vertices.
 */
export function smplForward(smpl, betas, theta, globalYaw, globalPitch) {
  const { vT, sd10, wt, meta: { J_rest, J_shapedirs, parents } } = smpl

  // ── 1. Shape blend shapes → v_shaped ─────────────────────────────────────
  const vShaped = new Float32Array(N_VERTS * 3)
  vShaped.set(vT)
  for (let b = 0; b < N_BETAS; b++) {
    const bv = betas[b]
    if (Math.abs(bv) < 1e-7) continue
    for (let v = 0; v < N_VERTS; v++) {
      const base = v * 30
      vShaped[v*3]   += bv * sd10[base +      b]
      vShaped[v*3+1] += bv * sd10[base + 10 + b]
      vShaped[v*3+2] += bv * sd10[base + 20 + b]
    }
  }

  // ── 2. Shaped joint positions ─────────────────────────────────────────────
  const jS = new Float32Array(N_JOINTS * 3)
  for (let j = 0; j < N_JOINTS; j++) {
    jS[j*3]   = J_rest[j][0]
    jS[j*3+1] = J_rest[j][1]
    jS[j*3+2] = J_rest[j][2]
    for (let b = 0; b < N_BETAS; b++) {
      const bv = betas[b]
      if (Math.abs(bv) < 1e-7) continue
      jS[j*3]   += bv * J_shapedirs[j][0][b]
      jS[j*3+1] += bv * J_shapedirs[j][1][b]
      jS[j*3+2] += bv * J_shapedirs[j][2][b]
    }
  }

  // ── 3. Build local rotation matrices ─────────────────────────────────────
  const localR = new Float32Array(N_JOINTS * 9)
  // identity for all
  for (let j = 0; j < N_JOINTS; j++) { localR[j*9]=1; localR[j*9+4]=1; localR[j*9+8]=1 }

  const {
    spineX=0, spineZ=0,
    lArmZ=0, rArmZ=0, lArmX=0, rArmX=0,
    lLegX=0, rLegX=0, lKneeX=0, rKneeX=0,
  } = theta

  const tmp9 = new Float32Array(9)

  // θ₀ — root joint = global orientation (yaw then pitch), exactly as in SMPL
  if (globalYaw !== 0 || globalPitch !== 0) {
    axisAngleMat9(0,1,0, globalYaw, tmp9, 0)
    const px9 = new Float32Array(9); axisAngleMat9(1,0,0, globalPitch, px9, 0)
    matmul9(px9,0, tmp9,0, localR, 0*9)   // localR[0] = pitch @ yaw
  }

  // Spine: distribute equally across joints 3, 6, 9
  if (spineX !== 0 || spineZ !== 0) {
    axisAngleMat9(0,0,1, spineZ/3, tmp9, 0)
    const rx9 = new Float32Array(9); axisAngleMat9(1,0,0, spineX/3, rx9, 0)
    const sm9 = new Float32Array(9); matmul9(rx9,0, tmp9,0, sm9,0)
    for (const j of [3, 6, 9]) localR.set(sm9, j*9)
  }
  // Left shoulder
  if (lArmZ !== 0 || lArmX !== 0) {
    axisAngleMat9(0,0,1, lArmZ, tmp9, 0)
    const rx9 = new Float32Array(9); axisAngleMat9(1,0,0, lArmX, rx9, 0)
    matmul9(rx9,0, tmp9,0, localR, 16*9)
  }
  // Right shoulder
  if (rArmZ !== 0 || rArmX !== 0) {
    axisAngleMat9(0,0,1, rArmZ, tmp9, 0)
    const rx9 = new Float32Array(9); axisAngleMat9(1,0,0, rArmX, rx9, 0)
    matmul9(rx9,0, tmp9,0, localR, 17*9)
  }
  // Hips
  if (lLegX !== 0) axisAngleMat9(1,0,0, lLegX, localR, 1*9)
  if (rLegX !== 0) axisAngleMat9(1,0,0, rLegX, localR, 2*9)
  // Knees
  if (lKneeX !== 0) axisAngleMat9(1,0,0, lKneeX, localR, 4*9)
  if (rKneeX !== 0) axisAngleMat9(1,0,0, rKneeX, localR, 5*9)

  // ── 4. FK: world positions + rotations ───────────────────────────────────
  const wPos = new Float32Array(N_JOINTS * 3)
  const wRot = new Float32Array(N_JOINTS * 9)
  // root identity
  wRot[0]=1; wRot[4]=1; wRot[8]=1
  wPos[0]=jS[0]; wPos[1]=jS[1]; wPos[2]=jS[2]

  for (let j = 1; j < N_JOINTS; j++) {
    const p = parents[j]
    // Rotate local offset by parent world rotation
    const ox = jS[j*3]  -jS[p*3]
    const oy = jS[j*3+1]-jS[p*3+1]
    const oz = jS[j*3+2]-jS[p*3+2]
    const R=wRot, po=p*9
    wPos[j*3]   = wPos[p*3]   + R[po]*ox + R[po+1]*oy + R[po+2]*oz
    wPos[j*3+1] = wPos[p*3+1] + R[po+3]*ox + R[po+4]*oy + R[po+5]*oz
    wPos[j*3+2] = wPos[p*3+2] + R[po+6]*ox + R[po+7]*oy + R[po+8]*oz
    // Accumulate rotation: wRot[j] = wRot[p] @ localR[j]
    matmul9(wRot, po, localR, j*9, wRot, j*9)
  }

  // ── 5. LBS ───────────────────────────────────────────────────────────────
  const vPosed = new Float32Array(N_VERTS * 3)
  for (let v = 0; v < N_VERTS; v++) {
    const vx=vShaped[v*3], vy=vShaped[v*3+1], vz=vShaped[v*3+2]
    let px=0, py=0, pz=0
    for (let j = 0; j < N_JOINTS; j++) {
      const w = wt[v*24+j]
      if (w < 1e-4) continue
      const dx=vx-jS[j*3], dy=vy-jS[j*3+1], dz=vz-jS[j*3+2]
      const R=wRot, o=j*9
      px += w*(R[o]*dx + R[o+1]*dy + R[o+2]*dz + wPos[j*3])
      py += w*(R[o+3]*dx + R[o+4]*dy + R[o+5]*dz + wPos[j*3+1])
      pz += w*(R[o+6]*dx + R[o+7]*dy + R[o+8]*dz + wPos[j*3+2])
    }
    vPosed[v*3]=px; vPosed[v*3+1]=py; vPosed[v*3+2]=pz
  }

  return { vPosed, wPos, wRot, jS }
}

// ─── Canvas renderer ──────────────────────────────────────────────────────────

const LIGHT_X = 0.3, LIGHT_Y = 0.7, LIGHT_Z = 0.9   // approx normalised
const LIGHT_LEN = Math.sqrt(LIGHT_X**2+LIGHT_Y**2+LIGHT_Z**2)
const LX=LIGHT_X/LIGHT_LEN, LY=LIGHT_Y/LIGHT_LEN, LZ=LIGHT_Z/LIGHT_LEN

export function renderSMPL(ctx, W, H, smpl, betas, theta, opts = {}) {
  const {
    globalYaw = 0, globalPitch = 0,
    tx = 0, ty = 0, tz = 0,
    camZ = 3.2,
    meshColor = [80, 140, 220],
    drawSkeleton = true,
  } = opts

  const { vPosed, wPos } = smplForward(smpl, betas, theta, globalYaw, globalPitch)
  const faces = smpl.faces

  // ── Body centroid → centre on canvas ────────────────────────────────────
  // Rough Y midpoint so the whole body fits
  let yMid = 0
  for (let v = 0; v < N_VERTS; v++) yMid += vPosed[v*3+1]
  yMid /= N_VERTS

  const scale = H * 0.40
  const cx = W/2 + tx * scale
  const cy = H/2 - ty * scale

  const proj = (x, y, z) => {
    const pz = z + tz + camZ      // tz shifts depth (closer/further)
    const f  = camZ * scale
    return [cx - x*f/pz, cy - (y-yMid)*f/pz, pz]  // flip X for front-facing view
  }

  // ── Project all vertices ─────────────────────────────────────────────────
  const vScreen = new Float32Array(N_VERTS * 3)  // [sx, sy, depth] per vertex
  for (let v = 0; v < N_VERTS; v++) {
    const [sx, sy, d] = proj(vPosed[v*3], vPosed[v*3+1], vPosed[v*3+2])
    vScreen[v*3]=sx; vScreen[v*3+1]=sy; vScreen[v*3+2]=d
  }

  // ── Collect face info: depth, normal, luminance ──────────────────────────
  const nFaces = N_FACES
  const fDepth  = new Float32Array(nFaces)
  const fLumi   = new Float32Array(nFaces)
  const fFront  = new Uint8Array(nFaces)

  for (let fi = 0; fi < nFaces; fi++) {
    const ai=faces[fi*3], bi=faces[fi*3+1], ci=faces[fi*3+2]
    const ax=vPosed[ai*3], ay=vPosed[ai*3+1], az=vPosed[ai*3+2]
    const bx=vPosed[bi*3], by=vPosed[bi*3+1], bz=vPosed[bi*3+2]
    const cx2=vPosed[ci*3], cy2=vPosed[ci*3+1], cz2=vPosed[ci*3+2]

    // Edge vectors
    const e1x=bx-ax, e1y=by-ay, e1z=bz-az
    const e2x=cx2-ax, e2y=cy2-ay, e2z=cz2-az

    // Face normal (cross product)
    let nx=e1y*e2z-e1z*e2y, ny=e1z*e2x-e1x*e2z, nz=e1x*e2y-e1y*e2x
    const nl=Math.sqrt(nx*nx+ny*ny+nz*nz)
    if (nl < 1e-9) continue
    nx/=nl; ny/=nl; nz/=nl

    // Back-face culling: in screen space, check if Z-component of normal faces camera
    // Since we flip X for display, and camera is at +Z, front faces have nz > 0 in world space
    // Simple heuristic: use screen-space winding (counter-clockwise = front)
    const a2x=vScreen[ai*3], a2y=vScreen[ai*3+1]
    const b2x=vScreen[bi*3], b2y=vScreen[bi*3+1]
    const c2x=vScreen[ci*3], c2y=vScreen[ci*3+1]
    const cross2d = (b2x-a2x)*(c2y-a2y) - (b2y-a2y)*(c2x-a2x)
    fFront[fi] = cross2d < 0 ? 1 : 0   // CCW in screen (Y-down) = front-facing

    fDepth[fi] = (vScreen[ai*3+2] + vScreen[bi*3+2] + vScreen[ci*3+2]) / 3

    // Lambertian shading using 3D face normal
    const lum = nx*LX + ny*LY + nz*LZ
    fLumi[fi] = Math.max(0.12, lum)
  }

  // ── Sort front faces by depth ────────────────────────────────────────────
  const frontFaces = []
  for (let fi = 0; fi < nFaces; fi++) if (fFront[fi]) frontFaces.push(fi)
  frontFaces.sort((a, b) => fDepth[b] - fDepth[a])

  // ── Draw ─────────────────────────────────────────────────────────────────
  ctx.clearRect(0, 0, W, H)
  const [mr, mg, mb] = meshColor
  for (const fi of frontFaces) {
    const ai=faces[fi*3], bi=faces[fi*3+1], ci=faces[fi*3+2]
    ctx.beginPath()
    ctx.moveTo(vScreen[ai*3], vScreen[ai*3+1])
    ctx.lineTo(vScreen[bi*3], vScreen[bi*3+1])
    ctx.lineTo(vScreen[ci*3], vScreen[ci*3+1])
    ctx.closePath()
    const lum = fLumi[fi]
    ctx.fillStyle = `rgb(${Math.round(mr*lum)},${Math.round(mg*lum)},${Math.round(mb*lum)})`
    ctx.fill()
  }

  // ── Skeleton overlay ─────────────────────────────────────────────────────
  if (drawSkeleton) {
    const SMPL_BONES = [
      [0,1],[0,2],[0,3],[1,4],[2,5],[3,6],[4,7],[5,8],
      [6,9],[9,12],[9,13],[9,14],[12,15],
      [13,16],[14,17],[16,18],[17,19],[18,20],[19,21],[20,22],[21,23],
    ]
    for (const [a,b] of SMPL_BONES) {
      const [ax2,ay2] = proj(wPos[a*3], wPos[a*3+1], wPos[a*3+2])
      const [bx2,by2] = proj(wPos[b*3], wPos[b*3+1], wPos[b*3+2])
      ctx.beginPath(); ctx.moveTo(ax2,ay2); ctx.lineTo(bx2,by2)
      ctx.strokeStyle='rgba(250,200,50,0.85)'; ctx.lineWidth=1.5; ctx.stroke()
    }
    for (let j = 0; j < N_JOINTS; j++) {
      const [sx,sy] = proj(wPos[j*3], wPos[j*3+1], wPos[j*3+2])
      ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI*2)
      ctx.fillStyle='rgba(250,200,50,0.9)'; ctx.fill()
    }
  }
}

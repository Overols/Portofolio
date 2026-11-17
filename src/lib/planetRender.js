const perm = new Uint8Array(512);

export function seedNoise(seed) {
  const t = new Uint8Array(256);
  for (let i = 0; i < 256; i++) t[i] = i;
  let s = seed >>> 0;
  for (let i = 255; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = Math.floor((s / 4294967296) * (i + 1));
    const k = t[i]; t[i] = t[j]; t[j] = k;
  }
  for (let i = 0; i < 512; i++) perm[i] = t[i & 255];
}

const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t, a, b) => a + t * (b - a);

function grad(h, x, y, z) {
  h &= 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

function noise3(x, y, z) {
  let X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
  x -= X; y -= Y; z -= Z;
  X &= 255; Y &= 255; Z &= 255;
  const u = fade(x), v = fade(y), w = fade(z);
  const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z;
  const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
  return lerp(w,
    lerp(v, lerp(u, grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z)),
            lerp(u, grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z))),
    lerp(v, lerp(u, grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1)),
            lerp(u, grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1))));
}

function fbm(x, y, z, oct) {
  let sum = 0, amp = 0.5, f = 1;
  const n = Math.ceil(oct);
  for (let i = 0; i < n; i++) {
    const w = Math.min(1, oct - i);
    sum += amp * w * noise3(x * f, y * f, z * f);
    amp *= 0.5; f *= 2.03;
  }
  return sum;
}

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bayer = (x, y) => (BAYER[((y & 3) << 2) | (x & 3)] + 0.5) / 16;

function hash2(x, y) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const DEEP = [18, 35, 92], OCEAN = [29, 63, 148], SHALLOW = [47, 120, 208];
const BEACH = [240, 226, 168], DESERT = [227, 184, 104];
const GRASS = [47, 196, 111], FOREST = [26, 149, 96];
const ROCK = [140, 120, 168], SNOW = [241, 238, 255];
const CLOUD = [255, 255, 255], CLOUD_EDGE = [255, 214, 240];
const GLOW_COOL = [111, 224, 255], GLOW_WARM = [255, 154, 213];
const NIGHT = [20, 24, 70];

export const DEFAULTS = {
  seed: 7, fov: 0.75, d0: 4.6, d1: 1.06, offsetX: 0.42,
  rot0: 3.0, rotSpan: 1.1, tilt: 0.35, f0: 1.5, sea: -0.03, levels: 4,
};

const LX = -0.5, LY = 0.45, LZ = 0.74;
const LL = Math.hypot(LX, LY, LZ);
const LDX = LX / LL, LDY = LY / LL, LDZ = LZ / LL;

let seededWith = null;

export function renderPlanet(buf, cols, rows, p, opt) {
  const o = opt ? { ...DEFAULTS, ...opt } : DEFAULTS;
  if (seededWith !== o.seed) { seedNoise(o.seed); seededWith = o.seed; }

  const aspect = cols / rows;
  const tf = Math.tan(o.fov * 0.5) * Math.max(1, 1 / aspect);
  const d = 1 + (o.d0 - 1) * Math.pow((o.d1 - 1) / (o.d0 - 1), p);
  const ox = aspect * o.offsetX * (1 - smooth(0, 0.55, p));
  const rot = o.rot0 + (o.rotationProgress ?? p) * o.rotSpan;
  const cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(o.tilt), st = Math.sin(o.tilt);
  const cloudFade = smooth(1.04, 1.5, d);
  const starScale = 1 + 3 * p;
  const pxFp = (2 * tf) / rows;
  const LV = o.levels;

  for (let y = 0; y < rows; y++) {
    const sy = 1 - (2 * (y + 0.5)) / rows;

    for (let x = 0; x < cols; x++) {
      const sx = aspect * ((2 * (x + 0.5)) / cols - 1) - ox;
      const dx = sx * tf, dy = sy * tf;
      const inv = 1 / Math.sqrt(dx * dx + dy * dy + 1);
      const ddx = dx * inv, ddy = dy * inv, ddz = -inv;
      const b = d * ddz;
      const disc = b * b - (d * d - 1);
      const idx = y * cols + x;
      const bd = bayer(x, y);
 
      if (disc >= 0) {
        const t = -b - Math.sqrt(disc);
        const nx = t * ddx, ny = t * ddy, nz = d + t * ddz;
        const ndv = Math.max(0.12, -(nx * ddx + ny * ddy + nz * ddz));
        const ndl = nx * LDX + ny * LDY + nz * LDZ;
 
        const px = nx * cr + nz * sr, pz0 = -nx * sr + nz * cr;
        const py = ny * ct - pz0 * st, pz = ny * st + pz0 * ct;
 
        const fp = (t * pxFp) / ndv;
        const oct = clamp(Math.log(1 / (2 * fp * o.f0)) / Math.log(2.03) + 1, 3, 10);
 
        const h = fbm(px * o.f0, py * o.f0, pz * o.f0, oct);
        let c;
        const sea = o.sea;
        if (h < sea - 0.3) c = DEEP;
        else if (h < sea - 0.12) c = OCEAN;
        else if (h < sea) c = SHALLOW;
        else if (h < sea + 0.035) c = BEACH;
        else if (h < 0.4) {
          const m = fbm(px * 1.1 + 9.1, py * 1.1 - 4.7, pz * 1.1 + 2.3, 3);
          if (h < 0.2) c = m < -0.14 ? DESERT : GRASS;
          else c = FOREST;
        } else if (h < 0.55) c = ROCK;
        else c = SNOW;
 
        let r = c[0], g = c[1], bl = c[2];
        if (h >= o.sea) {
          const k = 1 + (((Math.floor(h * 12) % 3) + 3) % 3 - 1) * 0.08;
          r *= k; g *= k; bl *= k;
        }
 
        if (cloudFade > 0.02) {
          const cv = fbm(px * 2.4 + 31.7, py * 2.4 + 12.3, pz * 2.4 - 7.9, 5) + 0.02;
          const thr = 0.14 + (1 - cloudFade) * 0.5;
          if (cv > thr + 0.14) { r = CLOUD[0]; g = CLOUD[1]; bl = CLOUD[2]; }
          else if (cv > thr) { r = (r + CLOUD_EDGE[0]) * 0.5 + 40; g = (g + CLOUD_EDGE[1]) * 0.5 + 20; bl = (bl + CLOUD_EDGE[2]) * 0.5 + 40; }
        }

        const lt = clamp(ndl * 0.85 + 0.2, 0, 1);
        const q = Math.floor(lt * (LV - 1) + 0.5 + (bd - 0.5) * 0.3) / (LV - 1);
        const br = 0.3 + 0.78 * q;
        const nt = (1 - q) * 0.35;
        r = r * br * (1 - nt) + NIGHT[0] * nt;
        g = g * br * (1 - nt) + NIGHT[1] * nt;
        bl = bl * br * (1 - nt) + NIGHT[2] * nt;

        const f = Math.pow(1 - ndv, 3);
        const band = f < 0.22 ? 0 : f < 0.45 ? 0.3 : f < 0.7 ? 0.6 : 0.9;
        if (band) {
          const lit = clamp(ndl * 0.7 + 0.55, 0, 1) * band;
          r += GLOW_COOL[0] * lit; g += GLOW_COOL[1] * lit; bl += GLOW_COOL[2] * lit;
        }
        buf[idx] = 0xff000000 | (clamp(bl, 0, 255) << 16) | (clamp(g, 0, 255) << 8) | clamp(r, 0, 255);
      } else {
        const bperp = Math.sqrt(d * d - b * b);
        const atm = 1.13;

        if (bperp < atm) {
          const gA = 1 - (bperp - 1) / (atm - 1);
          const band = gA * gA;
          const qb = band > 0.6 ? 0.85 : band > 0.3 ? 0.55 : band > 0.1 ? 0.28 : 0;
          
          if (qb) {
            const qx = -b * ddx, qy = -b * ddy, qz = d - b * ddz;
            const ql = Math.hypot(qx, qy, qz);
            const lit = clamp((qx * LDX + qy * LDY + qz * LDZ) / ql * 0.8 + 0.5, 0, 1);
            const a = qb * (0.25 + 0.75 * lit);
            const mixw = lit;
            const r = GLOW_COOL[0] * mixw + GLOW_WARM[0] * (1 - mixw);
            const g = GLOW_COOL[1] * mixw + GLOW_WARM[1] * (1 - mixw);
            const bl = GLOW_COOL[2] * mixw + GLOW_WARM[2] * (1 - mixw);
            buf[idx] = ((a * 255) << 24) | (bl << 16) | (g << 8) | r;
            continue;
          }
        }
        const cx = cols / 2 + (ox / aspect) * (cols / 2);
        const cy = rows / 2;
        const sxq = Math.floor((x - cx) / starScale + cx);
        const syq = Math.floor((y - cy) / starScale + cy);
        const hs = hash2(sxq, syq);

        if (hs < 0.012) {
          const k = hs / 0.012;
          const tone = k < 0.5 ? [255, 255, 255] : k < 0.75 ? [255, 160, 220] : [150, 190, 255];
          const a = 0.35 + 0.65 * hash2(syq, sxq);
          buf[idx] = ((a * 255) << 24) | (tone[2] << 16) | (tone[1] << 8) | tone[0];
        } else buf[idx] = 0;
      }
    }
  }
}
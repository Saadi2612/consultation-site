/**
 * Dots for the hero art: a latitude/longitude grid on a large sphere, seen
 * in perspective from a camera just above its surface and looking towards
 * the horizon. Computed at build time; the page receives only positions.
 *
 * Every value returned is a fraction of the art's width, so the dots can be
 * placed in `cqw` units and keep the sphere's proportions at any size.
 */
export interface Dot {
  x: number;
  y: number;
  r: number;
}

export interface DomeOptions {
  altitude: number; // camera height above the surface, in sphere radii
  pitch: number; // degrees the camera looks below horizontal
  focal: number; // focal length, in art widths
  step: number; // grid spacing, in degrees of arc
  horizonY: number; // where the top of the horizon lands, in art widths
  depth: number; // how far down the art extends, in art widths
  dotSize: number; // dot radius on the sphere, in sphere radii
  minR: number; // smallest rendered radius, in art widths
  maxR: number; // largest rendered radius, in art widths
  gap: number; // clear space kept between neighbouring dots, in art widths
}

const rad = Math.PI / 180;

// Deterministic jitter so the build output never changes between runs.
function hash(a: number, b: number): number {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function domeDots(o: DomeOptions): Dot[] {
  const h = 1 + o.altitude;
  const b = o.pitch * rad;
  // camera above (0, 0, 1), facing north along +y, pitched down by b
  const F = [0, Math.cos(b), -Math.sin(b)];
  const U = [0, Math.sin(b), Math.cos(b)];

  // place the horizon: the tangent ray dips by d below horizontal
  const dip = Math.acos(1 / h);
  const cy = o.horizonY + o.focal * Math.tan(b - dip);

  const candidates: (Dot & { main: boolean })[] = [];
  const reach = Math.acos(1 / h) / rad + o.step;
  const lonReach = 70;

  // two interleaved lattices: the main grid, and a half-step offset grid of
  // smaller dots between it, as in the reference
  for (const [offset, scale] of [
    [0, 1],
    [0.5, 0.62],
  ] as const) {
    for (let i = -Math.ceil(reach / o.step); i * o.step <= reach; i++) {
      const lat = (i + offset) * o.step;
      for (let j = -Math.ceil(lonReach / o.step); j * o.step <= lonReach; j++) {
        const lon = (j + offset) * o.step;
        const cl = Math.cos(lat * rad);
        const X = [cl * Math.sin(lon * rad), Math.sin(lat * rad), cl * Math.cos(lon * rad)];

        // only the side of the sphere the camera can see
        if (X[2] * h <= 1) continue;

        const D = [X[0], X[1], X[2] - h];
        const zc = D[0] * F[0] + D[1] * F[1] + D[2] * F[2];
        if (zc <= 0) continue;
        const yc = D[0] * U[0] + D[1] * U[1] + D[2] * U[2];

        const x = 0.5 + (o.focal * D[0]) / zc;
        const y = cy - (o.focal * yc) / zc;
        if (x < -0.02 || x > 1.02 || y > o.depth) continue;

        // grazing dots at the very rim merge into a line; thin them out
        const dist = Math.hypot(D[0], D[1], D[2]);
        const grazing = -(D[0] * X[0] + D[1] * X[1] + D[2] * X[2]) / dist;
        if (grazing < 0.012) continue;

        // perspective shrink, plus extra shrink as the surface turns away,
        // so the rim reads as a fine dense line of points
        const turn = 0.28 + 0.72 * Math.min(1, grazing / 0.55);
        const jitter = 0.66 + 0.62 * hash(i * 2 + offset * 2, j);
        const r = Math.min(o.maxR, ((o.focal * o.dotSize) / dist) * turn * scale * jitter);
        if (r < o.minR) continue;

        candidates.push({ x, y, r, main: scale === 1 });
      }
    }
  }

  // Towards the rim the grid foreshortens until dots touch. Main lattice
  // first, then nearest the viewer first, so thinning happens at the far edge.
  candidates.sort((a, b) => Number(b.main) - Number(a.main) || b.y - a.y);
  return thin(candidates, o.gap);
}

/**
 * Keep a dot only if it clears every dot already kept by `gap`, in the
 * order given. Used wherever a projected grid crowds at the far edge.
 */
export function thin(candidates: Dot[], gap: number): Dot[] {
  const cell = 0.02;
  const grid = new Map<string, Dot[]>();
  const dots: Dot[] = [];
  for (const c of candidates) {
    const gx = Math.floor(c.x / cell);
    const gy = Math.floor(c.y / cell);
    let clear = true;
    for (let dx = -1; dx <= 1 && clear; dx++) {
      for (let dy = -1; dy <= 1 && clear; dy++) {
        for (const d of grid.get(`${gx + dx},${gy + dy}`) ?? []) {
          if (Math.hypot(c.x - d.x, c.y - d.y) < c.r + d.r + gap) {
            clear = false;
            break;
          }
        }
      }
    }
    if (!clear) continue;
    const dot = { x: c.x, y: c.y, r: c.r };
    dots.push(dot);
    const key = `${gx},${gy}`;
    grid.set(key, [...(grid.get(key) ?? []), dot]);
  }
  return dots;
}

export const domeDefaults: DomeOptions = {
  altitude: 0.3,
  pitch: 38,
  focal: 1.3,
  step: 1.15,
  horizonY: 0.11,
  depth: 0.62,
  dotSize: 0.003,
  minR: 0.0005,
  maxR: 0.0031,
  gap: 0.0052,
};

/**
 * The dots as CSS: one box-shadow list per size bucket, offsets in `cqw`.
 * Each bucket is drawn by an element whose own size and radius make the
 * circle, so every shadow is an exact round dot.
 */
export function domeShadows(dots: Dot[], buckets = 7): { size: number; shadow: string }[] {
  const rs = dots.map((d) => d.r);
  const lo = Math.min(...rs);
  const hi = Math.max(...rs);
  const out: { size: number; dots: Dot[] }[] = Array.from({ length: buckets }, (_, k) => ({
    size: lo + ((hi - lo) * (k + 0.5)) / buckets,
    dots: [],
  }));
  for (const d of dots) {
    const k = Math.min(buckets - 1, Math.floor(((d.r - lo) / (hi - lo || 1)) * buckets));
    out[k].dots.push(d);
  }
  const n = (v: number) => (v * 100).toFixed(2);
  return out
    .filter((b) => b.dots.length)
    .map((b) => ({
      size: b.size * 2 * 100,
      shadow: b.dots
        .map((d) => `${n(d.x - b.size)}cqw ${n(d.y - b.size)}cqw`)
        .join(","),
    }));
}

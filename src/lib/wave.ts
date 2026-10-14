/**
 * Dots for the wave variant of the hero art: rows of dots that each follow
 * a sine curve, with the phase drifting a little from row to row so the
 * whole field ripples like a sheet of silk. Rows bunch together towards
 * the top and dots grow towards the bottom, so it keeps the same sense of a
 * horizon as the sphere. Computed at build time, returned in fractions of
 * the art's width, like domeDots.
 */
import type { Dot } from "./dome.ts";

export interface WaveOptions {
  rows: number; // number of dotted lines
  top: number; // y of the farthest line, in art widths
  bottom: number; // y of the nearest line, in art widths
  bunching: number; // >1 crowds lines towards the top
  frequency: number; // wave cycles across the art's width
  amplitudeFar: number; // wave height on the farthest line
  amplitudeNear: number; // wave height on the nearest line
  drift: number; // phase shift, in cycles, from the farthest line to the nearest
  stepFar: number; // dot spacing along the farthest line
  stepNear: number; // dot spacing along the nearest line
  rFar: number; // dot radius on the farthest line
  rNear: number; // dot radius on the nearest line
}

export function waveDots(o: WaveOptions): Dot[] {
  const dots: Dot[] = [];
  const tau = Math.PI * 2;
  for (let i = 0; i < o.rows; i++) {
    const t = i / (o.rows - 1); // 0 far, 1 near
    const base = o.top + (o.bottom - o.top) * Math.pow(t, o.bunching);
    const amp = o.amplitudeFar + (o.amplitudeNear - o.amplitudeFar) * t;
    const step = o.stepFar + (o.stepNear - o.stepFar) * t;
    const r = o.rFar + (o.rNear - o.rFar) * t;
    const phase = o.drift * t;
    // start each row half a step in on alternate lines, so neighbours
    // interleave instead of stacking in columns
    for (let x = (i % 2) * step * 0.5 - step; x <= 1 + step; x += step) {
      const main = Math.sin(tau * (x * o.frequency + phase));
      const swell = Math.sin(tau * (x * o.frequency * 0.43 - phase * 1.6 + 0.2));
      const y = base + amp * (0.72 * main + 0.28 * swell);
      // dots swell on the crests, as if catching light
      const lift = 0.7 + 0.45 * ((main + 1) / 2);
      dots.push({ x, y, r: r * lift });
    }
  }
  return dots;
}

export const waveDefaults: WaveOptions = {
  rows: 22,
  top: 0.13,
  bottom: 0.62,
  bunching: 1.7,
  frequency: 1.0,
  amplitudeFar: 0.008,
  amplitudeNear: 0.062,
  drift: 0.5,
  stepFar: 0.0065,
  stepNear: 0.022,
  rFar: 0.0009,
  rNear: 0.0032,
};

import { audio } from "@/lib/audio/manager";

// Bends time for the whole page: every running CSS/Web Animation and the
// soundtrack slow down together. Used by bullet time and Dead Eye.

let scale = 1;
let target = 1;
let ramp = 0;
let keeper = 0;

const apply = () => {
  for (const a of document.getAnimations()) a.playbackRate = scale;
  audio.setRate(scale);
};

/** Current time scale, for canvas effects that run their own clocks. */
export const getTimeScale = () => scale;

export const setTimeScale = (next: number, rampMs = 450) => {
  target = next;
  window.clearInterval(ramp);
  const from = scale;
  const t0 = performance.now();
  ramp = window.setInterval(() => {
    const k = Math.min(1, (performance.now() - t0) / rampMs);
    const eased = 1 - Math.pow(1 - k, 3);
    scale = from + (target - from) * eased;
    apply();
    if (k >= 1) window.clearInterval(ramp);
  }, 30);

  // Animations that start mid-warp (hover effects, reveals) need slowing too.
  window.clearInterval(keeper);
  if (next !== 1) keeper = window.setInterval(apply, 250);
};

import type { WorldSlug } from "@/data/worlds";
import type { Theme } from "./sequencer";
import { themes } from "./themes";

// Site-wide sound. Each art movement has an original generative theme. All
// themes share one transport, so a theme previewed on the select screen keeps
// playing, on the same beat, after you enter that world, and moving between
// worlds crossfades one piece of music into the next.

type Mode = "preview" | "world" | null;
type State = {
  enabled: boolean;
  unlocked: boolean;
  playing: WorldSlug | null;
  mode: Mode;
};

const initial: State = { enabled: true, unlocked: false, playing: null, mode: null };
let state: State = initial;
const listeners = new Set<() => void>();
const emit = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

export const audioStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => state,
  server: () => initial,
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let reverb: ConvolverNode | null = null;
let current: { slug: WorldSlug; theme: Theme } | null = null;
let desiredWorld: WorldSlug | null = null; // the world the visitor is in, even before sound unlocks
const CROSSFADE = 2.2;

const buildGraph = () => {
  ctx = new AudioContext();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.ratio.value = 3;
  master = ctx.createGain();
  master.gain.value = 0.7;
  master.connect(comp).connect(ctx.destination);
  reverb = ctx.createConvolver();
  const len = ctx.sampleRate * 2.4;
  const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = impulse.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  reverb.buffer = impulse;
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  reverb.connect(wet).connect(master);
};

const play = (slug: WorldSlug) => {
  if (!state.enabled || !state.unlocked || !ctx || !master || !reverb) return;
  emit({ playing: slug });
  // Already playing (a preview carrying on into its world, or a world that
  // announced itself after the crossfade began): leave it be.
  if (current?.slug === slug) return;
  // The outgoing theme fades while the incoming one, already on the same
  // beat, fades in over it.
  const fade = current ? CROSSFADE : 1.2;
  current?.theme.stop(fade);
  const theme = new themes[slug](ctx, master, reverb);
  theme.start(fade);
  current = { slug, theme };
};

const silence = (fade = 0.6) => {
  current?.theme.stop(fade);
  current = null;
  emit({ playing: null, mode: null });
};

const readPref = () => {
  try {
    return localStorage.getItem("sound") !== "off";
  } catch {
    return true;
  }
};

export const audio = {
  init() {
    emit({ enabled: readPref() });
  },

  /** Run inside a user gesture: browsers only allow sound after one. */
  unlock() {
    if (!ctx) buildGraph();
    ctx!.resume();
    if (!state.unlocked) emit({ unlocked: true });
    if (desiredWorld && !state.playing && state.enabled) {
      emit({ mode: "world" });
      play(desiredWorld);
    }
  },

  /** Select screen: play a world's theme while its panel is highlighted. */
  preview(slug: WorldSlug) {
    emit({ mode: "preview" });
    play(slug);
  },

  stopPreview() {
    if (state.mode === "preview") silence(0.5);
  },

  /** Inside a world: play its theme, carrying on from a preview of the same one. */
  setWorld(slug: WorldSlug | null) {
    desiredWorld = slug;
    if (slug === null) {
      silence();
      return;
    }
    emit({ mode: "world" });
    play(slug);
  },

  isEnabled: () => state.enabled,

  toggle() {
    const enabled = !state.enabled;
    try {
      localStorage.setItem("sound", enabled ? "on" : "off");
    } catch {}
    emit({ enabled });
    if (!enabled) {
      silence(0.3);
      return;
    }
    audio.unlock();
  },

  /** One-shot effects for micro-interactions, one family per movement. */
  sfx(kind: "click" | "stamp" | "tear" | "pop" | "slide") {
    if (!ctx || !master || !state.enabled) return;
    const c = ctx;
    const t = c.currentTime;
    const out = c.createGain();
    out.connect(master);
    const noise = (dur: number) => {
      const len = Math.ceil(c.sampleRate * dur);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      return src;
    };
    const tone = (type: OscillatorType, from: number, to: number, dur: number, level: number) => {
      const o = c.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(from, t);
      o.frequency.exponentialRampToValueAtTime(to, t + dur);
      const g = c.createGain();
      g.gain.setValueAtTime(level, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + dur + 0.02);
    };
    const burst = (type: BiquadFilterType, freq: number, dur: number, level: number, sweepTo?: number) => {
      const src = noise(dur + 0.05);
      const f = c.createBiquadFilter();
      f.type = type;
      f.frequency.setValueAtTime(freq, t);
      if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
      const g = c.createGain();
      g.gain.setValueAtTime(level, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f).connect(g).connect(out);
      src.start(t);
    };
    if (kind === "click") {
      // Bauhaus: a precise wooden click, like a block snapping into a grid
      tone("sine", 1800, 1200, 0.05, 0.12);
    } else if (kind === "stamp") {
      // Dada: a rubber stamp hitting the desk
      tone("sine", 160, 60, 0.12, 0.35);
      burst("lowpass", 900, 0.08, 0.2);
    } else if (kind === "tear") {
      // Dada: paper tearing
      burst("bandpass", 800, 0.3, 0.18, 4000);
    } else if (kind === "pop") {
      // Pop: a bright, round bubble pop
      tone("sine", 420, 1100, 0.09, 0.2);
    } else {
      // Cubism: a plane of card sliding over another
      burst("bandpass", 2400, 0.16, 0.08, 1400);
    }
  },
};

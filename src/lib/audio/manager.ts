import { worlds, type WorldSlug } from "@/data/worlds";
import type { Theme } from "./sequencer";
import { themes } from "./themes";
import { createPlayer, YT_PLAYING, type YTPlayer } from "./youtube";

// Site-wide audio. The soundtrack for each world plays through one YouTube
// player that lives in the root layout, so a song previewed on the select
// screen keeps playing, from the same moment, after you enter that world.
// If a video can't be embedded, that world falls back to a generative theme.

type Mode = "preview" | "world" | null;
type State = {
  enabled: boolean;
  unlocked: boolean;
  playing: WorldSlug | null;
  mode: Mode;
  source: "local" | "youtube" | "synth" | null;
};

const initial: State = { enabled: true, unlocked: false, playing: null, mode: null, source: null };
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

/* ——— Web Audio: effects and the synth fallback ——— */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let reverb: ConvolverNode | null = null;
let synth: { slug: WorldSlug; theme: Theme } | null = null;

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

const stopSynth = () => {
  synth?.theme.stop();
  synth = null;
};

const startSynth = (slug: WorldSlug) => {
  if (!ctx || !master || !reverb) return;
  if (synth?.slug === slug) return;
  stopSynth();
  const theme = new themes[slug](ctx, master, reverb);
  theme.start(1.2);
  synth = { slug, theme };
};

/* ——— YouTube player ——— */

let player: YTPlayer | null = null;
let playerPromise: Promise<YTPlayer | null> | null = null;
let host: HTMLElement | null = null;
const blocked = new Set<string>(); // videos that refused to embed
let fadeTimer = 0;
let desiredWorld: WorldSlug | null = null; // world page the visitor is on, even before audio unlocks
let volume = 0;

const trackFor = (slug: WorldSlug) => worlds.find((w) => w.slug === slug)!.soundtrack;

const fadeTo = (target: number, ms: number, done?: () => void) => {
  window.clearInterval(fadeTimer);
  const steps = Math.max(1, Math.round(ms / 50));
  const delta = (target - volume) / steps;
  let n = 0;
  fadeTimer = window.setInterval(() => {
    n++;
    volume = n >= steps ? target : volume + delta;
    player?.setVolume(Math.round(volume));
    if (n >= steps) {
      window.clearInterval(fadeTimer);
      done?.();
    }
  }, 50);
};

const ensurePlayer = () => {
  if (player) return Promise.resolve(player);
  if (!host) return Promise.resolve(null);
  playerPromise ??= createPlayer(host, {
    onError: () => {
      // 101/150: embedding disabled. Remember it and fall back to the synth.
      const id = player?.getVideoData()?.video_id;
      if (id) blocked.add(id);
      if (state.playing) {
        startSynth(state.playing);
        emit({ source: "synth" });
      }
    },
    onStateChange: () => {},
  })
    .then((p) => (player = p))
    .catch(() => null);
  return playerPromise;
};

/* ——— Local files (only present on Ayush's machine; gitignored) ——— */

// One element per track, so a world change can crossfade: the next song
// starts at the same second the last one had reached and fades in over it.
const localEls = new Map<string, HTMLAudioElement>();
const localFades = new Map<HTMLAudioElement, number>();
let localCurrent: HTMLAudioElement | null = null;
let localRate = 1;
const localExists = new Map<string, Promise<boolean>>();
const CROSSFADE = 2200;

const hasLocal = (url: string) => {
  if (!localExists.has(url)) {
    localExists.set(
      url,
      fetch(url, { method: "HEAD" })
        .then((r) => r.ok && (r.headers.get("content-type") ?? "").startsWith("audio"))
        .catch(() => false)
    );
  }
  return localExists.get(url)!;
};

const fadeLocal = (el: HTMLAudioElement, target: number, ms: number, done?: () => void) => {
  window.clearInterval(localFades.get(el));
  const steps = Math.max(1, Math.round(ms / 50));
  const delta = (target - el.volume) / steps;
  let n = 0;
  const id = window.setInterval(() => {
    n++;
    el.volume = n >= steps ? target : Math.min(1, Math.max(0, el.volume + delta));
    if (n >= steps) {
      window.clearInterval(id);
      done?.();
    }
  }, 50);
  localFades.set(el, id);
};

const stopLocal = (ms = 500) => {
  const el = localCurrent;
  localCurrent = null;
  if (el && !el.paused) fadeLocal(el, 0, ms, () => el.pause());
};

const localEl = (url: string) => {
  let el = localEls.get(url);
  if (!el) {
    el = new Audio(url);
    el.loop = true;
    el.preload = "auto";
    el.volume = 0;
    localEls.set(url, el);
  }
  el.preservesPitch = false;
  el.playbackRate = localRate;
  return el;
};

const playLocal = (url: string, startAt: number, fromPreview: boolean) => {
  const el = localEl(url);
  const prev = localCurrent;
  const target = fromPreview ? 0.7 : 0.85;
  localCurrent = el;

  if (prev === el) {
    // Same song: a hovered preview carries straight on into the world.
    el.play().catch(() => {});
    fadeLocal(el, target, 900);
    return;
  }

  // A different song picks up at the second the last one had reached, so the
  // change sounds like one piece of music turning into another. A song that is
  // still fading out (you scrolled back) just swells back in where it is.
  const carry = prev && !prev.paused ? prev.currentTime : null;
  const at = carry ?? (el.currentTime > 0 ? null : startAt);
  if (at !== null && el.paused) {
    const seek = () => (el.currentTime = el.duration ? at % el.duration : at);
    if (el.readyState >= 1) seek();
    else el.addEventListener("loadedmetadata", seek, { once: true });
  }
  el.play().catch(() => {});
  fadeLocal(el, target, prev ? CROSSFADE : 900);
  if (prev) fadeLocal(prev, 0, CROSSFADE, () => prev.pause());
};

const play = async (slug: WorldSlug, fromPreview: boolean) => {
  if (!state.enabled || !state.unlocked) return;
  const track = trackFor(slug);
  emit({ playing: slug });

  if (await hasLocal(track.local)) {
    if (state.playing !== slug) return;
    stopSynth();
    if (player) fadeTo(0, 300, () => player?.pauseVideo());
    emit({ source: "local" });
    playLocal(track.local, fromPreview ? track.previewAt : 0, fromPreview);
    return;
  }
  stopLocal(300);

  const p = blocked.has(track.youtubeId) ? null : await ensurePlayer();
  if (state.playing !== slug) return; // the visitor moved on while loading
  if (!p) {
    startSynth(slug);
    emit({ source: "synth" });
    return;
  }
  stopSynth();
  emit({ source: "youtube" });

  const sameTrack = p.getVideoData()?.video_id === track.youtubeId;
  if (sameTrack) {
    // Continue from wherever the preview got to.
    if (p.getPlayerState() !== YT_PLAYING) p.playVideo();
  } else {
    volume = 0;
    p.setVolume(0);
    // Carry the timestamp over from the song that was playing.
    const carry = p.getPlayerState() === YT_PLAYING ? p.getCurrentTime() : 0;
    p.loadVideoById({ videoId: track.youtubeId, startSeconds: fromPreview ? track.previewAt : carry });
  }
  fadeTo(fromPreview ? 70 : 85, 900);
};

const silence = (ms = 600) => {
  stopSynth();
  stopLocal(ms);
  emit({ playing: null, mode: null, source: null });
  if (player) fadeTo(0, ms, () => player?.pauseVideo());
};

/* ——— Public API ——— */

const readPref = () => {
  try {
    return localStorage.getItem("sound") !== "off";
  } catch {
    return true;
  }
};

export const audio = {
  init(playerHost: HTMLElement) {
    host = playerHost;
    emit({ enabled: readPref() });
  },

  /** Run inside a user gesture: browsers only allow sound after one. */
  unlock() {
    if (!ctx) buildGraph();
    ctx!.resume();
    if (!state.unlocked) emit({ unlocked: true });
    if (desiredWorld && !state.playing && state.enabled) {
      emit({ mode: "world" });
      play(desiredWorld, false);
    }
  },

  /** Select screen: play a sample of a world's song while its card is highlighted. */
  preview(slug: WorldSlug) {
    emit({ mode: "preview" });
    play(slug, true);
  },

  stopPreview() {
    if (state.mode === "preview") silence(500);
  },

  /** Inside a world: play its song, continuing a preview if it's the same one. */
  setWorld(slug: WorldSlug | null) {
    desiredWorld = slug;
    if (slug === null) {
      silence();
      return;
    }
    emit({ mode: "world" });
    play(slug, false);
  },

  toggle() {
    const enabled = !state.enabled;
    try {
      localStorage.setItem("sound", enabled ? "on" : "off");
    } catch {}
    emit({ enabled });
    if (!enabled) {
      silence(300);
      return;
    }
    audio.unlock();
  },

  /** Slow the soundtrack down (bullet time, Dead Eye). Pitch drops with it. */
  setRate(rate: number) {
    localRate = Math.max(0.25, rate);
    localEls.forEach((el) => {
      el.preservesPitch = false;
      el.playbackRate = localRate;
    });
    if (player && state.source === "youtube") {
      // YouTube only accepts a fixed set of speeds.
      const allowed = [0.25, 0.5, 0.75, 1];
      player.setPlaybackRate(allowed.reduce((a, b) => (Math.abs(b - rate) < Math.abs(a - rate) ? b : a)));
    }
  },

  /** One-shot effects (gunshot, heartbeat, glitch, blade, typewriter key). */
  sfx(kind: "shot" | "heartbeat" | "glitch" | "slash" | "type") {
    if (!ctx || !master || !state.enabled) return;
    const t = ctx.currentTime;
    const noise = () => {
      const len = ctx!.sampleRate;
      const buf = ctx!.createBuffer(1, len, ctx!.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const s = ctx!.createBufferSource();
      s.buffer = buf;
      return s;
    };
    const g = ctx.createGain();
    g.connect(master);
    if (kind === "shot" || kind === "slash") {
      const src = noise();
      const f = ctx.createBiquadFilter();
      f.type = kind === "shot" ? "lowpass" : "highpass";
      f.frequency.value = kind === "shot" ? 2400 : 3000;
      g.gain.setValueAtTime(kind === "shot" ? 0.9 : 0.35, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (kind === "shot" ? 0.4 : 0.25));
      src.connect(f).connect(g);
      src.start(t);
      src.stop(t + 0.5);
      if (kind === "shot") {
        const o = ctx.createOscillator();
        o.frequency.setValueAtTime(140, t);
        o.frequency.exponentialRampToValueAtTime(40, t + 0.2);
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.8, t);
        og.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        o.connect(og).connect(master);
        o.start(t);
        o.stop(t + 0.35);
      }
    } else if (kind === "heartbeat") {
      for (const dt of [0, 0.22]) {
        const o = ctx.createOscillator();
        o.frequency.setValueAtTime(70, t + dt);
        o.frequency.exponentialRampToValueAtTime(40, t + dt + 0.12);
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.0001, t + dt);
        og.gain.linearRampToValueAtTime(dt ? 0.4 : 0.6, t + dt + 0.01);
        og.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.2);
        o.connect(og).connect(master);
        o.start(t + dt);
        o.stop(t + dt + 0.25);
      }
    } else if (kind === "glitch") {
      const o = ctx.createOscillator();
      o.type = "square";
      o.frequency.setValueAtTime(880, t);
      o.frequency.setValueAtTime(220, t + 0.03);
      o.frequency.setValueAtTime(1760, t + 0.06);
      g.gain.setValueAtTime(0.06, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.11);
    } else {
      const src = noise();
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 2500;
      f.Q.value = 3;
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      src.connect(f).connect(g);
      src.start(t);
      src.stop(t + 0.05);
    }
  },
};

// Base class for the generative themes. Each theme gets its own output gain
// (for crossfades) and schedules notes slightly ahead of time on a timer.
// Every theme runs on one shared transport: same tempo, same step grid, same
// downbeat. Switching worlds crossfades two themes that are already in time,
// so the next movement picks up on exactly the beat the last one was at.

export const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

export const BPM = 104;
export const STEPS_PER_BEAT = 4;
const STEP = 60 / BPM / STEPS_PER_BEAT;
let transportStart: number | null = null;

/** Deterministic "chance": the same step always rolls the same number. */
export const chance = (step: number, salt = 0) => {
  let h = (step * 374761393 + salt * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export abstract class Theme {
  protected out: GainNode;
  protected step = 0;
  private nextTime = 0;
  private timer: number | null = null;
  private extras: AudioScheduledSourceNode[] = [];
  private noiseBuf: AudioBuffer | null = null;

  constructor(
    protected ctx: AudioContext,
    destination: AudioNode,
    protected reverb: AudioNode,
    protected swing = 0
  ) {
    this.out = ctx.createGain();
    this.out.gain.value = 0;
    this.out.connect(destination);
  }

  protected get stepDur() {
    return STEP;
  }

  start(fade = 1.5) {
    const now = this.ctx.currentTime;
    this.out.gain.cancelScheduledValues(now);
    this.out.gain.setValueAtTime(this.out.gain.value, now);
    this.out.gain.linearRampToValueAtTime(1, now + fade);
    if (this.timer !== null) return;
    this.extras = this.ambience();
    // Join the shared transport at its next step rather than starting a bar of our own.
    transportStart ??= now + 0.08;
    this.step = Math.max(0, Math.ceil((now + 0.08 - transportStart) / STEP));
    this.nextTime = transportStart + this.step * STEP;
    this.timer = window.setInterval(() => this.schedule(), 25);
  }

  stop(fade = 1.2) {
    const now = this.ctx.currentTime;
    this.out.gain.cancelScheduledValues(now);
    this.out.gain.setValueAtTime(this.out.gain.value, now);
    this.out.gain.linearRampToValueAtTime(0, now + fade);
    const timer = this.timer;
    this.timer = null;
    const extras = this.extras;
    this.extras = [];
    window.setTimeout(() => {
      if (timer !== null) window.clearInterval(timer);
      extras.forEach((n) => {
        try {
          n.stop();
        } catch {}
      });
    }, fade * 1000 + 50);
  }

  private schedule() {
    while (this.nextTime < this.ctx.currentTime + 0.15) {
      const t = this.step % 2 === 1 ? this.nextTime + this.stepDur * this.swing : this.nextTime;
      this.play(this.step, t);
      this.nextTime += this.stepDur;
      this.step++;
    }
  }

  protected abstract play(step: number, t: number): void;

  /** Long-running sources (rain, wind, pads). Returned nodes are stopped on stop(). */
  protected ambience(): AudioScheduledSourceNode[] {
    return [];
  }

  // ——— shared instruments ———

  protected noise(): AudioBufferSourceNode {
    if (!this.noiseBuf) {
      const len = this.ctx.sampleRate * 2;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    return src;
  }

  protected env(t: number, attack: number, peak: number, decay: number, sustain = 0.0001) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(Math.max(sustain, 0.0001), t + attack + decay);
    return g;
  }

  protected osc(type: OscillatorType, freq: number, t: number, dur: number, dest: AudioNode, detune = 0) {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    o.connect(dest);
    o.start(t);
    o.stop(t + dur);
    return o;
  }

  protected send(node: AudioNode, amount: number) {
    const g = this.ctx.createGain();
    g.gain.value = amount;
    node.connect(g).connect(this.reverb);
  }

  protected kick(t: number, level = 0.6, from = 120, to = 40) {
    const g = this.env(t, 0.002, level, 0.35);
    const o = this.osc("sine", from, t, 0.4, g);
    o.frequency.exponentialRampToValueAtTime(to, t + 0.12);
    g.connect(this.out);
  }

  protected hat(t: number, level = 0.05, decay = 0.05) {
    const src = this.noise();
    const f = this.ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 7000;
    const g = this.env(t, 0.001, level, decay);
    src.connect(f).connect(g).connect(this.out);
    src.start(t, Math.random());
    src.stop(t + decay + 0.05);
  }

  protected noiseHit(t: number, type: BiquadFilterType, freq: number, q: number, level: number, decay: number) {
    const src = this.noise();
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = this.env(t, 0.002, level, decay);
    src.connect(f).connect(g).connect(this.out);
    src.start(t, Math.random());
    src.stop(t + decay + 0.05);
    return g;
  }

  /** Continuous filtered noise bed, e.g. rain or wind. */
  protected bed(type: BiquadFilterType, freq: number, level: number, lfoRate = 0, lfoDepth = 0) {
    const src = this.noise();
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.value = level;
    src.connect(f).connect(g).connect(this.out);
    src.start();
    const nodes: AudioScheduledSourceNode[] = [src];
    if (lfoRate) {
      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = lfoRate;
      const depth = this.ctx.createGain();
      depth.gain.value = lfoDepth;
      lfo.connect(depth).connect(f.frequency);
      lfo.start();
      nodes.push(lfo);
    }
    return nodes;
  }
}

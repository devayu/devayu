import { midi, Theme } from "./sequencer";

// Four original, generative pieces, one per world. None of them quotes the
// games' real soundtracks; they only borrow the instrumentation and mood.

/* ——— Noir: a lonely cello over piano and rain, D minor, 60 bpm ——— */

const NOIR_CHORDS = [
  [50, 53, 57, 62], // Dm
  [46, 50, 53, 58], // Bb
  [43, 50, 55, 58], // Gm
  [45, 49, 52, 57], // A
];
// [midi, length in eighths]; 0 = rest. Four bars per pass, 8 eighths per bar.
const NOIR_MELODY: [number, number][] = [
  [62, 3], [65, 1], [64, 2], [62, 2],
  [57, 4], [60, 2], [58, 2],
  [58, 3], [57, 1], [55, 2], [53, 2],
  [52, 6], [0, 2],
  [62, 3], [69, 1], [67, 2], [65, 2],
  [64, 4], [62, 2], [61, 2],
  [62, 4], [57, 2], [58, 2],
  [57, 8],
];

export class NoirTheme extends Theme {
  private melodyAt = new Map<number, [number, number]>();

  constructor(ctx: AudioContext, dest: AudioNode, reverb: AudioNode) {
    super(ctx, dest, reverb, 60, 2);
    let pos = 0;
    for (const note of NOIR_MELODY) {
      this.melodyAt.set(pos, note);
      pos += note[1];
    }
  }

  protected play(step: number, t: number) {
    const loop = step % 64;
    const bar = Math.floor(loop / 8);
    if (loop % 8 === 0) {
      const chord = NOIR_CHORDS[bar % 4];
      chord.forEach((n, i) => this.piano(midi(n), t + i * 0.06, 0.05));
    }
    if (loop % 8 === 4 && Math.random() < 0.5) {
      const chord = NOIR_CHORDS[bar % 4];
      this.piano(midi(chord[3] + 12), t, 0.03);
    }
    const note = this.melodyAt.get(loop);
    if (note && note[0]) this.cello(midi(note[0] - 12), t, note[1] * this.stepDur);
  }

  private piano(freq: number, t: number, level: number) {
    const g = this.env(t, 0.005, level, 2.6);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 1800;
    this.osc("triangle", freq, t, 3, g);
    this.osc("sine", freq * 2, t, 1.2, g, 3);
    g.connect(f).connect(this.out);
    this.send(f, 0.6);
  }

  private cello(freq: number, t: number, dur: number) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.11, t + 0.35);
    g.gain.setValueAtTime(0.11, t + Math.max(0.4, dur - 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.6);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 1100;
    f.Q.value = 2;
    const vib = this.ctx.createOscillator();
    vib.frequency.value = 5.2;
    const vibDepth = this.ctx.createGain();
    vibDepth.gain.value = 9;
    vib.connect(vibDepth);
    for (const d of [-6, 6]) {
      const o = this.osc("sawtooth", freq, t, dur + 0.7, f, d);
      vibDepth.connect(o.detune);
    }
    vib.start(t);
    vib.stop(t + dur + 0.7);
    f.connect(g).connect(this.out);
    this.send(g, 0.8);
  }

  protected ambience() {
    return [...this.bed("highpass", 1200, 0.045), ...this.bed("lowpass", 300, 0.03)];
  }
}

/* ——— Frontier: fingerpicked guitar, a whistle and hooves, E minor, 84 bpm ——— */

const FR_CHORDS = [
  [40, 47, 52, 55, 59], // Em
  [45, 52, 57, 60, 64], // Am
  [43, 50, 55, 59, 62], // G
  [47, 51, 54, 57, 59], // B7
];
const FR_PICK = [0, 3, 1, 4, 2, 3, 1, 4];
const FR_WHISTLE: [number, number][] = [
  [76, 6], [74, 2], [71, 8],
  [72, 4], [74, 4], [76, 8],
  [79, 6], [78, 2], [74, 8],
  [75, 8], [0, 8],
];

export class FrontierTheme extends Theme {
  private whistleAt = new Map<number, [number, number]>();

  constructor(ctx: AudioContext, dest: AudioNode, reverb: AudioNode) {
    super(ctx, dest, reverb, 84, 2, 0.12);
    let pos = 16;
    for (const n of FR_WHISTLE) {
      this.whistleAt.set(pos, n);
      pos += n[1];
    }
  }

  protected play(step: number, t: number) {
    const loop = step % 128;
    const bar = Math.floor(loop / 8);
    const chord = FR_CHORDS[Math.floor(bar / 2) % 4];
    this.pluck(midi(chord[FR_PICK[loop % 8]]), t, loop % 8 === 0 ? 0.16 : 0.1);
    if (loop % 8 === 0) this.pluck(midi(chord[0] - 12), t, 0.14);

    // hooves: a lazy clip-clop
    if (loop % 4 === 0) this.noiseHit(t, "bandpass", 1800, 6, 0.06, 0.04);
    if (loop % 4 === 1) this.noiseHit(t, "bandpass", 1300, 6, 0.045, 0.04);

    const w = this.whistleAt.get(loop);
    if (w && w[0]) this.whistle(midi(w[0]), t, w[1] * this.stepDur);
  }

  private pluck(freq: number, t: number, level: number) {
    const g = this.env(t, 0.003, level, 1.4);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(4200, t);
    f.frequency.exponentialRampToValueAtTime(700, t + 0.5);
    this.osc("sawtooth", freq, t, 1.6, f);
    this.osc("triangle", freq * 2, t, 0.6, f, 4);
    f.connect(g).connect(this.out);
    this.send(g, 0.35);
  }

  private whistle(freq: number, t: number, dur: number) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.12);
    g.gain.setValueAtTime(0.07, t + dur - 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.3);
    const o = this.osc("sine", freq * 0.97, t, dur + 0.4, g);
    o.frequency.exponentialRampToValueAtTime(freq, t + 0.12);
    const vib = this.ctx.createOscillator();
    vib.frequency.value = 6;
    const depth = this.ctx.createGain();
    depth.gain.value = 14;
    vib.connect(depth).connect(o.detune);
    vib.start(t + 0.3);
    vib.stop(t + dur + 0.4);
    g.connect(this.out);
    this.send(g, 0.9);
  }

  protected ambience() {
    return this.bed("bandpass", 450, 0.035, 0.08, 250);
  }
}

/* ——— Night City: synth bass, arps and a four-on-the-floor kick, F# minor, 100 bpm ——— */

const NC_ROOTS = [42, 38, 45, 40]; // F#, D, A, E
const NC_ARP = [0, 7, 12, 15, 19, 15, 12, 7];

export class NightCityTheme extends Theme {
  constructor(ctx: AudioContext, dest: AudioNode, reverb: AudioNode) {
    super(ctx, dest, reverb, 100, 4);
  }

  protected play(step: number, t: number) {
    const loop = step % 128;
    const bar = Math.floor(loop / 16);
    const root = NC_ROOTS[Math.floor(bar / 2) % 4];
    const third = root === 42 ? 3 : 4; // F#m, D, A, E

    if (loop % 4 === 0) this.kick(t, 0.55, 140, 38);
    if (loop % 8 === 4) this.noiseHit(t, "bandpass", 1600, 0.8, 0.12, 0.18);
    if (loop % 2 === 1) this.hat(t, loop % 4 === 3 ? 0.06 : 0.03, 0.04);

    // rolling sixteenth bass, ducked under the kick
    this.bass(midi(root - 12 + (loop % 8 === 6 ? 12 : 0)), t, loop % 4 === 0 ? 0.05 : 0.13);

    if (step >= 32) {
      const interval = NC_ARP[loop % 8] === 15 ? 12 + third : NC_ARP[loop % 8];
      this.arp(midi(root + 24 + interval), t);
    }
    if (loop % 32 === 0) this.pad(root + 12, third, t, this.stepDur * 32);
  }

  private bass(freq: number, t: number, level: number) {
    const g = this.env(t, 0.004, level, 0.16);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.Q.value = 8;
    f.frequency.setValueAtTime(1400, t);
    f.frequency.exponentialRampToValueAtTime(200, t + 0.14);
    this.osc("sawtooth", freq, t, 0.2, f);
    f.connect(g).connect(this.out);
  }

  private arp(freq: number, t: number) {
    const g = this.env(t, 0.003, 0.035, 0.12);
    this.osc("square", freq, t, 0.15, g);
    g.connect(this.out);
    this.send(g, 0.5);
  }

  private pad(root: number, third: number, t: number, dur: number) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.04, t + 1.2);
    g.gain.setValueAtTime(0.04, t + dur - 1);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 900;
    for (const n of [0, third, 7]) {
      this.osc("sawtooth", midi(root + n), t, dur, f, -9);
      this.osc("sawtooth", midi(root + n), t, dur, f, 9);
    }
    f.connect(g).connect(this.out);
    this.send(g, 0.6);
  }

  protected ambience() {
    return this.bed("bandpass", 120, 0.05, 0.05, 40);
  }
}

/* ——— Yōtei: lofi keys, koto plucks in hirajōshi, vinyl and wind, 72 bpm ——— */

const YO_CHORDS = [
  [53, 57, 60, 64],
  [52, 55, 59, 62],
  [57, 59, 60, 64],
  [53, 57, 59, 64],
];
const YO_SCALE = [69, 71, 72, 76, 77, 81, 83, 84];
const YO_KICK = [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0];
const YO_SNARE = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];

export class YoteiTheme extends Theme {
  constructor(ctx: AudioContext, dest: AudioNode, reverb: AudioNode) {
    super(ctx, dest, reverb, 72, 2, 0.18);
  }

  protected play(step: number, t: number) {
    const inBar = step % 16;
    const chord = YO_CHORDS[Math.floor(step / 16) % 4];
    if (inBar === 0) {
      chord.forEach((n, i) => this.keys(midi(n), t + i * 0.012, this.stepDur * 15, 0.06));
      this.keys(midi(chord[0] - 12), t, this.stepDur * 15, 0.1);
    }
    if (YO_KICK[inBar]) this.kick(t, 0.4, 110, 42);
    if (YO_SNARE[inBar]) this.noiseHit(t, "bandpass", 1500, 0.7, 0.13, 0.22);
    if (step % 2 === 0 || Math.random() < 0.3) this.hat(t, step % 2 === 0 ? 0.04 : 0.02);
    if (Math.random() < (step % 4 === 0 ? 0.45 : 0.18)) {
      this.koto(midi(YO_SCALE[Math.floor(Math.random() * YO_SCALE.length)]), t);
    }
  }

  private keys(freq: number, t: number, dur: number, level: number) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(level, t + 0.03);
    g.gain.exponentialRampToValueAtTime(level * 0.4, t + 1.2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 2400;
    this.osc("sine", freq, t, dur + 0.1, g, -4);
    this.osc("triangle", freq, t, dur + 0.1, g, 5);
    g.connect(f).connect(this.out);
  }

  private koto(freq: number, t: number) {
    const body = this.ctx.createBiquadFilter();
    body.type = "bandpass";
    body.frequency.value = freq * 2;
    body.Q.value = 1.4;
    const g = this.env(t, 0.004, 0.15, 1.4);
    const o = this.osc("triangle", freq * 1.012, t, 1.5, body);
    o.frequency.exponentialRampToValueAtTime(freq, t + 0.06);
    body.connect(g).connect(this.out);
    this.send(g, 0.5);
  }

  protected ambience() {
    // vinyl crackle and wind
    const len = this.ctx.sampleRate * 4;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = Math.random() < 0.0006 ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.006;
    }
    const crackle = this.ctx.createBufferSource();
    crackle.buffer = buf;
    crackle.loop = true;
    const cg = this.ctx.createGain();
    cg.gain.value = 0.22;
    crackle.connect(cg).connect(this.out);
    crackle.start();
    return [crackle, ...this.bed("bandpass", 500, 0.04, 0.07, 300)];
  }
}

export const themes = {
  noir: NoirTheme,
  frontier: FrontierTheme,
  "night-city": NightCityTheme,
  yotei: YoteiTheme,
};

import { chance, midi, Theme } from "./sequencer";

// Four original, generative pieces, one per art movement, all on the shared
// transport (104 bpm, sixteenth-note steps). None quotes an existing work;
// each borrows how its movement thought about sound.

/* ——— Bauhaus: a machine of glass and wood. Strict grid, primary intervals,
   a pattern that rotates one step every bar like a Triadic Ballet figure. ——— */

const BAUHAUS_CHORDS = [
  [48, 55, 64, 71], // Cmaj7
  [45, 52, 60, 67], // Am7
  [41, 48, 57, 64], // Fmaj7
  [43, 50, 59, 64], // G6
];

export class BauhausTheme extends Theme {
  protected play(step: number, t: number) {
    const loop = step % 64;
    const bar = Math.floor(loop / 16);
    const s = loop % 16;
    const chord = BAUHAUS_CHORDS[bar];
    // the metronome of the workshop: wood on every beat, a brighter tick on the one
    if (s % 4 === 0) this.block(t, s === 0 ? 0.16 : 0.09, s === 0 ? 1900 : 1500);
    // bass: one note per half bar, nothing more than needed
    if (s === 0 || s === 8) this.bass(midi(chord[0] - 12), t, this.stepDur * 7);
    // the arpeggio: three shapes (triangle, square, circle) rotated by the bar
    const shape = [3, 4, 5][bar % 3];
    if (s % 2 === 0) {
      const idx = (s / 2 + bar) % shape;
      const note = chord[idx % 4] + 12 * Math.floor(idx / 4) + 12;
      this.glass(midi(note), t, s % 8 === 0 ? 0.07 : 0.045);
    }
  }

  private block(t: number, level: number, freq: number) {
    const g = this.env(t, 0.001, level, 0.06);
    this.osc("sine", freq, t, 0.08, g);
    this.osc("square", freq * 0.5, t, 0.02, g);
    g.connect(this.out);
  }

  private bass(freq: number, t: number, dur: number) {
    const g = this.env(t, 0.01, 0.16, dur);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 500;
    this.osc("triangle", freq, t, dur + 0.1, g);
    g.connect(f).connect(this.out);
  }

  private glass(freq: number, t: number, level: number) {
    const g = this.env(t, 0.003, level, 0.9);
    this.osc("sine", freq, t, 1, g);
    this.osc("sine", freq * 3, t, 0.25, g, 2);
    g.connect(this.out);
    this.send(g, 0.35);
  }
}

/* ——— Dada: a sound poem. Formant-synthesised syllables, a toy piano and
   desk noises, every event decided by chance (the same chance each time). ——— */

// Vowel formants (F1, F2) in Hz.
const VOWELS: [number, number][] = [
  [730, 1090], // a
  [570, 840], // o
  [300, 870], // u
  [270, 2290], // i
  [530, 1840], // e
  [440, 1020], // ö-ish
];
const TOY = [72, 74, 77, 79, 81, 84, 86];

export class DadaTheme extends Theme {
  protected play(step: number, t: number) {
    const s = step % 16;
    // a syllable on roughly a third of the eighths, pitch and vowel by chance
    if (s % 2 === 0 && chance(step, 1) < 0.34) {
      const v = VOWELS[Math.floor(chance(step, 2) * VOWELS.length)];
      const pitch = 110 * Math.pow(2, Math.floor(chance(step, 3) * 7) / 12);
      this.syllable(t, pitch, v, chance(step, 4) < 0.3 ? 0.32 : 0.14);
    }
    // the toy piano, cut from a hat
    if (chance(step, 5) < 0.12) this.toy(midi(TOY[Math.floor(chance(step, 6) * TOY.length)]), t);
    // desk noises: a stamp, a clock, paper tearing
    if (s === 0 && chance(step, 7) < 0.7) this.noiseHit(t, "lowpass", 300, 1, 0.22, 0.12);
    if (s % 4 === 2 && chance(step, 8) < 0.5) this.noiseHit(t, "bandpass", 3200, 8, 0.06, 0.03);
    if (chance(step, 9) < 0.025) this.tear(t);
    // and sometimes, absurdly, a slide whistle
    if (s === 8 && chance(step, 10) < 0.08) this.whistle(t, chance(step, 11) < 0.5);
  }

  private syllable(t: number, pitch: number, [f1, f2]: [number, number], dur: number) {
    const src = this.ctx.createOscillator();
    src.type = "sawtooth";
    src.frequency.setValueAtTime(pitch, t);
    src.frequency.linearRampToValueAtTime(pitch * (0.92 + Math.random() * 0.16), t + dur);
    const out = this.ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.linearRampToValueAtTime(0.07, t + 0.02);
    out.gain.setValueAtTime(0.07, t + dur * 0.7);
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    for (const [f, q, lvl] of [
      [f1, 9, 1],
      [f2, 12, 0.6],
    ] as const) {
      const bp = this.ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = f;
      bp.Q.value = q;
      const g = this.ctx.createGain();
      g.gain.value = lvl;
      src.connect(bp).connect(g).connect(out);
    }
    // a consonant: a puff of noise before the vowel
    this.noiseHit(t - 0.012, "highpass", 2500, 1, 0.03, 0.02);
    out.connect(this.out);
    this.send(out, 0.25);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  private toy(freq: number, t: number) {
    const g = this.env(t, 0.002, 0.06, 0.5);
    this.osc("sine", freq, t, 0.6, g);
    this.osc("sine", freq * 2.76, t, 0.15, g); // inharmonic, like a struck rod
    g.connect(this.out);
    this.send(g, 0.4);
  }

  private tear(t: number) {
    const src = this.noise();
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 2;
    f.frequency.setValueAtTime(900, t);
    f.frequency.exponentialRampToValueAtTime(4200, t + 0.35);
    const g = this.env(t, 0.02, 0.08, 0.35);
    src.connect(f).connect(g).connect(this.out);
    src.start(t, Math.random());
    src.stop(t + 0.45);
  }

  private whistle(t: number, up: boolean) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    const o = this.osc("sine", up ? 600 : 1800, t, 0.75, g);
    o.frequency.exponentialRampToValueAtTime(up ? 1800 : 500, t + 0.65);
    g.connect(this.out);
  }
}

/* ——— Pop Art: a jingle. Four on the floor, handclaps, a bouncing bass and
   one hook repeated like a soup can, its key shifting each pass like a new
   colourway of the same print. ——— */

const POP_CHORDS = [53, 50, 46, 48]; // F, Dm, Bb, C: the doo-wop turn
const POP_HOOK: [number, number][] = [
  // [step, semitones above the root]
  [0, 12], [3, 16], [6, 19], [8, 17], [10, 16], [12, 14], [14, 12],
];

export class PopTheme extends Theme {
  protected play(step: number, t: number) {
    const loop = step % 64;
    const bar = Math.floor(loop / 16);
    const s = loop % 16;
    const pass = Math.floor(step / 64);
    const lift = [0, 2, 5, 0][pass % 4]; // the same print, a new colourway
    const root = POP_CHORDS[bar] + lift;
    if (s % 4 === 0) this.kick(t, 0.5);
    if (s === 4 || s === 12) this.clap(t);
    if (s % 2 === 0) this.hat(t, s % 4 === 2 ? 0.05 : 0.025);
    // octave-bouncing bass on the eighths
    if (s % 2 === 0) this.bass(midi(root - 12 + (s % 4 === 2 ? 12 : 0)), t);
    // chord stabs on the offbeats
    if (s === 6 || s === 14) [0, 4, 7].forEach((i) => this.stab(midi(root + 12 + i), t));
    // the hook, only in the first and third bar: repetition with a gap
    if (bar % 2 === 0) {
      const note = POP_HOOK.find(([at]) => at === s);
      if (note) this.lead(midi(POP_CHORDS[0] + lift + note[1]), t);
    }
  }

  private clap(t: number) {
    for (const dt of [0, 0.011, 0.023]) this.noiseHit(t + dt, "bandpass", 1500, 1.5, 0.12, 0.09);
  }

  private bass(freq: number, t: number) {
    const g = this.env(t, 0.004, 0.13, 0.18);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 900;
    this.osc("square", freq, t, 0.22, g);
    g.connect(f).connect(this.out);
  }

  private stab(freq: number, t: number) {
    const g = this.env(t, 0.003, 0.025, 0.16);
    this.osc("sawtooth", freq, t, 0.2, g, 8);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 2600;
    g.connect(f).connect(this.out);
  }

  private lead(freq: number, t: number) {
    const g = this.env(t, 0.005, 0.05, 0.28);
    this.osc("square", freq, t, 0.3, g);
    this.osc("square", freq * 2, t, 0.3, g, 6);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 3200;
    g.connect(f).connect(this.out);
    this.send(f, 0.2);
  }
}

/* ——— Cubism: Paris café jazz, seen from several sides at once. A walking
   bass in four, swung ride, rootless chords, and a vibraphone figure five
   eighths long that lands somewhere new in every bar. ——— */

const CUBISM_CHORDS = [
  { root: 38, voicing: [53, 57, 60, 64] }, // Dm9
  { root: 43, voicing: [53, 57, 59, 64] }, // G13
  { root: 36, voicing: [52, 55, 59, 62] }, // Cmaj9
  { root: 45, voicing: [55, 58, 61, 65] }, // A7(b9)
];
const VIBES = [69, 72, 76, 74, 71];

export class CubismTheme extends Theme {
  constructor(ctx: AudioContext, dest: AudioNode, reverb: AudioNode) {
    super(ctx, dest, reverb, 0);
  }

  protected play(step: number, t: number) {
    const loop = step % 64;
    const bar = Math.floor(loop / 16);
    const s = loop % 16;
    const chord = CUBISM_CHORDS[bar];
    const next = CUBISM_CHORDS[(bar + 1) % 4];
    const swing = s % 4 === 2 ? this.stepDur * 0.66 : 0; // swung eighths
    // walking bass: root, a chord tone, a passing tone, a step into the next root
    if (s % 4 === 0) {
      const walk = [chord.root, chord.root + 7, chord.root + 4, next.root + 1][s / 4];
      this.bass(midi(walk), t);
    }
    // ride: ding, ding-a, ding, ding-a
    if (s % 4 === 0 || s === 6 || s === 14) this.ride(t + swing, s % 8 === 0 ? 0.05 : 0.035);
    if (s === 4 || s === 12) this.noiseHit(t, "bandpass", 5000, 0.7, 0.02, 0.07); // hat foot
    // comping, pushed ahead of the beat
    if (s === 14 || (s === 6 && chance(step, 1) < 0.5)) chord.voicing.forEach((n) => this.rhodes(midi(n), t + swing));
    // the five-note figure against the four-beat bar: a second viewpoint
    if (s % 2 === 0) {
      const eighth = Math.floor(step / 2);
      if (eighth % 5 < 3 && chance(eighth, 2) < 0.75) this.vibe(midi(VIBES[eighth % 5]), t + swing);
    }
  }

  private bass(freq: number, t: number) {
    const g = this.env(t, 0.008, 0.2, 0.5);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 420;
    this.osc("triangle", freq, t, 0.6, g);
    this.osc("sine", freq * 2, t, 0.15, g);
    g.connect(f).connect(this.out);
  }

  private ride(t: number, level: number) {
    const src = this.noise();
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 7600;
    f.Q.value = 1.2;
    const g = this.env(t, 0.001, level, 0.45);
    src.connect(f).connect(g).connect(this.out);
    src.start(t, Math.random());
    src.stop(t + 0.5);
  }

  private rhodes(freq: number, t: number) {
    const g = this.env(t, 0.004, 0.035, 1.3);
    // a little FM bell on top of a sine body
    const mod = this.ctx.createOscillator();
    mod.frequency.value = freq * 14;
    const depth = this.ctx.createGain();
    depth.gain.setValueAtTime(freq * 0.9, t);
    depth.gain.exponentialRampToValueAtTime(1, t + 0.3);
    mod.connect(depth);
    const o = this.osc("sine", freq, t, 1.4, g);
    depth.connect(o.frequency);
    mod.start(t);
    mod.stop(t + 0.4);
    g.connect(this.out);
    this.send(g, 0.3);
  }

  private vibe(freq: number, t: number) {
    const g = this.env(t, 0.002, 0.05, 1.1);
    const trem = this.ctx.createOscillator();
    trem.frequency.value = 5.5;
    const depth = this.ctx.createGain();
    depth.gain.value = 0.015;
    trem.connect(depth).connect(g.gain);
    trem.start(t);
    trem.stop(t + 1.2);
    this.osc("sine", freq, t, 1.2, g);
    this.osc("sine", freq * 4, t, 0.1, g);
    g.connect(this.out);
    this.send(g, 0.45);
  }
}

export const themes = {
  bauhaus: BauhausTheme,
  dada: DadaTheme,
  pop: PopTheme,
  cubism: CubismTheme,
};

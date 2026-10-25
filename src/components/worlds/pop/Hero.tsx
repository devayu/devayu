"use client";

import { useRef } from "react";
import { INK } from "./content";

// The hero is a billboard-sized serial print: the select screen's Return key,
// run off forty-eight times. Two screens make it, the way a silkscreen does:
// first every flat ink, then the black key, pulled 120ms later and landing
// off-register. Your pointer nudges the key screen.

const PAIRS: [string, string][] = [
  [INK.pink, INK.yellow],
  [INK.cyan, INK.red],
  [INK.yellow, INK.turquoise],
  [INK.red, INK.pink],
  [INK.turquoise, INK.orange],
  [INK.orange, INK.cyan],
  [INK.lime, INK.red],
  [INK.yellow, INK.pink],
  [INK.blue, INK.yellow],
  [INK.pink, INK.lime],
  [INK.cyan, INK.yellow],
];

const CELLS = 48;
const pairFor = (i: number) => PAIRS[(i * 7 + Math.floor(i / 8) * 3) % PAIRS.length];

const KEY_PATH = (
  <>
    <rect x="14" y="14" width="72" height="72" rx="4" />
    <path d="M66 34 V56 H36" />
    <path d="M44 47 L35 56 L44 65" />
  </>
);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const raf = useRef(0);

  const nudge = (x: number, y: number) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      // Quantised to whole pixels: a screen moves in hard steps, not a glide.
      el.style.setProperty("--kx", `${Math.round(x * 6)}px`);
      el.style.setProperty("--ky", `${Math.round(y * 5)}px`);
    });
  };

  return (
    <section
      ref={ref}
      className="pp-hero"
      aria-label="A serial print of a Return key, run off forty-eight times"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        nudge(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => nudge(0, 0)}
    >
      <div className="pp-hero-print" aria-hidden>
        {/* screen one: the flat inks */}
        <div className="pp-hero-screen pp-hero-ink">
          {Array.from({ length: CELLS }, (_, i) => {
            const [ground, fill] = pairFor(i);
            return (
              <span key={i} className="pp-hero-cell" style={{ background: ground }}>
                <svg viewBox="0 0 100 100">
                  <rect x="14" y="14" width="72" height="72" rx="4" fill={fill} />
                </svg>
              </span>
            );
          })}
        </div>
        {/* screen two: the black key */}
        <div className="pp-hero-screen pp-hero-key">
          {Array.from({ length: CELLS }, (_, i) => (
            <span key={i} className="pp-hero-cell">
              <svg viewBox="0 0 100 100" fill="none" stroke="#111" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
                {KEY_PATH}
              </svg>
            </span>
          ))}
        </div>
        <span className="pp-hero-squeegee" />
        <span className="pp-hero-squeegee pp-hero-squeegee-2" />
      </div>

      {/* the word block, pasted over the run like a billboard sheet */}
      <div className="pp-word" aria-hidden>
        <div className="pp-word-grid">
          <span className="pp-word-l">S</span>
          <span className="pp-word-l pp-word-tilt">H</span>
          <span className="pp-word-l">I</span>
          <span className="pp-word-l">P</span>
        </div>
      </div>

      <p className="pp-hero-card">
        <span className="pp-hero-card-new">New!</span>
        <span className="pp-hero-card-line">Improved! Now with TypeScript.</span>
      </p>
    </section>
  );
}

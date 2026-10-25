"use client";

import { useEffect, useRef, useState } from "react";

// The hero is a stage, nothing else: the 1923 poster's diagonal cross with a
// Triadic Ballet figure standing on the rail. Parts assemble along straight
// rails (bars, then circles, then type). Moving the pointer across the stage
// turns the axis in fixed 15° steps, like a cam clicking into its notch. Down
// the right edge the Dessau façade spells the school vertically while its
// curtain wall lights cell by cell.

// [x, y, w, h] in stage units along the axis (x) and across it (y), plus the
// rail each part slides in on and its place in the order.
type Part = {
  k: string;
  cls: string;
  at: [number, number, number, number];
  i: number;
  dx?: number;
  dy?: number;
};

const PARTS: Part[] = [
  { k: "axis", cls: "bh-p-bar bh-p-ink bh-grow-x", at: [-86, -2.6, 172, 5.2], i: 0 },
  { k: "cross", cls: "bh-p-bar bh-p-red bh-grow-y", at: [-24, -40, 3.4, 84], i: 1 },
  { k: "rule", cls: "bh-p-bar bh-p-grey bh-grow-x", at: [-6, 9, 64, 0.7], i: 2 },
  { k: "square", cls: "bh-p-red", at: [-44, 2.6, 16, 16], i: 3, dx: -26 },
  { k: "circle", cls: "bh-p-circle bh-p-blue", at: [34, -26.6, 24, 24], i: 4, dx: 30 },
  { k: "dot", cls: "bh-p-circle bh-p-ink", at: [-25.3, -2.6, 6, 6], i: 5, dy: -18 },
  { k: "skirt", cls: "bh-p-skirt", at: [4, -13.6, 18, 11], i: 6, dy: -24 },
  { k: "torso", cls: "bh-p-torso", at: [6.5, -27, 13, 13.4], i: 7, dy: -24 },
  { k: "head", cls: "bh-p-circle bh-p-ink", at: [10, -33.4, 6, 6], i: 8, dy: -24 },
  { k: "arms", cls: "bh-p-bar bh-p-ink bh-grow-x", at: [2, -25.4, 22, 0.8], i: 8 },
  { k: "triangle", cls: "bh-p-tri", at: [48, 2.6, 16, 14], i: 9, dx: 24 },
];

const LETTERS = "bauhaus".split("");
const CELLS = 27; // 3 × 9 curtain wall
const LIT = new Set([4, 13, 20]);

export default function Stage() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState(-30);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let px = 0;
    const move = (e: PointerEvent) => {
      px = e.clientX;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const p = (px - r.left) / r.width;
        setTilt(p < 1 / 3 ? 0 : p < 2 / 3 ? -15 : -30);
      });
    };
    el.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div ref={ref} className="bh-stage" aria-hidden>
      <div className="bh-axis" style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}>
        {PARTS.map((p) => (
          <span
            key={p.k}
            className={`bh-p ${p.cls}`}
            style={
              {
                "--x": p.at[0],
                "--y": p.at[1],
                "--w": p.at[2],
                "--h": p.at[3],
                "--i": p.i,
                "--dx": p.dx ?? 0,
                "--dy": p.dy ?? 0,
              } as React.CSSProperties
            }
          />
        ))}
        <span className="bh-p bh-p-type" style={{ "--x": -19, "--y": 4, "--i": 11 } as React.CSSProperties}>
          form follows function. so do i.
        </span>
        <span className="bh-p bh-p-type bh-p-type-s" style={{ "--x": -66, "--y": -6.4, "--i": 12 } as React.CSSProperties}>
          kunst und technik, eine neue einheit
        </span>
      </div>

      <div className="bh-dessau">
        <span className="bh-dessau-word">
          {LETTERS.map((l, i) => (
            <span key={i} className="bh-dessau-l" style={{ "--i": i } as React.CSSProperties}>
              <span>{l}</span>
            </span>
          ))}
        </span>
        <span className="bh-wall">
          {Array.from({ length: CELLS }, (_, i) => (
            <span key={i} className="bh-cell" data-lit={LIT.has(i) || undefined} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </span>
      </div>

      <div className="bh-gauge">
        <svg viewBox="0 0 120 120" className="bh-gauge-svg">
          <path d="M10 110 H110" stroke="#161514" strokeWidth="3" />
          <path d="M10 110 A100 100 0 0 1 96.6 60" fill="none" stroke="#8A8781" strokeWidth="1.5" />
          {[0, 15, 30].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={10 + Math.cos(r) * 92}
                y1={110 - Math.sin(r) * 92}
                x2={10 + Math.cos(r) * 104}
                y2={110 - Math.sin(r) * 104}
                stroke="#161514"
                strokeWidth="3"
              />
            );
          })}
          <g className="bh-gauge-needle" style={{ transform: `rotate(${tilt}deg)` }}>
            <rect x="10" y="108" width="84" height="4" fill="#D0331F" />
          </g>
          <circle cx="10" cy="110" r="6" fill="#161514" />
        </svg>
        <span className="bh-gauge-read">axis {Math.abs(tilt)}°</span>
      </div>

      <span className="bh-cue">
        <svg viewBox="0 0 24 60">
          <rect x="10" y="0" width="4" height="44" fill="#D0331F" />
          <path d="M2 40 L22 40 L12 58 Z" fill="#D0331F" />
        </svg>
      </span>
    </div>
  );
}

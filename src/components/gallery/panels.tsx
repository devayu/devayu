"use client";

import { chance } from "@/lib/audio/sequencer";
import { useEffect, useRef, useState } from "react";

// The four canvases on the gallery wall. Each is a small working composition
// in its movement's grammar, at rest until its room is highlighted, then it
// performs the way that movement moved.

/* ——— Bauhaus: the 1923 poster logic. Parts wait off their marks on a 30°
   rail and slide home, one after another, with a hard stop. ——— */

export function BauhausArt() {
  return (
    <div className="art art-bauhaus" aria-hidden>
      <span className="bh-bar" />
      <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* local frame: x runs along the rail, y across it */}
        <g transform="translate(200 430) rotate(-30)">
          <rect className="bh-part bh-rail" style={{ ["--d" as string]: 0 }} x="-190" y="-10" width="380" height="20" fill="#161514" />
          <rect className="bh-part" style={{ ["--d" as string]: 1, ["--x" as string]: "-70px" }} x="-150" y="22" width="80" height="80" fill="#D0331F" />
          <circle className="bh-part" style={{ ["--d" as string]: 2, ["--x" as string]: "90px" }} cx="60" cy="-66" r="46" fill="#1E3C8C" />
          <path className="bh-part" style={{ ["--d" as string]: 3, ["--x" as string]: "40px" }} d="M110 18 L156 98 L64 98 Z" fill="#F0B419" />
          <rect className="bh-part" style={{ ["--d" as string]: 4, ["--x" as string]: "-60px" }} x="-60" y="-40" width="170" height="5" fill="#8A8781" />
        </g>
      </svg>
    </div>
  );
}

/* ——— Dada: the name cut from four different printings, re-drawn by chance
   while you look at it, with a rubber stamp. ——— */

const DADA_FACES = [
  "var(--font-holtwood)",
  "var(--font-bodoni)",
  "var(--font-archivo-black)",
  "var(--font-elite)",
];

export function DadaArt({ active }: { active: boolean }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 420);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div className="art art-dada" aria-hidden>
      <div className="dd-letters">
        {"DADA".split("").map((ch, i) => {
          const r = (n: number) => chance(tick * 7 + i, n);
          const face = tick === 0 ? i : Math.floor(r(1) * 4);
          const size = [1, 0.62, 1.5, 0.85][tick === 0 ? i : Math.floor(r(2) * 4)];
          const turn = tick === 0 ? (i === 2 ? 90 : 0) : r(3) < 0.2 ? 90 : r(3) > 0.9 ? 180 : Math.round((r(4) - 0.5) * 16);
          const red = (tick === 0 ? i === 1 : Math.floor(r(5) * 4) === i);
          return (
            <span
              key={i}
              className="dd-letter"
              style={{
                fontFamily: DADA_FACES[face],
                fontStyle: face === 1 ? "italic" : "normal",
                fontSize: `${size}em`,
                transform: `rotate(${turn}deg)`,
                color: red ? "#D22B1F" : "#1A1814",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <span className="dd-stamp">ja</span>
      <svg className="dd-hand" viewBox="0 0 120 48" aria-hidden>
        <path
          d="M4 18 H62 C66 18 68 14 64 11 L54 4 C51 2 53 -1 57 1 L84 14 C88 16 92 16 96 16 H112 C116 16 116 24 112 24 H98 C102 24 102 31 98 31 H94 C98 31 98 38 94 38 H88 C92 38 92 44 88 44 H58 C44 44 34 36 30 30 H4 Z"
          fill="none"
          stroke="#1A1814"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M70 31 H94 M70 38 H88 M70 24 H98" stroke="#1A1814" strokeWidth="1.6" />
      </svg>
    </div>
  );
}

/* ——— Pop Art: one master print, run off six times. Each pull lays new inks;
   the black key never quite lines up. ——— */

const INKS: [string, string][] = [
  ["#FF5FA2", "#FFD400"],
  ["#2EB4E6", "#E2231A"],
  ["#FFD400", "#1FC3B5"],
  ["#E2231A", "#FF5FA2"],
  ["#1FC3B5", "#FF6A13"],
  ["#FF6A13", "#2EB4E6"],
  ["#A6D608", "#E2231A"],
];

const ReturnKey = ({ fill }: { fill: string }) => (
  <svg viewBox="0 0 100 100" className="block h-full w-full">
    <g className="pp-color">
      <rect x="14" y="14" width="72" height="72" rx="4" fill={fill} />
    </g>
    <g className="pp-key" fill="none" stroke="#111" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
      <rect x="14" y="14" width="72" height="72" rx="4" />
      <path d="M66 34 V56 H36" />
      <path d="M44 47 L35 56 L44 65" />
    </g>
  </svg>
);

export function PopArt({ active }: { active: boolean }) {
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!active) return;
    const next = () => setRun((r) => r + 1);
    const first = window.setTimeout(next, 0); // a fresh pull the moment you arrive
    const id = window.setInterval(next, 1500);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [active]);

  return (
    <div className="art art-pop" aria-hidden>
      <div className="pp-grid">
        {Array.from({ length: 6 }, (_, i) => {
          const [bg, key] = INKS[(i + run * 2) % INKS.length];
          return (
            <span key={i} className="pp-cell" style={{ background: bg, ["--i" as string]: i }}>
              <ReturnKey fill={key} />
            </span>
          );
        })}
      </div>
      <span key={run} className="pp-squeegee" />
    </div>
  );
}

/* ——— Cubism: a still life taken apart into planes. Move across it and each
   plane slides to a different viewpoint; nothing turns in 3D. ——— */

export function CubismArt() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="art art-cubism"
      aria-hidden
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--vx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      }}
      onPointerLeave={(e) => e.currentTarget.style.setProperty("--vx", "0")}
    >
      <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="cb-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="7" stroke="#2A2622" strokeWidth="1.4" />
          </pattern>
          <linearGradient id="cb-passage" x1="0" x2="1">
            <stop offset="0" stopColor="#E8DCC4" stopOpacity="0" />
            <stop offset="1" stopColor="#E8DCC4" stopOpacity="1" />
          </linearGradient>
        </defs>
        <g className="cb-plane" style={{ ["--k" as string]: -14 }}>
          <path d="M60 170 L250 120 L300 420 L90 470 Z" fill="#C9A15F" />
          <path d="M250 120 L300 420 L270 428 L224 128 Z" fill="url(#cb-hatch)" opacity="0.55" />
        </g>
        <g className="cb-plane" style={{ ["--k" as string]: 10 }}>
          <path d="M150 300 L360 260 L340 610 L170 580 Z" fill="#6E7F8C" opacity="0.9" />
          <path d="M150 300 L360 260 L356 330 L150 360 Z" fill="url(#cb-passage)" />
        </g>
        <g className="cb-plane" style={{ ["--k" as string]: -6 }}>
          <path d="M40 520 L220 470 L240 740 L60 760 Z" fill="#EDE6D3" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1="66" y1={600 + i * 22} x2="214" y2={584 + i * 22} stroke="#1F1D1A" strokeWidth="2" opacity="0.35" />
          ))}
          <text x="70" y="568" fontFamily="var(--font-stardos)" fontWeight="700" fontSize="58" fill="#1F1D1A" transform="rotate(-8 70 568)">
            JOU
          </text>
        </g>
        <g className="cb-plane" style={{ ["--k" as string]: 18 }}>
          <path d="M200 380 L330 350 L350 470 L215 500 Z" fill="#5C4128" />
          <circle cx="272" cy="428" r="36" fill="#2A2622" />
          <circle cx="272" cy="428" r="36" fill="none" stroke="#F3EEE2" strokeWidth="3" />
        </g>
        <g className="cb-plane" style={{ ["--k" as string]: 26 }}>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={248 + i * 15} y1="160" x2={256 + i * 15} y2="700" stroke="#F3EEE2" strokeWidth="2" />
          ))}
          <path d="M240 160 C230 110 300 90 310 140" fill="none" stroke="#2A2622" strokeWidth="9" strokeLinecap="round" />
        </g>
        <g className="cb-plane" style={{ ["--k" as string]: -22 }}>
          <path d="M20 60 L130 40 L150 260 L36 250 Z" fill="#8E8577" opacity="0.85" />
          <path d="M20 60 L130 40 L134 80 L24 96 Z" fill="url(#cb-hatch)" opacity="0.45" />
        </g>
      </svg>
    </div>
  );
}

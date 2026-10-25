"use client";

import { audio } from "@/lib/audio/manager";
import Arrow from "./Arrow";
import { useCallback, useEffect, useRef, useState } from "react";

// The still life, taken apart. Each plane holds the object from two sides (the
// sound hole round and edge-on, the glass from the side and from above). Move
// across the table and every plane decides, at its own point, which side it
// shows and whether it comes forward. Nothing rotates in 3D: planes slide a
// few pixels and change places, like walking round a table that stays flat.

type Pt = [number, number];
type Plane = {
  pts: Pt[];
  fill: string;
  alpha?: number;
  fade: "l" | "r" | "t" | "b"; // the open side: passage into the next plane
  hard: number[]; // edges (start index) drawn as hard charcoal lines
  hatch?: number; // edge whose inside gets the one-sided hatching
  k: number; // how far it slides per unit of viewpoint (px)
  z: [number, number]; // stacking for view 0 / view 1
  flip: number; // viewpoint (-1..1) where it turns to view 1
  views?: [React.ReactNode, React.ReactNode];
};

const C = "#2A2622";
const CH = "#F3EEE2";

const PLANES: Plane[] = [
  // quiet corners
  { pts: [[30, 40], [210, 26], [196, 206], [44, 226]], fill: "#8E8577", alpha: 0.32, fade: "r", hard: [3], k: -30, z: [0, 0], flip: 2 },
  { pts: [[812, 512], [982, 492], [972, 684], [826, 692]], fill: "#C9A15F", alpha: 0.4, fade: "l", hard: [1], k: 30, z: [0, 0], flip: 2 },
  // the table edge, from the front and from above
  {
    pts: [[230, 548], [790, 512], [808, 640], [214, 690]], fill: "#B8894A", fade: "r", hard: [0], hatch: 3, k: -8, z: [1, 5], flip: 0.78,
    views: [
      <g key="a" stroke={C} strokeWidth="3" fill="none"><path d="M240 572 L786 536" /><path d="M244 590 L788 554" strokeWidth="1.5" /></g>,
      <g key="b" stroke="#5C4128" strokeWidth="2" fill="none" opacity="0.8">{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M250 ${590 + i * 18} C 380 ${570 + i * 18}, 470 ${610 + i * 18}, 600 ${584 + i * 18} S 760 ${566 + i * 18}, 790 ${572 + i * 18}`} />)}</g>,
    ],
  },
  // the neck: a scroll, then frets
  {
    pts: [[232, 118], [364, 98], [382, 272], [252, 292]], fill: "#8E8577", fade: "b", hard: [3, 0], hatch: 3, k: -24, z: [3, 6], flip: -0.68,
    views: [
      <path key="a" d="M318 200 a 30 30 0 1 1 -30 -30 a 22 22 0 1 1 22 22 a 14 14 0 1 1 -14 -14 a 7 7 0 1 1 7 7" fill="none" stroke={C} strokeWidth="5" strokeLinecap="round" />,
      <g key="b" stroke={C} strokeWidth="3"><path d="M286 120 L298 284 M330 116 L342 280" />{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M288 ${146 + i * 24} L338 ${142 + i * 24}`} strokeWidth="2" />)}</g>,
    ],
  },
  // the guitar's body: a curve, then the same curve seen in facets
  {
    pts: [[300, 168], [542, 128], [582, 522], [330, 562]], fill: "#C9A15F", fade: "r", hard: [3, 0], hatch: 3, k: -14, z: [2, 7], flip: 0.12,
    views: [
      <path key="a" d="M362 200 C 444 240, 380 330, 452 372 C 522 412, 432 500, 472 542" fill="none" stroke={C} strokeWidth="7" strokeLinecap="round" />,
      <path key="b" d="M378 190 L436 300 L398 384 L478 448 L452 540" fill="none" stroke={C} strokeWidth="7" strokeLinejoin="miter" />,
    ],
  },
  // the newspaper, flat and then folded
  {
    pts: [[168, 420], [402, 388], [420, 642], [188, 662]], fill: "#EDE6D3", fade: "r", hard: [0, 3], hatch: 3, k: -20, z: [6, 2], flip: -0.34,
    views: [
      <g key="a" stroke="#1F1D1A" strokeWidth="2.2" opacity="0.4">{[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M200 ${520 + i * 18} L392 ${500 + i * 18}`} />)}<path d="M296 500 L304 640" strokeWidth="1.4" /></g>,
      <g key="b" stroke="#1F1D1A" strokeWidth="2.2" opacity="0.4">{[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M204 ${540 + i * 16} L300 ${506 + i * 16} L392 ${528 + i * 16}`} fill="none" />)}</g>,
    ],
  },
  // the sound hole: round from the front, an ellipse from the side
  {
    pts: [[430, 298], [640, 262], [668, 452], [452, 486]], fill: "#5C4128", fade: "b", hard: [0, 1], hatch: 1, k: 10, z: [5, 3], flip: -0.18,
    views: [
      <g key="a"><circle cx="548" cy="372" r="58" fill={C} /><circle cx="548" cy="372" r="66" fill="none" stroke={CH} strokeWidth="3" /></g>,
      <g key="b"><ellipse cx="548" cy="372" rx="26" ry="60" fill={C} /><ellipse cx="560" cy="372" rx="34" ry="68" fill="none" stroke={CH} strokeWidth="3" /></g>,
    ],
  },
  // the glass: profile, then from above
  {
    pts: [[640, 138], [802, 118], [820, 330], [656, 350]], fill: "#F3EEE2", fade: "l", hard: [0, 1], hatch: 1, k: 16, z: [3, 7], flip: -0.52,
    views: [
      <g key="a" fill="none" stroke={C} strokeWidth="3"><path d="M690 172 L708 322 L764 322 L782 172" /><ellipse cx="736" cy="172" rx="46" ry="10" /><path d="M700 250 L772 250" strokeWidth="1.5" /></g>,
      <g key="b" fill="none" stroke={C} strokeWidth="3"><circle cx="732" cy="236" r="62" /><circle cx="732" cy="236" r="44" strokeWidth="1.5" /><circle cx="732" cy="236" r="6" fill={C} /></g>,
    ],
  },
  // the strings: parallel, then running away from you
  {
    pts: [[520, 88], [602, 80], [626, 640], [540, 650]], fill: "#6E7F8C", alpha: 0.92, fade: "t", hard: [1], hatch: 1, k: 22, z: [4, 8], flip: 0.36,
    views: [
      <g key="a" stroke={CH} strokeWidth="2.2">{[0, 1, 2, 3].map((i) => <path key={i} d={`M${546 + i * 14} 110 L${556 + i * 14} 630`} />)}</g>,
      <g key="b" stroke={CH} strokeWidth="2.2">{[0, 1, 2, 3].map((i) => <path key={i} d={`M572 108 L${532 + i * 28} 630`} />)}</g>,
    ],
  },
  // the bottle: shoulders from the side, two rings from above
  {
    pts: [[700, 300], [862, 280], [882, 560], [690, 590]], fill: "#8E8577", fade: "b", hard: [3, 0], hatch: 3, k: 26, z: [4, 6], flip: 0.6,
    views: [
      <path key="a" d="M772 298 L772 358 C 742 378, 732 398, 732 430 L732 560 L842 560 L842 430 C 842 398, 832 378, 802 358 L802 298 Z" fill={C} opacity="0.86" />,
      <g key="b" fill="none" stroke={C} strokeWidth="4"><circle cx="786" cy="430" r="62" /><circle cx="786" cy="430" r="18" fill={C} /></g>,
    ],
  },
];

const VIEWS = 9; // the viewpoint is read in nine steps, so React only re-renders on a real change

const grad = (fade: Plane["fade"]) =>
  ({ l: [1, 0, 0, 0], r: [0, 0, 1, 0], t: [0, 1, 0, 0], b: [0, 0, 0, 1] })[fade];

function PlaneSvg({ p, i, view }: { p: Plane; i: number; view: 0 | 1 }) {
  const [x1, y1, x2, y2] = grad(p.fade);
  const pts = p.pts.map((q) => q.join(",")).join(" ");
  const c = p.pts.reduce((a, q) => [a[0] + q[0] / 4, a[1] + q[1] / 4], [0, 0]);
  const edge = (e: number) => [p.pts[e], p.pts[(e + 1) % 4]] as const;
  const inset = (q: Pt, t: number): Pt => [q[0] + (c[0] - q[0]) * t, q[1] + (c[1] - q[1]) * t];
  return (
    <svg
      className="cb-hp"
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid meet"
      data-view={view}
      style={{ zIndex: p.z[view], ["--k" as string]: p.k }}
    >
      <defs>
        <linearGradient id={`cb-hg-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" stopColor={p.fill} stopOpacity={p.alpha ?? 1} />
          <stop offset="0.58" stopColor={p.fill} stopOpacity={p.alpha ?? 1} />
          <stop offset="1" stopColor={p.fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={pts} fill={`url(#cb-hg-${i})`} />
      {p.hatch !== undefined && (() => {
        const [a, b] = edge(p.hatch);
        const strip = [a, b, inset(b, 0.2), inset(a, 0.2)].map((q) => q.join(",")).join(" ");
        return <polygon points={strip} fill="url(#cb-hatch)" opacity="0.5" />;
      })()}
      {p.hard.map((e) => {
        const [a, b] = edge(e);
        return <line key={e} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C} strokeWidth="3" strokeLinecap="square" />;
      })}
      {p.views && (
        <>
          <g className="cb-v cb-v0">{p.views[0]}</g>
          <g className="cb-v cb-v1">{p.views[1]}</g>
        </>
      )}
    </svg>
  );
}

export default function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(Math.floor(VIEWS / 2));
  const stepRef = useRef(step);
  const moved = useRef(false);

  const look = useCallback((vx: number) => {
    const el = stage.current;
    if (!el) return;
    el.style.setProperty("--vx", vx.toFixed(3));
    const s = Math.round(((vx + 1) / 2) * (VIEWS - 1));
    if (s !== stepRef.current) {
      stepRef.current = s;
      setStep(s);
    }
  }, []);

  // One slow walk round the table on arrival, so the idea shows itself; then
  // it holds still until you move.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now() + 700;
    const tick = (t: number) => {
      if (moved.current) return;
      const k = Math.min(1, Math.max(0, (t - t0) / 2200));
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      look(Math.sin(e * Math.PI * 1.5) * 0.85);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [look]);

  const lastSfx = useRef(0);
  useEffect(() => {
    if (!moved.current) return;
    const now = performance.now();
    if (now - lastSfx.current > 450) {
      lastSfx.current = now;
      audio.sfx("slide");
    }
  }, [step]);

  const viewpoint = (s: number) => (s / (VIEWS - 1)) * 2 - 1;

  return (
    <section
      className="cb-hero"
      aria-label="A still life seen from several sides at once"
      onPointerMove={(e) => {
        moved.current = true;
        const r = e.currentTarget.getBoundingClientRect();
        look(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)));
      }}
    >
      <div className="cb-hero-oval" aria-hidden />
      <div ref={stage} className="cb-stage" aria-hidden>
        {PLANES.map((p, i) => (
          <PlaneSvg key={i} p={p} i={i} view={viewpoint(step) > p.flip ? 1 : 0} />
        ))}
        <span className="cb-frag cb-frag-ma" style={{ zIndex: 9 }}>MA</span>
        <span className="cb-frag cb-frag-jou" style={{ zIndex: 9 }} data-full="JOURNAL">
          <span>JOU</span>
          <span className="cb-frag-rest">RNAL</span>
        </span>
        <span className="cb-frag cb-frag-date" style={{ zIndex: 9 }}>OCT. 22</span>
      </div>
      <a href="#next" className="cb-frag-next" aria-label="Beacon, what I'm building next">
        <span aria-hidden className="cb-frag-next-word">
          BEAC<span className="cb-frag-next-rest">ON</span>
        </span>
        <span aria-hidden className="cb-frag-next-sub">
          next <Arrow dir="down" />
        </span>
      </a>
      <p className="cb-hero-hint">
        <span className="cb-hint-fine">Move across the table. It stays flat; you walk round it.</span>
        <span className="cb-hint-touch">Drag across the table. It stays flat; you walk round it.</span>
      </p>
    </section>
  );
}

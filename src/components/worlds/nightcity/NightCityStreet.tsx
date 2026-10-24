import { seeded } from "@/lib/seeded";

// A one-point-perspective street canyon: megabuildings on both sides, neon
// stacked down every wall, a megatower at the vanishing point and a
// holographic koi swimming through the strip of sky.

const W = 1600;
const H = 900;
const VP = { x: 800, y: 400 };
const NEON = ["#fcee0a", "#00f0ff", "#ff003c", "#ff2bd6", "#fcee0a", "#00f0ff"];

// Depth f runs from 0 (the near edge of the screen) to 1 (the vanishing point).
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const wallX = (f: number, side: 1 | -1) => (side === 1 ? lerp(0, VP.x, f) : lerp(W, VP.x, f));
const groundY = (f: number) => lerp(H + 40, VP.y + 70, f);
const roofY = (f: number, nearRoof: number) => lerp(nearRoof, VP.y - 60, f);

type Building = { f0: number; f1: number; roof: number; tone: string };
type Sign = { f: number; top: number; len: number; color: string; side: 1 | -1; flicker: boolean };

const build = (side: 1 | -1, seed: number) => {
  const rand = seeded(seed);
  const buildings: Building[] = [];
  let f = 0;
  while (f < 0.86) {
    const span = 0.1 + rand() * 0.16;
    buildings.push({
      f0: f,
      f1: Math.min(0.88, f + span),
      roof: -260 + rand() * 300,
      tone: ["#07070c", "#0b0a12", "#0e0c16"][Math.floor(rand() * 3)],
    });
    f += span;
  }
  const signs: Sign[] = [];
  for (let i = 0; i < 16; i++) {
    signs.push({
      f: 0.04 + rand() * 0.8,
      top: 0.12 + rand() * 0.5,
      len: 0.12 + rand() * 0.28,
      color: NEON[Math.floor(rand() * NEON.length)],
      side,
      flicker: rand() < 0.2,
    });
  }
  const windows: { pts: string; color: string; o: number }[] = [];
  for (const b of buildings) {
    const cols = Math.max(2, Math.round((b.f1 - b.f0) * 40));
    for (let c = 0; c < cols; c++) {
      const fa = lerp(b.f0, b.f1, (c + 0.25) / cols);
      const fb = lerp(b.f0, b.f1, (c + 0.65) / cols);
      for (let r = 0.08; r < 0.92; r += 0.07) {
        if (rand() > 0.32) continue;
        const ya = (f: number) => lerp(roofY(f, b.roof), groundY(f), r);
        const yb = (f: number) => lerp(roofY(f, b.roof), groundY(f), r + 0.03);
        windows.push({
          pts: `${wallX(fa, side)},${ya(fa)} ${wallX(fb, side)},${ya(fb)} ${wallX(fb, side)},${yb(fb)} ${wallX(fa, side)},${yb(fa)}`,
          color: rand() < 0.7 ? "#f5d27a" : NEON[Math.floor(rand() * NEON.length)],
          o: 0.25 + rand() * 0.55,
        });
      }
    }
  }
  return { buildings, signs, windows };
};

const left = build(1, 101);
const right = build(-1, 202);

const wallPoly = (b: Building, side: 1 | -1) =>
  [
    [wallX(b.f0, side), roofY(b.f0, b.roof)],
    [wallX(b.f1, side), roofY(b.f1, b.roof)],
    [wallX(b.f1, side), groundY(b.f1)],
    [wallX(b.f0, side), groundY(b.f0)],
  ]
    .map((p) => p.join(","))
    .join(" ");

// A vertical neon sign hanging off the wall, sized by its depth.
const SignShape = ({ s }: { s: Sign }) => {
  const x = wallX(s.f, s.side);
  const scale = 1 - s.f * 0.92;
  const w = 34 * scale;
  const yTop = lerp(roofY(s.f, -100), groundY(s.f), s.top);
  const h = (groundY(s.f) - roofY(s.f, -100)) * s.len;
  const sx = s.side === 1 ? x : x - w;
  return (
    <g className={s.flicker ? "art-flicker" : undefined}>
      <rect x={sx} y={yTop} width={w} height={h} fill="#05050a" stroke={s.color} strokeWidth={Math.max(1, 3 * scale)} filter="url(#nc-glow)" />
      {Array.from({ length: Math.max(2, Math.round(h / (26 * scale + 4))) }, (_, i) => (
        <rect key={i} x={sx + w * 0.25} y={yTop + 8 * scale + i * (26 * scale + 4)} width={w * 0.5} height={16 * scale} fill={s.color} opacity="0.85" />
      ))}
    </g>
  );
};

export default function NightCityStreet() {
  const rain = seeded(303);
  const allSigns = [...left.signs, ...right.signs].sort((a, b) => b.f - a.f);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="ncs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120518" />
          <stop offset="0.55" stopColor="#3a0b2e" />
          <stop offset="1" stopColor="#ff2b6b" />
        </linearGradient>
        <linearGradient id="ncs-street" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a0a24" />
          <stop offset="1" stopColor="#020205" />
        </linearGradient>
        <radialGradient id="ncs-tower-glow">
          <stop offset="0" stopColor="#ff2b6b" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff2b6b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ncs-koi" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#00f0ff" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#ff8a3d" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ff2bd6" stopOpacity="0.55" />
        </linearGradient>
        <filter id="nc-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="ncs-reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* sky strip and the megatower at the end of the street */}
      <rect width={W} height={H} fill="url(#ncs-sky)" />
      <circle cx={VP.x} cy={VP.y - 120} r="260" fill="url(#ncs-tower-glow)" />
      <path d={`M${VP.x - 40} ${VP.y + 80} L ${VP.x - 28} ${VP.y - 280} L ${VP.x} ${VP.y - 360} L ${VP.x + 28} ${VP.y - 280} L ${VP.x + 40} ${VP.y + 80} Z`} fill="#0a0410" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={VP.x - 20} y={VP.y - 250 + i * 22} width="40" height="2" fill="#ff2b6b" opacity={0.35 + (i % 3) * 0.2} />
      ))}
      <circle cx={VP.x} cy={VP.y - 362} r="4" fill="#ff003c" className="art-flicker" />

      {/* holographic koi swimming over the street */}
      <g opacity="0.85">
        <g className="koi">
          <path d="M0 0 C 30 -26 90 -26 130 -4 L 170 -26 L 160 0 L 170 26 L 130 4 C 90 26 30 26 0 0 Z" fill="url(#ncs-koi)" />
          <path d="M40 -16 C 60 -36 80 -32 86 -18 M44 16 C 60 34 76 30 82 18" stroke="#00f0ff" strokeWidth="2" fill="none" opacity="0.7" />
          <circle cx="22" cy="-4" r="3" fill="#fff" />
          <animateMotion dur="26s" repeatCount="indefinite" rotate="auto" path={`M -300 160 C 300 60 700 280 1100 120 S 1700 200 1950 90`} />
        </g>
      </g>

      {/* the street, wet */}
      <path d={`M0 ${H} L ${W} ${H} L ${VP.x + 60} ${VP.y + 70} L ${VP.x - 60} ${VP.y + 70} Z`} fill="url(#ncs-street)" />
      <path d={`M${VP.x} ${VP.y + 70} L ${VP.x - 6} ${H} M ${VP.x} ${VP.y + 70} L ${VP.x + 6} ${H}`} stroke="#fcee0a" strokeWidth="3" strokeDasharray="30 40" opacity="0.6" />
      {allSigns
        .filter((s) => s.f < 0.6)
        .map((s, i) => {
          const x = wallX(s.f, s.side) + (s.side === 1 ? 8 : -26) * (1 - s.f);
          return <rect key={i} x={x} y={groundY(s.f) - 4} width={18 * (1 - s.f)} height={(H - groundY(s.f)) * 0.9 + 20} fill={s.color} opacity="0.22" />;
        })}

      {/* walls */}
      {([
        [left, 1],
        [right, -1],
      ] as const).map(([side, dir]) => (
        <g key={dir}>
          {side.buildings.map((b, i) => (
            <polygon key={i} points={wallPoly(b, dir)} fill={b.tone} stroke="#2a1035" strokeWidth="1" />
          ))}
          {side.windows.map((w, i) => (
            <polygon key={i} points={w.pts} fill={w.color} opacity={w.o} />
          ))}
        </g>
      ))}

      {/* overhead cables */}
      <g stroke="#05030a" strokeWidth="2.5" fill="none">
        <path d="M120 120 Q 800 300 1480 140" />
        <path d="M330 240 Q 800 360 1270 250" />
        <path d="M540 300 Q 800 380 1060 310" />
      </g>

      {/* neon, far to near */}
      {allSigns.map((s, i) => (
        <SignShape key={i} s={s} />
      ))}

      {/* steam from the vents */}
      <g fill="#ffd7f0" opacity="0.12">
        <ellipse cx="560" cy="760" rx="90" ry="30" className="nc-steam" />
        <ellipse cx="1080" cy="800" rx="120" ry="36" className="nc-steam" style={{ animationDelay: "-3s" }} />
      </g>

      {/* rain */}
      <g stroke="#9ff6ff" strokeWidth="1" opacity="0.28" className="art-rain">
        {Array.from({ length: 130 }, (_, i) => {
          const x = rain() * (W + 60) - 30;
          const y = rain() * H - 60;
          return <path key={i} d={`M${x.toFixed(0)} ${y.toFixed(0)} l -5 26`} />;
        })}
      </g>
    </svg>
  );
}

import { seeded } from "@/lib/seeded";

// Wide hero scenes (1600×900) for each world. Generated parts use a fixed
// seed so the markup is stable between server and client.

const heroSvg = {
  viewBox: "0 0 1600 900",
  preserveAspectRatio: "xMidYMax slice",
  "aria-hidden": true,
  className: "absolute inset-0 h-full w-full",
} as const;

type Tower = { x: number; w: number; h: number };

const towers = (seed: number, count: number, minH: number, maxH: number, minW = 50, maxW = 130): Tower[] => {
  const rand = seeded(seed);
  const out: Tower[] = [];
  let x = -40;
  for (let i = 0; i < count && x < 1640; i++) {
    const w = minW + rand() * (maxW - minW);
    out.push({ x, w, h: minH + rand() * (maxH - minH) });
    x += w + rand() * 14;
  }
  return out;
};

const windows = (seed: number, list: Tower[], base: number, density: number) => {
  const rand = seeded(seed);
  const out: { x: number; y: number; o: number }[] = [];
  for (const t of list) {
    for (let y = base - t.h + 18; y < base - 20; y += 22) {
      for (let x = t.x + 10; x < t.x + t.w - 14; x += 18) {
        if (rand() < density) out.push({ x, y, o: 0.35 + rand() * 0.6 });
      }
    }
  }
  return out;
};

/* ——— Noir ——— */

const noirFar = towers(11, 30, 160, 360);
const noirNear = towers(12, 18, 260, 560, 90, 200);
const noirWindows = windows(13, noirNear, 720, 0.12);

export function NoirHero() {
  const rain = seeded(14);
  return (
    <svg {...heroSvg}>
      <defs>
        <linearGradient id="nh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05070a" />
          <stop offset="0.7" stopColor="#1c232c" />
        </linearGradient>
        <radialGradient id="nh-lamp" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#e9dfa5" stopOpacity="0.5" />
          <stop offset="1" stopColor="#e9dfa5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nh-street" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1015" />
          <stop offset="1" stopColor="#030405" />
        </linearGradient>
        <pattern id="nh-dots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1.2" fill="#000" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#nh-sky)" />
      {/* moon behind cloud */}
      <circle cx="1240" cy="170" r="70" fill="#d8d2c0" opacity="0.18" />
      <g fill="#10151c">
        {noirFar.map((t, i) => (
          <rect key={i} x={t.x} y={600 - t.h} width={t.w} height={t.h + 120} />
        ))}
      </g>
      {/* water tower */}
      <g fill="#0a0d11" transform="translate(300 380)">
        <path d="M-40 0 h80 v-50 q-40 -24 -80 0 Z" />
        <path d="M-34 0 l -10 70 M34 0 l 10 70 M0 0 v70" stroke="#0a0d11" strokeWidth="5" />
      </g>
      <g fill="#07090c">
        {noirNear.map((t, i) => (
          <rect key={i} x={t.x} y={720 - t.h} width={t.w} height={t.h} />
        ))}
      </g>
      {noirWindows.map((w, i) => (
        <rect key={i} x={w.x} y={w.y} width="8" height="12" fill="#e9dfa5" opacity={w.o * 0.7} />
      ))}
      {/* neon hotel sign, half dead */}
      <g transform="translate(1380 260)">
        <rect x="-6" y="-6" width="52" height="210" fill="#07090c" />
        {["H", "O", "T", "E", "L"].map((ch, i) => (
          <text
            key={ch}
            x="20"
            y={30 + i * 40}
            textAnchor="middle"
            fontFamily="var(--font-oswald)"
            fontSize="34"
            fill="#c43a3a"
            className={i === 3 ? "art-flicker" : undefined}
            opacity={i === 3 ? 1 : 0.85}
          >
            {ch}
          </text>
        ))}
      </g>
      {/* street */}
      <rect y="720" width="1600" height="180" fill="url(#nh-street)" />
      <path d="M0 720 H1600" stroke="#2a3340" strokeWidth="2" />
      {/* reflections */}
      <g opacity="0.25">
        {noirWindows.filter((_, i) => i % 6 === 0).map((w, i) => (
          <rect key={i} x={w.x} y={730 + (i % 5) * 6} width="6" height={40 + (i % 4) * 20} fill="#e9dfa5" opacity={w.o * 0.4} />
        ))}
      </g>
      {/* lamp and figure */}
      <path d="M1050 720 V 400 q 0 -26 -30 -26 h -30" stroke="#151a21" strokeWidth="10" fill="none" />
      <rect x="966" y="368" width="30" height="13" rx="4" fill="#e9dfa5" />
      <path d="M981 381 L 820 720 L 1140 720 Z" fill="url(#nh-lamp)" />
      <ellipse cx="980" cy="760" rx="170" ry="14" fill="#e9dfa5" opacity="0.1" />
      <g transform="translate(950 720)" fill="#010203">
        <path d="M-32 0 L -24 -128 C -21 -150 21 -150 24 -128 L 34 0 Z" />
        <path d="M-17 -148 a 17 19 0 1 1 34 0 a 17 19 0 1 1 -34 0" />
        <path d="M-25 -162 h50 l -6 -12 h-38 Z" />
        <path d="M-36 -165 h72 v4 h-72 Z" />
        {/* coat tail lifting in the wind */}
        <path d="M24 -40 L 52 -10 L 34 0 Z" />
      </g>
      <rect width="1600" height="900" fill="url(#nh-dots)" />
      {/* rain */}
      <g stroke="#a9b8c9" strokeWidth="1.2" opacity="0.4" className="art-rain">
        {Array.from({ length: 140 }, (_, i) => {
          const x = rain() * 1660 - 30;
          const y = rain() * 900 - 60;
          return <path key={i} d={`M${x.toFixed(0)} ${y.toFixed(0)} l -10 34`} />;
        })}
      </g>
    </svg>
  );
}

/* ——— Frontier ——— */

export function FrontierHero() {
  const dust = seeded(21);
  return (
    <svg {...heroSvg}>
      <defs>
        <linearGradient id="fh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a130c" />
          <stop offset="0.4" stopColor="#9c4320" />
          <stop offset="0.68" stopColor="#e7a456" />
          <stop offset="0.75" stopColor="#f6d189" />
        </linearGradient>
        <radialGradient id="fh-sun">
          <stop offset="0.5" stopColor="#fbe3a6" />
          <stop offset="1" stopColor="#fbe3a6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#fh-sky)" />
      <circle cx="760" cy="600" r="260" fill="url(#fh-sun)" opacity="0.6" />
      <circle cx="760" cy="600" r="130" fill="#fbe3a6" />
      {/* vultures */}
      <g stroke="#2a130c" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M420 200 q 14 -12 28 0 q 14 -12 28 0" className="fr-vulture" />
        <path d="M520 160 q 10 -9 20 0 q 10 -9 20 0" className="fr-vulture" style={{ animationDelay: "-2s" }} />
      </g>
      {/* far mesas */}
      <path d="M-20 640 h120 l20 -90 h160 l22 90 h140 l12 -40 h90 l16 40 h300 l26 -130 h210 l24 130 h220 l14 -60 h120 l12 60 h160 V900 H-20 Z" fill="#a54e27" opacity="0.75" />
      <path d="M-20 690 h260 l30 -150 h250 l34 150 h420 l18 -70 h130 l20 70 h460 V900 H-20 Z" fill="#7a3319" />
      <path d="M-20 760 C 300 720 700 780 1000 740 C 1250 710 1450 750 1620 730 V 900 H -20 Z" fill="#4a1f0f" />
      {/* windmill */}
      <g transform="translate(1270 750)" stroke="#1c0d07" strokeWidth="5" fill="none">
        <path d="M-26 0 L 0 -230 L 26 0 M -18 -70 h36 M -10 -150 h20" />
        <g transform="translate(0 -236)">
          <g className="art-windmill">
            {Array.from({ length: 10 }, (_, i) => (
              <path key={i} d="M0 0 L 0 -58" transform={`rotate(${i * 36})`} strokeWidth="7" />
            ))}
          </g>
        </g>
        <path d="M0 -236 l 50 12 l 4 -16 Z" fill="#1c0d07" strokeWidth="2" />
      </g>
      {/* fence */}
      <g fill="#1c0d07">
        {[120, 260, 400, 540].map((x, i) => (
          <rect key={x} x={x} y={770 - i * 3} width="10" height="110" />
        ))}
        <path d="M110 790 L 560 776 L 560 780 L 110 794 Z" />
        <path d="M110 820 L 560 806 L 560 810 L 110 824 Z" />
        {/* hat on the post */}
        <path d="M232 770 q 34 -12 70 0 q -6 -6 -14 -6 q -4 -26 -21 -26 q -17 0 -21 26 q -8 0 -14 6 Z" />
      </g>
      {/* saguaros */}
      {[
        [1460, 880, 1.2],
        [900, 860, 0.8],
      ].map(([x, y, s], i) => (
        <path
          key={i}
          transform={`translate(${x} ${y}) scale(${s})`}
          d="M-12 0 v-150 q0 -14 12 -14 q12 0 12 14 V0 Z M-12 -80 h-24 q-10 0 -10 -10 v-34 q0 -10 10 -10 q10 0 10 10 v24 h14 Z M12 -100 h20 v-30 q0 -10 10 -10 q10 0 10 10 v36 q0 10 -10 10 h-30 Z"
          fill="#1c0d07"
        />
      ))}
      <rect y="860" width="1600" height="40" fill="#1c0d07" />
      <g fill="#fbe3a6" opacity="0.45">
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={dust() * 1600} cy={620 + dust() * 260} r={1 + dust() * 2.4} />
        ))}
      </g>
    </svg>
  );
}

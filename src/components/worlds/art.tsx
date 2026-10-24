// Hand-drawn SVG scenes for each world. They scale to fill their container
// and share a viewBox so the select screen can swap between them.

type ArtProps = { className?: string };

const svgProps = {
  viewBox: "0 0 400 600",
  preserveAspectRatio: "xMidYMid slice",
  "aria-hidden": true,
} as const;

// A lone figure in a long coat under a streetlamp, rain coming down.
export function NoirArt({ className }: ArtProps) {
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="noir-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1117" />
          <stop offset="1" stopColor="#1f2630" />
        </linearGradient>
        <radialGradient id="noir-lamp" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#e9dfa5" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e9dfa5" stopOpacity="0" />
        </radialGradient>
        <pattern id="noir-dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.1" fill="#000" opacity="0.35" />
        </pattern>
      </defs>
      <rect width="400" height="600" fill="url(#noir-sky)" />
      {/* skyline */}
      <path
        d="M0 330 h40 v-90 h30 v40 h24 v-120 h46 v80 h20 v-40 h40 v100 h30 v-160 h50 v110 h26 v-60 h44 v140 h50 V600 H0 Z"
        fill="#0a0d12"
      />
      {[
        [56, 270], [112, 200], [124, 236], [210, 280], [262, 200], [278, 250], [346, 300],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="8" height="12" fill="#e9dfa5" opacity={0.5 + (i % 3) * 0.15} />
      ))}
      {/* street */}
      <rect y="470" width="400" height="130" fill="#07090c" />
      <path d="M0 470 H400" stroke="#2a3340" strokeWidth="2" />
      {/* lamp */}
      <path d="M290 470 V230 q0 -20 -24 -20 h-20" stroke="#1a1f27" strokeWidth="7" fill="none" />
      <rect x="232" y="206" width="22" height="10" rx="3" fill="#e9dfa5" />
      <path d="M243 216 L 150 470 L 340 470 Z" fill="url(#noir-lamp)" />
      {/* figure */}
      <g transform="translate(232 470)" fill="#020304">
        <path d="M-22 0 L -16 -86 C -14 -100 14 -100 16 -86 L 24 0 Z" />
        <path d="M-12 -98 a 12 13 0 1 1 24 0 a 12 13 0 1 1 -24 0" />
        <path d="M-17 -108 h34 l -4 -8 h-26 Z" />
        <path d="M-24 -110 h48 v3 h-48 Z" />
      </g>
      {/* puddle reflection */}
      <ellipse cx="240" cy="500" rx="80" ry="8" fill="#e9dfa5" opacity="0.12" />
      <rect width="400" height="600" fill="url(#noir-dots)" />
      {/* rain */}
      <g stroke="#9fb0c4" strokeWidth="1" opacity="0.45" className="art-rain">
        {Array.from({ length: 46 }, (_, i) => {
          const x = (i * 53) % 420;
          const y = (i * 97) % 600;
          return <path key={i} d={`M${x} ${y} l -8 26`} />;
        })}
      </g>
    </svg>
  );
}

// Mesas at sundown, a windmill and a hat hung on a fence post.
export function FrontierArt({ className }: ArtProps) {
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="fr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b1d14" />
          <stop offset="0.45" stopColor="#b5512a" />
          <stop offset="0.75" stopColor="#e7a456" />
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#fr-sky)" />
      <circle cx="200" cy="330" r="70" fill="#f6d189" />
      <path d="M0 360 h60 l14 -60 h70 l12 60 h40 v-30 l10 -20 h60 l10 50 h124 V600 H0 Z" fill="#6b2a16" />
      <path d="M0 410 C 120 390 260 420 400 400 V 600 H 0 Z" fill="#3d1a0f" />
      {/* windmill */}
      <g stroke="#1c0d07" strokeWidth="3" fill="none">
        <path d="M320 470 L 334 340 L 348 470 M 324 430 h20 M 328 390 h12" />
        <g transform="translate(334 336)" className="art-windmill">
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M0 0 L 0 -30" transform={`rotate(${i * 45})`} strokeWidth="4" />
          ))}
        </g>
        <path d="M334 336 l 24 6" strokeWidth="4" />
      </g>
      {/* fence and hat */}
      <g fill="#1c0d07">
        <rect x="70" y="440" width="7" height="70" />
        <rect x="150" y="448" width="7" height="62" />
        <path d="M60 462 L 170 470 L 170 474 L 60 466 Z" />
        <path d="M54 444 q 20 -8 42 0 q -4 -4 -8 -4 q -2 -16 -14 -16 q -12 0 -14 16 q -4 0 -6 4 Z" />
      </g>
      {/* saguaro */}
      <path
        d="M250 520 v-80 q0 -10 9 -10 q9 0 9 10 v80 Z M250 470 h-14 q-6 0 -6 -6 v-18 q0 -6 6 -6 q6 0 6 6 v12 h8 Z M268 460 h12 v-16 q0 -6 6 -6 q6 0 6 6 v20 q0 6 -6 6 h-18 Z"
        fill="#1c0d07"
      />
      <rect y="520" width="400" height="80" fill="#1c0d07" />
      {/* dust */}
      <g fill="#f6d189" opacity="0.5">
        {Array.from({ length: 18 }, (_, i) => (
          <circle key={i} cx={(i * 71) % 400} cy={380 + ((i * 37) % 140)} r={1 + (i % 3)} />
        ))}
      </g>
    </svg>
  );
}

// Megablocks, neon and a hex grid over everything.
export function NightCityArt({ className }: ArtProps) {
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="nc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05060a" />
          <stop offset="1" stopColor="#1a0f24" />
        </linearGradient>
        <pattern id="nc-hex" width="28" height="48.5" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
          <path d="M14 0 L28 8 V24 L14 32 L0 24 V8 Z M14 32 V48.5" fill="none" stroke="#e9a23b" strokeWidth="0.6" opacity="0.35" />
        </pattern>
        <linearGradient id="nc-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#00f0ff" stopOpacity="0" />
          <stop offset="1" stopColor="#00f0ff" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#nc-sky)" />
      <rect width="400" height="600" fill="url(#nc-hex)" />
      <rect y="300" width="400" height="200" fill="url(#nc-glow)" />
      {/* towers */}
      <g fill="#07080d" stroke="#00f0ff" strokeOpacity="0.25">
        <path d="M20 600 V 260 h50 v-40 h20 V 600 Z" />
        <path d="M110 600 V 140 l 30 -30 l 30 30 V 600 Z" />
        <path d="M190 600 V 300 h70 V 600 Z" />
        <path d="M270 600 V 190 h60 v 40 h30 V 600 Z" />
      </g>
      {/* windows */}
      {Array.from({ length: 60 }, (_, i) => {
        const cols = [30, 50, 120, 135, 150, 200, 220, 240, 280, 300, 320, 340];
        const x = cols[i % cols.length];
        const y = 160 + ((i * 41) % 400);
        const color = i % 5 === 0 ? "#ff003c" : i % 3 === 0 ? "#00f0ff" : "#fcee0a";
        return <rect key={i} x={x} y={y} width="6" height="3" fill={color} opacity={0.4 + (i % 4) * 0.15} />;
      })}
      {/* neon signs */}
      <rect x="196" y="320" width="56" height="14" fill="none" stroke="#fcee0a" strokeWidth="2" className="art-flicker" />
      <rect x="116" y="200" width="8" height="70" fill="#ff003c" opacity="0.9" />
      <path d="M0 520 H400" stroke="#ff003c" strokeWidth="2" opacity="0.8" />
      {/* av flying past */}
      <g className="art-av">
        <path d="M-40 120 h30 l8 -6 h10 l6 6 h6 v4 h-60 Z" fill="#11131a" />
        <rect x="-36" y="124" width="10" height="2" fill="#fcee0a" />
      </g>
      {/* scanlines */}
      <rect width="400" height="600" fill="url(#nc-scan)" opacity="0.4" />
      <defs>
        <pattern id="nc-scan" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="1" fill="#000" />
        </pattern>
      </defs>
    </svg>
  );
}

// Mount Yōtei under a crimson sun, susuki grass in the foreground.
export function YoteiArt({ className }: ArtProps) {
  return (
    <svg {...svgProps} className={className}>
      <defs>
        <linearGradient id="yo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4ddd3" />
          <stop offset="0.7" stopColor="#edf0f2" />
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#yo-sky)" />
      <circle cx="260" cy="200" r="64" fill="#c8283a" />
      <path d="M-20 420 C 60 380 140 270 186 222 L 230 222 C 280 270 360 380 420 420 Z" fill="#5d6e80" />
      <path d="M150 262 C 165 245 178 230 188 222 L 228 222 C 238 230 250 244 264 262 L 250 276 L 238 262 L 226 288 L 212 266 L 200 292 L 188 266 L 176 284 L 164 268 Z" fill="#fff" />
      <rect x="120" y="300" width="180" height="10" rx="5" fill="#fff" opacity="0.85" />
      <path d="M-20 440 C 120 410 260 450 420 430 V 600 H -20 Z" fill="#8c9bab" />
      <path d="M-20 490 C 120 470 260 500 420 480 V 600 H -20 Z" fill="#3b4752" />
      <g fill="#c7a46a">
        {Array.from({ length: 30 }, (_, i) => {
          const x = i * 14 - 4;
          const h = 50 + ((i * 37) % 60);
          return <path key={i} d={`M${x} 600 q -4 ${-h / 2} -14 ${-h} q 8 ${h / 2} 18 ${h} Z`} />;
        })}
      </g>
    </svg>
  );
}

export const worldArt = {
  noir: NoirArt,
  frontier: FrontierArt,
  "night-city": NightCityArt,
  yotei: YoteiArt,
};

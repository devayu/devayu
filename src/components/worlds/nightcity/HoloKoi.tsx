// The holographic koi swimming over the street, drawn above the 3D city.
export default function HoloKoi({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      <defs>
        <linearGradient id="hk-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#00f0ff" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="#ff8a3d" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ff2bd6" stopOpacity="0.5" />
        </linearGradient>
        <filter id="hk-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g opacity="0.8" filter="url(#hk-glow)">
        <g className="koi">
          <path d="M0 0 C 45 -38 135 -38 195 -6 L 255 -38 L 240 0 L 255 38 L 195 6 C 135 38 45 38 0 0 Z" fill="url(#hk-body)" />
          <path d="M60 -24 C 90 -54 120 -48 129 -27 M66 24 C 90 51 114 45 123 27" stroke="#00f0ff" strokeWidth="2.5" fill="none" opacity="0.7" />
          <circle cx="33" cy="-6" r="4" fill="#fff" />
          <animateMotion dur="30s" repeatCount="indefinite" rotate="auto" path="M -400 210 C 300 90 700 330 1100 150 S 1700 240 2000 110" />
        </g>
      </g>
    </svg>
  );
}

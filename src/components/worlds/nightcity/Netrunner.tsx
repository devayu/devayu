// The netrunner: seen from behind on a rooftop ledge, looking down the
// canyon. Rim-lit magenta by the city, cables glowing at the neck port,
// optics burning yellow at the edge of the face.

const body = [
  // torso and jacket
  "M120 700 C 118 560 130 420 150 330 C 162 280 190 258 214 250 L 252 248 C 290 256 330 280 346 330 C 366 400 372 560 370 700 Z",
  // near arm, hanging
  "M150 330 C 128 380 116 450 114 540 C 113 572 124 594 142 594 C 154 560 160 470 170 400 Z",
  // far arm
  "M346 330 C 366 380 378 450 380 530 C 381 560 372 578 358 580 C 350 540 344 470 336 410 Z",
  // neck
  "M214 222 L 252 222 L 254 254 L 212 254 Z",
  // head, face turned toward the city on the left, undercut spiking up
  "M200 124 L 204 98 L 216 108 L 226 86 L 238 102 L 252 90 L 258 106 C 276 116 284 142 278 166 C 274 186 266 200 256 210 L 250 230 L 214 232 L 212 214 C 200 206 192 196 190 184 L 182 176 C 180 168 184 160 190 156 C 190 142 194 132 200 124 Z",
];

export default function Netrunner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMax meet" aria-hidden className={className}>
      <defs>
        <filter id="nr-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* rim light: the same silhouette, offset and coloured, peeking out behind */}
      <g transform="translate(-5 0)" fill="#ff2bd6" opacity="0.9" filter="url(#nr-glow)">
        {body.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g transform="translate(3 -3)" fill="#00f0ff" opacity="0.55">
        {body.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* the figure */}
      <g fill="#050407">
        {body.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* high collar with a yellow-trimmed edge */}
      <path d="M194 262 C 198 236 214 230 232 232 C 252 232 268 240 274 262 C 250 274 218 276 194 262 Z" fill="#0c0a12" />
      <path d="M150 330 C 172 290 200 268 232 266 C 270 266 310 288 342 330" fill="none" stroke="#fcee0a" strokeWidth="3" opacity="0.9" />
      <path d="M232 268 V 700" stroke="#fcee0a" strokeWidth="1.5" opacity="0.35" />

      {/* neck port and cables */}
      <g fill="none" strokeLinecap="round" filter="url(#nr-glow)">
        <path d="M244 236 C 272 250 292 292 288 334" stroke="#00f0ff" strokeWidth="3" />
        <path d="M236 240 C 256 264 264 302 256 344" stroke="#ff2bd6" strokeWidth="2.5" />
        <circle cx="240" cy="236" r="4" fill="#00f0ff" stroke="none" />
      </g>

      {/* optics */}
      <g className="nr-optic" filter="url(#nr-glow)">
        <path d="M186 164 L 200 161" stroke="#fcee0a" strokeWidth="4" strokeLinecap="round" />
        <circle cx="187" cy="164" r="2" fill="#fff" />
      </g>

      {/* the ledge, with a hazard stripe */}
      <path d="M-20 650 L 420 622 L 420 720 L -20 720 Z" fill="#08070c" />
      <path d="M-20 650 L 420 622" stroke="#fcee0a" strokeWidth="3" strokeDasharray="22 14" opacity="0.8" />
    </svg>
  );
}

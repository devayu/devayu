// Printer's cuts for the Dada room: the manicule, Tzara's hat, a bowler, a
// pair of scissors, a gramophone, and the Rotorelief disc. All drawn here,
// none copied from an artwork.

type SvgProps = { className?: string; style?: React.CSSProperties };

/** The printer's pointing hand. Points right; rotate it to point elsewhere. */
export function Manicule({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 120 50" aria-hidden focusable="false">
      <path
        d="M3 19 H60 C65 19 67 14 63 11 L53 5 C49 2 52 -1 57 1 L85 14 C89 16 93 16 97 16 H112 C117 16 117 24 112 24 H99 C104 24 104 31 99 31 H95 C100 31 100 38 95 38 H89 C94 38 94 45 89 45 H58 C44 45 34 37 30 31 H3 Z"
        fill="var(--dd-hand-fill, #EDE6D3)"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M70 31 H95 M70 38 H89 M72 24 H99 M10 19 V31 M16 19 V31" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

/** A top hat for Tzara's cut-up poem: words go in, come out in any order. */
export function TzaraHat({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 48 40" aria-hidden focusable="false">
      <path d="M12 6 C12 3 36 3 36 6 L34 30 H14 Z" fill="currentColor" />
      <path d="M14 24 H34" stroke="var(--dd-red, #D22B1F)" strokeWidth="3.4" />
      <path d="M2 31 C10 28 38 28 46 31 C40 36 8 36 2 31 Z" fill="currentColor" />
    </svg>
  );
}

/** A bowler hat, as in Richter's Ghosts Before Breakfast. */
export function Bowler({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 80 44" aria-hidden focusable="false">
      <path d="M16 30 C14 12 24 3 40 3 C56 3 66 12 64 30 Z" fill="#1A1814" />
      <path d="M17 25 C30 28 50 28 63 25" stroke="#3a3630" strokeWidth="4" fill="none" />
      <path d="M2 32 C14 27 66 27 78 32 C72 39 8 39 2 32 Z" fill="#1A1814" />
      <path d="M30 9 C34 6 40 6 44 7" stroke="#4a4640" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function Scissors({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 40 28" aria-hidden focusable="false">
      <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="7" cy="21" r="5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M11 9.5 L38 21 M11 18.5 L38 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Gramophone({ className }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 56 48" aria-hidden focusable="false">
      <path d="M22 26 L44 4 C50 8 54 16 52 24 Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M22 26 L46 6 M22 26 L50 14 M22 26 L52 22" stroke="currentColor" strokeWidth="1" />
      <path d="M22 26 C18 30 16 34 18 37" stroke="currentColor" strokeWidth="2.2" fill="none" />
      <rect x="4" y="36" width="34" height="9" fill="currentColor" />
      <ellipse cx="18" cy="36" rx="14" ry="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M40 40 h6 v-4" stroke="currentColor" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

/**
 * A Rotorelief: eccentric rings on a disc that read as a spiral when it
 * spins at 33 rpm. `rim` is the pun printed round the edge.
 */
export function Rotorelief({ className, rim, id = "dd-rim" }: SvgProps & { rim?: string; id?: string }) {
  const rings = Array.from({ length: 11 }, (_, k) => k);
  return (
    <svg className={className} viewBox="-100 -100 200 200" aria-hidden focusable="false">
      <circle r="99" fill="#EDE6D3" stroke="#1A1814" strokeWidth="1.6" />
      {rings.map((k) => (
        <circle
          key={k}
          cx={k * 2.3}
          cy={k * -0.8}
          r={78 - k * 6.6}
          fill="none"
          stroke={k % 4 === 2 ? "#D22B1F" : "#1A1814"}
          strokeWidth={k % 2 ? 1.4 : 4.2}
        />
      ))}
      <circle cx="26" cy="-9" r="3.4" fill="#1A1814" />
      {rim && (
        <>
          <path id={id} d="M0 -89 A89 89 0 1 1 -0.01 -89" fill="none" />
          <text fontFamily="var(--font-archivo-black)" fontSize="9.6" letterSpacing="1.4" fill="#1A1814">
            <textPath href={`#${id}`}>{rim}</textPath>
          </text>
        </>
      )}
    </svg>
  );
}

/** Halftone screens and the ink grain, defined once per page and referenced by id. */
export function DadaDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        <pattern id="dd-ht" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
          <circle cx="3" cy="3" r="1.9" fill="#1A1814" />
        </pattern>
        <pattern id="dd-ht-coarse" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
          <circle cx="4.5" cy="4.5" r="3.3" fill="#1A1814" />
        </pattern>
        <pattern id="dd-ht-fine" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
          <circle cx="2.5" cy="2.5" r="1.1" fill="#1A1814" />
        </pattern>
        <pattern id="dd-ht-red" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(75)">
          <circle cx="3.5" cy="3.5" r="2.4" fill="#D22B1F" />
        </pattern>
        <pattern id="dd-ht-violet" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx="3" cy="3" r="1.7" fill="#3B4A8C" />
        </pattern>
      </defs>
    </svg>
  );
}

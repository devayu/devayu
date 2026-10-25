// The room's tiny Vorkurs kit: the three primitives as morphable outlines,
// the Light Prop disc, and the Kandinsky colour for each primitive.

export type Prim = "triangle" | "square" | "circle";

// Kandinsky's 1923 questionnaire: yellow triangle, red square, blue circle.
export const KANDINSKY: Record<Prim, string> = {
  triangle: "#F0B419",
  square: "#D0331F",
  circle: "#1E3C8C",
};

const N = 72; // 5° steps: lands exactly on the square's and triangle's corners
type P = [number, number];

// Distance along a ray from c in direction d to the first edge of a polygon.
const rayHit = (c: P, d: P, verts: P[]) => {
  let best = Infinity;
  for (let i = 0; i < verts.length; i++) {
    const a = verts[i];
    const b = verts[(i + 1) % verts.length];
    const ex = b[0] - a[0];
    const ey = b[1] - a[1];
    const den = d[0] * ey - d[1] * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((a[0] - c[0]) * ey - (a[1] - c[1]) * ex) / den;
    const u = ((a[0] - c[0]) * d[1] - (a[1] - c[1]) * d[0]) / den;
    if (t > 0 && u >= -1e-9 && u <= 1 + 1e-9) best = Math.min(best, t);
  }
  return best;
};

// Every primitive is sampled with the same number of points on the same
// angles, so clip-path can morph one into another.
const poly = (kind: Prim) => {
  const c: P = kind === "triangle" ? [0.5, 0.671] : [0.5, 0.5];
  const pts: string[] = [];
  for (let i = 0; i < N; i++) {
    const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
    const d: P = [Math.cos(a), Math.sin(a)];
    const r =
      kind === "circle"
        ? 0.5
        : kind === "square"
          ? rayHit(c, d, [[0.04, 0.04], [0.96, 0.04], [0.96, 0.96], [0.04, 0.96]])
          : rayHit(c, d, [[0.5, 0], [1, 0.96], [0, 0.96]]);
    pts.push(`${+((c[0] + d[0] * r) * 100).toFixed(2)}% ${+((c[1] + d[1] * r) * 100).toFixed(2)}%`);
  }
  return `polygon(${pts.join(",")})`;
};

/** CSS custom properties holding the three morphable outlines. */
export const shapeVars = {
  "--bh-triangle": poly("triangle"),
  "--bh-square": poly("square"),
  "--bh-circle": poly("circle"),
} as React.CSSProperties;

/** Moholy-Nagy's Light Prop, reduced to a perforated disc with one red vane. */
export function PropDisc({ className }: { className?: string }) {
  const holes = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return [32 + Math.cos(a) * 19, 32 + Math.sin(a) * 19, i % 2 ? 2.6 : 3.6] as const;
  });
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <circle cx="32" cy="32" r="29" fill="#D9D6CF" stroke="#161514" strokeWidth="2.5" />
      {holes.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#161514" />
      ))}
      <rect x="30.5" y="6" width="3" height="20" fill="#161514" />
      <rect x="36" y="36" width="12" height="12" fill="#D0331F" />
      <circle cx="32" cy="32" r="5" fill="#EDE7D9" stroke="#161514" strokeWidth="2.5" />
    </svg>
  );
}

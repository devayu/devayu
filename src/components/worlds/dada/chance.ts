import { seeded } from "@/lib/seeded";

// Tzara's hat, as a function: the same seed always draws the same slips, so
// the server and the browser agree until a visitor asks for a new draw.

export const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export const dice = (seed: number) => {
  const r = seeded(seed);
  return {
    next: r,
    range: (a: number, b: number) => a + r() * (b - a),
    int: (a: number, b: number) => Math.floor(a + r() * (b - a + 1)),
    pick: <T,>(arr: readonly T[]) => arr[Math.floor(r() * arr.length)],
    sign: () => (r() < 0.5 ? -1 : 1),
  };
};

/** The four printings every heading is cut from. `optical` evens out their very different x-heights. */
export const FACES = [
  { key: "holtwood", family: "var(--font-holtwood)", style: "normal", weight: 400, optical: 0.82 },
  { key: "bodoni", family: "var(--font-bodoni)", style: "italic", weight: 700, optical: 1.14 },
  { key: "archivo", family: "var(--font-archivo-black)", style: "normal", weight: 400, optical: 0.96 },
  { key: "elite", family: "var(--font-elite)", style: "normal", weight: 400, optical: 1.04 },
] as const;

export type Face = (typeof FACES)[number];

export const faceStyle = (f: Face, size = 1): React.CSSProperties => ({
  fontFamily: f.family,
  fontStyle: f.style,
  fontWeight: f.weight,
  fontSize: `${size * f.optical}em`,
});

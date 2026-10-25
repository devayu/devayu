// Robert Delaunay's simultaneous disc: concentric rings cut into segments,
// each segment set against its complementary neighbour. Pure geometry, so it
// renders anywhere (server or client).

const pt = (cx: number, cy: number, r: number, a: number) =>
  `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;

export function sector(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  if (r0 <= 0) {
    return `M${cx} ${cy} L${pt(cx, cy, r1, a0)} A${r1} ${r1} 0 ${large} 1 ${pt(cx, cy, r1, a1)} Z`;
  }
  return `M${pt(cx, cy, r1, a0)} A${r1} ${r1} 0 ${large} 1 ${pt(cx, cy, r1, a1)} L${pt(cx, cy, r0, a1)} A${r0} ${r0} 0 ${large} 0 ${pt(cx, cy, r0, a0)} Z`;
}

export type Ring = { r0: number; r1: number; colors: string[]; turn?: number; className?: string };

export function Disc({ cx, cy, rings, className }: { cx: number; cy: number; rings: Ring[]; className?: string }) {
  return (
    <g className={className}>
      {rings.map((ring, i) => {
        const n = ring.colors.length;
        const step = (Math.PI * 2) / n;
        const off = ((ring.turn ?? 0) * Math.PI) / 180 - Math.PI / 2;
        return (
          <g key={i} className={ring.className} style={{ transformOrigin: `${cx}px ${cy}px` }}>
            {ring.colors.map((c, j) => (
              <path key={j} d={sector(cx, cy, ring.r0, ring.r1, off + j * step, off + (j + 1) * step)} fill={c} />
            ))}
          </g>
        );
      })}
    </g>
  );
}

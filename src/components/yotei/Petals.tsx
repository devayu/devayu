// Drifting petals for Atsu, red maple leaves for Jin. Positions are fixed so the
// server and client render the same markup.
const petals = Array.from({ length: 16 }, (_, i) => ({
  left: 18 + ((i * 37) % 90),
  size: 6 + (i % 4) * 2,
  dur: 11 + ((i * 7) % 9),
  delay: -((i * 2.3) % 18),
  wob: 2 + (i % 3) * 0.7,
}));

export default function Petals() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p, i) => (
        <div
          key={i}
          className="petal absolute top-0"
          style={{
            left: `${p.left}%`,
            ["--dur" as string]: `${p.dur}s`,
            ["--wob" as string]: `${p.wob}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <span
            style={{
              width: p.size,
              height: p.size * 0.62,
              background: "var(--petal)",
              borderRadius: "70% 0 70% 0",
              opacity: 0.85,
            }}
          />
        </div>
      ))}
    </div>
  );
}

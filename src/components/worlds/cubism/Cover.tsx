"use client";

// Into the Cubism room, the way Duchamp's nude came down the stairs: five
// planes of ochre and umber stepping down a diagonal, one every 55ms, each a
// discrete frame (no tweening), until they cover the old page. Then they slide
// apart, each to a different side, and the room is behind them.

export const timing = { cover: 440, reveal: 680 };

const PLANES = [
  { c: "#8E8577", at: [-56, -56], out: [-70, -90], poly: "4% 2%, 98% 6%, 94% 97%, 2% 92%" },
  { c: "#B8894A", at: [-42, -42], out: [-104, 8], poly: "2% 6%, 96% 0, 100% 94%, 6% 100%" },
  { c: "#C9A15F", at: [-28, -28], out: [96, -60], poly: "6% 0, 100% 4%, 96% 100%, 0 96%" },
  { c: "#5C4128", at: [-14, -14], out: [-30, 110], poly: "0 4%, 94% 0, 100% 100%, 4% 96%" },
  { c: "#E8DCC4", at: [0, 0], out: [104, 40], poly: "24% 0, 100% 0, 100% 100%, 0 100%, 0 34%" },
];

export default function Cover({ phase }: { phase: "cover" | "reveal" }) {
  return (
    <div className={`cbc cbc-${phase}`} aria-hidden>
      <style>{`
        .cbc { position: fixed; inset: 0; overflow: hidden; pointer-events: auto; }
        .cbc-p {
          position: absolute; inset: -16%;
          background: var(--c);
          clip-path: polygon(var(--poly));
          transform: translate(var(--ax), var(--ay));
        }
        .cbc-p::before {
          content: ""; position: absolute; top: 0; bottom: 0; left: 18%; width: 3.5%;
          background: repeating-linear-gradient(35deg, rgba(42,38,34,.7) 0 1.4px, transparent 1.4px 6px);
        }
        .cbc-p::after {
          content: ""; position: absolute; top: 0; bottom: 0; left: 18%; width: 3px; background: #2A2622;
        }
        .cbc-cover .cbc-p {
          opacity: 0;
          animation: cbc-frame 1ms steps(1, end) forwards;
          animation-delay: calc(var(--i) * 55ms);
        }
        .cbc-reveal .cbc-p {
          animation: cbc-apart 520ms cubic-bezier(.2,.7,.2,1) forwards;
          animation-delay: calc((4 - var(--i)) * 34ms);
        }
        .cbc-word {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -50%) rotate(-4deg);
          font-family: var(--font-big-stencil), sans-serif; font-weight: 800;
          font-size: min(22vw, 30vh); letter-spacing: .04em; line-height: 1;
          color: #2A2622; white-space: nowrap;
          clip-path: inset(0 10% 0 0);
        }
        @keyframes cbc-frame { to { opacity: 1; } }
        @keyframes cbc-apart {
          0% { transform: translate(var(--ax), var(--ay)); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translate(var(--ox), var(--oy)); opacity: 0; }
        }
      `}</style>
      {PLANES.map((p, i) => (
        <div
          key={i}
          className="cbc-p"
          style={{
            ["--i" as string]: i,
            ["--c" as string]: p.c,
            ["--poly" as string]: p.poly,
            ["--ax" as string]: `${p.at[0]}vw`,
            ["--ay" as string]: `${p.at[1]}vh`,
            ["--ox" as string]: `${p.out[0]}vw`,
            ["--oy" as string]: `${p.out[1]}vh`,
          }}
        >
          {i === PLANES.length - 1 && <span className="cbc-word">CUBISM</span>}
        </div>
      ))}
    </div>
  );
}

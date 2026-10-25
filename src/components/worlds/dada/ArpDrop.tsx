"use client";

import { audio } from "@/lib/audio/manager";
import { useEffect, useMemo, useRef, useState } from "react";
import { dice } from "./chance";

// Arp's squares arranged according to the laws of chance: paper falls onto a
// near-grid, each square lands a little off axis (never more than 8°). They
// fall when the composition first scrolls into view; "shake" drops a new one.

const PAPERS = ["#8C7B5A", "#B9AC90", "#1A1814", "#B9AC90", "#5E7F5A", "#8C7B5A", "#E07A2E", "#B9AC90", "#1A1814"];

function layout(seed: number, cols: number, rows: number) {
  const d = dice(seed);
  const cell = 100 / cols;
  const squares = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (d.next() < 0.22) continue; // some cells stay empty paper
      const w = d.range(0.52, 0.86) * cell;
      const h = d.next() < 0.5 ? w : w * d.range(0.6, 1.25);
      squares.push({
        x: c * cell + d.range(0, cell - w),
        y: r * (100 / rows) + d.range(0, 100 / rows - Math.min(h, 100 / rows)),
        w,
        h,
        r: d.range(-8, 8),
        r0: d.range(-30, 30),
        dx: d.range(-40, 40),
        delay: Math.round(d.range(0, 260)),
        dur: Math.round(d.range(400, 600)),
        color: d.pick(PAPERS),
      });
    }
  }
  return squares;
}

export default function ArpDrop({ seed = 1916, cols = 3, rows = 3, className }: { seed?: number; cols?: number; rows?: number; className?: string }) {
  const [round, setRound] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const squares = useMemo(() => layout(seed + round * 131, cols, rows), [seed, round, cols, rows]);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset.drop = "armed";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.dataset.drop = "play";
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className={`dd-arp ${className ?? ""}`}>
      <div className="dd-arp-field" aria-hidden key={round}>
        {squares.map((s, i) => (
          <span
            key={i}
            className="dd-arp-sq"
            style={
              {
                left: `${s.x.toFixed(2)}%`,
                top: `${s.y.toFixed(2)}%`,
                width: `${s.w.toFixed(2)}%`,
                height: `${s.h.toFixed(2)}%`,
                background: s.color,
                "--r": `${s.r.toFixed(1)}deg`,
                "--r0": `${s.r0.toFixed(1)}deg`,
                "--dx": `${s.dx.toFixed(0)}px`,
                "--d": `${s.delay}ms`,
                "--dur": `${s.dur}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <figcaption className="dd-arp-cap">
        <span>Squares arranged according to the laws of chance.</span>
        <button
          type="button"
          className="dd-arp-shake"
          onClick={() => {
            if (ref.current) ref.current.dataset.drop = "play";
            setRound((r) => r + 1);
            audio.sfx("tear");
          }}
        >
          shake
        </button>
      </figcaption>
    </figure>
  );
}

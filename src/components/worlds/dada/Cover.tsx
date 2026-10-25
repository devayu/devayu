"use client";

import { audio } from "@/lib/audio/manager";
import { useEffect } from "react";
import { Rotorelief } from "./art";

// Into the Dada room: a Rotorelief. A paper card with a spiral disc spins up
// over the old page from a point (cover), then the card is torn in two down a
// ragged line and the halves are pulled apart in stepped, cut-paper frames
// (reveal). Self-contained: its CSS lives here.

export const timing = { cover: 620, reveal: 700 };

// One ragged tear shared by both halves, so they fit back together.
const TEAR = (() => {
  const pts: string[] = [];
  const xs = [51, 47.5, 53, 48, 52.5, 46.5, 51.5, 49, 54, 47, 50.5, 48.5, 52];
  xs.forEach((x, i) => pts.push(`${x}% ${((i / (xs.length - 1)) * 100).toFixed(1)}%`));
  return pts;
})();
const LEFT = `polygon(0 0, ${TEAR.join(", ")}, 0 100%)`;
const RIGHT = `polygon(100% 0, ${TEAR.join(", ")}, 100% 100%)`;

const css = `
.ddc { position: fixed; inset: 0; overflow: hidden; animation: ddc-in ${timing.cover}ms cubic-bezier(.55,0,.9,.4) both; }
.ddc-half { position: absolute; inset: 0; background:
  linear-gradient(90deg, transparent calc(50% - 0.5px), rgb(26 24 20 / .07) calc(50% - 0.5px) calc(50% + 0.5px), transparent calc(50% + 0.5px)),
  linear-gradient(0deg, transparent calc(50% - 0.5px), rgb(26 24 20 / .07) calc(50% - 0.5px) calc(50% + 0.5px), transparent calc(50% + 0.5px)),
  #E3D3A8; }
.ddc-l { clip-path: ${LEFT}; }
.ddc-r { clip-path: ${RIGHT}; }
.ddc-disc { position: absolute; left: 50%; top: 50%; width: min(86vmin, 820px); aspect-ratio: 1; margin: calc(min(86vmin, 820px) / -2) 0 0 calc(min(86vmin, 820px) / -2);
  animation: ddc-spin 1800ms linear infinite; filter: drop-shadow(5px 6px 0 rgb(26 24 20 / .16)); }
.ddc-word { position: absolute; left: 50%; bottom: 6vmin; transform: translateX(-50%) rotate(-4deg); font-family: var(--font-holtwood), serif; color: #D22B1F;
  font-size: clamp(1.4rem, 5vmin, 3rem); letter-spacing: .04em; mix-blend-mode: multiply; white-space: nowrap; }
.ddc[data-phase="reveal"] { animation: none; }
.ddc[data-phase="reveal"] .ddc-l { animation: ddc-tear-l ${timing.reveal}ms steps(7, end) both; }
.ddc[data-phase="reveal"] .ddc-r { animation: ddc-tear-r ${timing.reveal}ms steps(7, end) both; }
@keyframes ddc-in { from { clip-path: circle(0px at 50% 50%); } to { clip-path: circle(76vmax at 50% 50%); } }
@keyframes ddc-spin { to { transform: rotate(360deg); } }
@keyframes ddc-tear-l { 0% { transform: none; } 18% { transform: translate(-1.5vw, .6vh) rotate(-1deg); } 100% { transform: translate(-72vw, 8vh) rotate(-9deg); } }
@keyframes ddc-tear-r { 0% { transform: none; } 18% { transform: translate(1.5vw, -.4vh) rotate(1deg); } 100% { transform: translate(72vw, -6vh) rotate(7deg); } }
@media (prefers-reduced-motion: reduce) { .ddc-disc { animation: none; } }
`;

function Card({ rimId }: { rimId: string }) {
  return (
    <>
      <Rotorelief className="ddc-disc" rim="CUT ME UP AND PASTE ME BACK TOGETHER · RELIEF AT 33 RPM · " id={rimId} />
      <span className="ddc-word">DADA</span>
    </>
  );
}

export default function Cover({ phase }: { phase: "cover" | "reveal" }) {
  useEffect(() => {
    if (phase === "reveal") audio.sfx("tear");
  }, [phase]);

  return (
    <div className="ddc" data-phase={phase} aria-hidden>
      <style>{css}</style>
      <div className="ddc-half ddc-l">
        <Card rimId="ddc-rim-l" />
      </div>
      <div className="ddc-half ddc-r">
        <Card rimId="ddc-rim-r" />
      </div>
    </div>
  );
}

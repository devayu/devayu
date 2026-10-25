"use client";

import WorldLink from "@/components/gallery/WorldLink";
import { getWorld, worlds } from "@/data/worlds";
import { audio } from "@/lib/audio/manager";
import { useAudio } from "@/lib/audio/use-audio";
import { Disc, sector } from "./Disc";

// The way out, as cut planes along the top: each a stencil label with one
// hatched side; hover moves the light. The sound control is a small Delaunay
// disc: its rings counter-rotate while the music plays, and its outer ring
// fills one segment at a time as you go down the room.

const world = getWorld("cubism");
const others = worlds.filter((w) => w.slug !== "cubism");

const SHAPES = [
  "polygon(0 6%, 100% 0, 96% 100%, 3% 90%)",
  "polygon(4% 0, 100% 8%, 100% 94%, 0 100%)",
  "polygon(0 0, 97% 5%, 100% 100%, 5% 94%)",
  "polygon(2% 8%, 100% 0, 95% 92%, 0 100%)",
  "polygon(5% 0, 100% 4%, 97% 100%, 0 92%)",
];

const PROGRESS = ["#E07B39", "#6B4C9A", "#3E8E6B", "#7FB3D5", "#C8372D", "#2F4FA2", "#E5B42A", "#E07B39", "#6B4C9A", "#3E8E6B", "#7FB3D5", "#C8372D"];

export function NavPlanes() {
  return (
    <nav className="cb-nav" aria-label="Rooms">
      <ul className="cb-nav-list">
        <li>
          <WorldLink href="/" className="cb-np" style={{ ["--shape" as string]: SHAPES[0] }}>
            <span className="cb-np-face">
              <span aria-hidden>← </span>Gallery
            </span>
          </WorldLink>
        </li>
        {others.map((w, i) => (
          <li key={w.slug}>
            <WorldLink href={w.href} className="cb-np" style={{ ["--shape" as string]: SHAPES[i + 1] }}>
              <span className="cb-np-face">{w.name}</span>
            </WorldLink>
          </li>
        ))}
      </ul>
      <a href="#reach" className="cb-np cb-np-reach" style={{ ["--shape" as string]: SHAPES[4] }}>
        <span className="cb-np-face">
          Reach me <span aria-hidden>↓</span>
        </span>
      </a>
    </nav>
  );
}

export function SoundDisc() {
  const { enabled, playing } = useAudio();
  const on = enabled && playing === "cubism";
  return (
    <div className="cb-sound">
      <span className="cb-sound-label" aria-hidden>
        <span className="cb-sound-state">{enabled ? (on ? "playing" : "sound on") : "sound off"}</span>
        <span className="cb-sound-desc">{world.sound}</span>
      </span>
      <button
        type="button"
        data-sound-toggle
        className="cb-disc-btn"
        data-on={on || undefined}
        aria-pressed={enabled}
        aria-label={`Sound: ${world.sound}. ${enabled ? "On" : "Off"}`}
        onClick={() => audio.toggle()}
      >
        <svg viewBox="0 0 100 100" aria-hidden>
          <g className="cb-disc-progress">
            {PROGRESS.map((c, j) => {
              const a = (Math.PI * 2) / PROGRESS.length;
              return <path key={j} d={sector(50, 50, 41, 49, -Math.PI / 2 + j * a + 0.03, -Math.PI / 2 + (j + 1) * a - 0.03)} fill={c} style={{ ["--s" as string]: j }} />;
            })}
          </g>
          <Disc
            className="cb-disc-step"
            cx={50}
            cy={50}
            rings={[
              { r0: 26, r1: 39, colors: ["#C8372D", "#7FB3D5", "#E5B42A", "#6B4C9A", "#3E8E6B", "#E07B39"], className: "cb-ring-a" },
              { r0: 12, r1: 25, colors: ["#2F4FA2", "#E07B39", "#F3EEE2", "#C8372D"], turn: 20, className: "cb-ring-b" },
              { r0: 0, r1: 11, colors: ["#2A2622", "#E5B42A"], turn: 90, className: "cb-ring-c" },
            ]}
          />
          {!enabled && <path d="M22 78 L78 22" stroke="#2A2622" strokeWidth="6" strokeLinecap="square" />}
        </svg>
      </button>
    </div>
  );
}

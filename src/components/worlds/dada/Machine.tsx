"use client";

import { skills } from "@/data/personal";
import { useState } from "react";

// What I can do, as a Picabia machine portrait: a thin technical drawing on
// bare paper whose labelled parts are the tools I work with. Hover or focus a
// part in the parts list (or the drawing) and that part inks up red and runs.

type Part = { key: string; letter: string; part: string; caption: string; anchor: [number, number]; label: [number, number]; side?: "left" };

const RAW: Record<string, Omit<Part, "letter">> = {
  TypeScript: { key: "plug", part: "spark plug", caption: "Nothing fires without a type.", anchor: [470, 112], label: [528, 44] },
  React: { key: "gear", part: "gear", caption: "Turns whenever anything changes.", anchor: [166, 446], label: [70, 560] },
  "Next.js": { key: "crank", part: "crank", caption: "Turn the handle; pages come out.", anchor: [300, 214], label: [232, 112] },
  "Spring Boot": { key: "spring", part: "spring", caption: "Takes the load, springs back.", anchor: [566, 176], label: [490, 254] },
  "Node.js": { key: "valve", part: "valve", caption: "Lets events through, one at a time.", anchor: [560, 352], label: [500, 478] },
  "Tailwind CSS": { key: "fan", part: "fan", caption: "Supplies the wind.", anchor: [96, 118], label: [34, 40] },
  PostgreSQL: { key: "tank", part: "cylinder", caption: "Remembers everything. Unlike me.", anchor: [756, 214], label: [796, 238] },
  Docker: { key: "crate", part: "crate", caption: "Ships it exactly as it is. A readymade.", anchor: [760, 500], label: [796, 560] },
  AWS: { key: "chimney", part: "chimney", caption: "Where everything goes up, eventually.", anchor: [742, 74], label: [806, 112] },
};

// Callout letters run A, B, C… in the order the skills are listed.
const PARTS: Record<string, Part> = Object.fromEntries(
  skills.filter((k) => RAW[k]).map((k, i) => [k, { ...RAW[k], letter: String.fromCharCode(65 + i) }])
);

function gearPath(cx: number, cy: number, r: number, teeth: number, depth: number) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const q = step / 4;
    const p = (ang: number, rad: number) => `${(cx + Math.cos(ang) * rad).toFixed(1)} ${(cy + Math.sin(ang) * rad).toFixed(1)}`;
    pts.push(p(a - q * 1.4, r - depth), p(a - q * 0.8, r), p(a + q * 0.8, r), p(a + q * 1.4, r - depth));
  }
  return `M${pts.join(" L")} Z`;
}

function Drawing({ on, set }: { on: string | null; set: (k: string | null) => void }) {
  const g = (key: string, children: React.ReactNode) => (
    <g className="dd-part" data-part={key} data-on={on === key || undefined} onMouseEnter={() => set(key)} onMouseLeave={() => set(null)}>
      {children}
    </g>
  );
  return (
    <svg className="dd-machine-svg" viewBox="0 0 900 620" role="img" aria-labelledby="dd-machine-title">
      <title id="dd-machine-title">A machine drawn in thin lines; each part is labelled with one of my tools.</title>
      {/* belt from the fan to the gear: drawn first so the parts sit on it */}
      <path d="M106 150 L204 386 M134 146 L256 372" className="dd-ln dd-ln--thin" />
      {/* pipe from the plug to the crate, through the valve */}
      <path d="M482 330 H590 V470 H640" className="dd-pipe" />
      <path d="M482 330 H590 V470 H640" className="dd-pipe-in" />
      {/* the rod and chain that hold it together */}
      <path d="M700 316 V428" className="dd-ln dd-ln--chain" />

      {g(
        "fan",
        <g className="dd-spin">
          {[20, 110, 200, 290].map((a) => (
            <ellipse key={a} cx="120" cy="150" rx="34" ry="11" transform={`rotate(${a} 120 150) translate(36 0)`} className="dd-ln" />
          ))}
          <circle cx="120" cy="150" r="10" className="dd-ln dd-fill" />
        </g>
      )}
      <path d="M120 160 V262 M98 262 H142" className="dd-ln" />

      {g(
        "gear",
        <g className="dd-spin dd-spin--slow">
          <path d={gearPath(230, 380, 96, 16, 14)} className="dd-ln dd-fill" />
          <circle cx="230" cy="380" r="62" className="dd-ln dd-ln--thin" />
          <circle cx="230" cy="380" r="26" className="dd-ln" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path key={a} d="M256 380 H292" transform={`rotate(${a} 230 380)`} className="dd-ln" />
          ))}
          <circle cx="230" cy="380" r="7" className="dd-ink" />
        </g>
      )}

      {g(
        "crank",
        <g>
          <g className="dd-spin dd-spin--rev">
            <path d={gearPath(330, 310, 40, 9, 11)} className="dd-ln dd-fill" />
            <circle cx="330" cy="310" r="8" className="dd-ln" />
          </g>
          <path d="M330 310 L300 214" className="dd-ln dd-ln--thick" />
          <circle cx="300" cy="214" r="10" className="dd-ln dd-fill" />
        </g>
      )}

      {g(
        "plug",
        <g>
          <rect x="444" y="46" width="12" height="14" className="dd-ln dd-fill" />
          <rect x="436" y="60" width="28" height="22" className="dd-ln dd-fill" />
          <path d="M432 82 H468 L478 230 H422 Z" className="dd-ln dd-fill" />
          <path d="M434 104 H466 M435 126 H467 M436 148 H469 M437 170 H471" className="dd-ln dd-ln--thin" />
          <path d="M408 230 H492 L500 252 L492 274 H408 L400 252 Z" className="dd-ln dd-fill" />
          <path d="M430 230 V274 M470 230 V274" className="dd-ln dd-ln--thin" />
          <rect x="418" y="274" width="64" height="110" className="dd-ln dd-fill" />
          {Array.from({ length: 10 }, (_, k) => (
            <path key={k} d={`M418 ${286 + k * 10} L482 ${280 + k * 10}`} className="dd-ln dd-ln--thin" />
          ))}
          <rect x="440" y="384" width="20" height="26" className="dd-ln dd-fill" />
          <path d="M450 410 V432 H478 V418" className="dd-ln dd-ln--thick" />
          <path className="dd-spark" d="M484 420 l14 -8 l-4 10 l14 -6" />
        </g>
      )}

      {g(
        "spring",
        <path
          className="dd-ln dd-coil"
          d={`M478 160 H498 ${Array.from({ length: 12 }, (_, k) => `L${504 + k * 11} ${k % 2 ? 176 : 144}`).join(" ")} L640 160 H644`}
        />
      )}

      {g(
        "tank",
        <g>
          <path d="M644 122 V300 A56 14 0 0 0 756 300 V122" className="dd-ln dd-fill" />
          <ellipse cx="700" cy="122" rx="56" ry="14" className="dd-ln dd-fill" />
          <path d="M644 172 A56 14 0 0 0 756 172 M644 252 A56 14 0 0 0 756 252" className="dd-ln dd-ln--thin" />
          <circle cx="700" cy="212" r="17" className="dd-ln dd-fill" />
          <path className="dd-needle" d="M700 212 L710 200" />
        </g>
      )}

      {g(
        "chimney",
        <g>
          <rect x="714" y="52" width="28" height="62" className="dd-ln dd-fill" />
          <path d="M710 52 H746" className="dd-ln dd-ln--thick" />
          <g className="dd-smoke">
            <circle cx="744" cy="34" r="9" className="dd-ln dd-ln--thin" />
            <circle cx="762" cy="20" r="12" className="dd-ln dd-ln--thin" />
            <circle cx="788" cy="12" r="8" className="dd-ln dd-ln--thin" />
          </g>
        </g>
      )}

      {g(
        "crate",
        <g className="dd-swing">
          <path d="M700 428 L670 440 M700 428 L730 440" className="dd-ln" />
          <rect x="640" y="440" width="120" height="84" className="dd-ln dd-fill" />
          <path d="M640 468 H760 M640 496 H760 M646 520 L754 444" className="dd-ln dd-ln--thin" />
        </g>
      )}

      {g(
        "valve",
        <g>
          <path d="M560 330 V352" className="dd-ln dd-ln--thick" />
          <g className="dd-spin">
            <circle cx="560" cy="352" r="22" className="dd-ln dd-fill" />
            <path d="M538 352 H582 M560 330 V374" className="dd-ln" />
            <circle cx="560" cy="352" r="4" className="dd-ink" />
          </g>
        </g>
      )}

      {/* leaders and callouts */}
      {Object.entries(PARTS).map(([skill, p]) => (
        <g key={p.key} className="dd-callout" data-on={on === p.key || undefined} aria-hidden>
          <path d={`M${p.anchor[0]} ${p.anchor[1]} L${p.label[0]} ${p.label[1]}`} className="dd-leader" />
          <circle cx={p.anchor[0]} cy={p.anchor[1]} r="3" className="dd-ink" />
          <circle cx={p.label[0]} cy={p.label[1]} r="13" className="dd-ln dd-fill" />
          <text x={p.label[0]} y={p.label[1] + 5} textAnchor="middle" className="dd-callout-letter">
            {p.letter}
          </text>
          <text x={p.label[0] + 20} y={p.label[1] - 2} className="dd-callout-part">
            {p.part}
          </text>
          <text x={p.label[0] + 20} y={p.label[1] + 16} className="dd-callout-skill">
            {skill}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Machine() {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const on = hover ?? pinned;
  return (
    <div className="dd-machine">
      <figure className="dd-machine-fig">
        <Drawing on={on} set={setHover} />
        <figcaption className="dd-machine-title">Portrait of a full stack developer in a state of production</figcaption>
      </figure>
      <ul className="dd-parts" aria-label="Parts list">
        {skills.map((skill) => {
          const p = PARTS[skill];
          if (!p) {
            return (
              <li key={skill} className="dd-partline">
                <span className="dd-partline-skill">{skill}</span>
              </li>
            );
          }
          return (
            <li key={skill}>
              <button
                type="button"
                className="dd-partline"
                aria-pressed={pinned === p.key}
                data-on={on === p.key || undefined}
                onMouseEnter={() => setHover(p.key)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(p.key)}
                onBlur={() => setHover(null)}
                onClick={() => setPinned((k) => (k === p.key ? null : p.key))}
              >
                <span className="dd-partline-letter" aria-hidden>
                  {p.letter}
                </span>
                <span className="dd-partline-part">{p.part}:</span> <span className="dd-partline-skill">{skill}</span>
                <span className="dd-partline-cap">{p.caption}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

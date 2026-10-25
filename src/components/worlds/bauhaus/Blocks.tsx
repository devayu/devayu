"use client";

import Highlight from "@/components/Highlight";
import { skills } from "@/data/personal";
import { projects } from "@/data/projects";
import { workExperience } from "@/data/work";
import { audio } from "@/lib/audio/manager";
import { useRef, useState } from "react";
import { KANDINSKY, type Prim } from "./kit";
import Reveal from "./Reveal";

// What I can do, as Alma Siedhoff-Buscher's building kit: every skill is a
// painted wooden piece, stacked into one construction. The pieces drop in
// when you arrive; tap one and it hops and lands again, and the card says
// where I actually used it (read from the work and project data, nothing
// added).

type Shape = "stick" | "cube" | "arch" | "cylinder" | "triangle";
type Box = [number, number, number, number]; // x, y (from the floor), w, h in kit units

const PIECES: Record<string, { shape: Shape; tone: string; d: Box; m: Box }> = {
  "Spring Boot": { shape: "stick", tone: "#D0331F", d: [0, 0, 6.5, 1], m: [0, 0, 4.6, 1] },
  PostgreSQL: { shape: "stick", tone: "#1E3C8C", d: [6.5, 0, 5.5, 1], m: [4.6, 0, 3.4, 1] },
  "Next.js": { shape: "arch", tone: "#F0B419", d: [0.5, 1, 4, 2], m: [0, 1, 4, 2] },
  "Node.js": { shape: "arch", tone: "#2E7D4F", d: [7, 1, 4, 2], m: [4, 1, 4, 2] },
  React: { shape: "cube", tone: "#D0331F", d: [4.75, 1, 2, 2], m: [0.2, 3.9, 2, 2] },
  "Tailwind CSS": { shape: "stick", tone: "#F4EFE4", d: [0.5, 3, 10.5, 0.9], m: [0, 3, 8, 0.9] },
  TypeScript: { shape: "cylinder", tone: "#1E3C8C", d: [2, 3.9, 1.6, 2.2], m: [2.6, 3.9, 1.6, 2.2] },
  Docker: { shape: "cube", tone: "#F0B419", d: [5, 3.9, 1.8, 1.8], m: [0.3, 5.9, 1.8, 1.8] },
  AWS: { shape: "triangle", tone: "#D0331F", d: [8, 3.9, 2.6, 2], m: [4.6, 3.9, 2.6, 2] },
};
const FALLBACK: { shape: Shape; tone: string; d: Box; m: Box } = {
  shape: "cube",
  tone: "#F4EFE4",
  d: [11, 1, 1, 1],
  m: [7, 1, 1, 1],
};

const PRIM: Record<Shape, Prim> = { stick: "square", cube: "square", arch: "circle", cylinder: "circle", triangle: "triangle" };
const DARK = new Set(["#D0331F", "#1E3C8C", "#2E7D4F"]);

type Use = { where: string; what: string; work: boolean };
const usesOf = (skill: string): Use[] => {
  const s = skill.toLowerCase();
  const word = new RegExp(`(^|[^a-z])${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`, "i");
  const fromWork = workExperience.flatMap((w) =>
    w.description.filter((d) => word.test(d)).map((d) => ({ where: w.location, what: d, work: true }))
  );
  const fromProjects = projects
    .filter((p) => p.techStack.some((t) => t.toLowerCase() === s))
    .map((p) => ({ where: `${p.title}${p.year ? `, ${p.year}` : ""}`, what: p.description, work: false }));
  return [...fromWork, ...fromProjects];
};

// Pieces stack from the floor up, so they drop in that order.
const ordered = skills
  .map((name) => ({ name, ...(PIECES[name] ?? FALLBACK) }))
  .sort((a, b) => a.d[1] - b.d[1] || a.d[0] - b.d[0]);

function PieceArt({ shape, tone }: { shape: Shape; tone: string }) {
  const common = { fill: tone, stroke: "#161514", strokeWidth: 2.5, vectorEffect: "non-scaling-stroke" as const };
  if (shape === "arch")
    return (
      <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="bh-piece-art" aria-hidden>
        <path d="M0 0 H400 V200 H300 A100 100 0 0 0 100 200 H0 Z" {...common} />
      </svg>
    );
  if (shape === "cylinder")
    return (
      <svg viewBox="0 0 160 220" preserveAspectRatio="none" className="bh-piece-art" aria-hidden>
        <path d="M0 22 A80 22 0 0 1 160 22 V198 A80 22 0 0 1 0 198 Z" {...common} />
        <path d="M0 22 A80 22 0 0 0 160 22" fill="none" stroke="#161514" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  if (shape === "triangle")
    return (
      <svg viewBox="0 0 260 200" preserveAspectRatio="none" className="bh-piece-art" aria-hidden>
        <path d="M130 0 L260 200 L0 200 Z" {...common} />
      </svg>
    );
  return null;
}

export default function Blocks() {
  const [sel, setSel] = useState("React");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const piece = PIECES[sel] ?? FALLBACK;
  const uses = usesOf(sel);
  const prim = PRIM[piece.shape];

  const pick = (name: string) => {
    setSel(name);
    const el = refs.current[name];
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Lift, then a fast fall with a 2px settle: weight, no bounce.
    el.animate(
      [
        { transform: "translateY(0)", easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" },
        { transform: "translateY(-16px)", offset: 0.4, easing: "cubic-bezier(0.6, 0, 1, 0.6)" },
        { transform: "translateY(2px)", offset: 0.88, easing: "linear" },
        { transform: "translateY(0)" },
      ],
      { duration: 330 }
    );
    window.setTimeout(() => audio.sfx("click"), 280);
  };

  return (
    <Reveal className="bh-skills" aria-labelledby="bh-skills-h" id="skills">
      <h2 id="bh-skills-h" className="bh-h2">
        what i can do
      </h2>
      <p className="bh-lede">
        {skills.length} pieces in my kit. tap one and i&rsquo;ll tell you where i&rsquo;ve actually used it.
      </p>

      <div className="bh-skills-grid">
        <div className="bh-kit-frame">
          <div className="bh-kit">
            {ordered.map((p, i) => (
              <button
                key={p.name}
                ref={(el) => {
                  refs.current[p.name] = el;
                }}
                type="button"
                className={`bh-piece bh-piece-${p.shape}`}
                aria-pressed={sel === p.name}
                data-dark={DARK.has(p.tone) || undefined}
                onClick={() => pick(p.name)}
                style={
                  {
                    "--x": p.d[0],
                    "--y": p.d[1],
                    "--w": p.d[2],
                    "--h": p.d[3],
                    "--mx": p.m[0],
                    "--my": p.m[1],
                    "--mw": p.m[2],
                    "--mh": p.m[3],
                    "--tone": p.tone,
                    "--o": i,
                  } as React.CSSProperties
                }
              >
                <PieceArt shape={p.shape} tone={p.tone} />
                <span className="bh-piece-label">{p.name}</span>
              </button>
            ))}
            <span className="bh-kit-floor" aria-hidden />
          </div>
        </div>

        <div className="bh-card" aria-live="polite">
          <span
            className="bh-mk bh-card-mk"
            aria-hidden
            style={{ "--own": `var(--bh-${prim})`, "--tone": KANDINSKY[prim] } as React.CSSProperties}
          />
          <p className="bh-card-name">{sel}</p>
          {uses.length ? (
            <ul className="bh-card-uses">
              {uses.map((u) => (
                <li key={u.where + u.what}>
                  <span className="bh-card-where">{u.work ? `at ${u.where}` : u.where}</span>
                  <span className="bh-card-what">
                    <Highlight text={u.what} className="bh-hl" />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="bh-card-none">
              it&rsquo;s in my kit, but none of the work on this page names it, so i won&rsquo;t pin a project on it.
            </p>
          )}
        </div>
      </div>
    </Reveal>
  );
}

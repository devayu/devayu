import { projects } from "@/data/projects";
import { Disc, type Ring } from "./Disc";
import Stencil from "./Stencil";

// Things I've made, as Sonia Delaunay's 1913 "simultaneous book": one long
// accordion strip, colour stencilled on the left, the words on the right, one
// fold per project. Each fold opens as you reach it. This is where the room
// has earned its colour: oranges against violets, emerald against red.

type Field = { bg: string; blocks: { d: string; fill: string }[]; disc: { cx: number; cy: number; rings: Ring[] }; word: string };

const FIELDS: Record<string, Field> = {
  beacon: {
    bg: "#2F4FA2",
    blocks: [
      { d: "M0 300 L400 220 L400 480 L0 480 Z", fill: "#E07B39" },
      { d: "M0 0 L170 0 L120 480 L0 480 Z", fill: "#6B4C9A" },
    ],
    disc: {
      cx: 270, cy: 170,
      rings: [
        { r0: 96, r1: 140, colors: ["#E5B42A", "#6B4C9A", "#E07B39", "#7FB3D5"] },
        { r0: 52, r1: 96, colors: ["#7FB3D5", "#C8372D", "#E5B42A", "#3E8E6B"], turn: 45 },
        { r0: 0, r1: 52, colors: ["#F3EEE2", "#E07B39"], turn: 90 },
      ],
    },
    word: "BEAC",
  },
  logbase: {
    bg: "#3E8E6B",
    blocks: [
      { d: "M220 0 L400 0 L400 480 L260 480 Z", fill: "#7FB3D5" },
      { d: "M0 360 L400 300 L400 380 L0 440 Z", fill: "#E5B42A" },
    ],
    disc: {
      cx: 120, cy: 300,
      rings: [
        { r0: 90, r1: 130, colors: ["#C8372D", "#7FB3D5", "#E5B42A", "#6B4C9A", "#E07B39", "#2F4FA2"] },
        { r0: 44, r1: 90, colors: ["#E07B39", "#2F4FA2", "#C8372D", "#E5B42A"], turn: 30 },
        { r0: 0, r1: 44, colors: ["#F3EEE2", "#C8372D"] },
      ],
    },
    word: "LOGB",
  },
  "a1-landing": {
    bg: "#6B4C9A",
    blocks: [
      { d: "M0 0 L400 0 L400 140 L0 210 Z", fill: "#E5B42A" },
      { d: "M260 210 L400 190 L400 480 L300 480 Z", fill: "#C8372D" },
    ],
    disc: {
      cx: 170, cy: 340,
      rings: [
        { r0: 80, r1: 126, colors: ["#3E8E6B", "#E07B39", "#7FB3D5", "#E5B42A"], turn: 20 },
        { r0: 40, r1: 80, colors: ["#E5B42A", "#C8372D", "#3E8E6B", "#F3EEE2"], turn: 65 },
        { r0: 0, r1: 40, colors: ["#2F4FA2", "#E07B39"] },
      ],
    },
    word: "A1",
  },
  kickstore: {
    bg: "#C8372D",
    blocks: [
      { d: "M0 250 L400 330 L400 480 L0 480 Z", fill: "#2F4FA2" },
      { d: "M300 0 L400 0 L400 330 L340 318 Z", fill: "#E5B42A" },
    ],
    disc: {
      cx: 150, cy: 160,
      rings: [
        { r0: 88, r1: 132, colors: ["#2F4FA2", "#E5B42A", "#3E8E6B", "#7FB3D5", "#E07B39"] },
        { r0: 44, r1: 88, colors: ["#7FB3D5", "#E07B39", "#E5B42A"], turn: 40 },
        { r0: 0, r1: 44, colors: ["#F3EEE2", "#2F4FA2"], turn: 90 },
      ],
    },
    word: "KICK",
  },
};

const STATUS: Record<string, string> = {
  "in-progress": "still building",
  completed: "shipped",
  planned: "planned",
};

const beat = (i: number) => Math.floor(i / 3) * 4 + [0, 1, 3][i % 3];

export default function Projects() {
  return (
    <section className="cb-projects" aria-labelledby="cb-projects-h">
      <header className="cb-sec-head">
        <Stencil text="Things I've made" id="cb-projects-h" className="cb-h2" />
        <p className="cb-lede">
          Four things I built, folded into one strip. Open it fold by fold; the first one is the one I&rsquo;m still
          building.
        </p>
      </header>

      <ol className="cb-strip">
        {projects.map((p, i) => {
          const f = FIELDS[p.id] ?? FIELDS.beacon;
          return (
            <li key={p.id} className="cb-fold" data-reveal data-sfx style={{ ["--n" as string]: i }}>
              <div className="cb-field" aria-hidden>
                <svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMid slice">
                  <rect width="400" height="480" fill={f.bg} />
                  {f.blocks.map((b, j) => (
                    <path key={j} d={b.d} fill={b.fill} />
                  ))}
                  <g className="cb-field-disc" style={{ transformOrigin: `${f.disc.cx}px ${f.disc.cy}px` }}>
                    <Disc cx={f.disc.cx} cy={f.disc.cy} rings={f.disc.rings} />
                  </g>
                  <text x="-6" y="468" fontFamily="var(--font-big-stencil)" fontWeight="800" fontSize="150" letterSpacing="6" fill="#F3EEE2" opacity="0.92">
                    {f.word}
                  </text>
                </svg>
              </div>
              <article className="cb-fold-text" data-refract>
                <p className="cb-fold-meta">
                  <span>{p.year}</span>
                  <span className={p.status === "in-progress" ? "cb-status cb-status-live" : "cb-status"}>
                    {STATUS[p.status ?? "completed"]}
                  </span>
                </p>
                <h3 className="cb-fold-title">{p.title}</h3>
                <p className="cb-fold-desc">{p.description}</p>
                <ul className="cb-stack cb-rhythm" aria-label="Built with" data-reveal>
                  {p.techStack.map((t, j) => (
                    <li key={t} style={{ ["--b" as string]: beat(j) }}>
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="cb-fold-links">
                  {p.liveLink && (
                    <a className="cb-facet" href={p.liveLink} target="_blank" rel="noreferrer">
                      <span className="cb-facet-face">
                        Visit <span className="cb-sr">{p.title}</span>
                        <span aria-hidden> ↗</span>
                      </span>
                    </a>
                  )}
                  {p.githubLink && (
                    <a className="cb-facet cb-facet-quiet" href={p.githubLink} target="_blank" rel="noreferrer">
                      <span className="cb-facet-face">
                        Code <span className="cb-sr">for {p.title} on GitHub</span>
                        <span aria-hidden> ↗</span>
                      </span>
                    </a>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

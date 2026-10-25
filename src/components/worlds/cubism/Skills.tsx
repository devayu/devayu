import Stencil from "./Stencil";

// What I can do, as a still-life table: the tabletop seen from above, the
// things on it seen from the side, which is exactly the lie Cézanne taught the
// Cubists. Each object carries one group of tools; its label is a scrap of
// sheet music pinned under it. Point at a label (or tab to it, or tap it) and
// that object's planes refract, shifting a few pixels apart.

const GROUPS = [
  {
    id: "front",
    label: "Frontend",
    object: "the guitar",
    note: "what you see and play with",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "back",
    label: "Backend",
    object: "the bottle",
    note: "what holds it up",
    items: ["Spring Boot", "Node.js", "PostgreSQL"],
  },
  {
    id: "infra",
    label: "Infrastructure",
    object: "the pipe",
    note: "what it runs through",
    items: ["Docker", "AWS"],
  },
];

const op = (dx: number, dy: number) => ({ ["--dx" as string]: `${dx}px`, ["--dy" as string]: `${dy}px` });
const beat = (i: number) => Math.floor(i / 3) * 4 + [0, 1, 3][i % 3]; // on, on, (rest), on

export default function Skills() {
  return (
    <section className="cb-skills" aria-labelledby="cb-skills-h">
      <header className="cb-sec-head">
        <Stencil text="What I can do" id="cb-skills-h" className="cb-h2" />
        <p className="cb-lede">
          My tools, set out on the table. Up front, the part you see; behind it, the part that holds it up; and the
          pipe it all runs through.
        </p>
      </header>

      <div className="cb-table">
        <svg className="cb-still" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet" aria-hidden>
          {/* the tabletop, from above */}
          <polygon points="50,330 950,296 992,606 14,620" fill="#B8894A" />
          <polygon points="50,330 950,296 992,606 14,620" fill="url(#cb-grain)" opacity="0.55" />
          <polygon points="60,340 520,322 552,612 30,620" fill="url(#cb-checks)" opacity="0.9" />
          <line x1="50" y1="330" x2="950" y2="296" stroke="#2A2622" strokeWidth="3" />
          <polygon points="620,470 900,452 918,590 640,604" fill="#EDE6D3" opacity="0.95" />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1="650" y1={490 + i * 20} x2="890" y2={474 + i * 20} stroke="#1F1D1A" strokeWidth="2" opacity="0.3" />
          ))}
          <text x="652" y="590" fontFamily="var(--font-stardos)" fontWeight="700" fontSize="40" fill="#1F1D1A" opacity="0.85">NAL</text>

          {/* the guitar: frontend */}
          <g className="cb-obj" data-g="front">
            <g className="cb-op" style={op(-6, 0)}>
              <polygon points="84,170 262,140 254,476 74,506" fill="#2F4FA2" opacity="0.92" />
              <polygon points="84,170 112,166 102,500 74,506" fill="url(#cb-hatch)" opacity="0.5" />
            </g>
            <g className="cb-op" style={op(4, -3)}>
              <polygon points="150,262 362,240 372,540 162,560" fill="#C9A15F" />
              <path d="M184 270 C 250 300, 196 380, 250 420 C 300 456, 230 520, 262 556" fill="none" stroke="#2A2622" strokeWidth="6" />
              <line x1="362" y1="240" x2="372" y2="540" stroke="#2A2622" strokeWidth="3" />
            </g>
            <g className="cb-op" style={op(7, 3)}>
              <circle cx="276" cy="398" r="42" fill="#2A2622" />
              <circle cx="276" cy="398" r="50" fill="none" stroke="#F3EEE2" strokeWidth="3" />
            </g>
            <g className="cb-op" style={op(-3, -6)}>
              <polygon points="250,36 290,32 304,410 262,414" fill="#6E7F8C" />
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1={258 + i * 9} y1="48" x2={264 + i * 9} y2="540" stroke="#F3EEE2" strokeWidth="1.8" />
              ))}
            </g>
          </g>

          {/* the bottle: backend */}
          <g className="cb-obj" data-g="back">
            <g className="cb-op" style={op(-5, 2)}>
              <polygon points="430,112 622,96 640,520 444,540" fill="#8E8577" opacity="0.55" />
              <polygon points="430,112 462,110 474,538 444,540" fill="url(#cb-hatch)" opacity="0.55" />
            </g>
            <g className="cb-op" style={op(3, -4)}>
              <path d="M516 104 L516 222 C 486 244, 474 268, 474 300 L474 520 L592 520 L592 300 C 592 268, 580 244, 550 222 L550 104 Z" fill="#2A2622" />
            </g>
            <g className="cb-op" style={op(8, 2)}>
              <polygon points="456,330 606,320 610,424 462,432" fill="#C8372D" />
              <line x1="470" y1="378" x2="598" y2="370" stroke="#F3EEE2" strokeWidth="3" />
              <line x1="456" y1="330" x2="606" y2="320" stroke="#2A2622" strokeWidth="3" />
            </g>
            <g className="cb-op" style={op(-2, -5)}>
              <polygon points="560,240 574,238 578,500 564,502" fill="#F3EEE2" opacity="0.9" />
            </g>
          </g>

          {/* the pipe: infrastructure */}
          <g className="cb-obj" data-g="infra">
            <g className="cb-op" style={op(6, -3)}>
              <polygon points="690,176 906,156 926,404 712,424" fill="#E5B42A" opacity="0.92" />
              <polygon points="906,156 926,404 902,406 884,160" fill="url(#cb-hatch)" opacity="0.45" />
            </g>
            <g className="cb-op" style={op(-4, 2)}>
              <path d="M650 300 L790 372" stroke="#2A2622" strokeWidth="14" strokeLinecap="round" />
            </g>
            <g className="cb-op" style={op(3, 5)}>
              <polygon points="770,334 872,322 880,456 780,466" fill="#5C4128" />
              <ellipse cx="822" cy="328" rx="52" ry="12" fill="#2A2622" />
              <line x1="770" y1="334" x2="780" y2="466" stroke="#2A2622" strokeWidth="3" />
            </g>
            <g className="cb-op" style={op(-6, -6)}>
              <path d="M818 300 C 790 270, 850 250, 822 214 C 798 184, 848 166, 830 128" fill="none" stroke="#2A2622" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        </svg>

        <ul className="cb-labels">
          {GROUPS.map((g, gi) => (
            <li
              key={g.id}
              className="cb-label cb-paste"
              data-g-label={g.id}
              data-reveal
              data-refract
              tabIndex={0}
              style={{ ["--r" as string]: `${[-2, 1.5, -1][gi]}deg`, ["--i" as string]: gi }}
            >
              <h3 className="cb-label-name">{g.label}</h3>
              <p className="cb-label-obj">
                {g.object}, {g.note}
              </p>
              <ul className="cb-rhythm" data-reveal>
                {g.items.map((s, i) => (
                  <li key={s} style={{ ["--b" as string]: beat(i) }}>
                    {s}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

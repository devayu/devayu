import { personalInfo } from "@/data/personal";
import Arrow from "./Arrow";

// Who I am: an oval canvas in a rope frame (the 1912 chair-caning still life),
// a few analytic planes inside it, and one frontal plane that carries the
// words. Around it, papier-collé scraps, each a fact cut from its own
// material and glued down one at a time.

const SCRAPS = [
  { cls: "cb-scrap-news", r: -3, text: personalInfo.title, note: "the whole stack, front to back" },
  { cls: "cb-scrap-wood", r: 2.5, text: personalInfo.location, note: "where I work from" },
  { cls: "cb-scrap-music", r: -1.5, text: "React + Spring Boot", note: "the two I reach for first" },
];

export default function Intro() {
  return (
    <section className="cb-intro" aria-labelledby="cb-hello">
      <div className="cb-oval-wrap">
        <div className="cb-oval" aria-hidden>
          <svg className="cb-oval-planes" viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice">
            <polygon points="40,90 330,40 360,300 70,350" fill="#C9A15F" opacity="0.55" />
            <polygon points="300,20 560,60 520,250 290,230" fill="#8E8577" opacity="0.45" />
            <polygon points="520,120 780,90 760,420 540,460" fill="#6E7F8C" opacity="0.4" />
            <polygon points="90,330 400,290 430,540 120,560" fill="#B8894A" opacity="0.4" />
            <polygon points="420,330 700,300 690,540 440,560" fill="#5C4128" opacity="0.28" />
            <line x1="330" y1="40" x2="360" y2="300" stroke="#2A2622" strokeWidth="3" />
            <line x1="520" y1="120" x2="780" y2="90" stroke="#2A2622" strokeWidth="3" />
            <line x1="90" y1="330" x2="120" y2="560" stroke="#2A2622" strokeWidth="3" />
            <polygon points="330,40 356,44 384,296 360,300" fill="url(#cb-hatch)" opacity="0.5" />
          </svg>
        </div>
        <svg className="cb-rope" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <ellipse cx="50" cy="50" rx="49" ry="49" fill="none" stroke="#5C4128" strokeWidth="3.2" vectorEffect="non-scaling-stroke" />
          <ellipse cx="50" cy="50" rx="49" ry="49" fill="none" stroke="#C9A15F" strokeWidth="3.2" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
          <ellipse cx="50" cy="50" rx="49" ry="49" fill="none" stroke="#2A2622" strokeWidth="1" vectorEffect="non-scaling-stroke" transform="translate(0.5 0.6)" />
        </svg>

        <div className="cb-front cb-pass" data-refract>
          <h1 id="cb-hello" className="cb-st cb-hello" data-reveal>
            <span className="cb-sr">I&rsquo;m Ayush.</span>
            <span aria-hidden className="cb-st-w">
              {"I’m".split("").map((c, i) => (
                <span key={i} className="cb-st-l" style={{ ["--i" as string]: i }}>{c}</span>
              ))}
            </span>{" "}
            <span aria-hidden className="cb-st-w cb-hello-name">
              {"Ayush.".split("").map((c, i) => (
                <span key={i} className="cb-st-l" style={{ ["--i" as string]: i + 4 }}>{c}</span>
              ))}
            </span>
          </h1>
          <p>
            I build software for the web, from the screen you touch to the services underneath it. Most days that
            means React in front and Spring Boot behind, and a habit of walking round a problem a few times before I
            pick the side to cut into.
          </p>
          <a href="#next" className="cb-front-next" data-refract>
            <span className="cb-front-next-name">{personalInfo.currentProject.name}</span>
            <span className="cb-front-next-text">
              Right now I&rsquo;m building {personalInfo.currentProject.name}, {personalInfo.currentProject.blurb}.
              It&rsquo;s the side of me that&rsquo;s still moving, so it&rsquo;s where this room is heading.
            </span>
            <span className="cb-front-next-go">
              See what&rsquo;s next <Arrow dir="down" />
            </span>
          </a>
          <p>
            Everything between here and there is me the way the Cubists showed a guitar: from several sides at once.
            Where I&rsquo;ve been, what I use, what I&rsquo;ve made.
          </p>
        </div>
      </div>

      <ul className="cb-scraps" aria-label="A few facts, pasted down">
        {SCRAPS.map((s, i) => (
          <li key={s.cls} className={`cb-scrap cb-paste ${s.cls}`} data-reveal data-refract style={{ ["--r" as string]: `${s.r}deg`, ["--i" as string]: i }}>
            <span className="cb-scrap-word">{s.text}</span>
            <span className="cb-scrap-note">{s.note}</span>
          </li>
        ))}
        <li className="cb-scrap cb-paste cb-scrap-flock" data-reveal data-refract style={{ ["--r" as string]: "3deg", ["--i" as string]: 3 }}>
          <a href="#next" className="cb-scrap-link">
            <span className="cb-scrap-word">building {personalInfo.currentProject.name}</span>
            <span className="cb-scrap-note">what&rsquo;s next, at the bottom <Arrow dir="down" /></span>
          </a>
        </li>
      </ul>
    </section>
  );
}

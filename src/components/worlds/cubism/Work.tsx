import Highlight from "@/components/Highlight";
import { workExperience } from "@/data/work";
import Comb from "./Comb";
import Stencil from "./Stencil";

// Where I've been, on Juan Gris's regulating grid: diagonals run through the
// whole section and cut every plane. Each job is one band, broken into three
// planes seen from three sides, each in its own material, the bands nudged a
// few pixels off true so the timeline reads as one object taken apart and put
// back. The highlights stand on their own plane in stencil.

const MATERIALS = [
  { role: "cb-m-check", text: "cb-m-news", fig: "cb-m-chalk" },
  { role: "cb-m-wood", text: "cb-m-news", fig: "cb-m-flock" },
];

const figure = (desc: string) => {
  const m = desc.match(/\*\*([^*]+)\*\*/);
  if (!m) return null;
  const parts = m[1].match(/^(top\s+\d+|\S*\d\S*)\s+(.*)$/i);
  return parts ? { big: parts[1], small: parts[2] } : { big: m[1], small: "" };
};

export default function Work() {
  return (
    <section className="cb-work" aria-labelledby="cb-work-h">
      <svg className="cb-gris" viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden>
        {[-4, -2, 0, 2, 4, 6, 8].map((i) => (
          <line key={`a${i}`} x1={i * 150} y1="0" x2={i * 150 + 520} y2="900" />
        ))}
        {[0, 2, 4, 6, 8, 10].map((i) => (
          <line key={`b${i}`} x1={i * 150 + 300} y1="0" x2={i * 150 - 220} y2="900" />
        ))}
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={`c${i}`} x1={i * 150} y1="0" x2={i * 150} y2="900" className="cb-gris-v" />
        ))}
      </svg>

      <header className="cb-sec-head">
        <Stencil text="Where I've been" id="cb-work-h" className="cb-h2" />
        <p className="cb-lede">
          Two places, each seen from three sides: what I was, what I did, and the one number I&rsquo;d point at.
        </p>
      </header>

      <div className="cb-bands-wrap">
      <Comb />
      <ol className="cb-bands">
        {workExperience.map((job, i) => {
          const m = MATERIALS[i % MATERIALS.length];
          const figs = job.description.map(figure).filter(Boolean) as { big: string; small: string }[];
          return (
            <li key={job.id} className="cb-band" style={{ ["--shift" as string]: `${i % 2 ? -6 : 5}px` }}>
              <div className={`cb-pass cb-bp cb-bp-role ${m.role}`} data-refract data-reveal>
                <h3 className="cb-role">{job.title}</h3>
                <p className="cb-where">{job.location}</p>
                <p className="cb-when">{job.yearString}</p>
              </div>
              <div className={`cb-pass cb-bp cb-bp-text ${m.text}`} data-refract data-reveal>
                <ul className="cb-did">
                  {job.description.map((d, j) => (
                    <li key={j}>
                      <Highlight text={d} className="cb-hl" />
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`cb-pass cb-bp cb-bp-fig ${m.fig}`} data-refract data-reveal aria-hidden>
                {figs.map((f) => (
                  <p key={f.big} className="cb-fig">
                    <span className="cb-fig-big">{f.big}</span>
                    <span className="cb-fig-small">{f.small}</span>
                  </p>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
      </div>
    </section>
  );
}

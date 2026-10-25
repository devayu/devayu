import Highlight from "@/components/Highlight";
import { personalInfo } from "@/data/personal";
import { workExperience } from "@/data/work";
import { Manicule } from "./art";
import DadaHeading from "./DadaHeading";

// Where I've been, as an extra edition of a Dada newspaper. Each job is a
// news item: a Didone headline, a dateline, the story in plain roman. In the
// margin: a tram ticket for the years, a clipping, the tech pressed on as
// rubber stamps, and the timetable of the route so far.

const DESK: Record<string, { headline: string; lead: string; stamps: string[]; clip: "monolith" | "search"; caption: string; ad?: string }> = {
  "agilon-sse": {
    headline: "Monolith Cut to Pieces; the Pieces Run Faster",
    lead: "I joined agilon Health in October 2022 and I’m still on this beat.",
    stamps: ["Groovy", "Spring Boot", "microservices", "React"],
    clip: "monolith",
    caption: "The monolith, shortly before.",
    ad: "For sale: one Groovy monolith, lightly used. Now available in pieces. No returns.",
  },
  "a1-landing": {
    headline: "Search for A1 Associates, Find A1 Associates",
    lead: "In 2024 A1 Associates needed a website, so I freelanced one for them.",
    stamps: ["Next.js", "SEO", "responsive"],
    clip: "search",
    caption: "Searching, in halftone.",
  },
};

function Clipping({ kind }: { kind: "monolith" | "search" }) {
  return (
    <svg className="dd-clip-img" viewBox="0 0 220 150" aria-hidden focusable="false">
      <rect width="220" height="150" fill="#F2ECDD" />
      {kind === "monolith" ? (
        <g className="dd-reg">
          <rect x="70" y="18" width="58" height="122" fill="url(#dd-ht-coarse)" />
          <rect x="128" y="40" width="22" height="100" fill="url(#dd-ht)" />
          <path d="M0 140 H220" stroke="#1A1814" strokeWidth="3" />
          <path d="M150 52 L178 34 L200 62 L172 80 Z" fill="url(#dd-ht-fine)" />
          <path d="M162 98 L190 92 L196 118 L168 124 Z" fill="url(#dd-ht-fine)" />
          <circle cx="40" cy="38" r="18" fill="url(#dd-ht-fine)" />
        </g>
      ) : (
        <g className="dd-reg">
          <circle cx="92" cy="66" r="44" fill="none" stroke="url(#dd-ht-coarse)" strokeWidth="16" />
          <path d="M122 98 L176 140" stroke="#1A1814" strokeWidth="16" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x="160" y={14 + i * 16} width={44 - i * 4} height="9" fill={i === 0 ? "#D22B1F" : "url(#dd-ht)"} />
          ))}
        </g>
      )}
    </svg>
  );
}

export default function DerDada() {
  return (
    <section id="der-dada" className="dd-news" aria-labelledby="der-dada-h">
      <span className="dd-fold dd-fold--v" aria-hidden />
      <header className="dd-news-head">
        <DadaHeading id="der-dada-h" text="Where I’ve been" loud="been" hat seed={1919} lean={1} />
        <p className="dd-news-strap">
          <span>Extra edition</span>
          <span>Price: one click</span>
          <span>Filed from {personalInfo.location}</span>
          <span>Weather: compiling, then sunny</span>
        </p>
      </header>

      <div className="dd-news-body">
        {workExperience.map((job, n) => {
          const desk = DESK[job.id];
          return (
            <div className="dd-row" key={job.id}>
              <article className={`dd-item${n === 0 ? " dd-item--lead" : ""}`} aria-labelledby={`${job.id}-h`}>
                <h3 id={`${job.id}-h`} className="dd-item-head">
                  {desk?.headline ?? `${job.title} at ${job.location}`}
                </h3>
                <p className="dd-item-deck">
                  {job.title}, {job.location}
                  {job.time ? ` · ${job.time}` : ""}
                </p>
                <p className="dd-item-p dd-item-first">
                  <span className="dd-dateline">
                    {job.location.toUpperCase()}, {job.yearString}.
                  </span>{" "}
                  {desk?.lead}
                </p>
                {job.description.map((line, i) => (
                  <p key={i} className="dd-item-p">
                    <Highlight text={line} className="dd-hl" />
                  </p>
                ))}
                {desk && (
                  <ul className="dd-stamps" aria-label="Pressed on this story">
                    {desk.stamps.map((s, i) => (
                      <li key={s} className={`dd-stamp dd-stamp--${["violet", "ink", "red", "green"][(i + n) % 4]}`}>
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </article>

              <aside className="dd-margin" aria-hidden>
                <div className={`dd-tram${n ? " dd-tram--b" : ""}`}>
                  <span className="dd-tram-line">Linie {n ? 24 : 22}</span>
                  <span className="dd-tram-year">{job.yearString}</span>
                  <span className="dd-tram-class">{job.time === "full-time" ? "1. Klasse · full-time" : "Einzelfahrt · part-time"}</span>
                  <span className="dd-tram-punch" />
                </div>
                {desk && (
                  <figure className={`dd-clip${n ? " dd-clip--b" : ""}`}>
                    <Clipping kind={desk.clip} />
                    <figcaption>{desk.caption}</figcaption>
                  </figure>
                )}
                {desk?.ad && <p className="dd-ad">{desk.ad}</p>}
              </aside>
            </div>
          );
        })}

        <div className="dd-row dd-row--end">
          <div className="dd-timetable-wrap">
            <table className="dd-timetable">
              <caption>Timetable of the route so far</caption>
              <tbody>
                {workExperience.map((job) => (
                  <tr key={job.id}>
                    <td>{job.yearString}</td>
                    <td>{job.location}</td>
                    <td>{job.time === "full-time" ? "still riding" : "freelance stop"}</td>
                  </tr>
                ))}
                <tr>
                  <td>now</td>
                  <td>{personalInfo.currentProject.name}</td>
                  <td>under construction</td>
                </tr>
              </tbody>
            </table>
            <a className="dd-hand-link" href="#telegramm">
              <Manicule className="dd-hand-link-icon" />
              Continued in the telegram, below
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

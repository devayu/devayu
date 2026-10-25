import WorldLink from "@/components/gallery/WorldLink";
import { personalInfo, socialLinks } from "@/data/personal";
import { projects } from "@/data/projects";
import EmailScrap from "./EmailScrap";
import Stencil from "./Stencil";

// Where the room has been heading all along. First, Beacon, as the thing I'm
// building next, under one big lamp of a form. Then a Cassandre poster: one
// geometric shape, one stencil line, one thing to do, and the other ways to
// reach me pinned up as scraps that lift at the corner.

const beacon = projects.find((p) => p.id === "beacon");

export default function Next() {
  const { currentProject, email, calendarLink } = personalInfo;
  return (
    <>
      <section id="next" className="cb-next" aria-labelledby="cb-next-h">
        <svg className="cb-lamp" viewBox="0 0 1200 800" preserveAspectRatio="xMaxYMid slice" aria-hidden>
          <defs>
            <linearGradient id="cb-beam" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#E5B42A" stopOpacity="0.95" />
              <stop offset="1" stopColor="#E5B42A" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="cb-lampglow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#F3EEE2" />
              <stop offset="0.55" stopColor="#E5B42A" />
              <stop offset="1" stopColor="#E07B39" />
            </radialGradient>
          </defs>
          <polygon className="cb-beam cb-beam-1" points="930,330 0,40 0,250" fill="url(#cb-beam)" />
          <polygon className="cb-beam cb-beam-2" points="930,360 0,420 0,620" fill="url(#cb-beam)" opacity="0.7" />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1="930" y1="345" x2={-40} y2={760 + i * 70} stroke="#F3EEE2" strokeWidth={i === 0 ? 3 : 1.5} opacity={0.5 - i * 0.08} />
          ))}
          <polygon points="860,420 1010,410 1060,800 820,800" fill="#2A2622" />
          <polygon points="860,420 900,418 868,800 820,800" fill="url(#cb-hatch-chalk)" opacity="0.6" />
          <circle cx="930" cy="345" r="132" fill="url(#cb-lampglow)" />
          <circle cx="930" cy="345" r="132" fill="none" stroke="#2A2622" strokeWidth="4" strokeDasharray="210 620" />
        </svg>

        <div className="cb-next-plane cb-pass" data-refract>
          <h2 id="cb-next-h" className="cb-next-h">
            <span className="cb-next-what">What&rsquo;s</span> <span className="cb-next-word">next</span>
          </h2>
          <p className="cb-next-name">{currentProject.name}</p>
          <p>
            What I&rsquo;m building next is {currentProject.name}: {currentProject.blurb}. It scans a site for
            accessibility problems and walks the team toward fixing them, so fewer people get shut out of the web.
          </p>
          <p>It&rsquo;s still in progress, so it&rsquo;s the side of me you&rsquo;ll see change next.</p>
          {beacon && (
            <ul className="cb-stack cb-stack-chalk" aria-label="Built with">
              {beacon.techStack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          <a className="cb-facet cb-facet-yellow" href={currentProject.href} target="_blank" rel="noreferrer">
            <span className="cb-facet-face">
              Follow {currentProject.name} on GitHub<span aria-hidden> ↗</span>
            </span>
          </a>
        </div>
      </section>

      <section id="reach" className="cb-poster" aria-labelledby="cb-reach-h">
        <svg className="cb-poster-form" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <circle cx="840" cy="420" r="360" fill="#C8372D" />
          <polygon points="0,900 0,640 1200,300 1200,520 380,900" fill="#2F4FA2" />
          <polygon points="0,640 1200,300 1200,330 0,672" fill="url(#cb-hatch)" opacity="0.5" />
          <circle cx="840" cy="420" r="360" fill="none" stroke="#2A2622" strokeWidth="5" strokeDasharray="420 1840" strokeDashoffset="-60" />
        </svg>

        <div className="cb-poster-inner">
          <div className="cb-poster-plane cb-pass" data-refract>
            <Stencil text="Let's make the next one" id="cb-reach-h" className="cb-poster-h" />
            <p>
              If you&rsquo;re building something and want someone who&rsquo;ll look at it from the side you
              haven&rsquo;t tried yet, book a quick chat. Or write. Either way, it starts with hello.
            </p>
            <a className="cb-facet cb-facet-red cb-facet-big" href={calendarLink} target="_blank" rel="noreferrer">
              <span className="cb-facet-face">
                Book a quick chat<span aria-hidden> ↗</span>
              </span>
            </a>
          </div>

          <ul className="cb-pins" aria-label="Other ways to reach me">
            <EmailScrap email={email} />
            {socialLinks.map((s, i) => (
              <li key={s.name} className="cb-pin" data-refract style={{ ["--r" as string]: `${[2, -1.5, 2.5][i]}deg` }}>
                <a className="cb-pin-paper" href={s.url} target="_blank" rel="noreferrer">
                  <span className="cb-pin-k">{s.name}</span>
                  <span className="cb-pin-v">{s.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</span>
                  <span className="cb-pin-flap" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <footer className="cb-foot">
          <p>
            <span className="cb-seal" lang="ja" aria-hidden>歩</span> devayu. Every side of me, at once.
          </p>
          <p>
            <WorldLink href="/" className="cb-foot-link">Back to the gallery</WorldLink>
            <span className="cb-foot-esc"> (or press Esc)</span>
          </p>
        </footer>
      </section>
    </>
  );
}

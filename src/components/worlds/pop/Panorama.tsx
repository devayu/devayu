"use client";

import Highlight from "@/components/Highlight";
import { workExperience } from "@/data/work";
import { useEffect, useRef, useState } from "react";

// Where I've been, as a billboard panorama: one panel per job, each a tightly
// cropped flat-printed fragment beside the copy, stencil numerals for the
// dates, hard seams between panels. It's a contained scroller: swipe, use a
// trackpad, the arrow keys once it has focus, or the two buttons.

function SpringFragment() {
  // A coil spring cropped until it's half a shape (Groovy out, Spring Boot in),
  // over a heartbeat line printed in Ben-Day tone.
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="pp-frag" aria-hidden>
      <defs>
        <pattern id="pp-frag-dots-a" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle className="pp-dot-b" cx="6" cy="6" r="3" fill="#1FC3B5" />
        </pattern>
      </defs>
      <rect width="400" height="500" fill="#2EB4E6" />
      <rect x="0" y="0" width="400" height="500" fill="url(#pp-frag-dots-a)" />
      <path d="M-20 300 H120 L150 220 L185 390 L220 160 L250 300 H420" fill="none" stroke="#F4EEDC" strokeWidth="26" strokeLinejoin="miter" />
      <g transform="rotate(-18 200 250)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={i} cx="250" cy={40 + i * 86} rx="170" ry="46" fill="none" stroke="#E2231A" strokeWidth="34" />
        ))}
      </g>
      <g className="pp-key-l" transform="rotate(-18 200 250)" fill="none" stroke="#111" strokeWidth="6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={i} cx="250" cy={40 + i * 86} rx="187" ry="63" />
        ))}
      </g>
    </svg>
  );
}

function LensFragment() {
  // A magnifying glass, close enough that it's mostly rim (SEO, cropped).
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="pp-frag" aria-hidden>
      <defs>
        <pattern id="pp-frag-dots-b" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle className="pp-dot-b" cx="5.5" cy="5.5" r="2.6" fill="#FF5FA2" />
        </pattern>
      </defs>
      <rect width="400" height="500" fill="#FFD400" />
      <circle cx="170" cy="210" r="210" fill="#F4EEDC" />
      <circle cx="170" cy="210" r="210" fill="url(#pp-frag-dots-b)" />
      <circle cx="170" cy="210" r="210" fill="none" stroke="#0070C0" strokeWidth="48" />
      <path d="M318 360 L470 540" stroke="#111" strokeWidth="70" strokeLinecap="square" />
      <text x="100" y="300" fontFamily="var(--font-anton)" fontSize="230" fill="#E2231A">
        5
      </text>
      <g className="pp-key-l" fill="none" stroke="#111" strokeWidth="6">
        <circle cx="170" cy="210" r="236" />
        <circle cx="170" cy="210" r="184" />
      </g>
      <text className="pp-key-l" x="100" y="300" fontFamily="var(--font-anton)" fontSize="230" fill="none" stroke="#111" strokeWidth="4">
        5
      </text>
    </svg>
  );
}

const FRAGMENTS: Record<string, () => React.ReactElement> = {
  "agilon-sse": SpringFragment,
  "a1-landing": LensFragment,
};
const GROUNDS: Record<string, string> = { "agilon-sse": "#F4EEDC", "a1-landing": "#FF6A13" };

const highlightsOf = (lines: string[]) =>
  lines.flatMap((l) =>
    Array.from(l.matchAll(/\*\*([^*]+)\*\*/g)).map((m) => ({ phrase: m[1], est: /estimated/i.test(l) }))
  );

const dates = (s = "") => s.replace("Present", "Now").toUpperCase();

export default function Panorama() {
  const scroller = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const total = workExperience.length + 1;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth || el.clientWidth;
        setAt(Math.min(total - 1, Math.round(el.scrollLeft / w)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [total]);

  const go = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth || el.clientWidth;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: Math.max(0, Math.min(total - 1, at + dir)) * w, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="work" className="pp-work" aria-labelledby="pp-work-h">
      <div className="pp-work-head">
        <h2 id="pp-work-h" className="pp-print pp-h2" data-pull data-text="Where I've been.">
          <span className="pp-print-ink">Where I&apos;ve been.</span>
        </h2>
        <p className="pp-work-intro">Two jobs, pasted up billboard-size. Scroll along; the numbers on the stickers are the real ones.</p>
      </div>

      <div className="pp-work-frame">
        <div ref={scroller} className="pp-billboards" tabIndex={0} role="region" aria-label="Work history, scrolls sideways">
          {workExperience.map((w, i) => {
            const Frag = FRAGMENTS[w.id] ?? SpringFragment;
            return (
              <article key={w.id} className="pp-board" style={{ ["--g" as string]: GROUNDS[w.id] ?? "#F4EEDC" }} aria-labelledby={`pp-job-${w.id}`}>
                <div className="pp-board-art">
                  <Frag />
                  <div className="pp-board-cards">
                    {highlightsOf(w.description).map((h, k) => (
                      <span key={h.phrase} className="pp-pricecard" style={{ ["--r" as string]: `${k % 2 ? 4 : -5}deg` }}>
                        {h.est && <small>est.</small>}
                        {h.phrase}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pp-board-copy">
                  <p className="pp-board-dates">{dates(w.yearString)}</p>
                  <h3 id={`pp-job-${w.id}`} className="pp-board-title">
                    {w.title}
                    <span> at {w.location}</span>
                  </h3>
                  <ul className="pp-board-lines">
                    {w.description.map((d) => (
                      <li key={d}>
                        <Highlight text={d} className="pp-hl" />
                      </li>
                    ))}
                  </ul>
                  <p className="pp-board-fine">
                    {w.time === "full-time" ? "Full-time." : "Part-time."} Panel {i + 1} of {total}.
                  </p>
                </div>
              </article>
            );
          })}
          <article className="pp-board pp-board-end" aria-labelledby="pp-job-next">
            <div className="pp-board-copy">
              <p className="pp-board-dates">Next</p>
              <h3 id="pp-job-next" className="pp-board-avail">
                This space
                <br />
                available
              </h3>
              <p className="pp-board-endline">
                Inquire at the <a href="#checkout">checkout</a>.
              </p>
            </div>
          </article>
        </div>
        <div className="pp-work-controls">
          <button type="button" className="pp-arrow" onClick={() => go(-1)} disabled={at === 0} aria-label="Previous billboard">
            <svg viewBox="0 0 40 24" aria-hidden>
              <path d="M38 12 H6 M16 2 L4 12 L16 22" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </button>
          <span className="pp-work-count" aria-live="polite">
            {at + 1} / {total}
          </span>
          <button type="button" className="pp-arrow" onClick={() => go(1)} disabled={at >= total - 1} aria-label="Next billboard">
            <svg viewBox="0 0 40 24" aria-hidden>
              <path d="M2 12 H34 M24 2 L36 12 L24 22" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

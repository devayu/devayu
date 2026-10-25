"use client";

import { projects } from "@/data/projects";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

// Things I've made, hung as Herbert Bayer's "extended field of vision": the
// panels are angled on the wall around an eye; look at one (hover, focus or,
// on a phone, scroll it to the middle) and it turns to face you in fixed
// steps while a red arrow points at it.

const TONES = ["ink", "buff", "card", "buff"] as const;
// rest angles: rotateY and rotateZ, in degrees
const ANGLES: [number, number][] = [
  [26, -3],
  [-22, 2],
  [18, 2],
  [-28, -2],
];

const STATUS: Record<string, string> = { "in-progress": "in progress", completed: "finished", planned: "planned" };

export default function Field() {
  const [active, setActive] = useState(0);
  const wall = useRef<HTMLDivElement>(null);

  // Phones can't hover: the panel crossing the middle of the screen is the one you're looking at.
  useEffect(() => {
    const el = wall.current;
    if (!el || window.matchMedia("(hover: hover)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    el.querySelectorAll<HTMLElement>(".bh-panel").forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  return (
    <Reveal className="bh-made" aria-labelledby="bh-made-h" id="made">
      <div className="bh-made-head">
        <h2 id="bh-made-h" className="bh-h2">
          things i&rsquo;ve made
        </h2>
        <p className="bh-lede">four on the wall. look at one and it turns to face you.</p>
        <svg viewBox="0 0 300 220" className="bh-eye" aria-hidden>
          {[-62, -22, 22, 62].map((dy, i) => (
            <line
              key={dy}
              x1="96"
              y1="110"
              x2="300"
              y2={110 + dy * 1.6}
              stroke={i === active ? "#D0331F" : "#8A8781"}
              strokeWidth={i === active ? 4 : 1.5}
              className="bh-eye-ray"
            />
          ))}
          <path d="M6 110 Q96 30 186 110 Q96 190 6 110 Z" fill="#EDE7D9" stroke="#161514" strokeWidth="5" />
          <circle cx="96" cy="110" r="34" fill="#1E3C8C" />
          <circle cx="96" cy="110" r="14" fill="#161514" />
        </svg>
      </div>

      <div className="bh-wall-field" ref={wall}>
        {projects.map((p, i) => (
          <article
            key={p.id}
            data-i={i}
            className="bh-panel"
            data-tone={TONES[i % TONES.length]}
            data-active={active === i || undefined}
            aria-labelledby={`bh-p-${p.id}`}
            style={{ "--ry": `${ANGLES[i % 4][0]}deg`, "--rz": `${ANGLES[i % 4][1]}deg`, "--i": i } as React.CSSProperties}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            onFocusCapture={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <span className="bh-arrow" aria-hidden>
              <svg viewBox="0 0 60 24">
                <rect x="0" y="9" width="40" height="6" />
                <path d="M38 0 L60 12 L38 24 Z" />
              </svg>
            </span>
            <div className="bh-panel-face">
              <div className="bh-panel-top">
                <span className="bh-panel-year">{p.year}</span>
                <span className="bh-panel-status" data-status={p.status}>
                  <span className="bh-light" aria-hidden />
                  {STATUS[p.status ?? "completed"]}
                </span>
              </div>
              <h3 id={`bh-p-${p.id}`} className="bh-panel-title">
                {p.title}
              </h3>
              <p className="bh-panel-desc">{p.description}</p>
              <ul className="bh-panel-stack" aria-label="built with">
                {p.techStack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="bh-panel-links">
                {p.githubLink ? (
                  <a className="bh-ln" href={p.githubLink} target="_blank" rel="noreferrer">
                    code on github
                  </a>
                ) : null}
                {p.liveLink ? (
                  <a className="bh-ln" href={p.liveLink} target="_blank" rel="noreferrer">
                    see it live
                  </a>
                ) : null}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Reveal>
  );
}

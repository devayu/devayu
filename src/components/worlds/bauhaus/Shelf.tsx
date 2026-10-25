"use client";

import Highlight from "@/components/Highlight";
import { workExperience } from "@/data/work";
import { audio } from "@/lib/audio/manager";
import { useState } from "react";
import Reveal from "./Reveal";

// Where I've been, as a shelf of Bauhausbücher: each job is a √2 book with a
// coloured spine, the year as a huge numeral, a black top bar and a red role
// block. Pull one out and its spread opens beside the shelf.

const SPINES = ["#1E3C8C", "#F0B419", "#2E7D4F"];
const yearOf = (s?: string) => s?.match(/\d{4}/)?.[0] ?? "";

export default function Shelf() {
  const [open, setOpen] = useState(workExperience[0].id);
  const job = workExperience.find((w) => w.id === open) ?? workExperience[0];

  return (
    <Reveal className="bh-work" aria-labelledby="bh-work-h" id="work">
      <h2 id="bh-work-h" className="bh-h2">
        where i&rsquo;ve been
      </h2>
      <p className="bh-lede">here&rsquo;s the work so far. pull a book off the shelf and it opens.</p>

      <div className="bh-work-grid">
        <div className="bh-shelf">
          <ul className="bh-books">
            {workExperience.map((w, i) => (
              <li key={w.id} className="bh-book-slot" style={{ "--i": i } as React.CSSProperties}>
                <button
                  type="button"
                  className="bh-book"
                  aria-expanded={open === w.id}
                  aria-controls="bh-spread"
                  style={{ "--spine": SPINES[i % SPINES.length] } as React.CSSProperties}
                  onClick={() => {
                    if (open !== w.id) audio.sfx("click");
                    setOpen(w.id);
                  }}
                >
                  <span className="bh-book-spine" aria-hidden />
                  <span className="bh-book-top">{w.location}</span>
                  <span className="bh-book-year">{yearOf(w.yearString)}</span>
                  <span className="bh-book-role">{w.title}</span>
                </button>
              </li>
            ))}
          </ul>
          <span className="bh-board" aria-hidden />
        </div>

        <article id="bh-spread" className="bh-spread" key={job.id} aria-live="polite">
          <div className="bh-page bh-page-l">
            <span className="bh-page-num" aria-hidden>
              {yearOf(job.yearString)}
            </span>
            <h3 className="bh-spread-role">{job.title}</h3>
            <p className="bh-spread-at">at {job.location}</p>
            <p className="bh-spread-when">
              {job.yearString}
              {job.time ? <span> · {job.time}</span> : null}
            </p>
          </div>
          <div className="bh-page bh-page-r">
            <ul className="bh-spread-list">
              {job.description.map((d) => (
                <li key={d}>
                  <Highlight text={d} className="bh-hl" />
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </Reveal>
  );
}

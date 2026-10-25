"use client";

import { projects } from "@/data/projects";
import type { Project } from "@/types";
import { useState } from "react";
import { Manicule } from "./art";
import { dice, hash } from "./chance";

// Things I've made, pasted onto a Merz board. Each project is a little
// collage: a halftone picture cut with scissors, a ticket stub for the year,
// a receipt for the stack. Each card is glued on at a chance angle; hover or
// focus straightens and lifts it. Click the picture and it becomes a
// readymade: signed, moustached, art.

const PAPER = ["#EDE6D3", "#E9DDBE", "#F4EFE2", "#E5E0CF"];

function Picture({ id }: { id: string }) {
  switch (id) {
    case "beacon":
      return (
        <g>
          <circle cx="232" cy="80" r="62" fill="url(#dd-ht-coarse)" />
          {[-26, -14, -3, 8, 19].map((a, i) => (
            <path key={a} d="M40 196 L330 150 L330 176 Z" transform={`rotate(${a} 40 196)`} fill={i === 2 ? "#D22B1F" : "url(#dd-ht-fine)"} />
          ))}
          <rect x="30" y="96" width="22" height="100" fill="url(#dd-ht)" />
          <path d="M26 96 H56 L48 80 H34 Z" fill="#1A1814" />
        </g>
      );
    case "logbase":
      return (
        <g>
          {[46, 92, 64, 128, 104, 150, 86].map((h, i) => (
            <rect key={i} x={24 + i * 40} y={196 - h} width="26" height={h} fill={i % 3 ? "url(#dd-ht)" : "url(#dd-ht-coarse)"} />
          ))}
          <path d="M10 110 L70 110 L90 60 L112 160 L134 90 L160 110 L330 110" fill="none" stroke="#D22B1F" strokeWidth="6" strokeLinejoin="miter" />
          <circle cx="282" cy="46" r="26" fill="url(#dd-ht-violet)" />
        </g>
      );
    case "a1-landing":
      return (
        <g>
          <circle cx="118" cy="100" r="62" fill="none" stroke="url(#dd-ht-coarse)" strokeWidth="22" />
          <path d="M160 146 L214 200" stroke="#1A1814" strokeWidth="22" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x="226" y={24 + i * 30} width={96 - i * 10} height="16" fill={i === 0 ? "#D22B1F" : "url(#dd-ht)"} />
          ))}
        </g>
      );
    default:
      return (
        <g>
          <path d="M20 170 C20 130 80 120 130 118 L210 82 C240 70 270 84 290 112 L330 140 V182 H20 Z" fill="url(#dd-ht-coarse)" />
          <path d="M20 182 H330 V198 H20 Z" fill="#1A1814" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={150 + i * 22} cy={104 - i * 7} r="5" fill="#EDE6D3" stroke="#1A1814" strokeWidth="2" />
          ))}
          <path d="M146 96 L172 108 L170 90 L194 102 L192 84 L216 96 L212 78 L238 90" fill="none" stroke="#D22B1F" strokeWidth="4" />
          <circle cx="62" cy="52" r="30" fill="url(#dd-ht-fine)" />
        </g>
      );
  }
}

function Card({ p, i }: { p: Project; i: number }) {
  const [art, setArt] = useState(false);
  const d = dice(hash(p.id) + 7);
  const tilt = d.sign() * d.range(1.6, 4.4);
  const cutPath = `polygon(${d.range(0, 3).toFixed(1)}% ${d.range(0, 5).toFixed(1)}%, ${d.range(96, 100).toFixed(1)}% 0%, 100% ${d.range(94, 100).toFixed(1)}%, ${d.range(0, 4).toFixed(1)}% 100%)`;
  const year = p.year ?? "";
  const live = p.liveLink;
  const code = p.githubLink;

  return (
    <li
      className={`dd-card dd-card--${i % 4}`}
      style={{ "--tilt": `${tilt.toFixed(1)}deg`, background: PAPER[i % PAPER.length] } as React.CSSProperties}
    >
      <article aria-labelledby={`merz-${p.id}`}>
        <div className="dd-card-pic-wrap">
          <button
            type="button"
            className="dd-card-pic"
            aria-pressed={art}
            aria-label={art ? `Take the signature off the ${p.title} picture` : `Sign the ${p.title} picture and make it art`}
            onClick={() => setArt((a) => !a)}
            style={{ clipPath: cutPath }}
          >
            <svg viewBox="0 0 340 210" aria-hidden focusable="false" className="dd-card-svg">
              <rect width="340" height="210" fill="#F2ECDD" />
              <g className="dd-reg">
                <Picture id={p.id} />
              </g>
              {art && (
                <g className="dd-readymade">
                  <path
                    d="M128 118 C140 104 158 104 170 116 C182 104 200 104 212 118 C222 128 234 124 238 112 C236 132 214 138 200 128 C190 122 178 124 170 130 C162 124 150 122 140 128 C126 138 104 132 102 112 C106 124 118 128 128 118 Z"
                    fill="#2b2824"
                  />
                  <text x="322" y="196" textAnchor="end" className="dd-mutt">
                    R. Mutt {year}
                  </text>
                </g>
              )}
            </svg>
          </button>
          <p className="dd-card-art" aria-live="polite">
            {art ? "now it’s art." : ""}
          </p>
          <span className="dd-stub" aria-hidden>
            <span className="dd-stub-year">{year}</span>
            <span className="dd-stub-sub">{p.status === "in-progress" ? "still building" : "admit one"}</span>
          </span>
        </div>

        <div className="dd-card-text">
          <h3 id={`merz-${p.id}`} className="dd-card-title">
            {p.title}
          </h3>
          {p.status === "in-progress" && <p className="dd-card-status">In progress</p>}
          <p className="dd-card-desc">{p.description}</p>
          <div className="dd-receipt" role="group" aria-label={`${p.title} is built with`}>
            <p className="dd-receipt-head" aria-hidden>
              Merz &amp; Co. · receipt
            </p>
            <ul>
              {p.techStack.map((t) => (
                <li key={t}>
                  <span>{t}</span>
                  <span aria-hidden>1&times;</span>
                </li>
              ))}
            </ul>
            <p className="dd-receipt-total" aria-hidden>
              <span>total</span>
              <span>1 {p.title.split(" ")[0]}</span>
            </p>
          </div>
          <p className="dd-card-links">
            {code && (
              <a href={code} target="_blank" rel="noreferrer">
                <Manicule className="dd-link-hand" />
                Source on GitHub
              </a>
            )}
            {live && (
              <a href={live} target="_blank" rel="noreferrer">
                <Manicule className="dd-link-hand" />
                See it live
              </a>
            )}
          </p>
        </div>
      </article>
    </li>
  );
}

export default function Merz() {
  return (
    <ul className="dd-board">
      {projects.map((p, i) => (
        <Card key={p.id} p={p} i={i} />
      ))}
    </ul>
  );
}

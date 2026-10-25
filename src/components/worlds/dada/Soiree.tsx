"use client";

import { audio } from "@/lib/audio/manager";
import { useState } from "react";
import { Manicule, Scissors } from "./art";
import { FACES, dice, faceStyle, hash } from "./chance";

// The hero: a little soirée poster performed as a sound poem. A huge red DADA
// is overprinted three ways over black type; syllables run across in mixed
// woodtype like a poster poem; the printed programme lists tonight's acts
// and links down the page. Clicking the paper re-cuts it (Tzara's hat):
// every slip lands somewhere new, nothing it says changes.

const ACTS = [
  { href: "#manifest", act: "Manifesto", what: "who I am" },
  { href: "#der-dada", act: "Der Dada", what: "where I’ve been, extra edition", main: true },
  { href: "#maschine", act: "The machine", what: "what I can do" },
  { href: "#merz", act: "Merz", what: "things I’ve made" },
  { href: "#telegramm", act: "Telegram", what: "what’s next, and how to reach me" },
];

/** Syllables set like an optophonetic poem: louder letters, bigger type. */
function Phonemes({ text, seed, className }: { text: string; seed: number; className?: string }) {
  const d = dice(seed);
  return (
    <span className={className} aria-hidden>
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i} className="dd-ph-gap" />
        ) : (
          <span key={i} style={faceStyle(FACES[d.int(0, 3)], d.pick([0.6, 1, 1, 1.8, 0.8, 1.3]))}>
            {ch}
          </span>
        )
      )}
    </span>
  );
}

type Piece = { key: string; className: string; content: React.ReactNode; still?: boolean };

const PIECES: Piece[] = [
  { key: "dada-big", className: "dd-p dd-p-dada1", content: "DADA" },
  { key: "dada-up", className: "dd-p dd-p-dada2", content: "DADA" },
  { key: "dada-flip", className: "dd-p dd-p-dada3", content: "dada" },
  { key: "kleine", className: "dd-p dd-p-kleine", content: "KLEINE" },
  { key: "full", className: "dd-p dd-p-full", content: "full-stack" },
  { key: "soiree", className: "dd-p dd-p-soiree", content: "Soirée" },
  { key: "abend", className: "dd-p dd-p-abend", content: "ein Abend in fünf Akten" },
  { key: "caps", className: "dd-p dd-p-caps", content: <Phonemes text="a N t I k U n S t" seed={11} /> },
  { key: "poem1", className: "dd-p dd-p-poem1", content: <Phonemes text="fümms bö wö tää zää Uu" seed={3} /> },
  { key: "poem2", className: "dd-p dd-p-poem2", content: <Phonemes text="tüpp skrrriptt rre äkt" seed={8} /> },
  { key: "poem3", className: "dd-p dd-p-poem3", content: <Phonemes text="dokkerr pössgrrr" seed={21} /> },
  { key: "free", className: "dd-p dd-p-free", content: <span className="dd-postmark"><span>Eintritt frei</span><b>heute</b><span>· Zürich · India ·</span></span> },
  { key: "hand1", className: "dd-p dd-p-hand1", content: <Manicule className="dd-p-hand" /> },
  { key: "hand2", className: "dd-p dd-p-hand2", content: <Manicule className="dd-p-hand" /> },
];

const TURNS = [-12, -9, -7, -5, -3, 3, 5, 7, 9, 12];

export default function Soiree() {
  const [cut, setCut] = useState(0);

  const recut = () => {
    setCut((c) => c + 1);
    audio.sfx("tear");
  };

  return (
    <section className="dd-soiree" aria-label="A little Dada soirée">
      <div
        className="dd-poster"
        data-cut={cut}
        onClick={(e) => {
          if ((e.target as Element).closest("a, button")) return;
          recut();
        }}
      >
        <span className="dd-fold dd-fold--v" aria-hidden />
        <span className="dd-fold dd-fold--h" aria-hidden />
        <div className="dd-poster-slips" aria-hidden>
          {PIECES.map((p, i) => {
            const d = dice(hash(p.key) + cut * 7919);
            const jx = cut ? d.range(-5, 5) : 0;
            const jy = cut ? d.range(-6, 6) : 0;
            const jr = cut ? d.pick(TURNS) * (d.next() < 0.5 ? 0.5 : 1) : 0;
            return (
              <span
                key={p.key}
                className={p.className}
                style={
                  {
                    "--jx": `${jx.toFixed(1)}cqi`,
                    "--jy": `${jy.toFixed(1)}cqb`,
                    "--jr": `${jr.toFixed(1)}deg`,
                    "--i": i,
                  } as React.CSSProperties
                }
              >
                <span className="dd-p-ink" data-text={typeof p.content === "string" ? p.content : undefined}>
                  {p.content}
                </span>
              </span>
            );
          })}
        </div>

        <nav className="dd-programme" aria-label="Programme">
          <p className="dd-programme-title" aria-hidden>
            <span>Pro</span>
            <span>gramm</span>
          </p>
          <ol>
            {ACTS.map((a, i) => (
              <li key={a.href} className={a.main ? "is-main" : undefined}>
                <a href={a.href}>
                  <span className="dd-act-no" aria-hidden>
                    {i + 1}.
                  </span>
                  <span className="dd-act-name">{a.act}</span>
                  <span className="dd-act-what">{a.what}</span>
                  {a.main && (
                    <span className="dd-act-star" aria-hidden>
                      main attraction
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <button type="button" className="dd-recut" onClick={recut}>
          <Scissors className="dd-recut-icon" />
          <span>cut it up again</span>
        </button>
      </div>
    </section>
  );
}

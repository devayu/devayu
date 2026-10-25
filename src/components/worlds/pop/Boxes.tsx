"use client";

import { audio } from "@/lib/audio/manager";
import { useRef, useState } from "react";
import { boxes, statusLabel } from "./content";

// Things I've made, as stacked grocery cartons: invented packaging with the
// project's name printed on every face. Hover, focus, drag or press "Turn it"
// and the carton makes a quarter turn to show its back panel.

type Box = (typeof boxes)[number];

// The logotype is sized to fill the band: at most two lines, never a broken word.
const nameSize = (name: string) => {
  const perLine = Math.max(name.length > 10 ? Math.ceil(name.length / 2) : name.length, ...name.split(" ").map((w) => w.length));
  return `${Math.min(10, 50 / (perLine * 0.8)).toFixed(2)}cqi`;
};

function Face({ box, side }: { box: Box; side: "front" | "left" | "top" | "back" }) {
  const [ground, ink] = box.inks;
  return (
    <span
      className={`pp-face pp-face-${side}`}
      style={{ ["--g" as string]: ground, ["--k" as string]: ink, ["--nfs" as string]: nameSize(box.short) }}
      aria-hidden
    >
      <span className="pp-face-band" />
      <span className="pp-face-name">{box.short}</span>
      {side === "front" && <span className="pp-face-strap">{box.strap}</span>}
      {side === "front" && <span className="pp-face-giant">Giant size</span>}
    </span>
  );
}

function Carton({ box, i }: { box: Box; i: number }) {
  const [turned, setTurned] = useState(false);
  const [hover, setHover] = useState(false);
  const drag = useRef<{ x: number; done: boolean } | null>(null);
  const shown = turned || hover;
  const [ground, ink] = box.inks;

  const flip = (next: boolean) => {
    setTurned(next);
    audio.sfx("pop");
  };

  return (
    <li className="pp-carton" style={{ ["--i" as string]: i }}>
      <div
        className="pp-box"
        data-turned={shown || undefined}
        onMouseEnter={() => {
          if (!window.matchMedia("(hover: hover)").matches) return;
          setHover(true);
          if (!turned) audio.sfx("pop");
        }}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setHover(false);
        }}
        onPointerDown={(e) => {
          if ((e.target as Element).closest("a,button")) return;
          drag.current = { x: e.clientX, done: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || d.done) return;
          if (Math.abs(e.clientX - d.x) > 36) {
            d.done = true;
            flip(e.clientX < d.x);
          }
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <div className="pp-box-body">
          <Face box={box} side="front" />
          <Face box={box} side="back" />
          <Face box={box} side="left" />
          <Face box={box} side="top" />
          <div className="pp-face pp-face-right" style={{ ["--g" as string]: ground, ["--k" as string]: ink }}>
            <p className="pp-back-title">{box.short}</p>
            <dl className="pp-back-facts">
              <div>
                <dt>Ingredients</dt>
                <dd>{box.techStack.join(", ")}</dd>
              </div>
              <div>
                <dt>Packed</dt>
                <dd>{box.year}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{statusLabel(box.status)}</dd>
              </div>
            </dl>
            <p className="pp-back-links">
              {box.githubLink && (
                <a href={box.githubLink} target="_blank" rel="noreferrer">
                  Source
                </a>
              )}
              {box.liveLink && (
                <a href={box.liveLink} target="_blank" rel="noreferrer">
                  Live
                </a>
              )}
            </p>
            <span className="pp-barcode" aria-hidden />
          </div>
        </div>
      </div>
      <div className="pp-carton-tag">
        <h3 className="pp-carton-name">{box.title}</h3>
        <p className="pp-carton-desc">{box.description}</p>
        <button type="button" className="pp-turn" aria-pressed={turned} onClick={() => flip(!turned)}>
          {turned ? "Turn it back" : "Turn it: read the back"}
        </button>
      </div>
    </li>
  );
}

export default function Boxes() {
  return (
    <section id="made" className="pp-made" aria-labelledby="pp-made-h">
      <div className="pp-made-head">
        <h2 id="pp-made-h" className="pp-print pp-h2" data-pull data-text="Things I've made.">
          <span className="pp-print-ink">Things I&apos;ve made.</span>
        </h2>
        <p className="pp-made-intro">
          Four cartons off the line. The name is on every face so you can&apos;t miss it; the back panel has what&apos;s inside
          and where to get it.
        </p>
      </div>
      <ul className="pp-cartons">
        {boxes.map((b, i) => (
          <Carton key={b.id} box={b} i={i} />
        ))}
      </ul>
    </section>
  );
}

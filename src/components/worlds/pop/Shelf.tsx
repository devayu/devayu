"use client";

import { audio } from "@/lib/audio/manager";
import { useEffect, useRef, useState } from "react";
import { cans } from "./content";

// What I can do, as a supermarket shelf. Every skill is a can run off the same
// logotype template; only the flavour and the inks change. Pick one up (hover,
// focus or tap) and it becomes the frontal hero product, with the back of the
// pack telling you where I've actually used it.

type Can = (typeof cans)[number];

const lines = (name: string) => name.split(" ");
// The flavour is set like a packaging logotype: one size for every can, and a
// long word is condensed to fit the label rather than shrunk.
const FS = 25;
const fit = (word: string) => (word.length * FS * 0.74 > 90 ? 90 : undefined);

function Flavour({ name }: { name: string }) {
  const ls = lines(name);
  const h = ls.length * 25 + 8;
  return (
    <svg className="pp-can-flavour" viewBox={`0 0 100 ${h}`}>
      {ls.map((l, k) => (
        <g key={l}>
          <text className="pp-flv-ink" x="50" y={26 + k * 25} textAnchor="middle" textLength={fit(l)} lengthAdjust="spacingAndGlyphs">
            {l}
          </text>
          <text className="pp-flv-key" x="50" y={26 + k * 25} textAnchor="middle" textLength={fit(l)} lengthAdjust="spacingAndGlyphs">
            {l}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Fixed per-can sticker tilts, so the server and the client agree.
const TILT = [-9, 7, -4, 11, -12, 5, -6, 8, -10];

export function CanArt({ can, big = false }: { can: Can; big?: boolean }) {
  const [a, b, c] = can.combo;
  return (
    <span
      className={big ? "pp-can-art pp-can-art-big" : "pp-can-art"}
      style={{ ["--a" as string]: a, ["--b" as string]: b, ["--c" as string]: c, }}
      aria-hidden
    >
      <span className="pp-can-rim" />
      <span className="pp-can-body">
        <span className="pp-can-brand">devayu&nbsp;brand</span>
        <Flavour name={can.name} />
        <span className="pp-can-dots" />
        <span className="pp-can-net">Net wt. one skill</span>
      </span>
      <span className="pp-can-rim pp-can-rim-base" />
    </span>
  );
}

export default function Shelf() {
  const [sel, setSel] = useState(0);
  const unit = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const can = cans[sel];

  // One "pop" when the stickers slap on, not one per sticker.
  useEffect(() => {
    const el = unit.current;
    if (!el) return;
    const onPull = () => window.setTimeout(() => audio.sfx("pop"), 520);
    el.addEventListener("pp:pull", onPull);
    return () => el.removeEventListener("pp:pull", onPull);
  }, []);

  const pick = (i: number, reveal = false) => {
    setSel(i);
    if (!reveal) return;
    const r = panel.current?.getBoundingClientRect();
    if (r && (r.top > window.innerHeight - 120 || r.bottom < 80)) {
      panel.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  const rows = [cans.slice(0, 3), cans.slice(3, 6), cans.slice(6, 9)];

  return (
    <section id="shelf" className="pp-shelf" aria-labelledby="pp-shelf-h">
      <div className="pp-shelf-head">
        <h2 id="pp-shelf-h" className="pp-print pp-h2" data-pull data-text="What I can do.">
          <span className="pp-print-ink">What I can do.</span>
        </h2>
        <p className="pp-shelf-intro">
          Nine flavours, one recipe. Pick any can off the shelf and read the back: it tells you where I&apos;ve actually used
          it, and says so when I haven&apos;t written it down here yet.
        </p>
      </div>

      <div className="pp-shelf-floor">
        <div ref={unit} className="pp-shelf-unit" data-pull role="group" aria-label="Skills, one can each">
          {rows.map((row, r) => (
            <div key={r} className="pp-shelf-row">
              <div className="pp-shelf-cans">
                {row.map((c, k) => {
                  const i = r * 3 + k;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      className="pp-can"
                      aria-pressed={sel === i}
                      aria-controls="pp-backpack"
                      style={{ ["--i" as string]: i, ["--tilt" as string]: `${TILT[i]}deg` }}
                      onMouseEnter={() => pick(i)}
                      onFocus={() => pick(i)}
                      onClick={(e) => pick(i, e.detail > 0 && window.matchMedia("(hover: none)").matches)}
                    >
                      <CanArt can={c} />
                      <span className="sr-only">{c.name}</span>
                      {c.sticker && <span className="pp-sticker">{c.sticker}</span>}
                    </button>
                  );
                })}
              </div>
              <div className="pp-shelf-board" aria-hidden>
                {row.map((c) => (
                  <span key={c.name} className="pp-shelf-price">
                    {c.uses.length ? `${c.uses.length} on file` : "Ask me"}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div ref={panel} id="pp-backpack" className="pp-backpack" aria-live="polite">
          <div className="pp-backpack-hero" key={can.name}>
            <CanArt can={can} big />
            <span className="pp-backpack-pull" aria-hidden />
          </div>
          <div className="pp-backpack-panel">
            <h3 className="pp-backpack-name">{can.name}</h3>
            <p className="pp-backpack-slogan">{can.slogan}</p>
            <p className="pp-backpack-label">Ingredients (where I&apos;ve used it)</p>
            {can.uses.length ? (
              <ul className="pp-backpack-uses">
                {can.uses.map((u) => (
                  <li key={u.where + u.how}>
                    <strong>{u.where}.</strong> {u.how}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pp-backpack-empty">
                Not itemised on this pack. It&apos;s on my list, but none of the work or projects in this room names it, so I
                won&apos;t pretend. Ask me about it at the checkout.
              </p>
            )}
            <p className="pp-backpack-fine">Uses on file: {can.uses.length}. Contains no skill percentages.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import WorldLink from "@/components/gallery/WorldLink";
import { getWorld, worlds, type WorldSlug } from "@/data/worlds";
import { audio } from "@/lib/audio/manager";
import { useAudio } from "@/lib/audio/use-audio";
import { KANDINSKY, PropDisc, type Prim } from "./kit";

// The in-room navigation: one heavy black bar down the left edge carrying the
// three primitives (one per other room), a way back to the gallery and the
// Light Prop as the sound control. Phones get the same bar along the bottom.

const ROOMS: Partial<Record<WorldSlug, { rest: Prim; own: Prim; label: string }>> = {
  dada: { rest: "circle", own: "triangle", label: "dada" },
  pop: { rest: "triangle", own: "square", label: "pop art" },
  cubism: { rest: "square", own: "circle", label: "cubism" },
};

const theme = getWorld("bauhaus").sound;

export default function Rail() {
  const { enabled, playing } = useAudio();
  const spinning = enabled && playing === "bauhaus";

  return (
    <nav className="bh-nav" aria-label="rooms">
      <WorldLink href="/" className="bh-nav-gallery">
        <svg viewBox="0 0 24 24" aria-hidden className="bh-nav-arrow">
          <path d="M3 12 L12 4 V9 H21 V15 H12 V20 Z" fill="currentColor" />
        </svg>
        <span className="bh-vt">gallery</span>
      </WorldLink>

      <ul className="bh-nav-rooms">
        {worlds
          .filter((w) => ROOMS[w.slug])
          .map((w) => {
            const r = ROOMS[w.slug]!;
            return (
              <li key={w.slug}>
                <WorldLink
                  href={w.href}
                  className="bh-nav-room"
                  style={
                    {
                      "--rest": `var(--bh-${r.rest})`,
                      "--own": `var(--bh-${r.own})`,
                      "--tone": KANDINSKY[r.own],
                    } as React.CSSProperties
                  }
                >
                  <span className="bh-plate" aria-hidden>
                    <span className="bh-mk" />
                  </span>
                  <span className="bh-vt">{r.label}</span>
                </WorldLink>
              </li>
            );
          })}
      </ul>

      <div className="bh-nav-sound">
        <button
          type="button"
          data-sound-toggle
          aria-pressed={enabled}
          aria-label={enabled ? "sound on: turn off" : "sound off: turn on"}
          className="bh-prop"
          data-spinning={spinning || undefined}
          onClick={() => audio.toggle()}
        >
          <PropDisc className="bh-prop-disc" />
          <span className="bh-prop-state" aria-hidden>
            {enabled ? "on" : "off"}
          </span>
        </button>
        <p className="bh-nav-theme">{theme}</p>
      </div>
    </nav>
  );
}

"use client";

import { chapters } from "@/components/journey/chapters";
import { worlds, type WorldSlug } from "@/data/worlds";
import { useCurrentWorld } from "@/lib/journey";
import { cn } from "@/lib/utils";

const nameClass: Record<WorldSlug, string> = {
  noir: "font-oswald uppercase tracking-[0.15em]",
  frontier: "font-rye",
  "night-city": "font-rajdhani font-bold uppercase italic",
  yotei: "font-mincho font-bold",
};

// Jump straight to a reality, at the moment its transformation completes.
export const goTo = (slug: WorldSlug) => {
  const el = document.getElementById(slug);
  if (!el) return;
  const gate = el.querySelector<HTMLElement>("[data-gate]");
  const top = gate ? el.offsetTop + gate.offsetHeight - window.innerHeight : 0;
  window.scrollTo({ top, behavior: "smooth" });
};

// A map of the four realities pinned to the screen's edge.
export default function ChapterRail() {
  const current = useCurrentWorld();
  return (
    <nav aria-label="Chapters" className="chapter-rail fixed left-1 top-1/2 z-50 -translate-y-1/2 md:left-3">
      <ol className="flex flex-col gap-3 md:gap-4">
        {worlds.map((w) => {
          const active = w.slug === current;
          return (
            <li key={w.slug}>
              <button
                type="button"
                onClick={() => goTo(w.slug)}
                aria-current={active ? "step" : undefined}
                aria-label={`${chapters[w.slug].n}: ${chapters[w.slug].label}, in ${w.name}`}
                className={cn("rail-item group flex items-center gap-3 text-left", active && "is-active")}
              >
                <span aria-hidden className="rail-mark block h-[2px]" />
                <span className="rail-text flex-col leading-tight">
                  <span className={cn("rail-name text-sm", nameClass[w.slug])}>{w.name}</span>
                  <span className="rail-label font-sans text-[11px]">{chapters[w.slug].label}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

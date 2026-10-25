"use client";

import { BauhausArt, CubismArt, DadaArt, PopArt } from "@/components/gallery/panels";
import WorldLink from "@/components/gallery/WorldLink";
import { worlds, type WorldSlug } from "@/data/worlds";
import { audio } from "@/lib/audio/manager";
import { useAudio } from "@/lib/audio/use-audio";
import { cn } from "@/lib/utils";
import { useEffect, useState, useSyncExternalStore } from "react";

// The select screen: four rooms hung side by side. Highlighting one widens it,
// sets its canvas performing and plays its theme; choosing it takes you in.

const readEntered = () => {
  try {
    return sessionStorage.getItem("entered") === "1";
  } catch {
    return true;
  }
};
const noop = () => () => {};

const Art = ({ slug, active }: { slug: WorldSlug; active: boolean }) =>
  slug === "bauhaus" ? <BauhausArt /> : slug === "dada" ? <DadaArt active={active} /> : slug === "pop" ? <PopArt active={active} /> : <CubismArt />;

export default function Gallery() {
  const enteredBefore = useSyncExternalStore(noop, readEntered, () => true);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState<WorldSlug | null>(null);
  const { enabled, unlocked } = useAudio();
  const gate = !enteredBefore && !entered;

  // The gallery itself is quiet: only a highlighted room plays.
  useEffect(() => {
    audio.setWorld(null);
  }, []);

  useEffect(() => {
    if (active && unlocked) audio.preview(active);
    else if (!active) audio.stopPreview();
  }, [active, unlocked]);

  const enter = (withSound: boolean) => {
    try {
      sessionStorage.setItem("entered", "1");
    } catch {}
    audio.unlock();
    if (withSound !== audio.isEnabled()) audio.toggle();
    setEntered(true);
  };

  return (
    <main className="gallery" data-gate={gate || undefined}>
      <header className="gallery-chrome">
        <span className="gallery-handle">devayu</span>
        <button
          type="button"
          data-sound-toggle
          className="gallery-sound"
          aria-pressed={enabled}
          onClick={() => audio.toggle()}
        >
          <span className="gallery-sound-dot" data-on={enabled || undefined} aria-hidden />
          {enabled ? "Sound on" : "Sound off"}
        </button>
      </header>

      <nav aria-label="Rooms" className="gallery-rooms" onMouseLeave={() => setActive(null)}>
        {worlds.map((w) => (
          <WorldLink
            key={w.slug}
            href={w.href}
            className={cn("room", `room-${w.slug}`)}
            data-active={active === w.slug || undefined}
            onMouseEnter={() => setActive(w.slug)}
            onFocus={() => setActive(w.slug)}
            onBlur={() => setActive(null)}
            tabIndex={gate ? -1 : undefined}
          >
            <Art slug={w.slug} active={active === w.slug} />
            <span className="room-label">
              <span className="room-name">{w.name}</span>
              <span className="room-years">{w.years}</span>
              <span className="room-tagline">{w.tagline}</span>
            </span>
          </WorldLink>
        ))}
      </nav>

      <footer className="gallery-foot">
        <p>Four movements, one person. Pick a room.</p>
        <WorldLink href="/%E2%88%85" className="gallery-foot-link" tabIndex={gate ? -1 : undefined}>
          Fragments
        </WorldLink>
      </footer>

      {gate && (
        <div className="gallery-gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
          <div className="gallery-gate-inner">
            <h1 id="gate-title" className="gallery-gate-title">
              Four movements.
              <br />
              One person.
            </h1>
            <p className="gallery-gate-copy">
              Each room tells you who I am in its own language, and each one has its own music.
            </p>
            <div className="gallery-gate-actions">
              <button type="button" className="gallery-gate-primary" onClick={() => enter(true)} autoFocus>
                Come in, with sound
              </button>
              <button type="button" className="gallery-gate-quiet" onClick={() => enter(false)}>
                Come in quietly
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

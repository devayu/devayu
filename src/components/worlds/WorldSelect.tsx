"use client";

import YoteiScene from "@/components/yotei/YoteiScene";
import { worldArt } from "@/components/worlds/art";
import { FrontierHero, NoirHero } from "@/components/worlds/heroes";
import HoloKoi from "@/components/worlds/nightcity/HoloKoi";
import NightCityCity from "@/components/worlds/nightcity/NightCityCity";
import { worlds, type WorldSlug } from "@/data/worlds";
import { audio } from "@/lib/audio/manager";
import { portalStore } from "@/lib/portal/store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const noop = () => () => {};
const readStarted = () => {
  try {
    return sessionStorage.getItem("started") === "1";
  } catch {
    return false;
  }
};

// Each world's name is set in that world's own lettering.
const nameStyle: Record<WorldSlug, string> = {
  noir: "font-oswald font-bold uppercase tracking-[0.12em] text-[#e9dfa5]",
  frontier: "font-rye text-[#f6d189]",
  "night-city": "font-rajdhani font-bold uppercase italic tracking-wide text-[#fcee0a]",
  yotei: "font-mincho font-extrabold text-[#f3ece0]",
};

const accent: Record<WorldSlug, string> = {
  noir: "#e9dfa5",
  frontier: "#f6d189",
  "night-city": "#fcee0a",
  yotei: "#c8283a",
};

// The real, living hero of every world becomes the menu's backdrop.
const Backdrop = ({ slug, active }: { slug: WorldSlug; active: boolean }) => {
  if (slug === "noir") return <NoirHero />;
  if (slug === "frontier") return <FrontierHero />;
  if (slug === "night-city")
    return (
      <>
        {/* the 3D city only renders while it's the one on screen */}
        <NightCityCity running={active} />
        <HoloKoi className="absolute inset-0 h-full w-full" />
      </>
    );
  return (
    <div
      className="absolute inset-0"
      style={{ background: "linear-gradient(to bottom, var(--sky-top), var(--sky-mid) 45%, var(--sky-bottom) 75%)" }}
    >
      <YoteiScene />
    </div>
  );
};

export default function WorldSelect() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [launching, setLaunching] = useState<number | null>(null);
  // The title screen shows once per visit; returning from a world skips it.
  const startedBefore = useSyncExternalStore(noop, readStarted, () => false);
  const [pressed, setPressed] = useState(false);
  const started = startedBefore || pressed;

  const start = useCallback(() => {
    try {
      sessionStorage.setItem("started", "1");
    } catch {}
    setPressed(true);
    audio.unlock();
  }, []);

  // No music on this screen, except a preview of whichever world you're
  // pointing at. Choosing that world keeps the song going.
  const [previewing, setPreviewing] = useState(false);
  useEffect(() => {
    audio.setWorld(null);
  }, []);
  useEffect(() => {
    if (!started || launching !== null) return;
    if (!previewing) {
      audio.stopPreview();
      return;
    }
    const id = window.setTimeout(() => audio.preview(worlds[active].slug), 180);
    return () => window.clearTimeout(id);
  }, [active, started, previewing, launching]);

  useEffect(() => {
    worlds.forEach((w) => router.prefetch(w.href));
  }, [router]);

  const launch = useCallback(
    (i: number) => {
      if (launching !== null) return;
      // The portal tears open from the chosen world's name.
      const item = document.querySelectorAll<HTMLElement>("[data-world-item]")[i];
      const rect = item?.getBoundingClientRect();
      const origin: [number, number] = rect
        ? [(rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height / 2) / window.innerHeight]
        : [0.5, 0.5];
      if (!portalStore.go({ slug: worlds[i].slug, href: worlds[i].href, origin, kind: "enter" })) return;
      setActive(i);
      setLaunching(i);
    },
    [launching]
  );

  const highlight = (i: number) => {
    if (launching !== null) return;
    setActive(i);
    setPreviewing(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started) {
        if (e.key !== "Tab" && !e.metaKey) start();
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setPreviewing(true);
        setActive((a) => (a + 1) % worlds.length);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setPreviewing(true);
        setActive((a) => (a - 1 + worlds.length) % worlds.length);
      } else if (e.key === "Enter" && document.activeElement === document.body) {
        launch(active);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, launch, started, start]);

  if (!started) return <TitleScreen onStart={start} />;

  const current = worlds[active];

  return (
    <main className="menu relative min-h-[100svh] overflow-hidden bg-black text-[#ece8df]" data-active={current.slug}>
      <h1 className="sr-only">Ayush Maurya, full stack developer</h1>

      {/* every world, alive behind the menu; the highlighted one is in front */}
      <div aria-hidden className="absolute inset-0">
        {worlds.map((w, i) => (
          <div key={w.slug} className={cn("menu-world absolute inset-0", i === active && "is-active")}>
            <Backdrop slug={w.slug} active={i === active} />
          </div>
        ))}
        <div className="menu-shade absolute inset-0" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col px-5 py-6 md:px-12 md:py-9">
        <header className="max-w-sm">
          <p className="font-oswald text-2xl font-bold md:text-3xl">Choose your world</p>
          <p className="mt-2 font-sans text-sm leading-relaxed text-[#ece8df]/70">
            Games are a big part of who I am. Pick a world I love, and I&apos;ll
            tell you about myself in it.
          </p>
        </header>

        {/* the menu: huge names, each in its world's lettering */}
        <nav aria-label="Worlds" className="mt-auto md:my-auto">
          <ul className="flex flex-col gap-1 md:gap-2">
            {worlds.map((w, i) => {
              const isActive = i === active;
              return (
                <li key={w.slug}>
                  <button
                    type="button"
                    data-world-item
                    aria-current={isActive}
                    aria-label={`Enter ${w.name}, inspired by ${w.inspiredBy}`}
                    onMouseEnter={() => highlight(i)}
                    onFocus={() => highlight(i)}
                    onClick={() => {
                      // On touch, the first tap highlights and previews; the second enters.
                      const coarse = window.matchMedia("(pointer: coarse)").matches;
                      if (coarse && !isActive) highlight(i);
                      else launch(i);
                    }}
                    className={cn("menu-item flex w-full items-center gap-5 text-left focus-visible:outline-none", isActive && "is-active")}
                  >
                    <span
                      className={cn("menu-name leading-[0.92]", nameStyle[w.slug], isActive && w.slug === "night-city" && "nc-glitch")}
                    >
                      {w.name}
                    </span>
                    <span aria-hidden className="menu-rule hidden h-px flex-1 md:block" style={{ background: accent[w.slug] }} />
                  </button>
                  {isActive && (
                    <div className="menu-info mt-3 max-w-md pb-2">
                      <p className={cn("text-xl leading-tight md:text-2xl", nameStyle[w.slug])}>{w.tagline}</p>
                      <p className="mt-1 font-sans text-sm text-[#ece8df]/65">Inspired by {w.inspiredBy}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* enter, kept clear of the sound dock on the left */}
        <div className="mt-6 flex justify-end pb-16 md:mt-0 md:pb-0">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-oswald text-sm tracking-wider text-[#ece8df]/70">
            <span className="hidden items-center gap-2 md:flex">
              <kbd className="sel-key">↑</kbd>
              <kbd className="sel-key">↓</kbd> Choose
            </span>
            <button
              type="button"
              onClick={() => launch(active)}
              className="menu-enter flex items-center gap-3 px-5 py-3 text-base font-bold uppercase tracking-[0.2em]"
              style={{ ["--accent" as string]: accent[current.slug] }}
            >
              <kbd className="sel-key hidden md:inline-grid">Enter</kbd>
              Enter {current.name}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// "Press any key": the first gesture also unlocks the soundtrack.
function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-black text-[#ece8df]">
      <h1 className="sr-only">Ayush Maurya, full stack developer</h1>
      {/* four slivers of the four worlds, drifting */}
      <div aria-hidden className="absolute inset-0 grid grid-cols-4 opacity-40">
        {worlds.map((w, i) => {
          const Art = worldArt[w.slug];
          return (
            <div key={w.slug} className="title-sliver relative overflow-hidden" style={{ animationDelay: `${i * -3}s` }}>
              <Art className="absolute inset-0 h-full w-full grayscale" />
            </div>
          );
        })}
      </div>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.55)_0%,#000_75%)]" />
      <button
        type="button"
        onClick={onStart}
        className="relative z-10 flex flex-col items-center gap-6 px-6 text-center focus-visible:outline-none"
      >
        <span className="font-oswald text-sm tracking-[0.5em] text-[#ece8df]/60">DEVAYU PRESENTS</span>
        <span className="title-press font-oswald text-[clamp(2.6rem,9vw,7rem)] font-bold uppercase leading-none tracking-[0.06em]">
          Press any key
        </span>
        <span className="max-w-sm font-sans text-sm text-[#ece8df]/60">
          Or tap anywhere. There&apos;s music, so turn your sound up. You can mute it any time.
        </span>
      </button>
      <button type="button" onClick={onStart} aria-hidden tabIndex={-1} className="absolute inset-0 z-0 cursor-pointer" />
    </main>
  );
}

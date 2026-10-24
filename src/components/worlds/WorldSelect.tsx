"use client";

import { worldArt } from "@/components/worlds/art";
import { worlds, type WorldSlug } from "@/data/worlds";
import { audio } from "@/lib/audio/manager";
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

const titleStyle: Record<WorldSlug, string> = {
  noir: "font-oswald font-bold uppercase tracking-[0.18em] text-[#e9dfa5]",
  frontier: "font-rye text-[#f6d189]",
  "night-city": "font-rajdhani font-bold uppercase italic tracking-wider text-[#fcee0a] nc-glitch",
  yotei: "font-mincho font-extrabold text-[#1b2129]",
};

const accent: Record<WorldSlug, string> = {
  noir: "#e9dfa5",
  frontier: "#e7a456",
  "night-city": "#fcee0a",
  yotei: "#c8283a",
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
      setActive(i);
      setLaunching(i);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.setTimeout(() => router.push(worlds[i].href), reduce ? 0 : 650);
    },
    [launching, router]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started) {
        if (e.key !== "Tab" && !e.metaKey) start();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setPreviewing(true);
        setActive((a) => (a + 1) % worlds.length);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
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

  const current = worlds[active];
  const BackdropArt = worldArt[current.slug];

  if (!started) return <TitleScreen onStart={start} />;

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black px-4 pb-6 pt-6 font-oswald text-[#ece8df] md:px-10 md:pt-8">
      {/* blurred backdrop of the highlighted world */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <BackdropArt
          key={current.slug}
          className="h-full w-full scale-110 opacity-35 blur-2xl transition-opacity duration-700 animate-in fade-in"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#000_85%)]" />
      </div>

      <header className="relative z-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <h1 className="sr-only">Ayush Maurya, full stack developer</h1>
          <p className="text-4xl font-bold leading-none md:text-6xl" style={{ color: accent[current.slug] }}>
            Choose your world
          </p>
          <p className="mt-3 max-w-lg font-sans text-[15px] leading-relaxed text-[#ece8df]/75">
            Hey, glad you&apos;re here. Games are a big part of who I am, so
            instead of a plain page, pick one of the worlds I love and I&apos;ll
            tell you about myself in it.
          </p>
        </div>
      </header>

      <ul
        role="listbox"
        aria-label="Worlds"
        onMouseLeave={() => setPreviewing(false)}
        className="relative z-10 mt-6 flex min-h-0 flex-1 flex-col gap-2 md:mt-8 md:flex-row md:gap-3"
      >
        {worlds.map((world, i) => {
          const Art = worldArt[world.slug];
          const isActive = i === active;
          const isLaunching = launching === i;
          return (
            <li
              key={world.slug}
              role="option"
              aria-selected={isActive}
              className={cn(
                "relative min-h-[64px] overflow-hidden rounded-md transition-[flex-grow,opacity,filter] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)]",
                isActive ? "flex-[3.2]" : "flex-1",
                launching !== null && !isLaunching && "flex-[0.0001] opacity-0",
                isLaunching && "flex-[40]"
              )}
            >
              <button
                type="button"
                onMouseEnter={() => {
                  if (launching !== null) return;
                  setActive(i);
                  setPreviewing(true);
                }}
                onFocus={() => {
                  setActive(i);
                  setPreviewing(true);
                }}
                onClick={() => launch(i)}
                className="group absolute inset-0 text-left focus-visible:outline-none"
                aria-label={`Enter ${world.name}, inspired by ${world.inspiredBy}`}
              >
                <Art
                  className={cn(
                    "absolute inset-0 h-full w-full transition-[filter,transform] duration-700",
                    isActive ? "scale-100 grayscale-0" : "scale-105 brightness-50 grayscale"
                  )}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
                />
                {/* selection frame */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 rounded-md border-2 transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-0 group-focus-visible:opacity-100"
                  )}
                  style={{ borderColor: accent[world.slug] }}
                />
                <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 md:p-6">
                  <span
                    className={cn(
                      "leading-none transition-[font-size] duration-500",
                      titleStyle[world.slug],
                      world.slug === "yotei" && !isActive && "text-[#ece8df]",
                      isActive ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"
                    )}
                    data-text={world.name}
                  >
                    {world.name}
                  </span>
                  <span
                    className={cn(
                      "overflow-hidden font-sans text-sm text-[#ece8df]/80 transition-[max-height,opacity] duration-500",
                      isActive ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    {world.tagline}
                    <span className="mt-1 block text-xs text-[#ece8df]/55">
                      Inspired by {world.inspiredBy}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <footer className="relative z-10 mt-5 hidden items-center justify-between pl-44 text-sm tracking-wider text-[#ece8df]/60 md:flex">
        <span className="flex items-center gap-5">
          <span className="flex items-center gap-2">
            <kbd className="sel-key">←</kbd>
            <kbd className="sel-key">→</kbd> Choose
          </span>
          <span className="flex items-center gap-2">
            <kbd className="sel-key">Enter</kbd> Start
          </span>
          <span>Hover a world to hear its theme</span>
        </span>
        <span>It&apos;s the same me in every world. Only the scenery changes.</span>
      </footer>
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

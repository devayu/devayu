"use client";

import { worlds } from "@/data/worlds";
import { audio } from "@/lib/audio/manager";
import { createRenderer, MODES } from "@/lib/portal/shader";
import { portalStore } from "@/lib/portal/store";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const COVER_MS = 780;
const REVEAL_MS = 900;
const MIN_HOLD_MS = { enter: 900, exit: 150 }; // enter holds long enough to read the title card
const MAX_WAIT_MS = 5000;

const ACCENT: Record<string, [number, number, number]> = {
  atsu: [0.78, 0.16, 0.23],
  jin: [0.89, 0.65, 0.17],
};

const SOUND = { noir: "heartbeat", frontier: "shot", "night-city": "glitch", yotei: "slash" } as const;

const titleClass = {
  noir: "font-oswald font-bold uppercase tracking-[0.2em] text-[#e9dfa5]",
  frontier: "font-rye text-[#f6d189]",
  "night-city": "font-rajdhani font-bold uppercase italic tracking-wider text-[#fcee0a] nc-glitch",
  yotei: "font-mincho font-extrabold text-[#ece8df]",
} as const;

const fallbackColor = { noir: "#060607", frontier: "#1c0d07", "night-city": "#030305", yotei: "#0b0a0c" } as const;

// Lives in the root layout so it survives the navigation it covers.
export default function Portal() {
  const req = useSyncExternalStore(portalStore.subscribe, portalStore.get, portalStore.server);
  const router = useRouter();
  const pathname = usePathname();
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<ReturnType<typeof createRenderer> | undefined>(undefined);
  const arrived = useRef(false);
  const [beat, setBeat] = useState<"cover" | "hold" | "reveal" | null>(null);
  const [fallback, setFallback] = useState(false);

  // Track arrival at the destination route.
  useEffect(() => {
    if (req && pathname === req.href) arrived.current = true;
  }, [pathname, req]);

  useEffect(() => {
    if (!req) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      router.push(req.href);
      portalStore.done();
      return;
    }

    arrived.current = false;
    if (renderer.current === undefined && canvas.current) renderer.current = createRenderer(canvas.current);
    const r = renderer.current;
    const useFallback = !r;
    let frame = 0;
    let cancelled = false;
    const theme = document.documentElement.dataset.theme === "jin" ? "jin" : "atsu";
    const base = {
      mode: MODES[req.slug],
      origin: req.origin.map((v, i) => (i === 1 ? 1 - v : v)) as [number, number],
      accent: ACCENT[theme],
    };
    const start = performance.now();
    const run = (ms: number, phase: 0 | 1, then: () => void) => {
      const t0 = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - t0) / ms);
        r?.draw({ ...base, t, phase, time: (now - start) / 1000 });
        if (t < 1) frame = requestAnimationFrame(tick);
        else then();
      };
      frame = requestAnimationFrame(tick);
    };

    // Kick off the state changes from the next frame, not synchronously.
    frame = requestAnimationFrame(() => {
      setFallback(useFallback);
      setBeat("cover");
      audio.sfx(SOUND[req.slug]);
    });

    const wait = () => {
      const held = performance.now();
      const check = () => {
        if (cancelled) return;
        const waited = performance.now() - held;
        if ((arrived.current && waited > MIN_HOLD_MS[req.kind]) || waited > MAX_WAIT_MS) {
          setBeat("reveal");
          run(REVEAL_MS, 1, () => {
            r?.clear();
            setBeat(null);
            portalStore.done();
          });
          return;
        }
        // Keep the cover animated (rain, grain, glitch) while we wait.
        r?.draw({ ...base, t: 1, phase: 0, time: (performance.now() - start) / 1000 });
        frame = requestAnimationFrame(check);
      };
      frame = requestAnimationFrame(check);
    };

    const coverTimer = window.setTimeout(() => {
      run(COVER_MS, 0, () => {
        setBeat("hold");
        window.scrollTo(0, 0);
        router.push(req.href);
        wait();
      });
    }, 16);

    return () => {
      cancelled = true;
      window.clearTimeout(coverTimer);
      cancelAnimationFrame(frame);
    };
  }, [req, router]);

  const world = req ? worlds.find((w) => w.slug === req.slug) : null;
  const showTitle = req?.kind === "enter" && beat !== null;

  return (
    <div
      aria-hidden={!beat}
      className={cn("fixed inset-0 z-[100]", beat ? "pointer-events-auto" : "pointer-events-none")}
    >
      <canvas ref={canvas} className={cn("absolute inset-0 h-full w-full", fallback && "hidden")} />
      {fallback && req && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: fallbackColor[req.slug], opacity: beat === "cover" || beat === "hold" ? 1 : 0 }}
        />
      )}
      {world && (
        <div
          role="status"
          className={cn(
            "portal-title absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center",
            showTitle && beat === "hold" && "is-on",
            showTitle && beat === "reveal" && "is-leaving"
          )}
        >
          <p className={cn("text-[clamp(3rem,11vw,8rem)] leading-none", titleClass[world.slug])}>{world.name}</p>
          <p className="max-w-md font-sans text-sm text-[#ece8df]/70">{world.tagline}</p>
          <span className="portal-loader mt-4 block h-px w-40 bg-[#ece8df]/20">
            <span className="block h-full bg-[#ece8df]/80" />
          </span>
        </div>
      )}
    </div>
  );
}

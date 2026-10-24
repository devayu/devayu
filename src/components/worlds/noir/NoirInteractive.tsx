"use client";

import { personalInfo, socialLinks } from "@/data";
import { audio } from "@/lib/audio/manager";
import { setTimeScale } from "@/lib/timewarp";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const PAINKILLER_EVENT = "noir:painkiller";

/* ——— Typewriter: types its text out once it scrolls into view ——— */

export function Typewriter({ text, className, speed = 28 }: { text: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setCount(text.length), 0);
      return () => window.clearTimeout(id);
    }
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let i = 0;
        timer = window.setInterval(() => {
          i++;
          setCount(i);
          if (i % 3 === 0 && text[i] !== " ") audio.sfx("type");
          if (i >= text.length) window.clearInterval(timer);
        }, speed);
      },
      { rootMargin: "0px 0px -25% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [text, speed]);

  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      <span aria-hidden className="invisible">{text.slice(count)}</span>
    </p>
  );
}

/* ——— The HUD: pain silhouette, painkillers, bullet time ——— */

export function NoirHud() {
  const [pain, setPain] = useState(0);
  const [pills, setPills] = useState(0);
  const [bullet, setBullet] = useState(false);

  const toggleBullet = () => setBullet((b) => !b);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPain(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onPill = () => setPills((p) => p + 1);
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "b" && !e.metaKey && !e.ctrlKey) setBullet((b) => !b);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(PAINKILLER_EVENT, onPill);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(PAINKILLER_EVENT, onPill);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Bullet time really slows the world: rain, every animation and the music.
  useEffect(() => {
    if (bullet) audio.sfx("heartbeat");
    document.documentElement.classList.toggle("bullet-time", bullet);
    setTimeScale(bullet ? 0.22 : 1);
  }, [bullet]);
  useEffect(
    () => () => {
      document.documentElement.classList.remove("bullet-time");
      setTimeScale(1, 0);
    },
    []
  );

  return (
    <>
      <div aria-hidden className="noir-rain pointer-events-none fixed inset-0 z-30" />
      <div aria-hidden className="noir-grain pointer-events-none fixed inset-0 z-30" />
      <div aria-hidden className="noir-vignette pointer-events-none fixed inset-0 z-30" />

      <div className="fixed bottom-4 right-4 z-40 flex items-end gap-4 md:bottom-6 md:right-6">
        {/* painkillers */}
        <div className="hidden flex-col items-center font-typewriter text-[#e9dfa5] sm:flex" title="Painkillers taken">
          <svg viewBox="0 0 20 30" className="h-7 w-5" aria-hidden>
            <rect x="3" y="6" width="14" height="22" rx="2" fill="#c27a1a" />
            <rect x="2" y="1" width="16" height="6" rx="1" fill="#ece8df" />
            <rect x="5" y="12" width="10" height="9" fill="#ece8df" />
          </svg>
          <span className="text-sm">{pills}</span>
        </div>
        {/* pain silhouette, fills as you read */}
        <div className="relative hidden h-16 w-8 sm:block" title="How far you've read">
          <svg viewBox="0 0 40 80" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <clipPath id="pain-figure">
                <path d="M20 2 a 7 7 0 1 1 0 14 a 7 7 0 1 1 0 -14 Z M10 18 h20 l6 26 h-6 l-2 -14 v 46 h-7 v-26 h-2 v26 h-7 v-46 l-2 14 h-6 Z" />
              </clipPath>
            </defs>
            <rect width="40" height="80" fill="#ece8df" opacity="0.15" clipPath="url(#pain-figure)" />
            <rect y={80 - pain * 80} width="40" height={pain * 80} fill="#b11a1a" clipPath="url(#pain-figure)" />
          </svg>
        </div>
        {/* bullet time */}
        <button
          type="button"
          onClick={toggleBullet}
          aria-pressed={bullet}
          className="flex items-center gap-3 border border-[#e9dfa5]/40 bg-black/80 px-4 py-2 font-oswald text-sm tracking-[0.15em] text-[#e9dfa5] transition-colors hover:border-[#e9dfa5]"
        >
          <span aria-hidden className="relative h-6 w-3.5 overflow-hidden border border-[#e9dfa5]/70" style={{ clipPath: "polygon(0 0,100% 0,60% 50%,100% 100%,0 100%,40% 50%)" }}>
            <span className="absolute inset-x-0 bottom-0 bg-[#e9dfa5] transition-[height] duration-[2s] ease-linear" style={{ height: bullet ? "12%" : "100%" }} />
          </span>
          {bullet ? "EXIT BULLET TIME" : "BULLET TIME"}
          <kbd className="sel-key !h-5 !min-w-5 !text-[10px]">B</kbd>
        </button>
      </div>
    </>
  );
}

/* ——— Painkillers: the skills shelf ——— */

export function PainkillerShelf({ skills }: { skills: string[] }) {
  const [taken, setTaken] = useState<Set<string>>(new Set());
  return (
    <div className="relative">
      <ul className="flex flex-wrap items-end justify-center gap-x-5 gap-y-10 px-2 pb-6 md:justify-start md:gap-x-7">
        {skills.map((skill, i) => {
          const isTaken = taken.has(skill);
          return (
            <li key={skill}>
              <button
                type="button"
                onClick={() => {
                  if (!isTaken) window.dispatchEvent(new Event(PAINKILLER_EVENT));
                  setTaken((t) => new Set(t).add(skill));
                  audio.sfx("type");
                }}
                className={cn("pill-bottle group relative block w-[86px] text-left", isTaken && "pill-taken")}
                style={{ ["--tilt" as string]: `${((i * 37) % 7) - 3}deg` }}
                aria-label={`${skill}${isTaken ? ", taken" : ""}`}
              >
                <span className="block h-4 rounded-t-sm bg-[#ece8df] shadow-[inset_0_-3px_0_rgb(0_0_0/0.15)]" />
                <span className="relative block h-[118px] rounded-b-md bg-gradient-to-r from-[#8a4f0e] via-[#c27a1a] to-[#7a430a] p-2 shadow-[0_10px_20px_rgb(0_0_0/0.6)]">
                  <span className="flex h-full flex-col justify-between bg-[#ece8df] p-1.5 font-typewriter text-[#141414]">
                    <span className="text-[9px] leading-tight">Rx. take daily</span>
                    <span className="font-oswald text-[15px] font-bold uppercase leading-none tracking-wide">{skill}</span>
                    <span className="text-[9px]">{100 * ((i % 5) + 1)} mg</span>
                  </span>
                  <span aria-hidden className="pill-pop absolute -top-2 left-1/2 size-3 -translate-x-1/2 rounded-full bg-[#ece8df]" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div aria-hidden className="h-3 bg-gradient-to-b from-[#3a2a1a] to-[#1a120a] shadow-[0_14px_20px_rgb(0_0_0/0.6)]" />
    </div>
  );
}

/* ——— The TV: flip channels to reach me ——— */

const channels = [
  { label: "Write to me", sub: personalInfo.email, href: `mailto:${personalInfo.email}` },
  { label: "Call me", sub: "Pick a time that works for you", href: personalInfo.calendarLink },
  ...socialLinks.map((s) => ({ label: s.name, sub: s.url.replace(/^https?:\/\/(www\.)?/, ""), href: s.url })),
];

export function NoirTv() {
  const [ch, setCh] = useState(0);
  const [static_, setStatic] = useState(false);

  const flip = (i: number) => {
    setStatic(true);
    audio.sfx("glitch");
    window.setTimeout(() => {
      setCh(i);
      setStatic(false);
    }, 380);
  };

  const c = channels[ch];
  const external = !c.href.startsWith("mailto");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 md:flex-row md:items-stretch">
      {/* set */}
      <div className="flex-1 rounded-[28px] bg-gradient-to-b from-[#3b2c1d] to-[#21170e] p-5 shadow-[0_30px_60px_rgb(0_0_0/0.7)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[40%/18%] bg-[#0d100e] shadow-[inset_0_0_60px_rgb(0_0_0/0.9)]">
          {static_ ? (
            <div className="tv-static absolute inset-0" />
          ) : (
            <a
              href={c.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="tv-on absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center"
            >
              <span className="font-typewriter text-xs text-[#cfe8d0]/70">CH {ch + 1}</span>
              <span className="font-oswald text-4xl font-bold uppercase tracking-wide text-[#e6f5e6] md:text-5xl">{c.label}</span>
              <span className="break-all font-typewriter text-sm text-[#cfe8d0]/80">{c.sub}</span>
            </a>
          )}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,rgb(0_0_0/0.25)_0_1px,transparent_1px_3px)]" />
        </div>
      </div>
      {/* dial */}
      <div className="flex flex-row flex-wrap justify-center gap-2 md:w-32 md:flex-col">
        {channels.map((x, i) => (
          <button
            key={x.label}
            type="button"
            onClick={() => flip(i)}
            aria-pressed={ch === i}
            className={cn(
              "border px-3 py-2 font-oswald text-sm uppercase tracking-wider transition-colors",
              ch === i ? "border-[#e9dfa5] bg-[#e9dfa5] text-black" : "border-[#e9dfa5]/40 text-[#e9dfa5] hover:border-[#e9dfa5]"
            )}
          >
            CH {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

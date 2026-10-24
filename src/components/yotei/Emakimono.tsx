"use client";

import Hanko from "@/components/yotei/Hanko";
import { personalInfo } from "@/data";
import Link from "next/link";
import { useEffect, useRef } from "react";

// A horizontal hand scroll. Scrolling down unrolls it sideways, the way an
// emakimono is read from right to left... except this one reads left to right.

const Ink = ({ children, viewBox = "0 0 300 300", className }: { children: React.ReactNode; viewBox?: string; className?: string }) => (
  <svg viewBox={viewBox} aria-hidden className={className}>
    <defs>
      <filter id="brush">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="3" />
        <feDisplacementMap in="SourceGraphic" scale="6" />
      </filter>
    </defs>
    <g filter="url(#brush)" fill="none" stroke="var(--ink)" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  </svg>
);

const scenes = [
  {
    key: "hello",
    art: null,
    body: (
      <div className="flex h-full items-center gap-10 md:gap-16">
        <p lang="ja" aria-hidden className="font-mincho text-3xl tracking-[0.4em] text-ink-soft/60 [writing-mode:vertical-rl] md:text-4xl">
          はじめまして
        </p>
        <div>
          <p className="font-mincho text-[clamp(3.5rem,9vw,8.5rem)] font-extrabold leading-[0.95] tracking-tight">
            Hey,
            <br />
            I&apos;m Ayush.
          </p>
          <p className="mt-6 max-w-sm text-lg text-ink-soft">
            Keep scrolling and I&apos;ll unroll the rest of my story for you.
          </p>
        </div>
        <Hanko className="size-14 self-end text-4xl" />
      </div>
    ),
  },
  {
    key: "craft",
    art: (
      <Ink className="h-[42vh] w-auto">
        {/* mountain in three strokes, sun, mist */}
        <path d="M20 250 C 90 180 120 90 150 70 C 180 90 210 180 280 250" strokeWidth="9" />
        <path d="M118 112 C 135 120 160 122 182 112" strokeWidth="5" />
        <path d="M40 270 C 110 262 190 266 270 258" strokeWidth="3" opacity="0.6" />
        <circle cx="230" cy="70" r="26" fill="var(--crimson)" stroke="none" />
      </Ink>
    ),
    body: (
      <p className="max-w-md font-mincho text-2xl leading-[1.7] md:text-3xl">
        I&apos;m a full stack developer. I like to build things all the way
        through, from the database at the bottom of the mountain to the last
        pixel at the top.
      </p>
    ),
  },
  {
    key: "now",
    art: (
      <Ink className="h-[42vh] w-auto">
        {/* a hanging lantern: Beacon */}
        <path d="M150 20 V 70" strokeWidth="3" />
        <path d="M110 80 h80 M115 230 h70" strokeWidth="8" />
        <path d="M112 84 C 80 130 80 180 116 226 M188 84 C 220 130 220 180 184 226" strokeWidth="6" />
        <path d="M130 90 C 118 140 118 170 132 220 M170 90 C 182 140 182 170 168 220" strokeWidth="2.5" opacity="0.6" />
        <circle cx="150" cy="155" r="22" fill="var(--crimson)" stroke="none" opacity="0.85" />
        <path d="M150 232 v 30 M140 262 h20" strokeWidth="3" />
      </Ink>
    ),
    body: (
      <p className="max-w-md font-mincho text-2xl leading-[1.7] md:text-3xl">
        Right now I&apos;m building{" "}
        <Link href={personalInfo.currentProject.href} target="_blank" rel="noopener noreferrer" className="text-crimson underline decoration-1 underline-offset-[6px]">
          Beacon
        </Link>
        . It&apos;s a lantern for the web: it finds accessibility problems so
        nobody gets left in the dark.
      </p>
    ),
  },
  {
    key: "life",
    art: (
      <Ink className="h-[38vh] w-auto" viewBox="0 0 360 300">
        {/* book */}
        <path d="M20 200 C 60 186 90 190 110 204 C 130 190 160 186 200 200 V 120 C 160 106 130 110 110 124 C 90 110 60 106 20 120 Z" strokeWidth="5" />
        <path d="M110 124 V 204" strokeWidth="3" />
        {/* headphones */}
        <path d="M230 120 C 230 60 330 60 330 120" strokeWidth="6" />
        <path d="M222 118 h18 v44 h-18 Z M320 118 h18 v44 h-18 Z" strokeWidth="5" fill="var(--ink)" />
        {/* controller */}
        <path d="M150 250 C 120 250 112 290 132 292 C 146 293 152 278 166 276 H 214 C 228 278 234 293 248 292 C 268 290 260 250 230 250 Z" strokeWidth="5" />
        <path d="M150 262 v 12 M144 268 h 12" strokeWidth="3" />
        <circle cx="228" cy="264" r="3" fill="var(--crimson)" stroke="none" />
        <circle cx="238" cy="272" r="3" fill="var(--crimson)" stroke="none" />
      </Ink>
    ),
    body: (
      <p className="max-w-md font-mincho text-2xl leading-[1.7] md:text-3xl">
        When I close the laptop, it&apos;s side projects, a book, some music,
        and games. Lots of games. That&apos;s why you picked a world to get
        here.
      </p>
    ),
  },
  {
    key: "onward",
    art: null,
    body: (
      <div className="flex h-full flex-col justify-center">
        <p className="max-w-lg font-mincho text-[clamp(2.2rem,5vw,4.2rem)] font-bold leading-[1.15]">
          That&apos;s me, so far.
          <br />
          <span className="text-ink-soft">Now let me show you what I&apos;ve made.</span>
        </p>
      </div>
    ),
  },
];

export default function Emakimono() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const tr = track.current;
    if (!el || !tr) return;
    let frame = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      const distance = tr.scrollWidth - window.innerWidth;
      tr.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      el.style.setProperty("--unroll", progress.toFixed(3));
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={section} id="scroll" aria-label="About me" className="relative h-[460vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        {/* rollers */}
        <div aria-hidden className="emaki-roller" />
        <div className="emaki-paper relative h-[78svh] overflow-hidden">
          <div ref={track} className="flex h-full w-max items-stretch will-change-transform">
            {scenes.map((s) => (
              <div key={s.key} className="flex h-full w-[100vw] shrink-0 items-center gap-10 px-8 md:w-[78vw] md:px-20">
                {s.art && <div className="hidden shrink-0 sm:block">{s.art}</div>}
                <div className={s.art ? "" : "w-full"}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
        <div aria-hidden className="emaki-roller" />
        {/* progress, like the remaining length of scroll */}
        <div aria-hidden className="mx-auto mt-4 h-px w-40 bg-line">
          <div className="h-px origin-left bg-crimson" style={{ transform: "scaleX(var(--unroll, 0))" }} />
        </div>
      </div>
    </section>
  );
}

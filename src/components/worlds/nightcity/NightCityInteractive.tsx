"use client";

import { personalInfo, socialLinks } from "@/data";
import { audio } from "@/lib/audio/manager";
import { seeded } from "@/lib/seeded";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ——— Dialogue: the visitor asks, I answer ——— */

const topics = [
  {
    q: "So who are you?",
    a: "I'm Ayush. Full stack developer. I take a feature from the database all the way to the screen you're looking at, and I care about every layer in between.",
    trait: "Honest",
  },
  {
    q: "What do you actually build?",
    a: "Web apps, mostly. React and Next.js up front, Spring Boot and Node behind them. Right now that's healthcare software at agilon Health, where my work moved real numbers.",
    trait: "Driven",
  },
  {
    q: "What are you working on right now?",
    a: "Beacon. It scans websites for accessibility problems and helps teams fix them, so nobody gets locked out of the net. It's still in progress, and I'm proud of it.",
    trait: "Empathetic",
  },
  {
    q: "What do you do when you're offline?",
    a: "Side projects, books, music. And games. Clearly. You walked through a world select screen to get here.",
    trait: "Playful",
  },
];

export function Dialogue() {
  const [asked, setAsked] = useState<number[]>([]);
  const current = asked.at(-1);
  const persuasion = asked.length / topics.length;

  const ask = (i: number) => {
    setAsked((a) => (a.includes(i) ? [...a.filter((x) => x !== i), i] : [...a, i]));
    audio.sfx("glitch");
  };

  return (
    <div data-scan="Social enhancer // conversation" className="grid gap-6 md:grid-cols-[260px_1fr]">
      {/* personality profile */}
      <aside className="nc-clip border border-[var(--nc-gold)]/40 bg-[#140d04]/85 p-5 font-tech text-xs text-[var(--nc-gold)]">
        <p>SOCIAL ENHANCER</p>
        <p className="mt-1 text-[#d8f6ff]/60">Subject: A. Maurya. Class: Netrunner (full stack)</p>
        <div className="mt-5">
          <p>PERSUASION</p>
          <div className="mt-2 flex gap-1">
            {topics.map((_, i) => (
              <span key={i} className={cn("h-3 flex-1 skew-x-[-20deg] transition-colors duration-500", i < asked.length ? "bg-[var(--nc-gold)]" : "bg-[var(--nc-gold)]/15")} />
            ))}
          </div>
          <p className="mt-2 text-[#d8f6ff]/60">
            {persuasion === 1 ? "Fully persuaded. Open a channel below." : persuasion > 0 ? "Keep talking." : "Ask a question."}
          </p>
        </div>
        <div className="mt-5 space-y-1">
          <p>TRAITS DETECTED</p>
          {topics.map((t, i) => (
            <p key={t.trait} className={cn("transition-opacity", asked.includes(i) ? "opacity-100" : "opacity-20")}>
              ▸ {t.trait}
            </p>
          ))}
        </div>
        <div className="mt-5">
          <p>STATUS</p>
          <p className="mt-1 font-rajdhani text-lg font-bold text-[var(--nc-yellow)]">Online, open to gigs</p>
        </div>
      </aside>

      <div className="flex min-h-[460px] flex-col justify-between gap-8">
        {/* subtitle */}
        <div aria-live="polite" className="flex flex-1 items-center">
          {current === undefined ? (
            <p className="font-rajdhani text-[clamp(2.5rem,6vw,5.5rem)] font-bold uppercase italic leading-[0.95] text-[#d8f6ff]/25">
              Go ahead.
              <br />
              Ask me anything.
            </p>
          ) : (
            <div key={current} className="nc-subtitle">
              <p className="font-tech text-sm text-[var(--nc-cyan)]">AYUSH:</p>
              <p className="mt-2 max-w-3xl font-rajdhani text-2xl font-medium leading-snug md:text-[2.1rem]">{topics[current].a}</p>
            </div>
          )}
        </div>
        {/* dialogue options */}
        <ol className="space-y-1.5">
          {topics.map((t, i) => (
            <li key={t.q}>
              <button
                type="button"
                onClick={() => ask(i)}
                className={cn(
                  "group flex w-full items-center gap-4 border-l-4 px-4 py-2.5 text-left font-rajdhani text-xl font-semibold transition-colors",
                  current === i
                    ? "border-[var(--nc-yellow)] bg-[var(--nc-yellow)] text-black"
                    : "border-[var(--nc-gold)]/40 bg-black/40 hover:border-[var(--nc-yellow)] hover:bg-[var(--nc-yellow)]/10",
                  asked.includes(i) && current !== i && "text-[#d8f6ff]/45"
                )}
              >
                <span className="font-tech text-sm opacity-70">{i + 1}</span>
                {t.q}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ——— Breach Protocol: crack it to reveal my contact details ——— */

const CODES = ["1C", "55", "BD", "E9", "7A"];
const SIZE = 5;
const BUFFER = 6;

const buildPuzzle = () => {
  const rand = seeded(2077);
  const grid = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => CODES[Math.floor(rand() * CODES.length)]));
  // Carve a guaranteed solution: row 0, then alternate column / row.
  const path: [number, number][] = [];
  let row = 0;
  let col = Math.floor(rand() * SIZE);
  path.push([row, col]);
  for (let i = 1; i < BUFFER; i++) {
    const used = (r: number, c: number) => path.some(([pr, pc]) => pr === r && pc === c);
    if (i % 2 === 1) {
      let r = Math.floor(rand() * SIZE);
      while (r === row || used(r, col)) r = (r + 1) % SIZE;
      row = r;
    } else {
      let c = Math.floor(rand() * SIZE);
      while (c === col || used(row, c)) c = (c + 1) % SIZE;
      col = c;
    }
    path.push([row, col]);
  }
  const solution = path.map(([r, c]) => grid[r][c]);
  return {
    grid,
    daemons: [
      { name: "OPEN_CHANNEL", seq: solution.slice(0, 3), reward: "email" as const },
      { name: "DATAMINE_SCHEDULE", seq: solution.slice(3, 6), reward: "call" as const },
    ],
  };
};

const puzzle = buildPuzzle();

const containsSeq = (buffer: string[], seq: string[]) => {
  for (let i = 0; i + seq.length <= buffer.length; i++) {
    if (seq.every((s, j) => buffer[i + j] === s)) return true;
  }
  return false;
};

export function BreachProtocol() {
  const { grid, daemons } = puzzle;
  const [picks, setPicks] = useState<[number, number][]>([]);
  const [hover, setHover] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);

  const buffer = picks.map(([r, c]) => grid[r][c]);
  const solved = daemons.map((d) => skipped || containsSeq(buffer, d.seq));
  const full = picks.length >= BUFFER;
  const axis = picks.length % 2 === 0 ? "row" : "col";
  const [lr, lc] = picks.at(-1) ?? [0, 0];

  const allowed = (r: number, c: number) => {
    if (full || picks.some(([pr, pc]) => pr === r && pc === c)) return false;
    if (picks.length === 0) return r === 0;
    return axis === "row" ? r === lr : c === lc;
  };

  const pick = (r: number, c: number) => {
    if (!allowed(r, c)) return;
    setPicks((p) => [...p, [r, c]]);
    audio.sfx("glitch");
  };

  const solvedCount = solved.filter(Boolean).length;
  useEffect(() => {
    if (solvedCount > 0 && !skipped) audio.sfx("slash");
  }, [solvedCount, skipped]);

  return (
    <div data-scan="Access point // breach protocol" className="grid gap-8 lg:grid-cols-[auto_1fr]">
      <div className="nc-clip border border-[var(--nc-yellow)]/40 bg-black/70 p-5">
        <p className="font-tech text-xs text-[var(--nc-yellow)]">CODE MATRIX</p>
        <div
          role="grid"
          aria-label="Code matrix"
          className="mt-4 grid grid-cols-5 gap-1"
          onMouseLeave={() => setHover(null)}
        >
          {grid.map((row, r) =>
            row.map((code, c) => {
              const used = picks.findIndex(([pr, pc]) => pr === r && pc === c);
              const ok = allowed(r, c);
              const inLine = !full && (picks.length === 0 ? r === 0 : axis === "row" ? r === lr : c === lc);
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  role="gridcell"
                  disabled={!ok}
                  onClick={() => pick(r, c)}
                  onMouseEnter={() => setHover(code)}
                  className={cn(
                    "grid size-12 place-items-center font-tech text-lg transition-colors md:size-14",
                    inLine && "bg-[var(--nc-yellow)]/10",
                    ok ? "text-[#d8f6ff] hover:bg-[var(--nc-yellow)] hover:text-black" : "text-[#d8f6ff]/25",
                    used >= 0 && "!bg-transparent !text-[var(--nc-cyan)] line-through"
                  )}
                >
                  {code}
                </button>
              );
            })
          )}
        </div>
        <p className="mt-4 font-tech text-xs text-[#d8f6ff]/50">
          {picks.length === 0 ? "Start anywhere in the top row." : full ? "Buffer full." : `Next: pick from the highlighted ${axis === "row" ? "row" : "column"}.`}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <p className="font-tech text-xs text-[var(--nc-yellow)]">BUFFER</p>
          <div className="mt-2 flex gap-1.5">
            {Array.from({ length: BUFFER }, (_, i) => (
              <span key={i} className="grid size-11 place-items-center border border-dashed border-[var(--nc-yellow)]/40 font-tech text-[var(--nc-cyan)]">
                {buffer[i] ?? ""}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-tech text-xs text-[var(--nc-yellow)]">DAEMONS</p>
          <ul className="mt-2 space-y-2">
            {daemons.map((d, i) => (
              <li key={d.name} className={cn("flex flex-wrap items-center gap-3 border-l-4 px-3 py-2", solved[i] ? "border-[var(--nc-cyan)] bg-[var(--nc-cyan)]/10" : "border-[var(--nc-yellow)]/40 bg-black/40")}>
                <span className="flex gap-1.5 font-tech">
                  {d.seq.map((s, j) => (
                    <span key={j} className={cn("px-1", hover === s && !solved[i] && "bg-[var(--nc-yellow)] text-black")}>
                      {s}
                    </span>
                  ))}
                </span>
                <span className="font-rajdhani text-lg font-bold">{d.name}</span>
                {solved[i] && <span className="font-tech text-xs text-[var(--nc-cyan)]">UPLOADED</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* rewards */}
        <div className="flex flex-wrap gap-3 font-rajdhani text-xl font-bold uppercase italic">
          {solved[0] ? (
            <Link href={`mailto:${personalInfo.email}`} className="nc-clip-sm nc-reward bg-[var(--nc-yellow)] px-6 py-3 text-black hover:bg-[var(--nc-cyan)]">
              Message me: {personalInfo.email}
            </Link>
          ) : (
            <span className="nc-clip-sm border border-[var(--nc-yellow)]/20 px-6 py-3 text-[#d8f6ff]/30">Email locked</span>
          )}
          {solved[1] ? (
            <Link href={personalInfo.calendarLink} target="_blank" rel="noopener noreferrer" className="nc-clip-sm nc-reward border-2 border-[var(--nc-cyan)] px-6 py-3 text-[var(--nc-cyan)] hover:bg-[var(--nc-cyan)] hover:text-black">
              Book a call
            </Link>
          ) : (
            <span className="nc-clip-sm border border-[var(--nc-cyan)]/20 px-6 py-3 text-[#d8f6ff]/30">Calendar locked</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-5 font-tech text-sm">
          <button type="button" onClick={() => setPicks([])} className="text-[var(--nc-yellow)] underline underline-offset-4">
            Reset breach
          </button>
          <button type="button" onClick={() => setSkipped(true)} className="text-[#d8f6ff]/60 underline underline-offset-4 hover:text-[#d8f6ff]">
            Skip the puzzle, just show me
          </button>
          {socialLinks.map((s) => (
            <Link key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[var(--nc-cyan)] hover:text-[var(--nc-yellow)]">
              {s.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ——— Kiroshi scanner: press Q to tag everything on screen ——— */

export function Scanner() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "q" && !e.metaKey && !e.ctrlKey) setOn((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (on) audio.sfx("glitch");
    document.documentElement.classList.toggle("scanning", on);
    return () => document.documentElement.classList.remove("scanning");
  }, [on]);

  return (
    <>
      <div aria-hidden className="scan-overlay pointer-events-none fixed inset-0 z-40" />
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        className="nc-clip-sm fixed bottom-4 right-4 z-50 flex h-11 items-center gap-2 border border-[var(--nc-cyan)] bg-black/80 px-4 font-rajdhani text-base font-bold uppercase italic text-[var(--nc-cyan)] md:bottom-6 md:right-6"
      >
        {on ? "Scanning" : "Scan"}
        <kbd className="sel-key !h-5 !min-w-5 !text-[10px]">Q</kbd>
      </button>
    </>
  );
}


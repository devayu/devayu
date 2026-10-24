"use client";

import { personalInfo } from "@/data";
import { audio } from "@/lib/audio/manager";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

// Like composing a haiku at a shrine: pick one line at a time, 5-7-5.
const lines = [
  ["A quiet commit", "Morning standup ends", "Snow on Yōtei's peak"],
  ["the build turns green at first light", "a bug hides beneath the leaves", "wind carries my pull request"],
  ["we ship it, then rest", "the tests all pass now", "let's build something, friend"],
];

export default function Haiku() {
  const [picks, setPicks] = useState<(number | null)[]>([null, null, null]);
  const done = picks.every((p) => p !== null);
  const poem = picks.map((p, i) => (p === null ? null : lines[i][p]));
  const mail = `mailto:${personalInfo.email}?subject=${encodeURIComponent("A haiku for you")}&body=${encodeURIComponent(
    `${poem.join("\n")}\n\n`
  )}`;

  return (
    <section aria-labelledby="haiku-heading" className="px-6 py-28 md:px-12 lg:px-24">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1.3fr_1fr] md:gap-20">
        <div>
          <h2 id="haiku-heading" className="font-mincho text-5xl font-extrabold md:text-7xl">
            Write me a haiku
          </h2>
          <p className="mt-4 max-w-md text-lg text-ink-soft">
            Before you go, pick a line for each part. I&apos;ll get it in my inbox
            if you send it, and I read every one.
          </p>
          <ol className="mt-10 space-y-8">
            {lines.map((options, i) => (
              <li key={i}>
                <p className="text-sm text-ink-soft">{["Five syllables", "Seven syllables", "Five again"][i]}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {options.map((line, j) => (
                    <button
                      key={line}
                      type="button"
                      onClick={() => {
                        setPicks((p) => p.map((v, k) => (k === i ? j : v)));
                        audio.sfx("type");
                      }}
                      aria-pressed={picks[i] === j}
                      className={cn(
                        "rounded-full border px-4 py-2 font-mincho transition-[background-color,color,border-color,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-95",
                        picks[i] === j
                          ? "border-crimson bg-crimson text-paper"
                          : "border-line hover:-translate-y-0.5 hover:border-crimson/60"
                      )}
                    >
                      {line}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* the tanzaku: a paper strip the poem is written on */}
        <div className="flex flex-col items-center gap-8">
          <div className="tanzaku relative flex h-[440px] w-36 justify-center rounded-sm py-10 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.4)]">
            <span aria-hidden className="absolute -top-6 left-1/2 h-6 w-px bg-crimson" />
            <p className="flex gap-4 font-mincho text-lg leading-loose text-[#1b2129] [writing-mode:vertical-rl]">
              {poem.map((l, i) => (
                <span key={i} className={cn("transition-opacity duration-500", l ? "opacity-100" : "opacity-20")}>
                  {l ?? "　·　·　·"}
                </span>
              ))}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={done ? mail : "#haiku-heading"}
              aria-disabled={!done}
              className={cn(
                "rounded-full px-6 py-3 font-medium transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                done ? "bg-crimson text-paper hover:-translate-y-0.5" : "pointer-events-none bg-ink/10 text-ink-soft"
              )}
            >
              {done ? "Send it to me" : "Pick all three lines"}
            </Link>
            <Link
              href={personalInfo.calendarLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-6 py-3 transition-colors hover:border-crimson hover:text-crimson"
            >
              Or book a call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

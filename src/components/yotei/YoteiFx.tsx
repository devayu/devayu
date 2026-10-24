"use client";

import { audio } from "@/lib/audio/manager";
import { useEffect, useState } from "react";

// "Follow the wind": a gust sweeps across and carries you down the page.
export function FollowWind() {
  const [gust, setGust] = useState(0);
  const follow = () => {
    setGust((g) => g + 1);
    audio.sfx("slash");
    window.setTimeout(() => document.getElementById("scroll")?.scrollIntoView({ behavior: "smooth" }), 350);
  };
  return (
    <>
      <button
        type="button"
        onClick={follow}
        className="ink-in group absolute bottom-[34vh] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-ink md:bottom-[38vh] md:left-[24%]"
        style={{ animationDelay: "2.4s" }}
      >
        <svg viewBox="0 0 120 40" aria-hidden className="w-24 transition-transform duration-500 group-hover:translate-x-2">
          <path d="M4 14 C 30 6 60 22 96 12 C 108 9 114 16 106 22 C 100 26 94 20 98 17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 28 C 40 22 70 34 100 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </svg>
        <span className="font-mincho text-xl font-semibold">Follow the wind</span>
      </button>
      {gust > 0 && <div key={gust} aria-hidden className="wind-gust pointer-events-none fixed inset-0 z-40" />}
    </>
  );
}

// Kurosawa mode: black and white, film grain, letterbox. Press K.
export function KurosawaMode() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && !e.metaKey && !e.ctrlKey) setOn((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("kurosawa", on);
    return () => document.documentElement.classList.remove("kurosawa");
  }, [on]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        className="fixed bottom-4 right-4 z-50 flex h-11 items-center gap-2 rounded-full border border-line bg-paper/75 px-4 font-mincho text-sm backdrop-blur-md transition-transform hover:-translate-y-0.5 md:bottom-6 md:right-6"
      >
        {on ? "Leave Kurosawa mode" : "Kurosawa mode"}
        <kbd className="sel-key !h-5 !min-w-5 !text-[10px]">K</kbd>
      </button>
      <div aria-hidden className="kurosawa-bars pointer-events-none fixed inset-0 z-40" />
    </>
  );
}

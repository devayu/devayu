"use client";

import { worldArt } from "@/components/worlds/art";
import { worlds } from "@/data/worlds";

// "Press any key": the first gesture also unlocks the soundtrack.
export default function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-black text-[#ece8df]">
      <h1 className="sr-only">Ayush Maurya, full stack developer</h1>
      {/* four slivers of the four realities, drifting */}
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
        <span className="title-press font-oswald text-[clamp(2.6rem,9vw,7rem)] font-bold uppercase leading-none tracking-[0.06em]">
          Press any key
        </span>
        <span className="max-w-sm font-sans text-sm leading-relaxed text-[#ece8df]/65">
          Four realities, one person. Scroll through them and each one tells you a
          different part of who I am. There&apos;s music, so turn your sound up.
        </span>
      </button>
      <button type="button" onClick={onStart} aria-hidden tabIndex={-1} className="absolute inset-0 z-0 cursor-pointer" />
    </main>
  );
}

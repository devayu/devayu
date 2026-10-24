"use client";

import Highlight from "@/components/Highlight";
import { getFeaturedProjects, workExperience } from "@/data";
import { audio } from "@/lib/audio/manager";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Six names painted on a white sash. The finished ones carry a crimson stroke
// through them. The last space is left blank for whoever is reading.

type Entry =
  | { kind: "project"; id: string; name: string; done: boolean; project: ReturnType<typeof getFeaturedProjects>[number] }
  | { kind: "work"; id: string; name: string; done: boolean; work: (typeof workExperience)[number] }
  | { kind: "you"; id: string; name: string; done: false };

const entries: Entry[] = [
  ...getFeaturedProjects().map((p) => ({
    kind: "project" as const,
    id: p.id,
    name: p.title.replace(" Landing Website", ""),
    done: p.status === "completed",
    project: p,
  })),
  { kind: "work", id: workExperience[0].id, name: workExperience[0].location, done: false, work: workExperience[0] },
  { kind: "you", id: "you", name: "", done: false },
];

// The finished names, in the order they get cut.
const cutOrder = entries.flatMap((e, i) => (e.done ? [i] : []));

export default function Sash() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const entry = entries[selected];

  useEffect(() => {
    if (!shown) return;
    const timers = cutOrder.map((_, n) => window.setTimeout(() => audio.sfx("slash"), 500 + n * 450 + 120));
    return () => timers.forEach(window.clearTimeout);
  }, [shown]);

  return (
    <section aria-labelledby="sash-heading" className="relative px-6 py-28 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <h2 id="sash-heading" className="font-mincho text-5xl font-extrabold md:text-7xl">
          The six
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
          Atsu painted six names on her sash. I did the same with the things I
          set out to build. The ones I&apos;ve finished get cut. Tap a name and
          I&apos;ll tell you about it.
        </p>
      </div>

      {/* the sash, bleeding off both edges of the page */}
      <div ref={ref} className="relative -mx-6 mt-14 md:-mx-12 lg:-mx-24">
        <div className="sash relative mx-auto grid grid-cols-3 md:grid-cols-6">
          {entries.map((e, i) => (
            <button
              key={e.id}
              type="button"
              onClick={() => {
                setSelected(i);
                audio.sfx("slash");
              }}
              aria-pressed={selected === i}
              className={cn(
                "group relative flex min-h-[220px] items-center justify-center py-8 transition-colors md:min-h-[300px]",
                selected === i ? "bg-ink/[0.06]" : "hover:bg-ink/[0.03]"
              )}
            >
              {e.done ? (
                // A finished name gets cut: a flash of steel, the name splits
                // along the blade's path, and a smear of red is left behind.
                <span
                  className={cn("sash-cut relative grid place-items-center", shown && "is-cut")}
                  style={{ ["--d" as string]: `${0.5 + cutOrder.indexOf(i) * 0.45}s` }}
                >
                  <span aria-hidden className="sash-blood" />
                  <span className="sash-half sash-half-a font-mincho text-2xl font-extrabold tracking-[0.15em] text-[#1b2129] [writing-mode:vertical-rl] md:text-3xl">
                    {e.name}
                  </span>
                  <span aria-hidden className="sash-half sash-half-b font-mincho text-2xl font-extrabold tracking-[0.15em] text-[#1b2129] [writing-mode:vertical-rl] md:text-3xl">
                    {e.name}
                  </span>
                  <span aria-hidden className="sash-flash" />
                </span>
              ) : (
                <span
                  className={cn(
                    "font-mincho text-2xl font-extrabold tracking-[0.15em] text-[#1b2129] [writing-mode:vertical-rl] md:text-3xl",
                    e.kind === "you" && "text-[#1b2129]/30"
                  )}
                >
                  {e.kind === "you" ? "あなた?" : e.name}
                </span>
              )}
              {selected === i && <span aria-hidden className="absolute bottom-3 size-1.5 rounded-full bg-[#b0182e]" />}
            </button>
          ))}
        </div>
      </div>

      {/* what the selected name means */}
      <div className="mx-auto mt-12 max-w-6xl" aria-live="polite">
        <div key={entry.id} className="ink-in grid gap-6 md:grid-cols-[1fr_1.4fr] md:gap-16">
          {entry.kind === "project" && (
            <>
              <div>
                <p className="text-sm text-ink-soft">
                  {entry.project.year}, {entry.done ? "finished" : "still in progress"}
                </p>
                <h3 className="mt-1 font-mincho text-4xl font-bold">{entry.project.title}</h3>
              </div>
              <div>
                <p className="font-mincho text-xl leading-relaxed">{entry.project.description}</p>
                <p className="mt-3 text-ink-soft">Built with {entry.project.techStack.join(", ")}.</p>
                <div className="mt-5 flex gap-5">
                  {entry.project.githubLink && (
                    <Link href={entry.project.githubLink} target="_blank" rel="noopener noreferrer" className="underline decoration-crimson/50 underline-offset-4 hover:text-crimson">
                      See the code
                    </Link>
                  )}
                  {entry.project.liveLink && (
                    <Link href={entry.project.liveLink} target="_blank" rel="noopener noreferrer" className="underline decoration-crimson/50 underline-offset-4 hover:text-crimson">
                      Visit the site
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
          {entry.kind === "work" && (
            <>
              <div>
                <p className="text-sm text-ink-soft">{entry.work.yearString}</p>
                <h3 className="mt-1 font-mincho text-4xl font-bold">{entry.work.location}</h3>
                <p className="text-ink-soft">{entry.work.title}</p>
              </div>
              <ul className="space-y-3 font-mincho text-xl leading-relaxed">
                {entry.work.description.map((d, i) => (
                  <li key={i}>
                    <Highlight text={d} />
                  </li>
                ))}
                {workExperience.slice(1).map((w) => (
                  <li key={w.id} className="text-base text-ink-soft">
                    On the side, I freelanced for {w.location} in {w.yearString}. <Highlight text={w.description[1] ?? ""} />
                  </li>
                ))}
              </ul>
            </>
          )}
          {entry.kind === "you" && (
            <>
              <h3 className="font-mincho text-4xl font-bold">This one&apos;s blank on purpose.</h3>
              <p className="font-mincho text-xl leading-relaxed">
                Maybe the next name is yours: a team, a project, an idea we
                build together. Write me a haiku below, or just say hello.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

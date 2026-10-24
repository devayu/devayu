import Highlight from "@/components/Highlight";
import { BreachProtocol, Dialogue, Scanner } from "@/components/worlds/nightcity/NightCityInteractive";
import NightCityStreet from "@/components/worlds/nightcity/NightCityStreet";
import Reveal from "@/components/worlds/Reveal";
import WorldSwitch from "@/components/worlds/WorldSwitch";
import WorldTheme from "@/components/worlds/WorldTheme";
import { getFeaturedProjects, skills, workExperience } from "@/data";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Night City",
  description: "Ayush Maurya's portfolio as a netrunner's HUD: a conversation, augmentations, gigs and a breach protocol.",
};

const bootLines = [
  "> establishing uplink ............ ok",
  "> neural handshake ............... ok",
  "> decrypting personal shard ...... ok",
  "> rendering city ................. ok",
  "> welcome in, choom",
];

// Where each skill would sit if it were an augmentation.
const slots = ["Cranium", "Eyes", "Torso", "Arms", "Hands", "Back", "Legs", "Skin", "Nervous system"];

const Heading = ({ kicker, children }: { kicker: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <p className="font-tech text-xs text-[var(--nc-cyan)]">{kicker}</p>
    <h2 className="mt-1 font-rajdhani text-[clamp(2.6rem,7vw,6rem)] font-bold uppercase italic leading-[0.9] tracking-wide text-[var(--nc-yellow)]">
      {children}
    </h2>
  </div>
);

export default function NightCityPage() {
  const projects = getFeaturedProjects();

  return (
    <div className="nc-root relative min-h-screen font-rajdhani text-[#d8f6ff]">
      <WorldTheme slug="night-city" />
      <h1 className="sr-only">Ayush Maurya, full stack developer</h1>
      <div aria-hidden className="nc-hexbg pointer-events-none fixed inset-0" />
      <div aria-hidden className="nc-scanlines pointer-events-none fixed inset-0 z-40 opacity-50" />
      <Scanner />

      {/* Hero: boot sequence, then the city */}
      <section className="relative h-[100svh] min-h-[520px] overflow-hidden" data-scan="District // Watson, Kabuki">
        <div className="nc-city absolute inset-0">
          <NightCityStreet />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030305]" />
        <div aria-hidden className="nc-boot absolute inset-0 z-20 flex items-center bg-black px-6 md:px-16">
          <div className="font-tech text-sm text-[var(--nc-cyan)] md:text-lg">
            {bootLines.map((line, i) => (
              <p key={line} className="nc-boot-line" style={{ animationDelay: `${0.25 + i * 0.45}s` }}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* HUD */}
        <header className="relative z-10 flex items-center justify-between px-5 pt-5 font-tech text-sm md:px-10">
          <span className="text-[var(--nc-yellow)]">DEVAYU.NET</span>
          <WorldSwitch className="text-[var(--nc-cyan)] hover:text-[var(--nc-yellow)]">Disconnect</WorldSwitch>
        </header>
        <div className="nc-hud-in absolute right-5 top-20 z-10 w-64 border-l-2 border-[var(--nc-yellow)] bg-black/55 px-4 py-3 backdrop-blur-sm md:right-10" style={{ animationDelay: "3.2s" }}>
          <p className="font-tech text-[11px] text-[var(--nc-yellow)]">NEW GIG</p>
          <p className="mt-1 font-rajdhani text-xl font-bold uppercase leading-tight">Meet the netrunner</p>
          <p className="mt-2 flex items-center gap-2 font-tech text-xs text-[#d8f6ff]/80">
            <span className="inline-block size-2 rotate-45 border border-[var(--nc-yellow)]" />
            Scroll down to find him
          </p>
        </div>
        <div aria-hidden className="nc-hud-in pointer-events-none absolute left-1/2 top-[44%] z-10 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: "3.4s" }}>
          <div className="nc-reticle relative size-28 md:size-36">
            <span className="absolute left-0 top-0 size-5 border-l-2 border-t-2 border-[var(--nc-yellow)]" />
            <span className="absolute right-0 top-0 size-5 border-r-2 border-t-2 border-[var(--nc-yellow)]" />
            <span className="absolute bottom-0 left-0 size-5 border-b-2 border-l-2 border-[var(--nc-yellow)]" />
            <span className="absolute bottom-0 right-0 size-5 border-b-2 border-r-2 border-[var(--nc-yellow)]" />
            <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 bg-[var(--nc-red)]" />
          </div>
          <p className="mt-2 text-center font-tech text-[11px] text-[var(--nc-yellow)]">SCANNING ▸ PRESS Q</p>
        </div>
        <ul aria-hidden className="absolute left-5 top-24 z-10 hidden space-y-1.5 font-tech text-xs md:left-10 md:block">
          {["+1 VISITOR DETECTED", "STREET CRED +12", "SHARD ACQUIRED: AYUSH.PROFILE"].map((n, i) => (
            <li key={n} className="nc-hud-in w-fit bg-black/60 px-2 py-1 text-[var(--nc-cyan)]" style={{ animationDelay: `${3.6 + i * 0.6}s` }}>
              {n}
            </li>
          ))}
        </ul>
        <div className="nc-hud-in absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center font-rajdhani text-lg font-bold uppercase italic tracking-widest text-[var(--nc-yellow)]" style={{ animationDelay: "4s" }}>
          <p>Jack in</p>
          <p aria-hidden className="nc-chevron font-tech text-sm">▼</p>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-40 md:px-10">
        <section className="pt-10">
          <Heading kicker="// incoming call">Talk to me</Heading>
          <Dialogue />
        </section>

        <section className="mt-40">
          <Heading kicker="// installed">Augmentations</Heading>
          <p className="-mt-6 mb-10 max-w-lg text-lg text-[#d8f6ff]/70">
            Everything I&apos;ve got installed. All of it gets used every day.
          </p>
          <ul className="honeycomb" data-scan="Cyberware // 9 slots occupied">
            {skills.map((skill, i) => (
              <li key={skill} className="hex group" style={{ ["--i" as string]: i }}>
                <span className="font-tech text-[10px] text-[var(--nc-gold)] opacity-70 group-hover:opacity-100">{slots[i % slots.length]}</span>
                <span className="font-rajdhani text-xl font-bold uppercase leading-none md:text-2xl">{skill}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-40">
          <Heading kicker="// job board">Gigs</Heading>
          <ul className="divide-y divide-[var(--nc-cyan)]/20 border-y border-[var(--nc-cyan)]/20">
            {projects.map((p, i) => (
              <Reveal
                as="li"
                key={p.id}
                className="nc-reveal nc-gig"
                style={{ transitionDelay: `${i * 80}ms` }}
                data-scan={`Gig // ${p.status === "in-progress" ? "active" : "complete"}`}
              >
                <article className="grid gap-3 px-3 py-6 md:grid-cols-[120px_1fr_auto] md:items-center md:gap-8 md:px-5">
                  <p className="nc-dim font-tech text-sm text-[var(--nc-cyan)]">
                    {p.status === "in-progress" ? "ACTIVE" : "COMPLETE"}
                    <br />
                    {p.year}
                  </p>
                  <div>
                    <h3 className="font-rajdhani text-4xl font-bold uppercase leading-none md:text-5xl">{p.title}</h3>
                    <p className="nc-dim mt-2 max-w-2xl text-lg leading-snug text-[#d8f6ff]/75">{p.description}</p>
                    <p className="nc-dim mt-2 font-tech text-xs text-[#d8f6ff]/55">{p.techStack.join(" + ")}</p>
                  </div>
                  <div className="flex gap-4 font-tech text-sm">
                    {p.githubLink && (
                      <Link href={p.githubLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                        Source
                      </Link>
                    )}
                    {p.liveLink && (
                      <Link href={p.liveLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                        Live
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="mt-40">
          <Heading kicker="// memory">Neural log</Heading>
          <ol className="relative grid gap-6 md:grid-cols-2">
            {workExperience.map((w, i) => (
              <Reveal
                as="li"
                key={w.id}
                className={cn("nc-reveal nc-clip border-l-4 border-[var(--nc-red)] bg-[#12060a]/85 p-6 md:p-8", i === 1 && "md:mt-24")}
                data-scan={`Employer // ${w.location}`}
              >
                <p className="font-tech text-xs text-[var(--nc-red)]">{w.yearString}</p>
                <h3 className="mt-1 font-rajdhani text-4xl font-bold uppercase">{w.location}</h3>
                <p className="text-[#d8f6ff]/70">{w.title}</p>
                <ul className="mt-4 space-y-2 text-lg">
                  {w.description.map((d, j) => (
                    <li key={j} className="flex gap-3">
                      <span aria-hidden className="font-tech text-[var(--nc-red)]">&gt;</span>
                      <span>
                        <Highlight text={d} className="font-rajdhani font-bold text-[var(--nc-yellow)]" />
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="mt-40">
          <Heading kicker="// access point">Want my number? Breach for it.</Heading>
          <p className="-mt-6 mb-10 max-w-xl text-lg text-[#d8f6ff]/70">
            Pick codes from the matrix to upload the daemons. Start in the top row,
            then switch between column and row with each pick. Each daemon unlocks
            a way to reach me.
          </p>
          <BreachProtocol />
        </section>
      </main>
    </div>
  );
}

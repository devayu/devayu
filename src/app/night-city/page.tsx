import Highlight from "@/components/Highlight";
import { BreachProtocol, Dialogue, Scanner } from "@/components/worlds/nightcity/NightCityInteractive";
import HeadLook from "@/components/worlds/nightcity/HeadLook";
import HoloKoi from "@/components/worlds/nightcity/HoloKoi";
import NightCityCity from "@/components/worlds/nightcity/NightCityCity";
import Netrunner from "@/components/worlds/nightcity/Netrunner";
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

// Section headings echo the hero: black type on a slab of yellow. The
// section's system label only shows up when you scan.
const Heading = ({ kicker, children }: { kicker: string; children: React.ReactNode }) => (
  <Reveal className="nc-reveal mb-12" data-scan={kicker.replace("// ", "Section // ")}>
    <h2 className="nc-heading w-fit py-2 pl-4 pr-12 font-rajdhani text-[clamp(2.6rem,7vw,6rem)] font-bold uppercase italic leading-[0.9] tracking-wide text-black md:pl-6 md:pr-20">
      {children}
    </h2>
  </Reveal>
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

      {/* Hero: boot sequence, then the city, the yellow slab and the netrunner */}
      <section className="nc-hero relative h-[100svh] min-h-[560px] overflow-hidden" data-scan="District // Watson, Kabuki">
        <div className="nc-city nc-look absolute inset-0">
          <NightCityCity />
          <HoloKoi className="pointer-events-none absolute inset-0 h-full w-full" />
          <Netrunner className="nc-fig absolute bottom-0 right-[-14%] h-[58%] w-auto md:right-[3%] md:h-[86%]" />
        </div>
        <HeadLook target=".nc-look" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030305]" />
        <div aria-hidden className="nc-tear pointer-events-none absolute inset-0 z-[6]" />

        {/* the yellow slab: Cyberpunk's signature, cutting across the frame */}
        <div className="nc-slab absolute left-0 top-0 z-[8] flex h-[52%] w-[88vw] flex-col justify-between p-5 pt-16 text-black md:h-full md:w-[min(40vw,600px)] md:p-10 md:pt-24">
          <p lang="ja" aria-hidden className="nc-kata absolute right-[30%] top-6 font-rajdhani text-[clamp(1.4rem,3vw,2.6rem)] font-bold leading-none [writing-mode:vertical-rl] md:right-[26%] md:top-24">
            ナイトシティ
          </p>
          <p className="font-rajdhani text-[clamp(3.4rem,9vw,8.5rem)] font-bold uppercase italic leading-[0.82] tracking-tight">
            Night
            <br />
            City
          </p>
          <div className="hidden pb-24 md:block">
            <div className="space-y-1 font-tech text-xs">
              <p>DISTRICT // WATSON, KABUKI</p>
              <p>NETRUNNER ON DUTY</p>
            </div>
            {/* the gig, stamped onto the slab */}
            <div className="mt-5 w-fit max-w-[16rem] bg-black px-4 py-3 text-[var(--nc-yellow)] [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)]">
              <p className="font-tech text-[11px]">NEW GIG</p>
              <p className="mt-1 font-rajdhani text-xl font-bold uppercase leading-tight text-white">Meet the netrunner</p>
              <p className="mt-1 font-tech text-xs text-white/70">Scroll down to find him</p>
            </div>
            <div aria-hidden className="nc-barcode mt-4 h-8 w-40" />
          </div>
        </div>

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
        <div aria-hidden className="nc-frame pointer-events-none absolute inset-3 z-[9] md:inset-5">
          <span className="left-0 top-0 border-l-2 border-t-2" />
          <span className="right-0 top-0 border-r-2 border-t-2" />
          <span className="bottom-0 left-0 border-b-2 border-l-2" />
          <span className="bottom-0 right-0 border-b-2 border-r-2" />
        </div>
        <header className="relative z-10 flex items-center justify-between px-6 pt-6 font-tech text-sm md:px-12 md:pt-8">
          <span className="text-black">DEVAYU.NET</span>
          <WorldSwitch className="text-black hover:text-[var(--nc-red)] md:text-[var(--nc-cyan)] md:hover:text-[var(--nc-yellow)]">Disconnect</WorldSwitch>
        </header>
        <div className="nc-hud-in absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center font-rajdhani text-lg font-bold uppercase italic tracking-widest text-[var(--nc-yellow)]" style={{ animationDelay: "4s" }}>
          <p>Jack in</p>
          <p aria-hidden className="nc-chevron font-tech text-sm">▼</p>
        </div>
        <p aria-hidden className="absolute bottom-8 right-8 z-10 hidden font-tech text-[11px] text-[var(--nc-yellow)]/80 md:right-12 md:block">
          PRESS Q TO SCAN
        </p>
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
                className={cn("nc-reveal nc-clip border border-[var(--nc-red)]/35 bg-[#12060a]/85 p-6 md:p-8", i === 1 && "md:mt-24")}
                data-scan={`Employer // ${w.location}`}
              >
                <p className="w-fit bg-[var(--nc-red)] px-2 py-0.5 font-tech text-xs text-black">{w.yearString}</p>
                <h3 className="mt-3 font-rajdhani text-4xl font-bold uppercase">{w.location}</h3>
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

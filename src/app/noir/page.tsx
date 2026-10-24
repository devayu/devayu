import Highlight from "@/components/Highlight";
import { NoirHero } from "@/components/worlds/heroes";
import { NoirHud, NoirTv, PainkillerShelf, Typewriter } from "@/components/worlds/noir/NoirInteractive";
import RainGlass from "@/components/worlds/noir/RainGlass";
import Reveal from "@/components/worlds/Reveal";
import WorldSwitch from "@/components/worlds/WorldSwitch";
import WorldTheme from "@/components/worlds/WorldTheme";
import { getFeaturedProjects, skills, workExperience } from "@/data";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Noir",
  description: "Ayush Maurya's portfolio as a rain-soaked graphic novel.",
};

const Caption = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("noir-caption relative z-10 max-w-[34ch] px-3 py-2 text-[15px] leading-snug md:text-base", className)}>
    {children}
  </p>
);

const Chapter = ({ n, title }: { n: string; title: string }) => (
  <Reveal className="noir-panel mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 pb-10 pt-32 text-center md:pt-48">
    <span className="font-typewriter text-sm text-[#e9dfa5]/70">Chapter {n}</span>
    <h2 className="font-oswald text-[clamp(2.8rem,9vw,7rem)] font-bold uppercase leading-[0.9] tracking-[0.04em]">{title}</h2>
  </Reveal>
);

// A wall clock for the hero's inset panel.
const ClockArt = () => (
  <svg viewBox="0 0 120 120" className="block h-full w-full" aria-hidden>
    <rect width="120" height="120" fill="#0b0d10" />
    <circle cx="60" cy="60" r="40" fill="#d8d2c0" />
    <circle cx="60" cy="60" r="40" fill="none" stroke="#1a1d22" strokeWidth="5" />
    {Array.from({ length: 12 }, (_, i) => (
      <path key={i} d="M60 24 v6" stroke="#1a1d22" strokeWidth="2.5" transform={`rotate(${i * 30} 60 60)`} />
    ))}
    <path d="M60 60 L 66 38" stroke="#1a1d22" strokeWidth="4" strokeLinecap="round" />
    <path d="M60 60 L 82 66" stroke="#1a1d22" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M60 60 L 60 26" stroke="#a3121e" strokeWidth="1.2" className="noir-second" />
  </svg>
);

export default function NoirPage() {
  const projects = getFeaturedProjects();
  const [lead, ...rest] = projects;

  return (
    <div className="min-h-screen bg-[#060607] text-[#ece8df]">
      <WorldTheme slug="noir" />
      <h1 className="sr-only">Ayush Maurya, full stack developer</h1>
      <NoirHud />

      <div className="noir-page pb-32">
        <header className="mx-auto flex max-w-[1400px] items-center justify-between px-4 pt-5 font-typewriter text-sm text-[#e9dfa5] md:px-8">
          <span>devayu</span>
          <WorldSwitch className="hover:text-white" />
        </header>

        {/* Hero: a comic page, panels cut at an angle */}
        <section className="relative mx-auto mt-4 h-[86svh] min-h-[480px] max-w-[1400px] px-4 md:px-8">
          <div className="noir-cut relative h-full overflow-hidden border-2 border-[#d8d2c0] bg-[#0b0d10]">
            <NoirHero />
            <RainGlass source='[data-hero="noir"]' />
          </div>
          <div className="noir-inset absolute right-6 top-6 w-28 border-2 border-[#d8d2c0] shadow-[8px_8px_0_#000] md:right-14 md:top-10 md:w-44">
            <ClockArt />
          </div>
          <Caption className="noir-inset absolute bottom-[16%] left-8 md:left-16">
            Somewhere in the city. 3:12 AM. Still raining.
          </Caption>
        </section>

        {/* The monologue, with room to breathe */}
        <section aria-label="About me" className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="flex min-h-[80svh] items-center">
            <Typewriter
              text="I'm Ayush."
              speed={90}
              className="font-oswald text-[clamp(4.5rem,17vw,15rem)] font-bold uppercase leading-[0.85] tracking-tight"
            />
          </div>
          <div className="flex min-h-[70svh] items-center justify-end">
            <Typewriter
              text="Code is a loaded gun. Every commit is a bullet you can't take back. So I aim carefully, and I build the whole thing: the frontend you see, the backend you don't."
              className="max-w-2xl text-right font-typewriter text-2xl leading-relaxed md:text-4xl md:leading-snug"
            />
          </div>
          <div className="grid min-h-[70svh] items-center gap-10 md:grid-cols-[1fr_1.2fr]">
            <p className="font-oswald text-[clamp(3rem,8vw,6.5rem)] font-bold uppercase leading-[0.9] text-[#e9dfa5]">
              React up front.
              <br />
              <span className="text-[#ece8df]/40">Spring Boot in the back alley.</span>
            </p>
            <Typewriter
              text="Right now I'm working one case. Beacon: a tool that finds the accessibility problems nobody else wants to look at, before they lock somebody out."
              className="font-typewriter text-xl leading-relaxed text-[#ece8df]/85 md:text-2xl"
            />
          </div>
          <div className="flex min-h-[50svh] items-center justify-center">
            <Typewriter
              text="Off the clock: side projects, books, music. And games. A man needs something to drown out the rain."
              className="max-w-xl text-center font-typewriter text-xl text-[#ece8df]/60 md:text-2xl"
            />
          </div>
        </section>

        <Chapter n="One" title="Painkillers" />
        <section className="mx-auto max-w-6xl px-4 md:px-8">
          <p className="mx-auto mb-14 max-w-md text-center font-typewriter text-[#ece8df]/70">
            The tools that get me through the night. Go on, take one. I won&apos;t tell.
          </p>
          <PainkillerShelf skills={skills} />
        </section>

        <Chapter n="Two" title="Front page" />
        {/* Projects as the morning paper */}
        <section className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal className="noir-panel newspaper relative p-5 text-[#161412] shadow-[0_40px_80px_rgb(0_0_0/0.8)] md:p-10">
            <div className="border-b-4 border-double border-[#161412] pb-3 text-center">
              <p className="font-typewriter text-xs">Late city edition. Rain, then more rain.</p>
              <p className="font-oswald text-[clamp(2.6rem,9vw,6.5rem)] font-bold uppercase leading-none tracking-tight">The Daily Deploy</p>
            </div>
            <div className="mt-6 grid gap-8 md:grid-cols-[1.6fr_1fr]">
              <article className="md:border-r md:border-[#161412]/30 md:pr-8">
                <p className="font-typewriter text-xs uppercase">{lead.status === "in-progress" ? "Developing story" : "Closed case"}</p>
                <h3 className="mt-1 font-oswald text-4xl font-bold uppercase leading-[0.95] md:text-6xl">
                  {lead.title} takes on an inaccessible web
                </h3>
                <p className="mt-4 font-typewriter text-[15px] leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:font-oswald first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8]">
                  {lead.description} Sources close to the developer say it&apos;s built with {lead.techStack.join(", ")}, and
                  that he isn&apos;t done yet.
                </p>
                {lead.githubLink && (
                  <Link href={lead.githubLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block border-b-2 border-[#161412] font-oswald uppercase tracking-wider hover:bg-[#161412] hover:text-[#e8e0cc]">
                    Read the full story
                  </Link>
                )}
              </article>
              <div className="divide-y divide-[#161412]/30">
                {rest.map((p) => (
                  <article key={p.id} className="py-4 first:pt-0">
                    <h3 className="font-oswald text-2xl font-bold uppercase leading-none">{p.title}</h3>
                    <p className="mt-2 font-typewriter text-sm leading-relaxed">{p.description}</p>
                    <div className="mt-2 flex gap-4 font-oswald text-sm uppercase tracking-wider">
                      {p.githubLink && (
                        <Link href={p.githubLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:bg-[#161412] hover:text-[#e8e0cc]">
                          Code
                        </Link>
                      )}
                      {p.liveLink && (
                        <Link href={p.liveLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:bg-[#161412] hover:text-[#e8e0cc]">
                          Live
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <Chapter n="Three" title="The record" />
        <section className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-6 md:px-8">
          {workExperience.map((work, i) => (
            <Reveal
              key={work.id}
              className={cn(
                "noir-panel relative overflow-hidden border-2 border-[#d8d2c0] bg-[#111316] p-5 md:p-8",
                i === 0 ? "md:col-span-4" : "md:col-span-2"
              )}
            >
              <p className="font-oswald text-4xl font-bold text-[#e9dfa5]/90 md:text-5xl">{work.yearString}</p>
              <p className="mt-3 font-oswald text-2xl uppercase tracking-wide">{work.location}</p>
              <p className="font-typewriter text-sm text-[#ece8df]/60">{work.title}</p>
              <div className="mt-5 flex flex-col gap-3">
                {work.description.map((line, j) => (
                  <Caption key={j} className={cn("max-w-none", j % 2 === 1 && i === 0 && "md:ml-16")}>
                    <Highlight text={line} className="font-oswald font-bold text-[#a3121e]" />
                  </Caption>
                ))}
              </div>
            </Reveal>
          ))}
        </section>

        <Chapter n="Four" title="Your move" />
        <section className="px-4 md:px-8">
          <p className="mx-auto mb-12 max-w-lg text-center font-typewriter text-lg text-[#ece8df]/75">
            The TV&apos;s been on all night. Flip through the channels. Every one of
            them gets you to me.
          </p>
          <NoirTv />
        </section>

        <p className="mt-40 text-center font-oswald text-[clamp(3rem,10vw,8rem)] font-bold uppercase leading-none tracking-[0.15em] text-[#ece8df]/15">
          The end?
        </p>
        <p className="mt-2 text-center font-typewriter text-sm text-[#ece8df]/40">
          Press B for bullet time. You&apos;ve earned it, detective.
        </p>
      </div>
    </div>
  );
}

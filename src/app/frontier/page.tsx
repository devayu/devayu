import Highlight from "@/components/Highlight";
import FrontierHud from "@/components/worlds/frontier/FrontierHud";
import { FrontierHero } from "@/components/worlds/heroes";
import Reveal from "@/components/worlds/Reveal";
import WorldSwitch from "@/components/worlds/WorldSwitch";
import WorldTheme from "@/components/worlds/WorldTheme";
import { getFeaturedProjects, personalInfo, socialLinks, workExperience } from "@/data";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frontier",
  description: "Ayush Maurya's portfolio out on the frontier: a wanted poster, a journal and a mail-order catalogue.",
};

const Tumbleweed = () => (
  <svg viewBox="0 0 60 60" className="h-full w-full" aria-hidden>
    <g fill="none" stroke="#3a2412" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="30" cy="30" r="24" />
      <path d="M8 22 C 22 30 38 12 52 26 M10 40 C 24 28 36 48 50 38 M22 7 C 30 22 18 38 30 53 M40 9 C 30 24 44 40 36 52 M14 14 C 28 18 34 42 46 46" />
    </g>
  </svg>
);

// A rough engraving: hat, bandana and a stubborn jaw.
const Portrait = () => (
  <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
    <rect width="200" height="200" fill="#d9c294" />
    <g fill="none" stroke="#2b1a10" strokeWidth="1" opacity="0.35">
      {Array.from({ length: 40 }, (_, i) => (
        <path key={i} d={`M0 ${i * 5} L200 ${i * 5 + 20}`} />
      ))}
    </g>
    <g fill="#2b1a10">
      <path d="M40 90 q 60 -20 120 0 q -6 -4 -18 -6 q -4 -44 -42 -44 q -38 0 -42 44 q -12 2 -18 6 Z" />
      <path d="M66 92 q 34 -6 68 0 q 4 30 -6 46 q -14 18 -28 18 q -14 0 -28 -18 q -10 -16 -6 -46 Z" opacity="0.92" />
      <path d="M62 132 q 38 30 76 0 l 10 20 q -48 30 -96 0 Z" fill="#7a1616" />
      <path d="M40 200 q 10 -44 60 -44 q 50 0 60 44 Z" />
    </g>
    <g fill="#d9c294">
      <rect x="80" y="108" width="10" height="3" />
      <rect x="110" y="108" width="10" height="3" />
    </g>
  </svg>
);

// Catalogue engravings, one per project.
const Engraving = ({ id }: { id: string }) => {
  const hatch = (
    <g stroke="#2b1a10" strokeWidth="0.8" opacity="0.5">
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${10 + i * 6} 108 l 6 -10`} />
      ))}
    </g>
  );
  const shapes: Record<string, React.ReactNode> = {
    beacon: (
      <>
        <path d="M60 8 v12 M44 22 h32 M46 92 h28" strokeWidth="4" />
        <path d="M46 24 C 32 44 32 70 48 90 M74 24 C 88 44 88 70 72 90" strokeWidth="3" />
        <path d="M54 26 C 48 46 48 68 56 88 M66 26 C 72 46 72 68 64 88" strokeWidth="1.2" />
        <circle cx="60" cy="57" r="9" fill="#8b1e1e" stroke="none" />
        <path d="M30 57 h-12 M102 57 h-12 M36 34 l-8 -6 M84 34 l8 -6" strokeWidth="1.4" />
      </>
    ),
    logbase: (
      <>
        <path d="M20 30 h80 v62 h-80 Z" strokeWidth="3" />
        <path d="M20 30 l 6 -8 h80 l -6 8 M100 92 l6 -8 v-62" strokeWidth="2" />
        {[44, 56, 68, 80].map((y) => (
          <path key={y} d={`M30 ${y} h60`} strokeWidth="1" />
        ))}
        <path d="M30 80 l 14 -10 l 12 6 l 16 -18 l 14 8" strokeWidth="2.4" stroke="#8b1e1e" />
      </>
    ),
    "a1-landing": (
      <>
        <path d="M14 96 V 40 h92 V 96" strokeWidth="3" />
        <path d="M8 40 h104 l -10 -18 h-84 Z" strokeWidth="2.4" />
        <path d="M30 96 V 62 h20 V 96 M66 60 h28 v20 h-28 Z" strokeWidth="2" />
        <path d="M34 30 h52" strokeWidth="5" stroke="#8b1e1e" />
      </>
    ),
    kickstore: (
      <>
        <path d="M30 16 h30 v52 c 10 4 28 6 40 14 c 6 4 6 12 0 14 H 24 c -4 0 -6 -4 -4 -8 l 10 -20 Z" strokeWidth="3" />
        <path d="M30 36 h30 M30 50 h30" strokeWidth="1.4" />
        <path d="M24 96 h82" strokeWidth="4" />
        <circle cx="94" cy="76" r="5" stroke="#8b1e1e" strokeWidth="2" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 120 112" className="h-28 w-32" aria-hidden>
      <g fill="none" stroke="#2b1a10" strokeLinecap="round" strokeLinejoin="round">
        {shapes[id] ?? <path d="M20 30 h80 v62 h-80 Z" strokeWidth="3" />}
      </g>
      {hatch}
    </svg>
  );
};

const SectionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("font-rye text-4xl leading-tight md:text-6xl", className)}>{children}</h2>
);

export default function FrontierPage() {
  const projects = getFeaturedProjects();

  return (
    <div className="frontier-world min-h-screen bg-[#1c0d07] font-fell text-[#2b1a10]">
      <WorldTheme slug="frontier" />
      <h1 className="sr-only">Ayush Maurya, full stack developer</h1>
      <FrontierHud />

      {/* Hero: the open range, with a chapter card */}
      <section className="relative h-[100svh] min-h-[520px] overflow-hidden">
        <div className="fr-heat absolute inset-0">
          <FrontierHero />
        </div>
        <div className="fr-tumbleweed absolute bottom-[8%] left-0 size-14 md:size-20">
          <Tumbleweed />
        </div>
        <div aria-hidden className="fr-letterbox fr-letterbox-top" />
        <div aria-hidden className="fr-letterbox fr-letterbox-bottom" />
        <header className="relative z-10 flex items-center justify-between px-5 pt-[calc(9vh+12px)] font-rye text-lg text-[#f6d189] md:px-10">
          <span>devayu</span>
          <WorldSwitch className="font-fell text-base hover:text-white" />
        </header>
        <div className="fr-chapter absolute inset-x-0 top-[22%] z-10 text-center text-[#fbe3a6]">
          <p className="font-fell text-xl italic tracking-[0.3em] md:text-2xl">Chapter I</p>
          <p className="mt-2 font-rye text-[clamp(3rem,10vw,8rem)] leading-none drop-shadow-[0_4px_0_rgb(42_19_12/0.6)]">
            Howdy, Stranger
          </p>
        </div>
        <p className="absolute inset-x-0 bottom-[calc(9vh+14px)] z-10 text-center font-fell italic text-[#f6d189]/80">
          Ride on down. Press E if you&apos;re feeling quick on the draw.
        </p>
      </section>

      {/* The wanted poster and a journal entry */}
      <section className="fr-wood relative px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,420px)_1fr]">
          <Reveal className="fr-pin relative mx-auto w-full max-w-[420px]" style={{ ["--tilt" as string]: "-2deg" }}>
            <div className="fr-paper fr-torn px-7 pb-8 pt-9 text-center shadow-[0_20px_40px_rgb(0_0_0/0.5)]">
              <span className="fr-nail absolute left-1/2 top-3 -translate-x-1/2" />
              <p className="font-rye text-6xl tracking-wide md:text-7xl">Wanted</p>
              <p className="mt-1 font-fell text-lg italic">for building software, end to end</p>
              <div className="mx-auto mt-5 aspect-square w-48 border-4 border-double border-[#2b1a10]">
                <Portrait />
              </div>
              <p className="mt-5 font-rye text-3xl">Ayush Maurya</p>
              <p className="mt-1">Known to ride with React and Spring Boot</p>
              <div className="my-5 border-y-2 border-[#2b1a10] py-2 font-rye text-2xl">Reward: a good conversation</div>
              <p className="text-sm italic">Remote or on-site. Approach with a project.</p>
            </div>
          </Reveal>

          <Reveal className="fr-pin" style={{ ["--tilt" as string]: "0.6deg" }}>
            <div className="fr-paper relative rounded-sm p-7 shadow-[0_20px_40px_rgb(0_0_0/0.5)] md:p-10">
              <div className="absolute inset-y-0 left-8 w-px bg-[#8b1e1e]/40" />
              {/* pencil sketch in the margin, journal style */}
              <svg viewBox="0 0 160 110" aria-hidden className="absolute -right-4 -top-10 hidden w-44 rotate-6 md:block">
                <g fill="none" stroke="#2b1a10" strokeWidth="1.3" strokeLinecap="round" opacity="0.75">
                  <path d="M6 96 C 40 60 60 30 80 18 C 100 30 120 60 154 96" />
                  <path d="M66 32 C 74 36 86 36 94 32" />
                  <path d="M10 100 C 60 96 100 98 150 94" />
                  <path d="M120 24 a 10 10 0 1 0 0.1 0" />
                </g>
              </svg>
              <div className="space-y-4 pl-6 font-caveat text-2xl leading-snug md:text-[1.7rem]">
                <p className="text-4xl font-bold">Well, howdy.</p>
                <p>
                  I see you read the poster. Don&apos;t believe everything they print
                  about me. I&apos;m Ayush, and I build software all the way through,
                  from the database out to whatever you click on.
                </p>
                <p>
                  These days I&apos;m riding with{" "}
                  <Link href={personalInfo.currentProject.href} target="_blank" rel="noopener noreferrer" className="text-[#8b1e1e] underline decoration-wavy underline-offset-4">
                    {personalInfo.currentProject.name}
                  </Link>
                  , a tool that finds accessibility problems on websites so more
                  folks can use them.
                </p>
                <p>
                  When I&apos;m off the clock it&apos;s side projects, books, music and a
                  whole lot of games. Pull up a chair and look around.
                </p>
                <p className="text-right text-xl">— A.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The catalogue: projects */}
      <section className="fr-paper px-5 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="border-y-4 border-double border-[#2b1a10] py-6 text-center">
            <p className="font-fell text-lg italic">The</p>
            <SectionTitle className="md:text-7xl">Maurya &amp; Co. Catalogue</SectionTitle>
            <p className="mt-2 font-fell text-lg italic">Fine software, built to last. Established 2022.</p>
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-lg italic">
            Everything I&apos;ve made, laid out like the general store. Look all you
            like, partner. Most of it&apos;s free.
          </p>
          <div className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal as="article" key={p.id} className="fr-pin flex gap-5 border-b border-[#2b1a10]/40 pb-10" style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="shrink-0 border border-[#2b1a10]/50 bg-[#efe2c4] p-2">
                  <Engraving id={p.id} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-fell text-sm italic">No. {String(i + 1).padStart(3, "0")}, {p.year}</p>
                  <h3 className="font-rye text-2xl leading-tight md:text-3xl">{p.title}</h3>
                  <p className="mt-2 text-[17px] leading-relaxed">{p.description}</p>
                  <p className="mt-3 flex items-baseline gap-2 text-sm">
                    <span className="shrink-0 font-rye">Made with</span>
                    <span aria-hidden className="mb-1 flex-1 border-b-2 border-dotted border-[#2b1a10]/50" />
                    <span className="text-right">{p.techStack.join(", ")}</span>
                  </p>
                  <p className="flex items-baseline gap-2 text-sm">
                    <span className="shrink-0 font-rye">Price</span>
                    <span aria-hidden className="mb-1 flex-1 border-b-2 border-dotted border-[#2b1a10]/50" />
                    <span className="text-[#8b1e1e]">{p.githubLink ? "Free, open source" : "Ask the proprietor"}</span>
                  </p>
                  <div className="mt-4 flex gap-5 font-rye">
                    {p.githubLink && (
                      <Link href={p.githubLink} target="_blank" rel="noopener noreferrer" className="border-b-2 border-[#2b1a10] hover:text-[#8b1e1e]">
                        Inspect the goods
                      </Link>
                    )}
                    {p.liveLink && (
                      <Link href={p.liveLink} target="_blank" rel="noopener noreferrer" className="border-b-2 border-[#2b1a10] hover:text-[#8b1e1e]">
                        Ride over
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The trail: work, as stations on a rail line */}
      <section className="bg-[#2b1a10] px-5 py-20 text-[#e8d7b2] md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="font-fell text-xl italic text-[#f6d189]/80">Chapter II</p>
          <SectionTitle className="text-[#f6d189]">Stops along the trail</SectionTitle>
          <p className="mt-2 max-w-xl text-lg italic text-[#e8d7b2]/80">Where I&apos;ve hung my hat, most recent first.</p>
          <div aria-hidden className="relative mt-10 h-6">
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#8a6a3c_0_6px,transparent_6px_18px)]" />
            <div className="absolute inset-x-0 top-[calc(50%-5px)] h-px bg-[#c9b08a]" />
            <div className="absolute inset-x-0 top-[calc(50%+5px)] h-px bg-[#c9b08a]" />
            <svg viewBox="0 0 46 24" className="fr-train absolute top-0 h-6 w-[46px]">
              <path d="M2 18 V8 h18 V2 h8 v6 h8 l8 10 Z" fill="#f6d189" />
              <circle cx="10" cy="20" r="3.5" fill="#f6d189" />
              <circle cx="30" cy="20" r="3.5" fill="#f6d189" />
            </svg>
          </div>
          <ol className="mt-8 grid gap-10 md:grid-cols-2">
            {workExperience.map((w) => (
              <Reveal as="li" key={w.id} className="fr-pin border-l-2 border-dashed border-[#c9b08a]/60 pl-6">
                <p className="font-rye text-[#f6d189]">{w.yearString}</p>
                <h3 className="mt-1 font-rye text-3xl">{w.location}</h3>
                <p className="italic text-[#e8d7b2]/75">{w.title}</p>
                <ul className="mt-4 space-y-3 text-lg leading-relaxed">
                  {w.description.map((d, i) => (
                    <li key={i}>
                      <Highlight text={d} className="font-rye font-normal text-[#f6d189]" />
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Telegraph office */}
      <section className="fr-wood px-5 py-20 md:py-28">
        <Reveal className="fr-pin fr-paper mx-auto max-w-2xl p-7 shadow-[0_20px_40px_rgb(0_0_0/0.5)] md:p-10" style={{ ["--tilt" as string]: "-0.8deg" }}>
          <div className="flex items-baseline justify-between border-b-4 border-double border-[#2b1a10] pb-3">
            <p className="font-rye text-2xl md:text-3xl">Telegram</p>
            <p aria-hidden className="font-rye text-lg tracking-[0.3em] text-[#8b1e1e]">·— ·· —·</p>
          </div>
          <div className="mt-5 space-y-3 font-fell text-xl uppercase leading-relaxed tracking-wide">
            <p>To: you. From: Ayush.</p>
            <p>
              If you&apos;ve got a job, a project or an idea worth riding out for
              stop. I&apos;d like to hear it stop. Send word and I&apos;ll answer
              quick stop.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3 font-rye text-lg">
            <Link href={`mailto:${personalInfo.email}`} className="bg-[#2b1a10] px-5 py-3 text-[#e8d7b2] transition-transform hover:-translate-y-0.5">
              Send a telegram
            </Link>
            <Link href={personalInfo.calendarLink} target="_blank" rel="noopener noreferrer" className="border-2 border-[#2b1a10] px-5 py-3 transition-colors hover:bg-[#2b1a10] hover:text-[#e8d7b2]">
              Meet me at the saloon
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 flex justify-center gap-8 font-rye text-[#f6d189]">
          {socialLinks.map((s) => (
            <Link key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              {s.name}
            </Link>
          ))}
        </div>
        <p className="mt-8 pb-12 text-center font-fell italic text-[#e8d7b2]/60">Ride safe, partner.</p>
      </section>
    </div>
  );
}

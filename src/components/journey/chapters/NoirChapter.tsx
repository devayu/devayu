import OnlyIn from "@/components/journey/OnlyIn";
import { NoirHud, Typewriter } from "@/components/worlds/noir/NoirInteractive";
import Reveal from "@/components/worlds/Reveal";
import { getFeaturedProjects } from "@/data";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Chapter I, Noir: who I am, and the case I'm working.

const Caption = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("noir-caption relative z-10 max-w-[34ch] px-3 py-2 text-[15px] leading-snug md:text-base", className)}>
    {children}
  </p>
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

export default function NoirChapter() {
  const beacon = getFeaturedProjects().find((p) => p.id === "beacon");

  return (
    <section id="noir" data-reality="noir" className="noir-world relative text-[#ece8df]">
      <OnlyIn world="noir">
        <NoirHud />
      </OnlyIn>

      <div className="noir-page">
        {/* Hero: a window onto the world, framed like a comic panel */}
        <div data-window className="relative h-[100svh] min-h-[520px] p-3 pl-12 md:p-5 md:pl-20">
          <div className="noir-cut relative h-full border-2 border-[#d8d2c0]" />
          <div className="noir-inset absolute right-6 top-6 w-24 border-2 border-[#d8d2c0] shadow-[8px_8px_0_#000] md:right-12 md:top-10 md:w-40">
            <ClockArt />
          </div>
          <Caption className="noir-inset absolute bottom-[16%] left-16 md:left-28">
            Somewhere in the city. 3:12 AM. Still raining. Scroll, and watch the city change.
          </Caption>
        </div>

        {/* everything below the window sits on the night itself */}
        <div className="bg-[#060607]">
        {/* The monologue, with room to breathe */}
        <div aria-label="Who I am" className="mx-auto max-w-[1400px] pl-12 pr-4 md:pl-20 md:pr-10">
          <div className="flex min-h-[80svh] items-center">
            <Typewriter
              text="I'm Ayush."
              speed={90}
              className="font-oswald text-[clamp(4.5rem,15vw,13rem)] font-bold uppercase leading-[0.85] tracking-tight"
            />
          </div>
          <div className="flex min-h-[70svh] items-center justify-end">
            <Typewriter
              text="Code is a loaded gun. Every commit is a bullet you can't take back. So I aim carefully, and I build the whole thing: the frontend you see, the backend you don't."
              className="max-w-2xl text-right font-typewriter text-2xl leading-relaxed md:text-4xl md:leading-snug"
            />
          </div>
          <div className="grid min-h-[70svh] items-center gap-10 md:grid-cols-[1fr_1.2fr]">
            <p className="font-oswald text-[clamp(3rem,7vw,6rem)] font-bold uppercase leading-[0.9] text-[#e9dfa5]">
              React up front.
              <br />
              <span className="text-[#ece8df]/40">Spring Boot in the back alley.</span>
            </p>
            <Typewriter
              text="Off the clock it's side projects, books and music. And games. A man needs something to drown out the rain."
              className="font-typewriter text-xl leading-relaxed text-[#ece8df]/80 md:text-2xl"
            />
          </div>
        </div>

        {/* The case I'm on right now */}
        {beacon && (
          <div className="mx-auto max-w-6xl pb-32 pl-12 pr-4 pt-16 md:pl-20 md:pr-10">
            <Reveal className="noir-panel relative bg-[#c9b48a] text-[#1b1712]">
              <div className="absolute left-6 top-0 h-3 w-32 bg-[#b39d72]" />
              <article className="grid gap-8 p-6 pt-9 font-typewriter md:grid-cols-[1.2fr_1fr] md:p-10 md:pt-12">
                <div>
                  <p className="text-sm opacity-70">The case I&apos;m working, {beacon.year}</p>
                  <h2 className="mt-1 font-oswald text-[clamp(3rem,8vw,6rem)] font-bold uppercase leading-[0.9]">{beacon.title}</h2>
                  <p className="mt-5 max-w-prose text-lg leading-relaxed">{beacon.description}</p>
                  <p className="mt-4 text-sm">
                    <span className="opacity-70">Evidence: </span>
                    {beacon.techStack.join(", ")}
                  </p>
                  {beacon.githubLink && (
                    <Link
                      href={beacon.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-block border-b-2 border-[#1b1712] font-oswald text-lg uppercase tracking-wider hover:bg-[#1b1712] hover:text-[#c9b48a]"
                    >
                      Read the case file
                    </Link>
                  )}
                </div>
                <div className="flex flex-col justify-between gap-8">
                  <span className="noir-stamp self-end px-3 py-1 font-oswald text-3xl font-bold uppercase tracking-widest text-[#a3121e]">
                    Open
                  </span>
                  <Caption className="max-w-none">
                    Most people never notice the doors a website forgets to open. I do. Beacon finds them before
                    somebody gets locked out.
                  </Caption>
                </div>
              </article>
            </Reveal>
            <p className="mt-24 text-center font-typewriter text-lg text-[#ece8df]/60">
              That&apos;s where I am tonight. If you want to know how I got here, keep walking.
            </p>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}

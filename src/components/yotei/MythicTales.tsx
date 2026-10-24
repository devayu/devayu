import Highlight from "@/components/Highlight";
import Reveal from "@/components/worlds/Reveal";
import { getFeaturedProjects, workExperience } from "@/data";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Jin's world: on Tsushima, travelling musicians sing of legends. These are
// my projects, told as tales.

const legends: Record<string, string> = {
  beacon: "They say there is a lantern that shows the doors the web forgot to open.",
  logbase: "They say a watchman keeps a ledger of every footstep, and never sleeps.",
  "a1-landing": "They say a merchant's banner rose to the top of every search for his name.",
  kickstore: "They say there was a shoe shop where anyone could buy, quickly and safely.",
};

// A brush-drawn ensō circle behind each tale.
const Enso = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" aria-hidden className={className}>
    <path
      d="M150 40 C 110 10 40 26 28 92 C 18 150 80 186 132 168 C 178 152 188 98 166 66"
      fill="none"
      stroke="currentColor"
      strokeWidth="14"
      strokeLinecap="round"
    />
  </svg>
);

export default function MythicTales() {
  const projects = getFeaturedProjects();

  return (
    <section aria-labelledby="tales-heading" className="px-6 py-28 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="relative">
          <span lang="ja" aria-hidden className="yo-backdrop-kanji -top-24 right-0 md:-top-40">伝説</span>
          <h2 id="tales-heading" className="relative font-mincho text-[clamp(3.2rem,9vw,7.5rem)] font-extrabold leading-none">
            Mythic tales
          </h2>
        </div>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
          On Tsushima, wandering musicians sing about legends. Pull up a mat,
          and I&apos;ll sing you mine. Every one of them is true.
        </p>

        <ol className="mt-20 space-y-28">
          {projects.map((p, i) => (
            <Reveal
              as="li"
              key={p.id}
              className={cn("tale grid items-center gap-8 md:grid-cols-[1fr_1.2fr] md:gap-16", i % 2 === 1 && "md:[&>*:first-child]:order-2")}
            >
              <div className="relative grid place-items-center py-6">
                <Enso className="tale-enso absolute inset-0 m-auto h-full max-h-72 w-auto text-gold/35" />
                <h3 className="relative text-center font-mincho text-[clamp(2.6rem,6vw,4.8rem)] font-extrabold leading-[1.05]">
                  {p.title}
                </h3>
              </div>
              <div>
                <p className="font-mincho text-2xl italic leading-relaxed md:text-3xl">
                  {legends[p.id] ?? `They say there was something called ${p.title}.`}
                </p>
                <p className="mt-6 text-sm text-gold">The truth of it</p>
                <p className="mt-1 text-lg leading-relaxed text-ink-soft">{p.description}</p>
                <p className="mt-3 text-sm text-ink-soft">
                  {p.year}, made with {p.techStack.join(", ")}.{" "}
                  {p.status === "in-progress" ? "This tale is still being written." : "This tale is told."}
                </p>
                <div className="mt-5 flex gap-6">
                  {p.githubLink && (
                    <Link href={p.githubLink} target="_blank" rel="noopener noreferrer" className="underline decoration-gold/60 underline-offset-4 hover:text-gold">
                      Read the code
                    </Link>
                  )}
                  {p.liveLink && (
                    <Link href={p.liveLink} target="_blank" rel="noopener noreferrer" className="underline decoration-gold/60 underline-offset-4 hover:text-gold">
                      Visit it
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* work: the houses I've served */}
        <div className="mt-36 border-t border-line pt-14">
          <h3 className="font-mincho text-3xl font-bold md:text-4xl">The houses I&apos;ve served</h3>
          <div className="mt-10 grid gap-12 md:grid-cols-2">
            {workExperience.map((w) => (
              <Reveal key={w.id} className="tale">
                <p className="text-sm text-gold">{w.yearString}</p>
                <p className="mt-1 font-mincho text-3xl font-bold">{w.location}</p>
                <p className="text-ink-soft">{w.title}</p>
                <ul className="mt-4 space-y-2 font-mincho text-lg leading-relaxed">
                  {w.description.map((d, j) => (
                    <li key={j}>
                      <Highlight text={d} className="text-gold" />
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

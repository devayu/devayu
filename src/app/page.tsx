import { HeroBackground } from "@/components/HeroBackground";
import Navbar from "@/components/Navbar";
import ProjectSection from "@/components/ProjectSection";
import { Button } from "@/components/ui/button";
import WorkSection from "@/components/WorkSection";
import Link from "next/link";
export default function Home() {
  return (
    <div className="relative min-h-screen">
      <HeroBackground />
      <main className="relative px-6 md:px-12 lg:px-24 py-4 md:py-16">
        <Navbar />

        <section className="mt-10 md:mt-20 min-h-[40vh] grid grid-cols-1 md:grid-cols-2 gap-12  items-center">
          <div>
            <p className="text-sm mb-3 text-primary font-hanken-grotesk font-semibold">
              Hey, I&apos;m
            </p>
            <h1 className="text-5xl md:text-7xl font-bold leading-[0.95] font-space-grotesk">
              Ayush
            </h1>
            <h1 className="text-5xl md:text-7xl font-bold leading-[0.95] tracking-wide font-space-grotesk">
              Maurya
            </h1>
            <Link
              href={"https://cal.com/idntknw/quick-chat"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="group overflow-hidden mt-6 h-10 md:h-12 px-6 rounded-full border-white/20 hover:border-transparent bg-black/40 hover:bg-black/50 text-foreground/90 backdrop-blur-sm"
              >
                <span className="relative z-10 font-hanken-grotesk">
                  Schedule a Call
                </span>
              </Button>
            </Link>
          </div>
          <div className="max-w-[520px] text-foreground opacity-85 font-hanken-grotesk">
            <p>
              {`I’m a full stack developer who loves building end-to-end solutions with React and Spring Boot. Right now, I’m working on `}
              <span>
                <Link
                  href="abc"
                  className="text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Beacon
                </Link>
              </span>
              <span>
                {`, a tool that detects accessibility issues and helps make the web more inclusive.`}
              </span>
            </p>

            <p className="mt-4">
              {`When I’m not coding, I’m usually tinkering with `}
              <span className="font-garamond italic text-primary font-semibold">
                side projects, books or music.
              </span>
            </p>
          </div>
        </section>

        <section className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProjectSection></ProjectSection>
          <WorkSection></WorkSection>
        </section>
      </main>
    </div>
  );
}
// #9CA0F6

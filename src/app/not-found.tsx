import { HeroBackground } from "@/components/HeroBackground";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen">
      <HeroBackground />
      <main className="relative px-6 md:px-12 lg:px-24 py-16">
        <Navbar />

        <section className="mt-10 md:mt-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="max-w-2xl mx-auto">
            {/* GIF */}
            <div className="mb-8">
              <Image
                src="/assets/nope.gif"
                width={500}
                height={500}
                alt="Not found animation"
                className="mx-auto rounded-lg shadow-lg"
                unoptimized
              />
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-6xl md:text-8xl font-bold leading-[0.95] font-space-grotesk mb-4">
                4<span className="text-primary">0</span>4
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-hanken-grotesk mb-2">
                Page Not Found
              </p>
              <p className="text-foreground/80 font-hanken-grotesk">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button
                  variant="outline"
                  className="group overflow-hidden h-12 px-6 rounded-full border-white/20 hover:border-transparent bg-black/40 hover:bg-black/50 text-foreground/90 backdrop-blur-sm"
                >
                  <span className="relative z-10 font-hanken-grotesk">
                    ← Back to Home
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

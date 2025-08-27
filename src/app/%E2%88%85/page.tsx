"use client";

import { HeroBackground } from "@/components/HeroBackground";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

const glitchText = ["V̴̰̈O̸̭̿I̷̱̍D̶̰̾", "ℕ𝕌𝕃𝕃", "∅∅∅∅", "404"];

export default function VoidPage() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [glitchIndex, setGlitchIndex] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchIndex((prev) => (prev + 1) % glitchText.length);
    }, 1500);

    return () => {
      clearInterval(glitchInterval);
    };
  }, []);

  const handleKonamiCode = (e: React.KeyboardEvent) => {
    if (e.key.toLowerCase() === "v") {
      setShowEasterEgg(!showEasterEgg);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-black/95 overflow-hidden"
      onKeyDown={handleKonamiCode}
      tabIndex={0}
    >
      <HeroBackground />

      {/* Glitch overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-green-500 font-mono text-xs animate-pulse">
          {">"} systems_online: true
        </div>
        <div className="absolute top-20 right-20 text-red-500 font-mono text-xs animate-bounce">
          ERROR 418: I'm a teapot
        </div>
        <div className="absolute bottom-20 left-20 text-blue-500 font-mono text-xs">
          matrix.exe has stopped working
        </div>
      </div>

      <main className="relative px-6 md:px-12 lg:px-24 py-16 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl">
          {/* Cryptic Symbol */}
          <div className="mb-8">
            <div className="text-9xl md:text-[12rem] font-mono text-primary/80 animate-pulse select-none">
              {glitchText[glitchIndex]}
            </div>
          </div>

          {/* Hidden wisdom */}
          <div className="space-y-6 mb-12">
            <p className="text-muted-foreground/70 font-hanken-grotesk text-sm">
              Congratulations, curious soul. You've discovered the void.
            </p>
            <p className="text-muted-foreground/50 font-hanken-grotesk text-xs">
              This is where I put my random thoughts, existential developer
              crises, and things that don't fit anywhere else.
            </p>

            {showEasterEgg && (
              <div className="animate-fade-in mt-8 p-4 border border-primary/20 rounded-lg bg-primary/5 backdrop-blur-sm">
                <p className="text-primary text-sm font-mono">
                  🎉 You found the easter egg! Press 'v' to toggle this message.
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  "The best way to debug is to explain your code to a rubber
                  duck. If you don't have one, a cat works too. They judge you
                  silently."
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button
                variant="outline"
                className="group overflow-hidden h-12 px-6 rounded-full border-white/20 hover:border-transparent bg-black/40 hover:bg-black/50 text-foreground/90 backdrop-blur-sm font-hanken-grotesk"
              >
                <span className="relative z-10">← Return to Reality</span>
              </Button>
            </Link>

            <button
              onClick={() => setShowEasterEgg(!showEasterEgg)}
              className="text-muted-foreground/30 hover:text-primary/60 transition-colors text-sm font-mono"
            >
              Press 'v' for void secrets
            </button>
          </div>

          {/* Matrix-style footer */}
          <div className="mt-16 text-center">
            <div className="text-xs font-mono text-muted-foreground/30 space-y-1">
              <div>The void stares back</div>
              <div className="animate-pulse">∅ null ∅ undefined ∅ 404 ∅</div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

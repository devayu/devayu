import WorldMount from "@/components/gallery/WorldMount";
import Effects from "@/components/worlds/cubism/Effects";
import Hero from "@/components/worlds/cubism/Hero";
import Intro from "@/components/worlds/cubism/Intro";
import { NavPlanes, SoundDisc } from "@/components/worlds/cubism/Nav";
import Next from "@/components/worlds/cubism/Next";
import Projects from "@/components/worlds/cubism/Projects";
import Skills from "@/components/worlds/cubism/Skills";
import Work from "@/components/worlds/cubism/Work";
import { getWorld } from "@/data/worlds";
import "./cubism.css";

const world = getWorld("cubism");

export const metadata = { title: world.name };

// The Cubism room. Analytic at the top (ochre, umber, grey, many small
// planes), Synthetic and Orphic by the end (flat colour, few large shapes),
// and the whole way down it leans toward one place: what's next, and how to
// reach me.

function Materials() {
  return (
    <svg className="cb-defs" aria-hidden focusable="false">
      <defs>
        <pattern id="cb-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#2A2622" strokeWidth="1.4" />
        </pattern>
        <pattern id="cb-hatch-chalk" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#F3EEE2" strokeWidth="1.4" />
        </pattern>
        <pattern id="cb-checks" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(-3) skewX(-14)">
          <rect width="44" height="44" fill="#F3EEE2" />
          <rect width="22" height="44" fill="#6E7F8C" opacity="0.45" />
          <rect width="44" height="22" fill="#6E7F8C" opacity="0.45" />
        </pattern>
        <pattern id="cb-grain" width="160" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-2)">
          <path d="M0 8 C 40 2, 80 14, 160 8 M0 20 C 50 26, 100 12, 160 20 M0 32 C 30 28, 110 38, 160 32" fill="none" stroke="#5C4128" strokeWidth="1.6" />
        </pattern>
      </defs>
    </svg>
  );
}

export default function Page() {
  return (
    <main className="cb-room">
      <WorldMount slug="cubism" />
      <Materials />
      <div className="cb-ground" aria-hidden>
        <svg className="cb-ground-an" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <polygon points="0,0 120,0 90,140 0,170" fill="#C9A15F" />
          <polygon points="100,0 230,0 200,90 120,110" fill="#8E8577" />
          <polygon points="0,180 80,150 110,300 0,330" fill="#6E7F8C" />
          <polygon points="880,0 1000,0 1000,160 900,130" fill="#B8894A" />
          <polygon points="790,0 900,0 880,110 800,90" fill="#8E8577" />
          <polygon points="920,170 1000,150 1000,320 940,300" fill="#5C4128" />
          <polygon points="0,820 100,800 130,1000 0,1000" fill="#B8894A" />
          <polygon points="880,840 1000,820 1000,1000 900,1000" fill="#6E7F8C" />
          <polygon points="120,880 240,900 220,1000 140,1000" fill="#8E8577" />
        </svg>
        <svg className="cb-ground-syn" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M0 1000 L0 620 A 380 380 0 0 1 380 1000 Z" fill="#C8372D" />
          <polygon points="860,0 1000,0 1000,560 900,600" fill="#2F4FA2" />
          <polygon points="0,0 260,0 0,180" fill="#E5B42A" />
        </svg>
      </div>

      <NavPlanes />
      <Hero />
      <Intro />
      <Work />
      <Skills />
      <Projects />
      <Next />

      <SoundDisc />
      <Effects />
    </main>
  );
}

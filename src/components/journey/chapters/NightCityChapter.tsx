import GateChapter from "@/components/journey/GateChapter";
import OnlyIn from "@/components/journey/OnlyIn";
import SkillLoadout from "@/components/journey/chapters/SkillLoadout";
import HeadLook from "@/components/worlds/nightcity/HeadLook";
import HoloKoi from "@/components/worlds/nightcity/HoloKoi";
import { Scanner } from "@/components/worlds/nightcity/NightCityInteractive";
import Netrunner from "@/components/worlds/nightcity/Netrunner";
import Reveal from "@/components/worlds/Reveal";

// Chapter III, Night City: what I can do. Skills as installed cyberware.

export default function NightCityChapter() {
  return (
    <section id="night-city" data-reality="night-city" className="nc-root nc-clear relative font-rajdhani text-[#d8f6ff]">
      <OnlyIn world="night-city">
        <div aria-hidden className="nc-scanlines pointer-events-none fixed inset-0 z-40 opacity-50" />
        <Scanner />
      </OnlyIn>

      {/* The seam: the desert rises into the canyon while this window is pinned */}
      <div data-gate data-window data-from="frontier" data-to="night-city" className="relative h-[220svh]">
        <div className="nc-hero sticky top-0 h-[100svh] min-h-[560px] overflow-hidden" data-scan="District // Watson, Kabuki">
          <GateChapter world="night-city" className="nc-glitch font-rajdhani font-bold uppercase italic tracking-wider text-[#fcee0a]" />
          <div className="nc-look gate-in absolute inset-0">
            <HoloKoi className="pointer-events-none absolute inset-0 h-full w-full" />
            <Netrunner className="nc-fig gate-rise-far absolute bottom-0 right-[-14%] h-[58%] w-auto md:right-[3%] md:h-[86%]" />
          </div>
          <HeadLook target=".nc-look" />
          <div aria-hidden className="gate-in nc-tear pointer-events-none absolute inset-0 z-[6]" />
            {/* the yellow slab: Cyberpunk's signature, cutting across the frame */}
            <div className="gate-slab nc-slab absolute left-0 top-0 z-[8] flex h-[52%] w-[88vw] flex-col justify-between p-5 pt-16 text-black md:h-full md:w-[min(40vw,600px)] md:p-10 md:pt-24">
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
                  <p className="mt-1 font-rajdhani text-xl font-bold uppercase leading-tight text-white">See what&apos;s installed</p>
                  <p className="mt-1 font-tech text-xs text-white/70">Scroll down for the loadout</p>
                </div>
                <div aria-hidden className="nc-barcode mt-4 h-8 w-40" />
              </div>
            </div>

            {/* HUD, arriving as the canyon completes */}
            <div className="gate-in">
            {/* HUD */}
            <div aria-hidden className="nc-frame pointer-events-none absolute inset-3 z-[9] md:inset-5">
              <span className="left-0 top-0 border-l-2 border-t-2" />
              <span className="right-0 top-0 border-r-2 border-t-2" />
              <span className="bottom-0 left-0 border-b-2 border-l-2" />
              <span className="bottom-0 right-0 border-b-2 border-r-2" />
            </div>
            <header className="relative z-10 flex items-center justify-between px-6 pt-6 font-tech text-sm md:px-12 md:pt-8">
              <span className="pl-8 text-black md:pl-12">DEVAYU.NET</span>
            </header>
            <div className="nc-hud-in absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center font-rajdhani text-lg font-bold uppercase italic tracking-widest text-[var(--nc-yellow)]" style={{ animationDelay: "4s" }}>
              <p>Jack in</p>
              <p aria-hidden className="nc-chevron font-tech text-sm">▼</p>
            </div>
            <p aria-hidden className="absolute bottom-8 right-8 z-10 hidden font-tech text-[11px] text-[var(--nc-yellow)]/80 md:right-12 md:block">
              PRESS Q TO SCAN
            </p>
            </div>
        </div>
      </div>

      <div className="nc-ground relative">
      <div aria-hidden className="nc-hexbg pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-6xl pb-40 pl-12 pr-5 pt-24 md:pl-20 md:pr-10">
        <Reveal className="nc-reveal mb-12" data-scan="Section // installed">
          <h2 className="nc-heading w-fit py-2 pl-4 pr-12 font-rajdhani text-[clamp(2.6rem,7vw,6rem)] font-bold uppercase italic leading-[0.9] tracking-wide text-black md:pl-6 md:pr-20">
            The loadout
          </h2>
        </Reveal>
        <p className="-mt-4 mb-12 max-w-xl text-xl leading-relaxed text-[#d8f6ff]/80">
          Everything I&apos;ve got installed. Pick a slot and I&apos;ll show you where I&apos;ve
          actually used it.
        </p>
        <SkillLoadout />
        <p className="mt-28 text-center font-tech text-sm text-[var(--nc-cyan)]/80">
          That&apos;s the hardware. One more reality to go, and it&apos;s the quiet one.
        </p>
      </div>
      </div>
    </section>
  );
}

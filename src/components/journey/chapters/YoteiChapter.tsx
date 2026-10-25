import Footer from "@/components/Footer";
import GateChapter from "@/components/journey/GateChapter";
import Near from "@/components/journey/Near";
import OnlyIn from "@/components/journey/OnlyIn";
import Navbar from "@/components/Navbar";
import Haiku from "@/components/yotei/Haiku";
import KintsugiRule from "@/components/yotei/KintsugiRule";
import MythicTales from "@/components/yotei/MythicTales";
import Sash from "@/components/yotei/Sash";
import WindField from "@/components/yotei/WindField";
import { FollowWind, KurosawaMode } from "@/components/yotei/YoteiFx";

// Chapter IV, Yōtei: what's next, and you. The quiet ending.

export default function YoteiChapter() {
  return (
    <section id="yotei" data-reality="yotei" className="relative text-[var(--ink)]">
      <OnlyIn world="yotei">
        <KurosawaMode />
      </OnlyIn>

      <div className="yotei-world">
        {/* The seam: the canyon melts into hills and the mountain rises */}
        <div data-gate data-window data-from="night-city" data-to="yotei" className="relative h-[220svh]">
          <div className="sticky top-0 h-[100svh] min-h-[620px] overflow-hidden">
            <GateChapter world="yotei" className="font-mincho font-extrabold text-[#f3ece0]" />
            <div className="gate-in absolute inset-0">
              <Near>
                <WindField />
              </Near>
            </div>
            <div className="gate-in relative z-10 pl-12 pr-6 pt-5 md:pl-20 md:pr-12 md:pt-8">
              <Navbar />
            </div>
            <div
              lang="ja"
              className="gate-in absolute right-[5%] top-[24%] z-10 hidden font-mincho text-lg tracking-[0.5em] text-ink-soft/80 [writing-mode:vertical-rl] md:block"
            >
              <p className="place-atsu" title="Mount Yōtei">羊蹄山</p>
              <p className="place-jin" title="Tsushima">対馬</p>
            </div>
            <div className="gate-in">
              <FollowWind />
            </div>
          </div>
        </div>

        <div id="yotei-next" className="bg-[var(--paper)] pl-6 md:pl-8">
          {/* Atsu carries the sash; Jin sings the mythic tales */}
          <div className="place-atsu">
            <Sash />
          </div>
          <div className="place-jin">
            <MythicTales />
          </div>
          <KintsugiRule className="mx-auto block h-6 w-[calc(100%-3rem)] max-w-6xl" />
          <Haiku />
        </div>
      </div>
      <Footer />
    </section>
  );
}

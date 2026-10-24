import Navbar from "@/components/Navbar";
import Emakimono from "@/components/yotei/Emakimono";
import Haiku from "@/components/yotei/Haiku";
import KintsugiRule from "@/components/yotei/KintsugiRule";
import MythicTales from "@/components/yotei/MythicTales";
import Sash from "@/components/yotei/Sash";
import WindField from "@/components/yotei/WindField";
import { FollowWind, KurosawaMode } from "@/components/yotei/YoteiFx";
import YoteiScene from "@/components/yotei/YoteiScene";

export default function Yotei() {
  return (
    <>
      <div className="yotei-world">
        <section
          className="relative h-[100svh] min-h-[620px] overflow-hidden"
          style={{
            background:
              "linear-gradient(to bottom, var(--sky-top), var(--sky-mid) 45%, var(--sky-bottom) 75%)",
          }}
        >
          <YoteiScene />
          <WindField />
          <div className="relative z-10 px-6 pt-5 md:px-12 md:pt-8 lg:px-24">
            <Navbar />
            <h1 className="sr-only">Ayush Maurya, full stack developer</h1>
          </div>
          <div
            lang="ja"
            className="ink-in absolute right-[5%] top-[24%] z-10 hidden font-mincho text-lg tracking-[0.5em] text-ink-soft/70 [writing-mode:vertical-rl] md:block"
            style={{ animationDelay: "2s" }}
          >
            <p className="place-atsu" title="Mount Yōtei">羊蹄山</p>
            <p className="place-jin" title="Tsushima">対馬</p>
          </div>
          <FollowWind />
        </section>

        <Emakimono />
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
      <KurosawaMode />
    </>
  );
}

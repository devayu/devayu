import WorldMount from "@/components/gallery/WorldMount";
import ArpDrop from "@/components/worlds/dada/ArpDrop";
import { DadaDefs, Manicule, Rotorelief } from "@/components/worlds/dada/art";
import DadaHeading from "@/components/worlds/dada/DadaHeading";
import DadaNav from "@/components/worlds/dada/DadaNav";
import DerDada from "@/components/worlds/dada/DerDada";
import Machine from "@/components/worlds/dada/Machine";
import Merz from "@/components/worlds/dada/Merz";
import Soiree from "@/components/worlds/dada/Soiree";
import Telegram from "@/components/worlds/dada/Telegram";
import { getWorld } from "@/data/worlds";
import "./dada.css";

const world = getWorld("dada");

export const metadata = {
  title: world.name,
  description: "Ayush Maurya, full stack developer, cut up and pasted back together as a Dada soirée: where I've been, what I can do, what I've made.",
};

export default function Page() {
  return (
    <div className="dd-root">
      <WorldMount slug="dada" />
      <DadaDefs />
      <a className="dd-skip" href="#manifest">
        Skip to the manifesto
      </a>
      <header className="dd-top">
        <DadaNav />
      </header>

      <main>
        <Soiree />

        <section id="manifest" className="dd-sec dd-manifest" aria-labelledby="manifest-h">
          <div className="dd-spine">
            <span className="dd-watermark" aria-hidden>
              Manifest
            </span>
            <DadaHeading as="h1" id="manifest-h" text="I’m A|yush." loud="Ayush" seed={36} lean={0} />
            <div className="dd-manifesto">
              <p>
                I&rsquo;m a full stack developer, which means I build <b className="dd-punch">the whole thing</b>: the
                screen you&rsquo;re poking at, the server behind it, the database behind that, and the boring pipes in
                between.
              </p>
              <p className="dd-decree">
                I am against nothing <span>except</span> half-built things.
              </p>
              <p>
                Since October 2022 I&rsquo;ve been a senior software engineer at agilon Health. On the side I freelance and
                build my own tools, because some ideas won&rsquo;t leave me alone until they <b className="dd-punch">ship</b>.
              </p>
              <p>
                I work from India. This room was cut up with scissors and pasted back together <b className="dd-punch">by chance</b>.
                Click anything that looks like paper. Nothing breaks. Probably.
              </p>
              <a className="dd-hand-link" href="#der-dada">
                <Manicule className="dd-hand-link-icon" />
                Start with where I&rsquo;ve been: today&rsquo;s paper
              </a>
            </div>
          </div>
          <div className="dd-heckle">
            <p className="dd-slip dd-torn" aria-hidden>
              Dada is against the future
            </p>
            <p className="dd-slip dd-slip--b" aria-hidden>
              (I&rsquo;m mostly for it.)
            </p>
            <span className="dd-rect-stamp" aria-hidden>
              this is not a résumé
            </span>
            <ArpDrop className="dd-heckle-arp" />
          </div>
        </section>

        <DerDada />

        <div className="dd-divider" aria-hidden>
          <Rotorelief className="dd-divider-disc" rim="WHAT GOES AROUND COMPILES AROUND · 33 RPM · " id="dd-rim-divider" />
        </div>

        <section id="maschine" className="dd-sec dd-machine-sec" aria-labelledby="maschine-h">
          <div className="dd-sec-head">
            <DadaHeading id="maschine-h" text="What I can do" loud="do" seed={1915} />
            <p className="dd-lede">
              Picabia drew people as machines. Fair enough. Here I am as one: every part is a tool I use, labelled the
              way an engineer would. Run your finger down the parts list and watch each one work.
            </p>
          </div>
          <Machine />
        </section>

        <section id="merz" className="dd-sec dd-merz" aria-labelledby="merz-h">
          <div className="dd-sec-head">
            <DadaHeading id="merz-h" text="Things I’ve made" loud="made" seed={1923} />
            <p className="dd-lede">
              Schwitters glued tram tickets and receipts onto boards and called it Merz. These are my scraps: four
              things I&rsquo;ve built, each with its ticket and its receipt. Click a picture to turn it into art.
            </p>
          </div>
          <Merz />
        </section>

        <section id="telegramm" className="dd-sec dd-telegramm" aria-labelledby="telegramm-h">
          <div className="dd-sec-head dd-sec-head--tg">
            <DadaHeading id="telegramm-h" text="What’s next?" loud="next" ransom seed={1922} />
          </div>
          <Telegram />
        </section>
      </main>

      <footer className="dd-foot">
        <DadaNav label="More rooms" sound={false} />
        <p className="dd-colophon">
          <span className="dd-seal" lang="ja" role="img" aria-label="Seal: ayu, to walk">
            歩
          </span>
          <span>
            devayu. Set by hand in Old Standard, Bodoni, Holtwood, Archivo Black and Special Elite. No artworks were
            harmed; every scrap is drawn here.
          </span>
        </p>
      </footer>
    </div>
  );
}

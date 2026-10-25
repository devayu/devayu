import WorldLink from "@/components/gallery/WorldLink";
import { DadaDefs, Manicule, Rotorelief } from "@/components/worlds/dada/art";
import DadaHeading from "@/components/worlds/dada/DadaHeading";
import DadaNav from "@/components/worlds/dada/DadaNav";
import PaperWorld from "@/components/worlds/dada/PaperWorld";
import "./dada/dada.css";

// The dead end, as a Dada room: a missing page declared a readymade.
export default function NotFound() {
  return (
    <div className="dd-root dd-404">
      <PaperWorld />
      <DadaDefs />
      <header className="dd-top">
        <DadaNav label="Rooms" />
      </header>
      <main className="dd-404-main">
        <div className="dd-404-num" aria-hidden>
          <span className="dd-404-four">4</span>
          <Rotorelief className="dd-404-zero" rim="NOTHING HERE · NOTHING HERE · NOTHING HERE · " id="dd-rim-404" />
          <span className="dd-404-four dd-404-four--b">4</span>
        </div>

        <div className="dd-404-copy">
          <DadaHeading as="h1" text="This page is Da|da." loud="Dada" seed={404} hat />
          <p>
            Dada is against the future. This page is against the present: whatever you were looking for isn&rsquo;t
            here. Maybe it was cut up and pasted somewhere else. Maybe it never existed, which is very Dada of it.
          </p>
          <p>Either way, I&rsquo;ve signed the nothing and hung it. Please don&rsquo;t touch the art.</p>
          <WorldLink href="/" className="dd-return">
            <Manicule className="dd-return-hand" />
            <span>
              <b>Return ticket</b>
              <span>back to the gallery</span>
            </span>
            <span className="dd-return-stamp" aria-hidden>
              retour
            </span>
          </WorldLink>
        </div>

        <figure className="dd-404-frame" aria-label="An empty frame">
          <div className="dd-404-nothing" aria-hidden>
            <span className="dd-404-sig">R. Mutt 404</span>
          </div>
          <figcaption>
            <i>Untitled (Page Not Found)</i>, 404. Readymade: nothing, found.
          </figcaption>
        </figure>
      </main>
    </div>
  );
}

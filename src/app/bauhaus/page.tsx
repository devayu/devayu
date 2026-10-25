import WorldLink from "@/components/gallery/WorldLink";
import WorldMount from "@/components/gallery/WorldMount";
import Blocks from "@/components/worlds/bauhaus/Blocks";
import Cursor from "@/components/worlds/bauhaus/Cursor";
import Field from "@/components/worlds/bauhaus/Field";
import Infuser from "@/components/worlds/bauhaus/Infuser";
import Intro from "@/components/worlds/bauhaus/Intro";
import { shapeVars } from "@/components/worlds/bauhaus/kit";
import Rail from "@/components/worlds/bauhaus/Rail";
import Shelf from "@/components/worlds/bauhaus/Shelf";
import Stage from "@/components/worlds/bauhaus/Stage";
import { getWorld } from "@/data/worlds";
import "./bauhaus.css";

const world = getWorld("bauhaus");

export const metadata = {
  title: world.name,
  description: "ayush maurya, full stack developer, built the bauhaus way: form follows function.",
};

export default function Page() {
  return (
    <div className="bh-room" style={shapeVars}>
      <WorldMount slug="bauhaus" />
      <a href="#who" className="bh-skip">
        skip to the introduction
      </a>
      <Rail />
      <Cursor />
      <main className="bh-main">
        <Stage />
        <Intro />
        <Shelf />
        <Blocks />
        <Field />
        <Infuser />
      </main>
      <footer className="bh-foot">
        <span className="bh-foot-seal" lang="ja" aria-hidden>
          歩
        </span>
        <p>
          devayu, in the bauhaus room ({world.years}). thanks for walking through.{" "}
          <WorldLink href="/" className="bh-ln">
            back to the gallery
          </WorldLink>{" "}
          (or press esc).
        </p>
      </footer>
    </div>
  );
}

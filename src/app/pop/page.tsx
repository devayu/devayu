import WorldMount from "@/components/gallery/WorldMount";
import Boxes from "@/components/worlds/pop/Boxes";
import Checkout from "@/components/worlds/pop/Checkout";
import Hero from "@/components/worlds/pop/Hero";
import Intro from "@/components/worlds/pop/Intro";
import Panorama from "@/components/worlds/pop/Panorama";
import PopNav from "@/components/worlds/pop/PopNav";
import PrintShop from "@/components/worlds/pop/PrintShop";
import Shelf from "@/components/worlds/pop/Shelf";
import { getWorld } from "@/data/worlds";
import "./pop.css";

const world = getWorld("pop");

export const metadata = { title: world.name };

// The Pop Art room: a print shop and a supermarket. Everything is a flat
// silkscreen print on paper, the black key never quite lines up, and the
// skills come first, on a shelf.
export default function Page() {
  return (
    <div className="pp-room">
      <WorldMount slug="pop" />
      <PrintShop />
      <PopNav />
      <main>
        <Hero />
        <Intro />
        <Shelf />
        <Panorama />
        <Boxes />
        <Checkout />
      </main>
    </div>
  );
}

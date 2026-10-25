import NotionGrid from "@/components/NotionGrid";
import { DadaDefs } from "@/components/worlds/dada/art";
import DadaHeading from "@/components/worlds/dada/DadaHeading";
import DadaNav from "@/components/worlds/dada/DadaNav";
import PaperWorld from "@/components/worlds/dada/PaperWorld";
import { getFragments } from "@/lib/notion";
import type { Metadata } from "next";
import { Suspense } from "react";
import "../dada/dada.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fragments",
  description: "Little pieces of thoughts, quotes, and images I've collected.",
};

async function NotionContent() {
  let fragments: Awaited<ReturnType<typeof getFragments>> = [];
  try {
    fragments = await getFragments();
  } catch (error) {
    console.error("Error fetching Notion data:", error);
  }
  return <NotionGrid data={fragments} />;
}

export default function FragmentsPage() {
  return (
    <div className="dd-root dd-frag">
      <PaperWorld />
      <DadaDefs />
      <header className="dd-top">
        <DadaNav label="Rooms" />
      </header>
      <main className="dd-sec dd-frag-main">
        <div className="dd-sec-head">
          <DadaHeading as="h1" text="Frag|ments" loud="Fragments" seed={1919} lean={1} />
          <p className="dd-lede">
            Little pieces of thoughts, quotes, and images I&apos;ve collected, pasted down the way Schwitters kept tram
            tickets: whatever caught my eye, in the order it arrived.
          </p>
        </div>
        <Suspense fallback={<p role="status" className="dd-frag-loading">Gluing the scraps down…</p>}>
          <NotionContent />
        </Suspense>
      </main>
    </div>
  );
}

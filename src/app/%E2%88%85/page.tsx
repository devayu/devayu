import Footer from "@/components/Footer";
import WorldTheme from "@/components/worlds/WorldTheme";
import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import NotionGrid from "@/components/NotionGrid";
import { getFragments } from "@/lib/notion";
import type { Metadata } from "next";
import { Suspense } from "react";

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
    <>
    <WorldTheme slug="yotei" />
    <main className="relative px-6 pt-5 md:px-12 md:pt-8 lg:px-24">
      <Navbar />
      <div className="mx-auto mt-16 max-w-6xl md:mt-24">
        <h1 className="flex items-baseline gap-4 font-mincho text-5xl font-extrabold md:text-6xl">
          Fragments
          <span lang="ja" aria-hidden className="text-xl font-medium text-ink-soft/60">
            絵馬
          </span>
        </h1>
        <p className="mt-3 max-w-md text-lg text-ink-soft">
          Little pieces of thoughts, quotes, and images I&apos;ve collected.
        </p>
        <Suspense fallback={<LoadingSpinner />}>
          <NotionContent />
        </Suspense>
      </div>
    </main>
    <Footer />
    </>
  );
}

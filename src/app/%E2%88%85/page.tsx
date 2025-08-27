import { Suspense } from "react";
import NotionGrid from "@/components/NotionGrid";
import { HeroBackground } from "@/components/HeroBackground";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";

async function fetchNotionData() {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASE_URL
        : "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/notion`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching Notion data:", error);
    return [];
  }
}

async function NotionContent() {
  const notionData = await fetchNotionData();

  return (
    <NotionGrid
      data={notionData}
      columns={3}
      showImages={true}
      showDates={true}
    />
  );
}

export default function FragmentsPage() {
  return (
    <div className="relative min-h-screen">
      <HeroBackground />
      <main className="relative px-6 md:px-12 lg:px-24 py-16">
        <Navbar />
        <div className="mt-5 md:mt-10">
          <h1 className="text-xl font-bold tracking-tight text-primary font-space-grotesk">
            Fragments
          </h1>
          <p className="font-garamond text-muted-foreground italic font-semibold">
            Little pieces of thoughts, quotes, and images I&apos;ve collected.
          </p>
          <Suspense fallback={<LoadingSpinner />}>
            <NotionContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

"use client";

import BauhausCover, { timing as bauhausTiming } from "@/components/worlds/bauhaus/Cover";
import CubismCover, { timing as cubismTiming } from "@/components/worlds/cubism/Cover";
import DadaCover, { timing as dadaTiming } from "@/components/worlds/dada/Cover";
import PopCover, { timing as popTiming } from "@/components/worlds/pop/Cover";
import GalleryCover, { timing as galleryTiming } from "@/components/gallery/GalleryCover";
import { audio } from "@/lib/audio/manager";
import { coverStore, useCover, type Destination } from "@/lib/gallery";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Mounted once in the root layout. Unlocks sound on the first gesture and
// draws the cover that closes over the page while you move between rooms.

const covers: Record<Destination, { Cover: React.ComponentType<{ phase: "cover" | "reveal" }>; timing: { cover: number; reveal: number } }> = {
  bauhaus: { Cover: BauhausCover, timing: bauhausTiming },
  dada: { Cover: DadaCover, timing: dadaTiming },
  pop: { Cover: PopCover, timing: popTiming },
  cubism: { Cover: CubismCover, timing: cubismTiming },
  gallery: { Cover: GalleryCover, timing: galleryTiming },
};

export const coverTiming = (to: Destination) => covers[to].timing;

export default function GalleryRoot() {
  const cover = useCover();
  const pathname = usePathname();

  useEffect(() => {
    audio.init();
    const unlock = (e: Event) => {
      if ((e.target as Element | null)?.closest?.("[data-sound-toggle]")) return;
      audio.unlock();
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // The new room has rendered under the cover: open it.
  useEffect(() => {
    if (!cover || cover.phase !== "cover" || pathname !== cover.href.split(/[?#]/)[0]) return;
    // Give the new page a frame to paint before uncovering it.
    const raf = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      coverStore.set({ ...cover, phase: "reveal" });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, cover]);

  useEffect(() => {
    if (cover?.phase !== "reveal") return;
    const done = window.setTimeout(() => coverStore.set(null), covers[cover.to].timing.reveal + 60);
    return () => window.clearTimeout(done);
  }, [cover]);

  if (!cover) return null;
  const { Cover } = covers[cover.to];
  return (
    <div className="pointer-events-auto fixed inset-0 z-[9999]" aria-hidden>
      <Cover key={cover.to} phase={cover.phase} />
    </div>
  );
}

"use client";

import type { WorldSlug } from "@/data/worlds";
import { audio } from "@/lib/audio/manager";
import { useEffect } from "react";

// Marks the page with its world (for shared chrome like the sound switch)
// and switches the music to that world's theme.
export default function WorldTheme({ slug }: { slug: WorldSlug }) {
  useEffect(() => {
    document.documentElement.dataset.world = slug;
    audio.setWorld(slug);
    return () => {
      delete document.documentElement.dataset.world;
    };
  }, [slug]);
  return null;
}

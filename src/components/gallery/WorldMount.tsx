"use client";

import { useGo } from "@/components/gallery/WorldLink";
import type { WorldSlug } from "@/data/worlds";
import { audio } from "@/lib/audio/manager";
import { useEffect } from "react";

// Every world renders this once. It tells the music which room you're in
// (so a deep link or a reload still plays the right theme after your first
// click), marks the document for world-scoped styles, and lets Esc take you
// back to the gallery.
export default function WorldMount({ slug }: { slug: WorldSlug }) {
  const go = useGo();

  useEffect(() => {
    audio.setWorld(slug);
    document.documentElement.dataset.world = slug;
    return () => {
      delete document.documentElement.dataset.world;
    };
  }, [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      go("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return null;
}

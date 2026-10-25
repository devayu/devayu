"use client";

import { useEffect } from "react";

// For Dada pages that are not the room itself (404, Fragments): mark the
// document so the room's paper, selection and scrollbar apply, without
// changing the music.
export default function PaperWorld() {
  useEffect(() => {
    const html = document.documentElement;
    const before = html.dataset.world;
    html.dataset.world = "dada";
    return () => {
      if (before) html.dataset.world = before;
      else delete html.dataset.world;
    };
  }, []);
  return null;
}

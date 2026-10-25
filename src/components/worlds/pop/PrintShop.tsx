"use client";

import { useEffect } from "react";

// Runs the presses. Everything in the room is printed and visible without
// JavaScript; this only "arms" the room (so prints wait for their pull) and
// then pulls each [data-pull] block as it scrolls into view. Reduced motion
// leaves the room unarmed: every print is already dry.
export default function PrintShop() {
  useEffect(() => {
    const room = document.querySelector<HTMLElement>(".pp-room");
    if (!room) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const blocks = Array.from(room.querySelectorAll<HTMLElement>("[data-pull]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          e.target.dispatchEvent(new CustomEvent("pp:pull"));
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.01 }
    );
    room.setAttribute("data-armed", "");
    blocks.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, []);
  return null;
}

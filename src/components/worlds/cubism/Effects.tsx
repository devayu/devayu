"use client";

import { audio } from "@/lib/audio/manager";
import { useEffect, useRef } from "react";

// The room's quiet machinery:
// - Analytic → Synthetic: scroll writes --p (0 at the top, 1 at the end) and
//   --pstep (twelve steps) on the room. CSS turns that into the ground moving
//   from ochre canvas to newsprint, small facets giving way to large flat
//   colour, and the sound disc filling.
// - Reveals: anything with [data-reveal] gets .is-in when it comes into view
//   (papier-collé drops, stencil sprays, folds opening). Without JS nothing is
//   hidden: the hidden states only exist under .cb-js.
// - Refraction: on a fine pointer, a small flat pane trails the cursor (~100ms)
//   and the card under it slides 3px sideways, like seen through glass.

export default function Effects() {
  const pane = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const room = document.querySelector<HTMLElement>(".cb-room");
    if (!room) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // With reduced motion nothing is ever held back: everything is already settled.
    if (!reduced) room.classList.add("cb-js");

    // scroll → palette
    let raf = 0;
    let lastStep = -1;
    const measure = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      room.style.setProperty("--p", p.toFixed(3));
      const step = Math.round(p * 12);
      if (step !== lastStep) {
        lastStep = step;
        room.style.setProperty("--pstep", String(step));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // reveals
    let lastSfx = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-in");
          io.unobserve(el);
          if (el.dataset.sfx && !reduced) {
            const now = performance.now();
            if (now - lastSfx > 500) {
              lastSfx = now;
              audio.sfx("slide");
            }
          }
        }
      },
      // threshold 0: a folded fold is clipped to a strip, and Chrome measures the clipped box
      { threshold: 0, rootMargin: "0px 0px -14% 0px" }
    );
    room.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    // refraction
    const fine = window.matchMedia("(pointer: fine)").matches;
    let target = { x: -200, y: -200 };
    const pos = { x: -200, y: -200 };
    let lastX = 0;
    let loop = 0;
    let bent: HTMLElement | null = null;
    const step = () => {
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      if (pane.current) pane.current.style.transform = `translate3d(${pos.x - 30}px, ${pos.y - 30}px, 0)`;
      loop = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.4 ? requestAnimationFrame(step) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target = { x: e.clientX, y: e.clientY };
      pane.current?.classList.add("is-on");
      if (!loop) loop = requestAnimationFrame(step);
      const under = (e.target as Element | null)?.closest?.<HTMLElement>("[data-refract]") ?? null;
      if (under !== bent) {
        bent?.style.removeProperty("--rx");
        bent = under;
      }
      if (bent) {
        const dir = e.clientX >= lastX ? 1 : -1;
        bent.style.setProperty("--rx", `${dir * 3}px`);
      }
      lastX = e.clientX;
    };
    const onLeave = () => {
      pane.current?.classList.remove("is-on");
      bent?.style.removeProperty("--rx");
      bent = null;
    };
    if (fine && !reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      io.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(loop);
    };
  }, []);

  return <div ref={pane} className="cb-pane" aria-hidden />;
}

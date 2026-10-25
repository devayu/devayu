"use client";

import { useEffect, useRef } from "react";
import { PropDisc } from "./kit";

// A Light Prop disc that rides beside the pointer (the native cursor stays):
// it turns once every six seconds, faster over anything you can press, and a
// faint grey shadow drifts behind it. Fine pointers only, never with reduced
// motion.
export default function Cursor() {
  const disc = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches || !disc.current || !shade.current) return;
    const d = disc.current;
    const s = shade.current;
    let x = -100;
    let y = -100;
    let sx = x;
    let sy = y;
    let angle = 0;
    let speed = 60; // degrees per second: one turn in six seconds
    let target = 60;
    let last = performance.now();
    let raf = 0;
    let shown = false;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      speed += (target - speed) * Math.min(1, dt * 6);
      angle = (angle + speed * dt) % 360;
      sx += (x - sx) * Math.min(1, dt * 7);
      sy += (y - sy) * Math.min(1, dt * 7);
      d.style.transform = `translate3d(${x + 14}px, ${y + 14}px, 0) rotate(${angle}deg)`;
      s.style.transform = `translate3d(${sx + 20}px, ${sy + 22}px, 0) rotate(${angle}deg)`;
      raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      const t = e.target as Element | null;
      target = t?.closest?.("a, button, [role=button]") ? 420 : 60;
      if (!shown) {
        shown = true;
        sx = x;
        sy = y;
        d.dataset.on = s.dataset.on = "";
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const leave = () => {
      shown = false;
      delete d.dataset.on;
      delete s.dataset.on;
      cancelAnimationFrame(raf);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={shade} className="bh-cursor bh-cursor-shade" aria-hidden>
        <PropDisc />
      </div>
      <div ref={disc} className="bh-cursor" aria-hidden>
        <PropDisc />
      </div>
    </>
  );
}

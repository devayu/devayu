"use client";

import { useEffect, useRef } from "react";

// Braque learned faux bois as a house painter: drag a steel comb through wet
// umber and wood grain appears. Over the work bands, the pointer is the comb.
// Its teeth leave wavy grain that dries away in about a second and a half.
// Fine pointers only; it never covers the text with more than a thin film.

export default function Comb() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => {
      canvas.width = host.clientWidth * dpr;
      canvas.height = host.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(host);

    type P = { x: number; y: number; t: number };
    let trail: P[] = [];
    let raf = 0;
    const TEETH = 7;
    const LIFE = 1500;

    const draw = () => {
      const now = performance.now();
      trail = trail.filter((p) => now - p.t < LIFE);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const life = 1 - (now - b.t) / LIFE;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        for (let k = 0; k < TEETH; k++) {
          const off = (k - (TEETH - 1) / 2) * 6;
          const wob = Math.sin(b.t / 90 + k * 1.7) * 2.2;
          ctx.strokeStyle = `rgba(92, 65, 40, ${(0.42 * life * (k % 3 === 1 ? 0.6 : 1)).toFixed(3)})`;
          ctx.lineWidth = k % 2 ? 1.1 : 1.8;
          ctx.beginPath();
          ctx.moveTo(a.x + nx * (off + wob), a.y + ny * (off + wob));
          ctx.lineTo(b.x + nx * (off - wob), b.y + ny * (off - wob));
          ctx.stroke();
        }
      }
      raf = trail.length ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      const p = { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() };
      const last = trail[trail.length - 1];
      if (last && Math.hypot(p.x - last.x, p.y - last.y) < 4) return;
      trail.push(p);
      if (!raf) raf = requestAnimationFrame(draw);
    };
    host.addEventListener("pointermove", onMove);
    return () => {
      host.removeEventListener("pointermove", onMove);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="cb-comb" aria-hidden />;
}

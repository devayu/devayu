"use client";

import { useEffect, useRef } from "react";

// A gold seam like the kintsugi cracks on Atsu's blades. Draws itself
// once when it scrolls into view.
export default function KintsugiRule({ className }: { className?: string }) {
  const ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = ref.current;
    if (!path) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          path.dataset.drawn = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(path);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      aria-hidden
      className={className}
    >
      <path
        d="M0 12 L 120 12 L 150 8 L 210 14 L 260 11 L 300 15 L 330 10 L 420 12 L 470 6 L 500 13 L 520 9 L 610 12 L 680 16 L 720 11 L 790 12 L 830 7 L 860 13 L 940 12 L 990 15 L 1040 10 L 1200 12 M 470 6 L 488 1 M 680 16 L 700 22 M 830 7 L 842 2"
        className="line-base"
        stroke="var(--line)"
        strokeWidth="1"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        ref={ref}
        pathLength={1}
        d="M0 12 L 120 12 L 150 8 L 210 14 L 260 11 L 300 15 L 330 10 L 420 12 L 470 6 L 500 13 L 520 9 L 610 12 L 680 16 L 720 11 L 790 12 L 830 7 L 860 13 L 940 12 L 990 15 L 1040 10 L 1200 12 M 470 6 L 488 1 M 680 16 L 700 22 M 830 7 L 842 2"
        className="crack"
        stroke="var(--gold)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

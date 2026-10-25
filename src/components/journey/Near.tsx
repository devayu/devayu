"use client";

import { useEffect, useRef, useState } from "react";

// Mounts expensive children (WebGL scenes) only while they're within a couple
// of screens of the viewport, and unmounts them when the visitor moves on.
export default function Near({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "150% 0px 150% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className ?? "absolute inset-0"}>
      {near ? children : null}
    </div>
  );
}

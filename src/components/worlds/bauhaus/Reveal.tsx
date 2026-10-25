"use client";

import { useEffect, useRef } from "react";

// A section that assembles itself when you reach it. Content is at rest in
// the HTML; only a section still below the fold is "armed" (parts held off
// their marks) and then set "in" to run its own movement. Reduced motion and
// sections already on screen never arm.
type Props = React.HTMLAttributes<HTMLElement> & { margin?: string };

export default function Reveal({ children, margin = "0px 0px -22% 0px", ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return;
    el.dataset.reveal = "armed";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.reveal = "in";
        io.disconnect();
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return (
    <section ref={ref} {...rest}>
      {children}
    </section>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

// Adds data-shown once the element scrolls into view; each world styles the
// entrance itself through the [data-shown] attribute.
export default function Reveal({
  as: Tag = "div",
  className,
  children,
  ...rest
}: {
  as?: "div" | "section" | "article" | "li" | "figure";
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = "true";
          observer.disconnect();
        }
      },
      // threshold 0: clip-path entrances report a ratio of 0 until revealed
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref as React.Ref<never>} className={cn(className)} {...rest}>
      {children}
    </Tag>
  );
}

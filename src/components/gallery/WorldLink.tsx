"use client";

import { coverTiming } from "@/components/gallery/GalleryRoot";
import { audio } from "@/lib/audio/manager";
import { coverStore, destinationFor } from "@/lib/gallery";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

// Moves between rooms behind the destination's cover. The music starts its
// crossfade the moment you leave, so it has changed by the time you arrive.

export function useGo() {
  const router = useRouter();
  return useCallback(
    (href: string) => {
      const to = destinationFor(href);
      if (coverStore.get()) return;
      audio.setWorld(to === "gallery" ? null : to);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      router.prefetch(href);
      coverStore.set({ to, href, phase: "cover" });
      window.setTimeout(() => router.push(href, { scroll: false }), coverTiming(to).cover);
    },
    [router]
  );
}

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export default function WorldLink({ href, onClick, children, ...rest }: Props) {
  const go = useGo();
  const router = useRouter();
  return (
    <a
      href={href}
      onMouseEnter={(e) => {
        router.prefetch(href);
        rest.onMouseEnter?.(e);
      }}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

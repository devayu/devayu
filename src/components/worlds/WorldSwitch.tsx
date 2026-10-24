"use client";

import type { WorldSlug } from "@/data/worlds";
import { portalStore } from "@/lib/portal/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Leave through the current world's portal, played in reverse feel.
const leave = (router: ReturnType<typeof useRouter>) => {
  const slug = document.documentElement.dataset.world as WorldSlug | undefined;
  if (!slug) {
    router.push("/");
    return;
  }
  portalStore.go({ slug, href: "/", origin: [0.5, 0.5], kind: "exit" });
};

// Every world can return to the select screen, by click or with Escape.
export default function WorldSwitch({
  className,
  children = "Change world",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable]")) return;
      if (e.key === "Escape") leave(router);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <Link
      href="/"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        leave(router);
      }}
      className={cn("inline-flex items-center gap-2", className)}
    >
      {children}
      <kbd className="rounded border border-current px-1 text-[0.7em] leading-tight opacity-60">
        Esc
      </kbd>
    </Link>
  );
}

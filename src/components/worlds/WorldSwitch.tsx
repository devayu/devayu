"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      if (e.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      {children}
      <kbd className="rounded border border-current px-1 text-[0.7em] leading-tight opacity-60">
        Esc
      </kbd>
    </Link>
  );
}

"use client";

import ChapterRail, { goTo } from "@/components/journey/ChapterRail";
import Reality from "@/components/journey/Reality";
import TitleScreen from "@/components/journey/TitleScreen";
import type { WorldSlug } from "@/data/worlds";
import { audio } from "@/lib/audio/manager";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const noop = () => () => {};
// The title screen shows once per visit, and never on a deep link to a chapter.
const readStarted = () => {
  try {
    return sessionStorage.getItem("started") === "1" || window.location.hash.length > 1;
  } catch {
    return false;
  }
};

export default function Journey({ children }: { children: React.ReactNode }) {
  const startedBefore = useSyncExternalStore(noop, readStarted, () => false);
  const [pressed, setPressed] = useState(false);
  const started = startedBefore || pressed;

  const start = useCallback(() => {
    try {
      sessionStorage.setItem("started", "1");
    } catch {}
    setPressed(true);
    requestAnimationFrame(() => window.scrollTo(0, 0));
    audio.unlock();
    audio.setWorld("noir");
  }, []);

  useEffect(() => {
    if (started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.metaKey) return;
      // Space and arrows would otherwise scroll the journey the moment it appears.
      e.preventDefault();
      start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, start]);

  // Deep links (/#frontier, or the old /frontier routes) land on their chapter.
  useEffect(() => {
    if (!started) return;
    const slug = window.location.hash.slice(1) as WorldSlug;
    if (!slug) return;
    const id = window.setTimeout(() => goTo(slug), 120);
    return () => window.clearTimeout(id);
  }, [started]);

  // TEMP (review captures): ?at=<gate>:<progress> or ?at=y:<px> jumps instantly.
  useEffect(() => {
    if (!started) return;
    const at = new URLSearchParams(window.location.search).get("at");
    if (!at) return;
    const [k, v] = at.split(":");
    const id = window.setTimeout(() => {
      let top = Number(v);
      if (k !== "y") {
        const gate = document.querySelectorAll<HTMLElement>("[data-gate]")[Number(k)];
        if (!gate) return;
        const r = gate.getBoundingClientRect();
        top = window.scrollY + r.top + Number(v) * (gate.offsetHeight - window.innerHeight);
      }
      window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
    }, 400);
    return () => window.clearTimeout(id);
  }, [started]);

  if (!started) return <TitleScreen onStart={start} />;

  return (
    <>
      <h1 className="sr-only">Ayush Maurya, full stack developer</h1>
      <Reality />
      <ChapterRail />
      {children}
    </>
  );
}

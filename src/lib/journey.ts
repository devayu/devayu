import type { WorldSlug } from "@/data/worlds";
import { useSyncExternalStore } from "react";

// Which reality the visitor is standing in right now. The journey sets it as
// the page scrolls; world-specific controls (bullet time, Dead Eye, the
// scanner, Kurosawa mode) only exist while their world is current.

let current: WorldSlug = "noir";
const listeners = new Set<() => void>();

export const journey = {
  get: () => current,
  set(next: WorldSlug) {
    if (next === current) return;
    current = next;
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export const useCurrentWorld = () =>
  useSyncExternalStore(journey.subscribe, journey.get, () => "noir" as WorldSlug);

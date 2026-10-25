import type { WorldSlug } from "@/data/worlds";
import { useSyncExternalStore } from "react";

// Moving between rooms: a cover in the destination's own material closes over
// the page, the route changes underneath it, then it opens on the new room.

export type Destination = WorldSlug | "gallery";
export type CoverState = { to: Destination; href: string; phase: "cover" | "reveal" } | null;

let state: CoverState = null;
const listeners = new Set<() => void>();

export const coverStore = {
  get: () => state,
  set(next: CoverState) {
    state = next;
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export const useCover = () => useSyncExternalStore(coverStore.subscribe, coverStore.get, () => null);

export const destinationFor = (href: string): Destination => {
  const slug = href.replace(/^\//, "").split(/[?#/]/)[0];
  return (["bauhaus", "dada", "pop", "cubism"] as const).find((s) => s === slug) ?? "gallery";
};

import type { WorldSlug } from "@/data/worlds";

// Requests to travel between pages through a world's portal. The Portal
// component in the root layout listens and performs the transition.

export type PortalRequest = {
  id: number;
  slug: WorldSlug;
  href: string;
  /** Where the transition starts, 0..1 from the top-left. */
  origin: [number, number];
  /** "enter" shows the world's title card while the route loads. */
  kind: "enter" | "exit";
};

let current: PortalRequest | null = null;
let nextId = 1;
const listeners = new Set<() => void>();

export const portalStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => current,
  server: () => null,
  /** Returns false when a transition is already running. */
  go(req: Omit<PortalRequest, "id">) {
    if (current) return false;
    current = { ...req, id: nextId++ };
    listeners.forEach((l) => l());
    return true;
  },
  done() {
    current = null;
    listeners.forEach((l) => l());
  },
};

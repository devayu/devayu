"use client";

import type { WorldSlug } from "@/data/worlds";
import { useCurrentWorld } from "@/lib/journey";

// Renders its children only while the visitor is inside that world.
export default function OnlyIn({ world, children }: { world: WorldSlug; children: React.ReactNode }) {
  return useCurrentWorld() === world ? <>{children}</> : null;
}

import type { WorldSlug } from "@/data/worlds";

// What each reality is for in the story.
export const chapters: Record<WorldSlug, { n: string; label: string }> = {
  noir: { n: "Chapter I", label: "Who I am" },
  frontier: { n: "Chapter II", label: "Where I've been" },
  "night-city": { n: "Chapter III", label: "What I can do" },
  yotei: { n: "Chapter IV", label: "What's next" },
};

import { projects } from "@/data/projects";
import { skills } from "@/data/personal";
import { workExperience } from "@/data/work";

// The print shop's stock: inks, and the true content re-labelled as product.
// Nothing here is invented about Ayush; the jokes are about the packaging.

export const INK = {
  paper: "#F4EEDC",
  key: "#111111",
  red: "#E2231A",
  yellow: "#FFD400",
  blue: "#0070C0",
  cyan: "#2EB4E6",
  pink: "#FF5FA2",
  turquoise: "#1FC3B5",
  orange: "#FF6A13",
  lime: "#A6D608",
} as const;

// Ink combinations for one "print": ground, logotype, band. Three inks at most,
// rotated per instance so a row never repeats its neighbour.
export const COMBOS: [string, string, string][] = [
  [INK.yellow, INK.red, INK.cyan],
  [INK.pink, INK.yellow, INK.turquoise],
  [INK.cyan, INK.red, INK.yellow],
  [INK.lime, INK.pink, INK.paper],
  [INK.orange, INK.paper, INK.cyan],
  [INK.turquoise, INK.yellow, INK.pink],
  [INK.red, INK.yellow, INK.paper],
  [INK.yellow, INK.blue, INK.pink],
  [INK.pink, INK.paper, INK.red],
];

/* ——— The shelf: one can per skill ——— */

export type Use = { where: string; how: string };

// Slogans are product copy about the tool, never claims about skill level.
const SLOGANS: Record<string, string> = {
  React: "Up front, where you can see it.",
  "Next.js": "React, with delivery.",
  TypeScript: "Says what it means.",
  "Spring Boot": "The back room. Heavy lifting.",
  "Node.js": "JavaScript, after hours.",
  "Tailwind CSS": "Style, pre-portioned.",
  PostgreSQL: "Keeps things in rows.",
  Docker: "Ships in its own box.",
  AWS: "Somewhere to put it all.",
};

const STICKERS: Record<string, string> = {
  React: "IMPROVED!",
  "Next.js": "SERVER SIDE!",
  TypeScript: "NOW WITH 0% GUESSWORK",
  "Spring Boot": "NEW!",
  Docker: "CONTAINS NO MAGIC",
};

// Where each skill was actually used: read off the projects' stacks and the
// work descriptions. A skill with no recorded use says so plainly.
const usesOf = (skill: string): Use[] => {
  const out: Use[] = [];
  for (const w of workExperience) {
    for (const line of w.description) {
      if (line.includes(skill)) {
        out.push({ where: `${w.title}, ${w.location}`, how: line.replace(/\*\*/g, "") });
      }
    }
  }
  for (const p of projects) {
    if (p.techStack.includes(skill)) {
      out.push({ where: `${p.title} (${p.year})`, how: `On the stack with ${p.techStack.filter((t) => t !== skill).join(", ")}.` });
    }
  }
  return out;
};

export const cans = skills.map((name, i) => ({
  name,
  slogan: SLOGANS[name] ?? "As advertised.",
  sticker: STICKERS[name],
  uses: usesOf(name),
  combo: COMBOS[(i * 4 + Math.floor(i / 3)) % COMBOS.length],
}));

/* ——— The boxes: one per project ——— */

const BOX_COPY: Record<string, { strap: string; inks: [string, string] }> = {
  beacon: { strap: "Finds what the web forgot", inks: [INK.yellow, INK.red] },
  logbase: { strap: "Real-time events, by the box", inks: [INK.cyan, INK.key] },
  "a1-landing": { strap: "One landing, fully assembled", inks: [INK.pink, INK.blue] },
  kickstore: { strap: "Sneakers, checkout included", inks: [INK.lime, INK.red] },
};

export const boxes = projects.map((p) => ({
  ...p,
  short: p.id === "a1-landing" ? "A1 Associates" : p.title,
  strap: BOX_COPY[p.id]?.strap ?? p.title,
  inks: BOX_COPY[p.id]?.inks ?? [INK.yellow, INK.red],
}));

export const statusLabel = (s?: string) =>
  s === "in-progress" ? "Still printing" : s === "planned" ? "On order" : "On shelves";

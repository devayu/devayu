export type WorldSlug = "bauhaus" | "dada" | "pop" | "cubism";

export interface World {
  slug: WorldSlug;
  name: string;
  years: string;
  /** What this world says about me, in a line. */
  tagline: string;
  href: string;
  /** What the generated theme sounds like, shown while it plays. */
  sound: string;
}

export const worlds: World[] = [
  {
    slug: "bauhaus",
    name: "Bauhaus",
    years: "1919–1933",
    tagline: "form follows function. so do i.",
    href: "/bauhaus",
    sound: "glass, wood and a grid",
  },
  {
    slug: "dada",
    name: "Dada",
    years: "1916–1924",
    tagline: "Cut me up and paste me back together.",
    href: "/dada",
    sound: "a sound poem, by chance",
  },
  {
    slug: "pop",
    name: "Pop Art",
    years: "1956–1970",
    tagline: "New! Improved! Now with TypeScript.",
    href: "/pop",
    sound: "a jingle on repeat",
  },
  {
    slug: "cubism",
    name: "Cubism",
    years: "1907–1920s",
    tagline: "One person, every side at once.",
    href: "/cubism",
    sound: "café jazz from four angles",
  },
];

export const getWorld = (slug: WorldSlug) => worlds.find((w) => w.slug === slug)!;

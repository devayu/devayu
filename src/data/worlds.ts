export type WorldSlug = "noir" | "frontier" | "night-city" | "yotei";

export interface World {
  slug: WorldSlug;
  name: string;
  inspiredBy: string;
  tagline: string;
  href: string;
  /**
   * `local` is tried first: a file in public/soundtracks-local/ that exists only
   * on Ayush's machine (gitignored, never deployed). Otherwise the track plays
   * through YouTube's embedded player. `previewAt` is where hover previews start.
   */
  soundtrack: { youtubeId: string; local: string; label: string; previewAt: number };
}

export const worlds: World[] = [
  {
    slug: "noir",
    name: "Noir",
    inspiredBy: "Max Payne 2",
    tagline: "Rain, regret, and production bugs.",
    href: "/noir",
    soundtrack: { youtubeId: "swvjIctr6Fw", local: "/soundtracks-local/noir.m4a", label: "Max Payne 2 theme", previewAt: 0 },
  },
  {
    slug: "frontier",
    name: "Frontier",
    inspiredBy: "Red Dead Redemption 2",
    tagline: "Wanted for shipping software.",
    href: "/frontier",
    soundtrack: { youtubeId: "-itXhJvEF4w", local: "/soundtracks-local/frontier.m4a", label: "Red Dead Redemption 2", previewAt: 0 },
  },
  {
    slug: "night-city",
    name: "Night City",
    inspiredBy: "Cyberpunk 2077 & Deus Ex",
    tagline: "Augmented, online, open to gigs.",
    href: "/night-city",
    soundtrack: { youtubeId: "FV7_r22fgCI", local: "/soundtracks-local/night-city.m4a", label: "Cyberpunk 2077", previewAt: 0 },
  },
  {
    slug: "yotei",
    name: "Yōtei",
    inspiredBy: "Ghost of Tsushima & Ghost of Yōtei",
    tagline: "A quiet path, one step at a time.",
    href: "/yotei",
    soundtrack: { youtubeId: "5L5HkpnMavg", local: "/soundtracks-local/yotei.m4a", label: "Ghost of Tsushima", previewAt: 0 },
  },
];

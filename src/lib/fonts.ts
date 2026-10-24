import {
  Caveat,
  IM_Fell_English,
  Oswald,
  Rajdhani,
  Rye,
  Share_Tech_Mono,
  Shippori_Mincho,
  Special_Elite,
  Zen_Maru_Gothic,
} from "next/font/google";

// Yōtei
export const mincho = Shippori_Mincho({
  variable: "--font-mincho",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
export const maru = Zen_Maru_Gothic({
  variable: "--font-maru",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

// Noir
export const typewriter = Special_Elite({
  variable: "--font-typewriter",
  preload: false,
  weight: "400",
  subsets: ["latin"],
});
export const oswald = Oswald({
  variable: "--font-oswald",
  preload: false,
  subsets: ["latin"],
});

// Frontier
export const rye = Rye({
  variable: "--font-rye",
  preload: false,
  weight: "400",
  subsets: ["latin"],
});
export const fell = IM_Fell_English({
  variable: "--font-fell",
  preload: false,
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});
export const caveat = Caveat({
  variable: "--font-caveat",
  preload: false,
  subsets: ["latin"],
});

// Night City
export const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  preload: false,
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
export const techMono = Share_Tech_Mono({
  variable: "--font-tech",
  preload: false,
  weight: "400",
  subsets: ["latin"],
});

export const allFonts = [
  mincho,
  maru,
  typewriter,
  oswald,
  rye,
  fell,
  caveat,
  rajdhani,
  techMono,
]
  .map((f) => f.variable)
  .join(" ");

import {
  Abril_Fatface,
  Anton,
  Archivo,
  Archivo_Black,
  Big_Shoulders_Stencil,
  Bodoni_Moda,
  Familjen_Grotesk,
  Holtwood_One_SC,
  Jost,
  Old_Standard_TT,
  Poiret_One,
  Special_Elite,
  Stardos_Stencil,
  Ultra,
  Work_Sans,
} from "next/font/google";

// Every face is declared once and nothing is preloaded: a browser only
// downloads a face when something on screen is set in it, so each world pays
// only for its own type. Faces are chosen from the movements' own practice
// (see .impeccable/research).

// Bauhaus: a wide semibold grotesk (the print workshop's Breite halbfette
// Grotesk), a plain grotesk for text, and a 1920s geometric for numerals.
export const archivo = Archivo({ subsets: ["latin"], preload: false, display: "swap", variable: "--font-archivo", axes: ["wdth"] });
export const workSans = Work_Sans({ subsets: ["latin"], preload: false, display: "swap", variable: "--font-work" });
export const jost = Jost({ subsets: ["latin"], preload: false, display: "swap", variable: "--font-jost" });

// Dada: woodtype, a fat Didone, a black grotesk, a typewriter, newsprint roman.
export const holtwood = Holtwood_One_SC({ subsets: ["latin"], preload: false, display: "swap", weight: "400", variable: "--font-holtwood" });
export const abril = Abril_Fatface({ subsets: ["latin"], preload: false, display: "swap", weight: "400", variable: "--font-abril" });
export const archivoBlack = Archivo_Black({ subsets: ["latin"], preload: false, display: "swap", weight: "400", variable: "--font-archivo-black" });
export const specialElite = Special_Elite({ subsets: ["latin"], preload: false, display: "swap", weight: "400", variable: "--font-elite" });
export const oldStandard = Old_Standard_TT({
  subsets: ["latin"],
  preload: false,
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-old-standard",
});
export const bodoni = Bodoni_Moda({ subsets: ["latin"], preload: false, display: "swap", style: ["normal", "italic"], variable: "--font-bodoni" });

// Pop Art: a fat Clarendon slab for logotypes, billboard sans, a back-of-pack grotesque.
export const ultra = Ultra({ subsets: ["latin"], preload: false, display: "swap", weight: "400", variable: "--font-ultra" });
export const anton = Anton({ subsets: ["latin"], preload: false, display: "swap", weight: "400", variable: "--font-anton" });
export const familjen = Familjen_Grotesk({ subsets: ["latin"], preload: false, display: "swap", variable: "--font-familjen" });

// Cubism (and Pop's stencil numerals): stencil caps, a serif stencil, thin poster caps.
export const bigStencil = Big_Shoulders_Stencil({ subsets: ["latin"], preload: false, display: "swap", variable: "--font-big-stencil" });
export const stardos = Stardos_Stencil({ subsets: ["latin"], preload: false, display: "swap", weight: ["400", "700"], variable: "--font-stardos" });
export const poiret = Poiret_One({ subsets: ["latin"], preload: false, display: "swap", weight: "400", variable: "--font-poiret" });

export const allFonts = [
  archivo,
  workSans,
  jost,
  holtwood,
  abril,
  archivoBlack,
  specialElite,
  oldStandard,
  bodoni,
  ultra,
  anton,
  familjen,
  bigStencil,
  stardos,
  poiret,
]
  .map((f) => f.variable)
  .join(" ");

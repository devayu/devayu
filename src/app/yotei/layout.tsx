import Footer from "@/components/Footer";
import WorldTheme from "@/components/worlds/WorldTheme";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yōtei",
  description:
    "Ayush Maurya's portfolio in the world of Yōtei: snow, crimson and a quiet path.",
};

export default function YoteiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
      <WorldTheme slug="yotei" />
    </>
  );
}

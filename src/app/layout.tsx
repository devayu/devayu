import GalleryRoot from "@/components/gallery/GalleryRoot";
import { StructuredData } from "@/components/StructuredData";
import { allFonts } from "@/lib/fonts";
import { defaultMetadata } from "@/lib/seo";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f0e0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${allFonts} antialiased`} suppressHydrationWarning>
        {children}
        <GalleryRoot />
      </body>
    </html>
  );
}

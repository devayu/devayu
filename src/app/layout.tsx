import AudioRoot from "@/components/audio/AudioRoot";
import Portal from "@/components/worlds/Portal";
import { StructuredData } from "@/components/StructuredData";
import { themeScript } from "@/hooks/useTheme";
import { defaultMetadata } from "@/lib/seo";
import type { Metadata, Viewport } from "next";
import { allFonts } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf0f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0907" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="atsu" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <StructuredData />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body
        className={`${allFonts} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        {children}
        <AudioRoot />
        <Portal />
      </body>
    </html>
  );
}

import { Metadata } from "next";

export const siteConfig = {
  name: "Ayush Maurya",
  title: "Ayush Maurya - Full Stack Developer",
  description:
    "Full stack developer specializing in React, Next.js, and Spring Boot. Currently building Beacon, an accessibility tool to make the web more inclusive.",
  url: "https://devayu.vercel.app/",
  ogImage: "/assets/og-image.png",
  links: {
    twitter: "https://x.com/idntkno_w",
    github: "https://github.com/devayu",
    linkedin: "https://linkedin.com/in/devayu",
    calendar: "https://cal.com/idntknw/quick-chat",
  },
  creator: "Ayush Maurya",
  keywords: [
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Spring Boot Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "Frontend Developer",
    "Backend Developer",
    "Web Developer",
    "Software Engineer",
    "Accessibility Developer",
    "React Native Developer",
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.creator,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "idntkno_w",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Ybh0Ppp1raWF3T6TZD_QI3DBbyLYNfKAkkj_8p1WitY",
  },
};

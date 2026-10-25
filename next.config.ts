import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "notion.so",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "file.notion.so",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // The four worlds used to be separate pages; they're chapters of one scroll now.
  async redirects() {
    return ["noir", "frontier", "night-city", "yotei"].map((slug) => ({
      source: `/${slug}`,
      destination: `/#${slug}`,
      permanent: false,
    }));
  },
};

export default nextConfig;

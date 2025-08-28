import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "beacon",
    title: "Beacon",
    description:
      "An accessibility checker that scans websites for A11y issues and guides teams toward building more inclusive, compliant experiences.",
    techStack: ["React", "TypeScript", "Node.js", "Accessibility"],
    githubLink: "https://github.com/devayu/beacon.git",
    featured: true,
    year: "2024",
    status: "in-progress",
  },
  {
    id: "logbase",
    title: "Logbase",
    description:
      "A lightweight analytics and monitoring platform with real-time event tracking, uptime monitoring, and project dashboards.",
    techStack: ["Next.js", "Prisma", "Redis", "QStash"],
    githubLink: "https://github.com/devayu/logbase",
    liveLink: "https://logbase.vercel.app",
    featured: true,
    year: "2024",
    status: "completed",
  },
  {
    id: "a1-landing",
    title: "A1 Associates Landing Website",
    description:
      "A sleek, SEO-optimized landing page designed for a client to boost their online presence and brand visibility.",
    techStack: ["Next.js", "SEO"],
    liveLink: "https://www.a1associates.ai",
    featured: true,
    year: "2024",
    status: "completed",
  },
  {
    id: "kickstore",
    title: "The Kicks Store",
    description:
      "A minimal sneaker e-commerce app with secure checkout via Stripe and Firebase-powered backend services.",
    techStack: ["Next.js", "Stripe", "Firebase"],
    githubLink: "https://github.com/devayu/thekickstore",
    liveLink: "https://thekickstore.vercel.app",
    featured: true,
    year: "2022",
    status: "completed",
  },
];

// Helper functions
export const getFeaturedProjects = () =>
  projects.filter((project) => project.featured);
export const getProjectsByStatus = (status: Project["status"]) =>
  projects.filter((project) => project.status === status);
export const getProjectById = (id: string) =>
  projects.find((project) => project.id === id);

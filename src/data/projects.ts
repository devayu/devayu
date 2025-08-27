import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "beacon",
    title: "Beacon",
    description:
      "A tool that detects accessibility issues and helps make the web more inclusive.",
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
      "An end-to-end analytics solution with realtime platform monitoring.",
    techStack: ["Next.js", "Primsa", "Redis", "QStash"],
    githubLink: "https://github.com/devayu/logbase",
    liveLink: "https://logbase.vercel.app",
    featured: true,
    year: "2024",
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

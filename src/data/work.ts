import { WorkExperience } from "@/types";

// Wrap a phrase in **double asterisks** to highlight it.
export const workExperience: WorkExperience[] = [
  {
    id: "agilon-sse",
    title: "Senior Software Engineer",
    location: "agilon Health",
    description: [
      "Migrated a legacy Groovy monolith into Spring Boot microservices, for a **60% performance boost**.",
      "Architected and built React modules for reviewing patient conditions, with an estimated **$10M revenue impact**.",
    ],
    yearString: "Oct 2022 – Present",
    time: "full-time",
  },
  {
    id: "a1-landing",
    title: "Freelance",
    location: "A1 Associates",
    description: [
      "Designed and built a responsive landing page with Next.js.",
      "SEO work that put the company in the **top 5 Google results** for its name.",
    ],
    yearString: "2024",
    time: "part-time",
  },
];

export const getWorkById = (id: string) =>
  workExperience.find((work) => work.id === id);

import { WorkExperience } from "@/types";

export const workExperience: WorkExperience[] = [
  {
    id: "agilon-sse",
    title: "Senior Software Engineer",
    location: "agilon Health",
    description: [
      `<div class="flex items-start gap-2 mb-2">
        <span class="text-primary font-bold">•</span>
        <span>Worked on migration of a legacy groovy monolith application into Spring boot microservices achieving a <span class="text-primary font-extrabold font-garamond italic">60% performance boost</span>.</span>
      </div>`,
      `<div class="flex items-start gap-2">
        <span class="text-primary font-bold">•</span>
        <span>Architected and developd multiple react modules to enhance patient conditions review, generating an estimated <span class="text-primary font-extrabold font-garamond italic">$10M revenue impact</span>.</span>
      </div>`,
    ],
    yearString: "Oct 2022 - Present",
    time: "full-time",
  },
  {
    id: "a1-landing",
    title: "Freelance",
    location: "A1 Associates",
    description: [
      `<div class="flex items-start gap-2 mb-2">
        <span class="text-primary font-bold">•</span>
        <span>Designed and built a responsive landing page with Next.js.</span>
      </div>`,
      `<div class="flex items-start gap-2">
        <span class="text-primary font-bold">•</span>
        <span>Implemented SEO optimizations that ranked the company in the <span class="text-primary font-extrabold font-garamond italic">Top 5 Google search results</span> for its name.</span>
      </div>`,
    ],
    yearString: "2024 - Freelance",
    time: "part-time",
  },
];

export const getWorkById = (id: string) =>
  workExperience.find((work) => work.id === id);

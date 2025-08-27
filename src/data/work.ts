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
        <span>Architected and develop multiple react modules to enhance patient conditions review, generating an estimated <span class="text-primary font-extrabold font-garamond italic">$10M revenue impact</span>.</span>
      </div>`,
    ],
    yearString: "Oct 2022 - Present",
    time: "part-time",
  },
];

export const getWorkById = (id: string) =>
  workExperience.find((work) => work.id === id);

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  liveLink?: string;
  featured?: boolean;
  year?: string;
  status?: "completed" | "in-progress" | "planned";
}

export interface WorkExperience {
  id: string;
  title: string;
  location: string;
  description: string[];
  yearString?: string;
  time?: "full-time" | "part-time";
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

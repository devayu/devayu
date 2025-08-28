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

// Notion Types
export interface NotionRichText {
  type: string;
  text?: {
    content: string;
    link?: {
      url: string;
    } | null;
  };
  plain_text: string;
  href?: string | null;
}

export interface NotionFile {
  name: string;
  file: {
    url: string;
  };
  type: "file" | "external";
  expiry_time?: string | null;
}

export interface NotionCover {
  type: "file" | "external";
  url: string;
  expiry_time?: string | null;
}

export interface NotionIcon {
  type: "emoji" | "file" | "external";
  url?: string;
  emoji?: string;
}

export interface NotionProperty {
  id: string;
  type: string;
  title?: NotionRichText[];
  rich_text?: NotionRichText[];
  number?: number | null;
  select?: {
    id: string;
    name: string;
    color: string;
  } | null;
  multi_select?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  date?: {
    start: string;
    end?: string | null;
    time_zone?: string | null;
  } | null;
  checkbox?: boolean;
  url?: string | null;
  email?: string | null;
  phone_number?: string | null;
  files?: NotionFile[];
}

export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  url: string;
  cover?: NotionCover | null;
  icon?: NotionIcon | null;
  properties: Record<string, NotionProperty>;
}

export interface TransformedNotionItem {
  id: string;
  created_time: string;
  last_edited_time: string;
  url: string;
  cover?: NotionCover;
  icon?: NotionIcon;
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | NotionFile[]
    | NotionCover
    | NotionIcon
    | null
    | undefined;
}

export interface NotionAPIResponse {
  success: boolean;
  data: TransformedNotionItem[];
  total_count: number;
  error?: string;
  message?: string;
}

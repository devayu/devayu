import { siteConfig } from "@/lib/seo";
import { projects } from "@/data/projects";
import { workExperience } from "@/data/work";

export function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: "Full Stack Developer",
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/assets/og-image.png`,
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.github,
      siteConfig.links.linkedin,
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Spring Boot",
      "Java",
      "Node.js",
      "Web Development",
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
      "Web Accessibility",
      "Software Engineering",
    ],
    worksFor: {
      "@type": "Organization",
      name: "agilon Health",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Your University", // Update with your actual university
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    inLanguage: "en-US",
  };

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${siteConfig.name} - Developer Portfolio`,
    description: siteConfig.description,
    url: siteConfig.url,
    creator: {
      "@type": "Person",
      name: siteConfig.name,
    },
    datePublished: "2024-01-01", // Update with your actual launch date
    dateModified: new Date().toISOString(),
    genre: "Portfolio",
    audience: {
      "@type": "Audience",
      audienceType: "Employers, Clients, Developers",
    },
  };

  // Organization schema for current work
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "agilon Health",
    employee: {
      "@type": "Person",
      name: siteConfig.name,
      jobTitle: "Senior Software Engineer",
    },
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      personSchema,
      websiteSchema,
      portfolioSchema,
      organizationSchema,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combinedSchema),
      }}
    />
  );
}

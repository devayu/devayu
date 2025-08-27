"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Github } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

type ProjectCardProps = {
  title: string;
  description: string;
  githubLink?: string;
  liveLink?: string;
  techStack?: string[];
};

export const ProjectCard = ({
  title,
  description,
  githubLink,
  liveLink,
  techStack,
}: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const links = linksRef.current;

    if (!card || !links) return;

    // Check if it's a touch device (mobile)
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isMobile) {
      // On mobile, don't apply any GSAP animations - let CSS handle visibility
      return;
    }

    // Desktop: Set initial state - links hidden
    gsap.set(links, {
      opacity: 0,
      x: 20,
      scale: 0.8,
    });

    const handleMouseEnter = () => {
      gsap.to(links, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(links, {
        opacity: 0,
        x: 20,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.inOut",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <Card
      ref={cardRef}
      className="border border-border/50 bg-background/40 backdrop-blur-md shadow-lg hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300 hover:bg-background/50"
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold font-space-grotesk text-foreground mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            {techStack && techStack.length ? (
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs rounded-md border border-border/50 bg-background/40 backdrop-blur-md text-foreground/90 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div ref={linksRef} className="flex items-center gap-3">
            {githubLink ? (
              <Link
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border/40 bg-background/30 backdrop-blur-sm md:hover:border-primary/50 md:hover:bg-primary/10 md:transition-all md:duration-200 group"
              >
                <Github className="w-4 h-4 text-muted-foreground md:group-hover:text-primary md:transition-colors" />
              </Link>
            ) : null}
            {liveLink ? (
              <Link
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border/40 bg-background/30 backdrop-blur-sm md:hover:border-primary/50 md:hover:bg-primary/10 md:transition-all md:duration-200 group"
              >
                <Eye className="w-4 h-4 text-muted-foreground md:group-hover:text-primary md:transition-colors" />
              </Link>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;

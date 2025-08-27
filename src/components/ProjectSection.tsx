import ProjectCard from "@/components/ProjectCard";
import { getFeaturedProjects } from "@/data";

const ProjectSection = () => {
  const projects = getFeaturedProjects();
  return (
    <div className="font-hanken-grotesk">
      <h2 className="text-xl font-semibold font-space-grotesk">Projects</h2>
      <h3 className="text-sm text-primary">
        A few things I have been building
      </h3>
      <div className="space-y-5 mt-5">
        {projects.map((project) => {
          return <ProjectCard {...project} key={project.id}></ProjectCard>;
        })}
      </div>
    </div>
  );
};

export default ProjectSection;

import WorkCard from "@/components/WorkCard";
import { workExperience } from "@/data";

const OpenToWorkPill = () => {
  return (
    <div className="font-garamond italic font-light  text-green-500  px-2 text-sm rounded-full border-1 border-green-500">
      Open for work
    </div>
  );
};
export const WorkSection = () => {
  return (
    <div>
      <div className="flex gap-2 items-center">
        <h2 className="text-xl font-semibold font-hanken-grotesk">Work</h2>
        <OpenToWorkPill></OpenToWorkPill>
      </div>
      <h3 className="text-sm text-primary font-hanken-grotesk">
        A few places I’ve contributed my skills
      </h3>
      <div className="space-y-3 mt-5">
        {workExperience.map((work) => {
          return <WorkCard {...work} key={work.id}></WorkCard>;
        })}
      </div>
    </div>
  );
};

export default WorkSection;

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WorkExperience } from "@/types";

const WorkCard = ({
  title,
  description,
  time,
  yearString,
  location,
}: WorkExperience) => {
  return (
    <Card className="bg-background/40 backdrop-blur-md shadow-lg hover:shadow-primary/10transition-all duration-300 hover:bg-background/50 border-0 font-hanken-grotesk border-b-2 border-dashed rounded-none">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <div className="flex gap- flex-col mb-2">
            <div className="font-medium font-space-grotesk">{title}</div>
            <div className="opacity-85">{location}</div>
            <div className="text-sm  text-muted-foreground font-garamond italic font-semibold">
              {yearString}
            </div>
          </div>
          {description.length > 0 && (
            <div className="space-y-2">
              {description.map((item, idx) => {
                return (
                  <div
                    key={idx}
                    className="text-sm text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkCard;

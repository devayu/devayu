import { chapters } from "@/components/journey/chapters";
import { worlds, type WorldSlug } from "@/data/worlds";
import { cn } from "@/lib/utils";

// Mid-transformation, the incoming chapter names itself, then gets out of the way.
export default function GateChapter({ world, className }: { world: WorldSlug; className?: string }) {
  const w = worlds.find((x) => x.slug === world)!;
  return (
    <div aria-hidden className="gate-mid pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 px-6 text-center">
      <p className={cn("text-[clamp(2.6rem,9vw,7rem)] leading-none drop-shadow-[0_4px_24px_rgb(0_0_0/0.55)]", className)}>{w.name}</p>
      <p className="font-sans text-sm tracking-[0.25em] text-[#ece8df]/85 drop-shadow">
        {chapters[world].n.toUpperCase()}: {chapters[world].label.toUpperCase()}
      </p>
    </div>
  );
}

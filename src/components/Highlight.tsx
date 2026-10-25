import { cn } from "@/lib/utils";

// Renders text with **phrases** emphasised. Each world passes its own style.
export default function Highlight({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className={cn("font-bold", className)}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

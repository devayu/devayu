// One authored arrow, drawn with the same 1.75 stroke everywhere in the room:
// a straight shaft and an open, slightly unequal head (cut card, not a glyph).

type Dir = "left" | "down" | "out";

const PATHS: Record<Dir, string> = {
  left: "M15 8 H2.5 M7 3.5 L2.5 8 L7.5 12.5",
  down: "M8 1.5 V14 M3.5 9.5 L8 14 L12.5 9",
  out: "M3 13 L13 3 M6 3 H13 V10.5",
};

export default function Arrow({ dir, className }: { dir: Dir; className?: string }) {
  return (
    <svg
      className={`cb-arrow ${className ?? ""}`}
      viewBox="0 0 16 16"
      width="0.9em"
      height="0.9em"
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d={PATHS[dir]} />
    </svg>
  );
}

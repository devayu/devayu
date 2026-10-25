"use client";

// Back to the gallery: the four rooms' grounds slide shut like hanging
// canvases, then part on the wall.

export const timing = { cover: 560, reveal: 620 };

const grounds = ["#EDE7D9", "#EDE6D3", "#FFD400", "#E8DCC4"];

export default function GalleryCover({ phase }: { phase: "cover" | "reveal" }) {
  return (
    <div className="gallery-cover fixed inset-0 flex gap-[10px] bg-transparent" data-phase={phase}>
      {grounds.map((g, i) => (
        <span key={g} className="gallery-cover-panel h-full flex-1" style={{ background: g, ["--i" as string]: i }} />
      ))}
    </div>
  );
}

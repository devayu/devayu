import Image from "next/image";

import { TransformedNotionItem } from "@/types";

interface NotionGridProps {
  data: TransformedNotionItem[];
}

const imageFields = [
  "image",
  "images",
  "photo",
  "photos",
  "picture",
  "pictures",
  "thumbnail",
  "file",
  "files",
  "media",
  "url",
];

const getImageUrl = (item: TransformedNotionItem): string | null => {
  if (item.cover?.url) return item.cover.url;
  if (item.icon?.url && item.icon.type !== "emoji") return item.icon.url;

  for (const field of imageFields) {
    const value = item[field];

    if (Array.isArray(value) && value.length > 0) {
      const first = value[0];
      if (typeof first === "object" && first && typeof first.file?.url === "string") {
        return first.file.url;
      }
      if (typeof first === "string" && first.startsWith("http")) return first;
    }
    if (value && typeof value === "object" && "url" in value && typeof value.url === "string") {
      return value.url;
    }
    if (typeof value === "string" && value.startsWith("http")) return value;
  }
  return null;
};

const firstString = (item: TransformedNotionItem, fields: string[]) => {
  for (const field of fields) {
    const value = item[field];
    if (value && typeof value === "string") return value;
  }
  return null;
};

// Each fragment hangs like an ema, the wooden wish plaques at a shrine.
const NotionGrid = ({ data }: NotionGridProps) => {
  if (data.length === 0) {
    return (
      <p className="mt-16 max-w-md text-ink-soft">
        Nothing is hanging here yet. New fragments added in Notion show up
        within the hour.
      </p>
    );
  }

  return (
    <div className="mt-14 columns-1 gap-8 sm:columns-2 lg:columns-3">
      {data.map((item, index) => {
        const imageUrl = getImageUrl(item);
        const title = firstString(item, ["name", "title", "heading", "subject"]);
        const description = firstString(item, ["description", "content", "summary", "excerpt", "notes"]);

        return (
          <figure key={item.id} className="ema relative mb-12 break-inside-avoid pt-6">
            {/* cord and peg */}
            <span aria-hidden className="absolute left-1/2 top-0 h-7 w-px -translate-x-1/2 bg-crimson" />
            <span aria-hidden className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1 rounded-full bg-gold" />
            <div
              className="relative px-5 pb-5 pt-10 text-[var(--wood-ink)]"
              style={{
                clipPath: "polygon(50% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)",
                background:
                  "repeating-linear-gradient(176deg, var(--wood) 0 9px, var(--wood-grain) 9px 10px, var(--wood) 10px 23px)",
              }}
            >
              <span aria-hidden className="absolute left-1/2 top-6 size-2 -translate-x-1/2 rounded-full bg-[var(--wood-ink)]/40" />
              {imageUrl && (
                <div className="overflow-hidden rounded-md">
                  <Image
                    src={imageUrl}
                    alt={title ?? `Fragment ${index + 1}`}
                    width={400}
                    height={300}
                    className="h-auto max-h-80 w-full object-cover"
                  />
                </div>
              )}
              <figcaption className="mt-4 space-y-2">
                {title && (
                  <h2 className="font-mincho text-lg font-bold leading-snug">{title}</h2>
                )}
                {description && (
                  <blockquote className="font-mincho leading-relaxed opacity-80">
                    “{description}”
                  </blockquote>
                )}
                <p className="pt-1 text-xs opacity-60">
                  {new Date(item.created_time).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </figcaption>
            </div>
          </figure>
        );
      })}
    </div>
  );
};

export default NotionGrid;

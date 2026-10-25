import Image from "next/image";

import { dice, hash } from "@/components/worlds/dada/chance";
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

const PAPERS = ["dd-scrap--news", "dd-scrap--aged", "dd-scrap--slip", "dd-scrap--ticket", "dd-scrap--receipt"];

// Fragments pasted onto a Merz board: each one a scrap of different paper,
// glued at a chance angle (seeded by its id, so it stays put), photos screened
// to halftone with a hard scissor cut, text scraps torn along the bottom, and
// a postmark for the day it arrived.
const NotionGrid = ({ data }: NotionGridProps) => {
  if (data.length === 0) {
    return (
      <div className="dd-frag-empty">
        <div className="dd-frag-ticket">
          <span className="dd-frag-ticket-no" aria-hidden>
            No 0000
          </span>
          <p>Nothing is pasted here yet. New fragments added in Notion show up within the hour.</p>
          <span className="dd-frag-ticket-stamp" aria-hidden>
            leer
          </span>
        </div>
      </div>
    );
  }

  return (
    <ul className="dd-frag-board">
      {data.map((item, index) => {
        const imageUrl = getImageUrl(item);
        const title = firstString(item, ["name", "title", "heading", "subject"]);
        const description = firstString(item, ["description", "content", "summary", "excerpt", "notes"]);
        const d = dice(hash(item.id));
        const tilt = d.sign() * d.range(1, 4.5);
        const date = new Date(item.created_time);

        return (
          <li
            key={item.id}
            className={`dd-scrap ${PAPERS[index % PAPERS.length]}${imageUrl ? " dd-scrap--pic" : " dd-torn"}`}
            style={{ "--tilt": `${tilt.toFixed(1)}deg` } as React.CSSProperties}
          >
            <figure>
              {imageUrl && (
                <div className="dd-scrap-img" style={{ clipPath: `polygon(${d.range(0, 3).toFixed(1)}% 0, 100% ${d.range(0, 4).toFixed(1)}%, ${d.range(97, 100).toFixed(1)}% 100%, 0 ${d.range(96, 100).toFixed(1)}%)` }}>
                  <Image
                    src={imageUrl}
                    alt={title ?? `Fragment ${index + 1}`}
                    width={400}
                    height={300}
                    className="dd-scrap-photo"
                  />
                </div>
              )}
              <figcaption>
                {title && <h2 className="dd-scrap-title">{title}</h2>}
                {description && <blockquote className="dd-scrap-quote">“{description}”</blockquote>}
                <p className="dd-scrap-date">
                  <time dateTime={item.created_time}>
                    {date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </time>
                </p>
              </figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
};

export default NotionGrid;

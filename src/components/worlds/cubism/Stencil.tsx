import { Fragment } from "react";

// A heading in stencil caps that fills letter by letter, as if sprayed through
// a cut card (30ms apart). The text is whole for assistive tech; the letters
// are decoration. Visible without JS: the wipe only arms once Effects runs.

type Props = {
  as?: "h1" | "h2" | "h3";
  text: string;
  className?: string;
  id?: string;
};

export default function Stencil({ as: Tag = "h2", text, className, id }: Props) {
  let n = 0;
  return (
    <Tag id={id} className={`cb-st ${className ?? ""}`} data-reveal>
      <span className="cb-sr">{text}</span>
      {text.split(" ").map((word, w) => (
        <Fragment key={w}>
          {w > 0 && " "}
          <span className="cb-st-w" aria-hidden>
            {word.split("").map((ch, i) => (
              <span key={i} className="cb-st-l" style={{ ["--i" as string]: n++ }}>
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}

"use client";

import { personalInfo } from "@/data/personal";
import { useRef } from "react";

// "Just what is it…" logic, rebuilt: a room assembled from printed scraps.
// A television holding a flat-printed stand-in portrait (there is no photo,
// so it is honest about being a print), a framed poster of the job, and one
// giant everyday object carrying one word. The scraps on the floor are the
// way into the rest of the room.

const SCRAPS = [
  { href: "#shelf", aisle: "Aisle 1", label: "What I can do", ink: "#FFD400" },
  {
    href: "#work",
    aisle: "Billboards",
    label: "Where I've been",
    ink: "#2EB4E6",
  },
  { href: "#made", aisle: "Boxed", label: "Things I've made", ink: "#FF5FA2" },
  { href: "#checkout", aisle: "Checkout", label: "Say hello", ink: "#A6D608" },
];

function Television() {
  return (
    <figure className="pp-tv">
      <svg
        viewBox="0 0 400 360"
        className="pp-tv-svg"
        role="img"
        aria-label="A flat-printed portrait on a television, standing in for a photo"
      >
        <defs>
          <clipPath id="pp-tv-screen">
            <rect x="46" y="62" width="250" height="200" rx="26" />
          </clipPath>
          <pattern
            id="pp-tv-dots"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
          >
            <circle className="pp-dot" cx="4.5" cy="4.5" r="1.8" fill="#111" />
          </pattern>
        </defs>
        {/* antenna */}
        <g
          className="pp-key-l"
          stroke="#111"
          strokeWidth="6"
          strokeLinecap="round"
        >
          <path d="M170 48 L120 6" />
          <path d="M190 48 L260 10" />
        </g>
        {/* ink: cabinet, screen ground, knob panel */}
        <rect x="20" y="40" width="360" height="250" rx="18" fill="#FF6A13" />
        <rect x="46" y="62" width="250" height="200" rx="26" fill="#2EB4E6" />
        <rect x="312" y="62" width="48" height="200" fill="#FFD400" />
        <rect x="60" y="290" width="40" height="44" fill="#111" />
        <rect x="300" y="290" width="40" height="44" fill="#111" />
        {/* the portrait, printed on the screen */}
        <g clipPath="url(#pp-tv-screen)">
          <rect
            x="46"
            y="62"
            width="250"
            height="200"
            fill="url(#pp-tv-dots)"
            opacity="0.25"
          />
          <g className="pp-sitter">
            {/* shoulders */}
            <path
              d="M84 262 C92 214 128 200 171 200 C214 200 250 214 258 262 Z"
              fill="#111"
            />
            {/* face */}
            <path
              d="M126 140 C126 104 146 86 171 86 C196 86 216 104 216 140 C216 178 196 204 171 204 C146 204 126 178 126 140 Z"
              fill="#FF5FA2"
            />
            {/* hair */}
            <path
              d="M120 132 C116 92 140 70 172 70 C206 70 228 92 222 132 C214 112 200 104 186 108 C172 98 146 100 132 116 Z"
              fill="#111"
            />
            {/* eyes: they blink, in three hard frames */}
            <g className="pp-eyes">
              <rect x="146" y="138" width="12" height="7" fill="#111" />
              <rect x="184" y="138" width="12" height="7" fill="#111" />
            </g>
            <path d="M160 178 H184" stroke="#E2231A" strokeWidth="6" />
          </g>
          {/* the key layer of the face, off-register */}
          <g
            className="pp-sitter pp-sitter-key"
            fill="none"
            stroke="#111"
            strokeWidth="3"
          >
            <path d="M126 140 C126 104 146 86 171 86 C196 86 216 104 216 140 C216 178 196 204 171 204 C146 204 126 178 126 140 Z" />
          </g>
        </g>
        {/* black key over the cabinet, printed a few pixels off */}
        <g
          className="pp-key-l"
          fill="none"
          stroke="#111"
          strokeWidth="6"
          strokeLinejoin="round"
        >
          <rect x="20" y="40" width="360" height="250" rx="18" />
          <rect x="46" y="62" width="250" height="200" rx="26" />
          <circle cx="336" cy="104" r="14" />
          <circle cx="336" cy="150" r="14" />
          <path d="M322 200 H350 M322 216 H350 M322 232 H350" />
        </g>
      </svg>
      <figcaption className="pp-tv-cap">
        Screen Test, flat print. No photo on file.
      </figcaption>
    </figure>
  );
}

function Cup() {
  return (
    <svg viewBox="0 0 240 400" className="pp-cup" aria-hidden>
      <defs>
        <pattern
          id="pp-cup-dots"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <circle className="pp-dot" cx="5" cy="5" r="2" fill="#E2231A" />
        </pattern>
      </defs>
      {/* ink */}
      <path d="M30 70 L210 70 L186 390 L54 390 Z" fill="#F4EEDC" />
      <path d="M30 70 L210 70 L186 390 L54 390 Z" fill="url(#pp-cup-dots)" />
      <path d="M40 170 L200 170 L192 280 L48 280 Z" fill="#FFD400" />
      <rect x="18" y="40" width="204" height="30" fill="#111" />
      <rect x="40" y="22" width="160" height="22" fill="#111" />
      <text
        x="120"
        y="244"
        textAnchor="middle"
        fontFamily="var(--font-ultra)"
        fontSize="44"
        fill="#E2231A"
        textLength="140"
        lengthAdjust="spacingAndGlyphs"
      >
        HELLO
      </text>
      {/* key */}
      <g
        className="pp-key-l"
        fill="none"
        stroke="#111"
        strokeWidth="5"
        strokeLinejoin="round"
      >
        <path d="M30 70 L210 70 L186 390 L54 390 Z" />
        <path d="M40 170 L200 170 L192 280 L48 280 Z" />
      </g>
      <text
        className="pp-key-l"
        x="120"
        y="244"
        textAnchor="middle"
        fontFamily="var(--font-ultra)"
        fontSize="44"
        fill="none"
        stroke="#111"
        strokeWidth="1.6"
        textLength="140"
        lengthAdjust="spacingAndGlyphs"
      >
        HELLO
      </text>
    </svg>
  );
}

export default function Intro() {
  const ref = useRef<HTMLElement>(null);
  const raf = useRef(0);

  return (
    <section
      ref={ref}
      id="hello"
      className="pp-intro"
      aria-labelledby="pp-hello"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const x = e.clientX;
        const y = e.clientY;
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(() => {
          const el = ref.current;
          const cup = el?.querySelector(".pp-cup")?.getBoundingClientRect();
          if (!el || !cup) return;
          // Ben-Day dots swell as you come closer to the object.
          const d = Math.hypot(
            x - (cup.left + cup.width / 2),
            y - (cup.top + cup.height / 2),
          );
          const near = Math.max(0, 1 - d / 520);
          el.style.setProperty("--dot", `${(1.6 + near * 2.2).toFixed(2)}px`);
        });
      }}
      onPointerLeave={() => ref.current?.style.setProperty("--dot", "1.8px")}
    >
      <div className="pp-intro-room">
        <div className="pp-intro-tv pp-pullbox" data-pull>
          <Television />
        </div>

        <div className="pp-intro-copy">
          <h1
            id="pp-hello"
            className="pp-print pp-h1"
            data-pull
            data-text="I'm Ayush."
          >
            <span className="pp-print-ink">I&apos;m Ayush.</span>
          </h1>
          <p className="pp-lead">
            New! Improved! Now with TypeScript. That&apos;s the label. The
            contents: a {personalInfo.title.toLowerCase()} in{" "}
            {personalInfo.location}.
          </p>
          <p>
            React and Next.js up front, where you can see them. Spring Boot in
            the back room, doing the heavy lifting. Right now I&apos;m building{" "}
            {personalInfo.currentProject.name},{" "}
            {personalInfo.currentProject.blurb}.
          </p>
          <p>Everything in this room is true. Only the packaging is made up.</p>
        </div>

        <div className="pp-poster-wrap pp-pullbox" data-pull>
          <figure className="pp-poster">
            <div className="pp-poster-sheet">
              <span className="pp-poster-top">Now showing</span>
              <span className="pp-poster-big">Full</span>
              <span className="pp-poster-big">Stack</span>
              <span className="pp-poster-mid">Developer</span>
              <span className="pp-poster-foot">
                Made in {personalInfo.location}
              </span>
            </div>
            <figcaption className="sr-only">
              A framed poster: Full Stack Developer, made in{" "}
              {personalInfo.location}.
            </figcaption>
          </figure>
        </div>

        <div className="pp-intro-cup">
          <Cup />
        </div>

        <nav className="pp-scraps" aria-label="In this room">
          {SCRAPS.map((s, i) => (
            <a
              key={s.href}
              href={s.href}
              className="pp-scrap"
              style={{
                ["--s" as string]: s.ink,
                ["--r" as string]: `${[-3, 2, -1.5, 3][i]}deg`,
              }}
            >
              <span className="pp-scrap-aisle">{s.aisle}</span>
              <span className="pp-scrap-label">{s.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

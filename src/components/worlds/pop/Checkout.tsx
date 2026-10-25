"use client";

import { personalInfo, socialLinks } from "@/data/personal";
import { projects } from "@/data/projects";
import { audio } from "@/lib/audio/manager";
import { useEffect, useRef } from "react";

// What's next and how to reach me, as the checkout. Beacon is the product
// that's still printing (the run gets more ink toward the end, because it's
// coming in, not going out). Then the receipt, and one big soft button.

const beacon = projects.find((p) => p.id === "beacon");

function SilverClouds() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const pillows = Array.from(host.querySelectorAll<HTMLElement>(".pp-cloud"));
    const state = pillows.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    let px = -9999;
    let py = -9999;
    let raf = 0;
    let visible = false;
    const section = host.parentElement!;
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
    };
    const tick = () => {
      pillows.forEach((p, i) => {
        const s = state[i];
        const r = p.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - px;
        const dy = cy - py;
        const d = Math.hypot(dx, dy);
        // The cursor pushes a pillow away; a soft spring brings it home.
        if (d < 220 && d > 0) {
          const f = (1 - d / 220) * 1.4;
          s.vx += (dx / d) * f;
          s.vy += (dy / d) * f;
        }
        s.vx += -s.x * 0.012;
        s.vy += -s.y * 0.012;
        s.vx *= 0.9;
        s.vy *= 0.9;
        s.x += s.vx;
        s.y += s.vy;
        p.style.setProperty("--nx", `${s.x.toFixed(1)}px`);
        p.style.setProperty("--ny", `${s.y.toFixed(1)}px`);
      });
      if (visible) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(section);
    section.addEventListener("pointermove", onMove);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className="pp-clouds" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="pp-cloud" style={{ ["--c" as string]: i }}>
          <svg viewBox="0 0 200 140" className="pp-cloud-svg">
            <defs>
              <linearGradient id={`pp-silver-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#F2F3F5" />
                <stop offset="0.55" stopColor="#C9CCD1" />
                <stop offset="1" stopColor="#F2F3F5" />
              </linearGradient>
            </defs>
            <path
              d="M14 30 C10 12 30 6 50 12 C80 2 120 2 150 12 C172 6 192 14 186 32 C196 60 196 84 186 108 C192 128 172 136 150 128 C120 138 80 138 50 128 C28 136 8 126 14 108 C4 84 4 58 14 30 Z"
              fill={`url(#pp-silver-${i})`}
            />
            <path
              d="M40 34 C80 26 120 26 160 34"
              fill="none"
              stroke="#F2F3F5"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default function Checkout() {
  const btn = useRef<HTMLAnchorElement>(null);
  const cal = personalInfo.calendarLink.replace(/^https?:\/\//, "");

  const squash = () => {
    const el = btn.current;
    if (!el) return;
    el.classList.remove("is-squashed");
    void el.offsetWidth; // restart the slump
    el.classList.add("is-squashed");
    audio.sfx("pop");
  };

  const rows = [
    {
      item: "Email",
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    { item: "A call", value: cal, href: personalInfo.calendarLink },
    ...socialLinks.map((s) => ({
      item: s.name,
      value: s.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      href: s.url,
    })),
  ];

  return (
    <section id="checkout" className="pp-checkout" aria-labelledby="pp-next-h">
      <SilverClouds />

      <div className="pp-next">
        <h2
          id="pp-next-h"
          className="pp-print pp-h2"
          data-pull
          data-text="What's next."
        >
          <span className="pp-print-ink">What&apos;s next.</span>
        </h2>
        <div className="pp-soon">
          <div className="pp-soon-run" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="pp-soon-print"
                style={{ ["--n" as string]: i }}
              >
                <svg viewBox="0 0 100 140" className="pp-soon-svg">
                  <g transform="rotate(-90 50 70)">
                    <text x="50" y="86" textAnchor="middle" textLength="124" lengthAdjust="spacingAndGlyphs" className="pp-soon-ink">
                      {personalInfo.currentProject.name}
                    </text>
                    <text x="50" y="86" textAnchor="middle" textLength="124" lengthAdjust="spacingAndGlyphs" className="pp-soon-key">
                      {personalInfo.currentProject.name}
                    </text>
                  </g>
                </svg>
              </span>
            ))}
          </div>
          <div className="pp-soon-label">
            <p className="pp-soon-flag">
              Coming soon. Honestly: still printing.
            </p>
            <p className="pp-soon-copy">
              {personalInfo.currentProject.name} is what I&apos;m building now:{" "}
              {personalInfo.currentProject.blurb}.
              {beacon ? ` ${beacon.description}` : ""}
            </p>
            <p className="pp-soon-fine">
              Ingredients: {beacon?.techStack.join(", ")}. Not on shelves yet.{" "}
              <a
                href={personalInfo.currentProject.href}
                target="_blank"
                rel="noreferrer"
              >
                Watch it print on GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <footer className="pp-till">
        <div className="pp-receipt-wrap pp-pullbox pp-pullbox-y" data-pull>
          <div className="pp-receipt">
            <p className="pp-receipt-head">
              <span>devayu general store</span>
              <span>Thank you for shopping</span>
            </p>
            <h2 className="pp-receipt-title">Say hello.</h2>
            <ul className="pp-receipt-rows">
              {rows.map((r) => (
                <li key={r.item}>
                  <span className="pp-receipt-item">{r.item}</span>
                  <span className="pp-receipt-dots" aria-hidden />
                  <a
                    href={r.href}
                    target={r.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer"
                  >
                    {r.value}
                  </a>
                </li>
              ))}
            </ul>
            <p className="pp-receipt-total">
              <span>Total</span>
              <span>One conversation</span>
            </p>
            <p className="pp-receipt-foot">
              Change due: none. No returns needed. Esc takes you back to the
              gallery.
            </p>
            <span className="pp-receipt-bars" aria-hidden />
          </div>
        </div>

        <div className="pp-buy">
          <a
            ref={btn}
            href={personalInfo.calendarLink}
            target="_blank"
            rel="noreferrer"
            className="pp-squash"
            onPointerDown={squash}
            onKeyDown={(e) => {
              if (e.key === "Enter") squash();
            }}
            onAnimationEnd={(e) =>
              e.currentTarget.classList.remove("is-squashed")
            }
          >
            <span className="pp-squash-ink">Book a call</span>
          </a>
          <p className="pp-buy-note">
            A quick chat, booked on cal.com. Press firmly.
          </p>
        </div>
      </footer>
    </section>
  );
}

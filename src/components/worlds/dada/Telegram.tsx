"use client";

import { personalInfo, socialLinks } from "@/data/personal";
import { audio } from "@/lib/audio/manager";
import { useEffect, useRef, useState } from "react";
import { Bowler, Manicule } from "./art";

// What's next and how to reach me, typed on a telegram form. Sending it
// opens your mail with my address; a red EXPEDIÉ stamp lands on the form as
// it goes. Bowler hats drift across, as in Richter's film, and dodge you.

const handle = (url: string) => url.replace(/\/$/, "").split("/").pop();

function Bowlers() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const field = ref.current;
    const section = field?.parentElement;
    if (!field || !section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hats = Array.from(field.querySelectorAll<HTMLElement>(".dd-bowler-i"));
    let raf = 0;
    let px = -9999;
    let py = -9999;
    const tick = () => {
      raf = 0;
      for (const h of hats) {
        const r = h.parentElement!.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - px;
        const dy = cy - py;
        const dist = Math.hypot(dx, dy) || 1;
        const push = dist < 170 ? (170 - dist) * 0.9 : 0;
        h.style.transform = push ? `translate(${((dx / dist) * push).toFixed(0)}px, ${((dy / dist) * push).toFixed(0)}px) rotate(${(dx > 0 ? 8 : -8)}deg)` : "";
      }
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      px = py = -9999;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    section.addEventListener("pointermove", move);
    section.addEventListener("pointerleave", leave);
    return () => {
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className="dd-bowlers" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={`dd-bowler dd-bowler--${i}`}>
          <span className="dd-bowler-i">
            <Bowler className="dd-bowler-svg" />
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Telegram() {
  const [sent, setSent] = useState(0);
  const mail = `mailto:${personalInfo.email}?subject=${encodeURIComponent("Telegram from your Dada room")}`;

  return (
    <>
      <Bowlers />
      <div className="dd-telegram">
        <div className="dd-tg-head" aria-hidden>
          <span className="dd-tg-mast">Telegramm</span>
          <span className="dd-tg-fields">
            <span>An / to: Ayush</span>
            <span>Von / from: you</span>
            <span>Wörter: as many as you like</span>
          </span>
        </div>

        <div className="dd-tg-body">
          <p>
            NOW BUILDING{" "}
            <a href={personalInfo.currentProject.href} target="_blank" rel="noreferrer">
              {personalInfo.currentProject.name.toUpperCase()}
            </a>{" "}
            <b>STOP</b> {personalInfo.currentProject.blurb.toUpperCase()} <b>STOP</b>
          </p>
          <p>
            DADA IS AGAINST THE FUTURE <b>STOP</b> I AM NOT <b>STOP</b> IF YOU ARE BUILDING SOMETHING TOO LET US TALK <b>STOP</b>
          </p>
          <p>
            WRITE TO <a href={`mailto:${personalInfo.email}`}>{personalInfo.email.toUpperCase()}</a> <b>STOP</b>
          </p>
          <p>
            OR BOOK A QUICK CHAT AT{" "}
            <a href={personalInfo.calendarLink} target="_blank" rel="noreferrer">
              CAL.COM/{handle(personalInfo.calendarLink.replace(/\/[^/]+$/, ""))?.toUpperCase()}
            </a>{" "}
            <b>STOP</b>
          </p>
          <p className="dd-tg-socials">
            {socialLinks.map((s) => (
              <span key={s.name}>
                {s.name.toUpperCase()}{" "}
                <a href={s.url} target="_blank" rel="noreferrer">
                  {handle(s.url)?.toUpperCase()}
                </a>{" "}
                <b>STOP</b>{" "}
              </span>
            ))}
          </p>
          <p className="dd-tg-end" aria-hidden>
            END
          </p>
        </div>

        <div className="dd-tg-actions">
          <a
            className="dd-send"
            href={mail}
            onClick={() => {
              setSent((n) => n + 1);
              audio.sfx("stamp");
            }}
          >
            <Manicule className="dd-send-hand" />
            Send it: write to me
          </a>
          <a className="dd-book" href={personalInfo.calendarLink} target="_blank" rel="noreferrer">
            or book a call
          </a>
        </div>

        {sent > 0 && (
          <span key={sent} className="dd-expedie" aria-hidden>
            <span className="dd-expedie-ink">Expédié</span>
            Expédié
          </span>
        )}
        <p className="dd-sr" aria-live="polite">
          {sent > 0 ? "Stamped and sent to your mail app." : ""}
        </p>
      </div>
    </>
  );
}

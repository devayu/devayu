"use client";

import { personalInfo, socialLinks } from "@/data/personal";
import { audio } from "@/lib/audio/manager";
import { useState } from "react";
import Reveal from "./Reveal";

// What's next and how to reach me. The contact object is Marianne Brandt's
// tea infuser: a hemisphere on a cross base. The two ways to reach me sit on
// the bowl; pressing one hinges the disc lid up 20° on its pivot (120ms up,
// 180ms down, linear) and a red square marks it engaged.

export default function Infuser() {
  const [engaged, setEngaged] = useState(false);
  const press = () => {
    if (engaged) return;
    setEngaged(true);
    audio.sfx("click");
  };
  const release = () => setEngaged(false);
  const handlers = {
    onPointerDown: press,
    onPointerUp: release,
    onPointerLeave: release,
    onPointerCancel: release,
    onBlur: release,
    onKeyDown: (e: React.KeyboardEvent) => (e.key === "Enter" || e.key === " ") && press(),
    onKeyUp: release,
  };

  return (
    <Reveal className="bh-next" aria-labelledby="bh-next-h" id="contact">
      <div className="bh-next-copy">
        <h2 id="bh-next-h" className="bh-h2">
          what&rsquo;s next
        </h2>
        <p className="bh-next-now">
          right now i&rsquo;m building{" "}
          <a className="bh-ln bh-ln-strong" href={personalInfo.currentProject.href} target="_blank" rel="noreferrer">
            {personalInfo.currentProject.name.toLowerCase()}
          </a>
          , {personalInfo.currentProject.blurb}. it&rsquo;s still in progress, and it&rsquo;s open on github.
        </p>
        <p>
          if you want to build something, talk shop, or just say hello, write to me or grab fifteen minutes on my
          calendar. the infuser is the switch.
        </p>
        <p className="bh-next-mail">
          <a className="bh-ln" href={`mailto:${personalInfo.email}`}>
            {personalInfo.email}
          </a>
        </p>
        <ul className="bh-socials" aria-label="elsewhere">
          {socialLinks.map((s) => (
            <li key={s.name}>
              <a className="bh-ln bh-social" href={s.url} target="_blank" rel="noreferrer">
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="bh-infuser" data-engaged={engaged || undefined}>
        <svg viewBox="0 0 520 470" className="bh-infuser-art" aria-hidden>
          {/* cross base: the long arm, and the cross arm seen end on */}
          <rect x="150" y="430" width="220" height="16" fill="#161514" />
          <rect x="243" y="376" width="34" height="62" fill="#161514" />
          <rect x="236" y="424" width="48" height="28" fill="#161514" />
          {/* handle (ebony) */}
          <path d="M452 212 Q522 204 514 150 Q506 104 448 120" fill="none" stroke="#161514" strokeWidth="16" />
          {/* spout */}
          <path d="M66 212 L18 194 L70 238 Z" fill="#161514" />
          {/* bowl */}
          <path d="M60 186 A200 200 0 0 0 460 186 Z" fill="#D9D6CF" stroke="#161514" strokeWidth="5" />
          <rect x="52" y="178" width="416" height="12" fill="#161514" />
          {/* lid on its pivot */}
          <g className="bh-lid">
            <rect x="96" y="160" width="314" height="16" fill="#D9D6CF" stroke="#161514" strokeWidth="4" />
            <rect x="228" y="128" width="50" height="16" fill="#161514" />
            <rect x="246" y="140" width="14" height="22" fill="#161514" />
          </g>
          <circle cx="410" cy="170" r="11" fill="#EDE7D9" stroke="#161514" strokeWidth="4" />
          <circle cx="410" cy="170" r="4" fill="#161514" />
          <rect className="bh-engaged" x="436" y="40" width="34" height="34" fill="#D0331F" />
        </svg>
        <div className="bh-infuser-actions">
          <a className="bh-act bh-act-mail" href={`mailto:${personalInfo.email}`} {...handlers}>
            email me
          </a>
          <a className="bh-act bh-act-call" href={personalInfo.calendarLink} target="_blank" rel="noreferrer" {...handlers}>
            book a call
          </a>
        </div>
      </div>
    </Reveal>
  );
}

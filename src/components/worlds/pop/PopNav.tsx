"use client";

import WorldLink from "@/components/gallery/WorldLink";
import { getWorld, worlds } from "@/data/worlds";
import { audio } from "@/lib/audio/manager";
import { useAudio } from "@/lib/audio/use-audio";

// The room's navigation is a channel strip: every other room is a channel
// you can flip to, the gallery is channel 0, and the music is the jingle.
const pop = getWorld("pop");

export default function PopNav() {
  const { enabled, playing } = useAudio();
  const on = enabled && playing === "pop";
  const channels = worlds.map((w, i) => ({ ...w, ch: i + 1 })).filter((w) => w.slug !== "pop");

  return (
    <header className="pp-nav">
      <nav aria-label="Rooms" className="pp-nav-strip">
        <WorldLink href="/" className="pp-tag pp-tag-home" style={{ ["--t" as string]: "#FFD400" }}>
          <span className="pp-tag-ch" aria-hidden>
            CH 0
          </span>
          <span className="pp-tag-name">Gallery</span>
        </WorldLink>
        {channels.map((w, i) => (
          <WorldLink
            key={w.slug}
            href={w.href}
            className="pp-tag"
            style={{ ["--t" as string]: ["#2EB4E6", "#FF5FA2", "#A6D608"][i] }}
          >
            <span className="pp-tag-ch" aria-hidden>
              CH {w.ch}
            </span>
            <span className="pp-tag-name">{w.name}</span>
          </WorldLink>
        ))}
        <span className="pp-onair" aria-hidden>
          <span className="pp-onair-dot" /> Now: Pop Art
        </span>
      </nav>
      <button
        type="button"
        data-sound-toggle
        className="pp-jingle"
        aria-pressed={enabled}
        aria-label={enabled ? "Sound on: turn the jingle off" : "Sound off: turn the jingle on"}
        onClick={() => audio.toggle()}
        data-on={on || undefined}
      >
        <span className="pp-jingle-bars" aria-hidden>
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="pp-jingle-text">
          <span className="pp-jingle-state">{enabled ? "Jingle on" : "Jingle off"}</span>
          <span className="pp-jingle-desc">{pop.sound}</span>
        </span>
      </button>
    </header>
  );
}

"use client";

import WorldLink from "@/components/gallery/WorldLink";
import { getWorld, worlds, type WorldSlug } from "@/data/worlds";
import { audio } from "@/lib/audio/manager";
import { useAudio } from "@/lib/audio/use-audio";
import { Gramophone, Manicule } from "./art";

// Tram tickets for the other rooms, punched by a rubber stamp as you board;
// the sound control is a luggage tag tied to a gramophone.

const TICKETS: Record<WorldSlug | "gallery", { stamp: string; serial: string; tone: string }> = {
  gallery: { stamp: "retour", serial: "0000", tone: "ink" },
  bauhaus: { stamp: "genehmigt", serial: "1919", tone: "aged" },
  pop: { stamp: "ja", serial: "1956", tone: "orange" },
  cubism: { stamp: "dada", serial: "1907", tone: "green" },
  dada: { stamp: "dada", serial: "1916", tone: "aged" },
};

export function SoundTag({ compact }: { compact?: boolean }) {
  const { enabled, playing } = useAudio();
  const on = enabled;
  return (
    <div className={`dd-tag${compact ? " dd-tag--compact" : ""}`}>
      <button
        type="button"
        data-sound-toggle
        className="dd-tag-btn"
        aria-pressed={on}
        onClick={() => audio.toggle()}
      >
        <span className="dd-tag-hole" aria-hidden />
        <Gramophone className={`dd-tag-gramo${on && playing ? " is-playing" : ""}`} />
        <span className="dd-tag-text">
          <span className="dd-tag-state">sound {on ? "on" : "off"}</span>
          <span className="dd-tag-poem" aria-hidden>
            {on && playing ? "bö wö tää" : on ? "wound up" : "the needle is up"}
          </span>
        </span>
      </button>
      <p className="dd-tag-desc">{getWorld("dada").sound}</p>
    </div>
  );
}

export default function DadaNav({ label = "Rooms", sound = true }: { label?: string; sound?: boolean }) {
  const others = worlds.filter((w) => w.slug !== "dada");
  return (
    <nav className="dd-nav" aria-label={label}>
      <ul className="dd-tickets">
        <li>
          <WorldLink href="/" className="dd-ticket dd-ticket--ink" onClick={() => audio.sfx("stamp")}>
            <span className="dd-ticket-no" aria-hidden>
              No {TICKETS.gallery.serial}
            </span>
            <span className="dd-ticket-name dd-ticket-name--home">
              <Manicule className="dd-ticket-hand" />
              Gallery
            </span>
            <span className="dd-ticket-sub">back to all four rooms</span>
            <span className="dd-ticket-stamp" aria-hidden>
              {TICKETS.gallery.stamp}
            </span>
          </WorldLink>
        </li>
        {others.map((w) => {
          const t = TICKETS[w.slug];
          return (
            <li key={w.slug}>
              <WorldLink
                href={w.href}
                className={`dd-ticket dd-ticket--${t.tone}`}
                data-room={w.slug}
                onClick={() => audio.sfx("stamp")}
              >
                <span className="dd-ticket-no" aria-hidden>
                  No {t.serial}
                </span>
                <span className="dd-ticket-name">{w.name}</span>
                <span className="dd-ticket-sub">{w.years}</span>
                <span className="dd-ticket-stamp" aria-hidden>
                  {t.stamp}
                </span>
              </WorldLink>
            </li>
          );
        })}
      </ul>
      {sound && <SoundTag />}
    </nav>
  );
}

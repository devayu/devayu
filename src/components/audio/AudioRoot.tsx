"use client";

import { worlds } from "@/data/worlds";
import { audio, audioStore } from "@/lib/audio/manager";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useSyncExternalStore } from "react";

export const useAudio = () =>
  useSyncExternalStore(audioStore.subscribe, audioStore.get, audioStore.server);

// Mounted once in the root layout. Holds the YouTube player (visible whenever
// it plays), unlocks audio on the first click or key press, and gives the
// visitor a switch to turn sound off.
export default function AudioRoot() {
  const { enabled, playing, source, mode } = useAudio();
  const slot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // YouTube swaps its host node for an iframe, so hand it a node React
    // doesn't manage.
    const host = document.createElement("div");
    slot.current?.appendChild(host);
    audio.init(host);
    const unlock = (e: Event) => {
      if ((e.target as HTMLElement | null)?.closest("[data-sound-toggle]")) return;
      audio.unlock();
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const showPlayer = enabled && playing !== null && source === "youtube";
  const track = worlds.find((w) => w.slug === playing);

  return (
    <div className="sound-dock fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2 md:bottom-6 md:left-6">
      {/* the player itself: visible whenever music is playing */}
      <div
        className={cn(
          "sound-player overflow-hidden transition-[height,opacity] duration-500",
          showPlayer ? "h-[236px] opacity-100" : "pointer-events-none h-0 opacity-0"
        )}
        aria-hidden={!showPlayer}
      >
        <p className="sound-player-label px-2 pb-1.5 pt-2 text-xs">
          {mode === "preview" ? "Preview: " : "Now playing: "}
          {track?.soundtrack.label}
        </p>
        <div ref={slot} className="size-[200px] [&_iframe]:block" />
      </div>

      {/* local files need no visible player; just say what's playing */}
      {enabled && playing !== null && source === "local" && (
        <p className="sound-player sound-player-label px-3 py-2 text-xs">
          {mode === "preview" ? "Preview: " : "Now playing: "}
          {track?.soundtrack.label}
        </p>
      )}

      <button
        type="button"
        data-sound-toggle
        onClick={() => audio.toggle()}
        aria-pressed={enabled}
        aria-label={enabled ? "Turn music off" : "Turn music on"}
        className="sound-toggle flex h-11 items-center gap-2.5 px-3.5 text-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:scale-95"
      >
        <span aria-hidden className="flex h-4 items-end gap-[3px]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={playing && enabled ? "eq-bar min-h-1 w-[3px] bg-current" : "h-1 w-[3px] bg-current opacity-60"}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
        <span className="sound-label">{enabled ? (playing ? "Music on" : "Music ready") : "Music off"}</span>
      </button>
    </div>
  );
}

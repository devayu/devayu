"use client";

import { audio } from "@/lib/audio/manager";
import { useCallback, useEffect, useRef, useState } from "react";

type Mark = { id: number; x: number; y: number; fired: boolean };

const Core = ({ value, label, children }: { value: number; label: string; children: React.ReactNode }) => {
  const c = 2 * Math.PI * 17;
  return (
    <div className="relative size-12" title={label}>
      <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="20" cy="20" r="17" fill="rgb(20 12 6 / 0.75)" stroke="rgb(232 215 178 / 0.25)" strokeWidth="3" />
        <circle
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke="#e8d7b2"
          strokeWidth="3"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value)}
          className="transition-[stroke-dashoffset] duration-300"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[#e8d7b2]">{children}</span>
    </div>
  );
};

// The three cores (health, stamina, Dead Eye) and Dead Eye itself: press E,
// paint targets with clicks, and they all fire at once.
export default function FrontierHud() {
  const [read, setRead] = useState(0);
  const [deadEye, setDeadEye] = useState(false);
  const [meter, setMeter] = useState(1);
  const [marks, setMarks] = useState<Mark[]>([]);
  const nextId = useRef(0);
  const fireTimer = useRef(0);
  const marksRef = useRef<Mark[]>([]);

  useEffect(() => {
    marksRef.current = marks;
  }, [marks]);

  const fire = useCallback(() => {
    const count = Math.max(1, marksRef.current.length);
    for (let i = 0; i < count; i++) window.setTimeout(() => audio.sfx("shot"), i * 140);
    setMarks((ms) => ms.map((m) => ({ ...m, fired: true })));
    window.setTimeout(() => {
      setMarks([]);
      setDeadEye(false);
    }, 900);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setRead(max > 0 ? window.scrollY / max : 0);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "e" && !e.metaKey && !e.ctrlKey) setDeadEye((d) => !d);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // The meter drains while Dead Eye is on and refills when it's off.
  useEffect(() => {
    document.documentElement.classList.toggle("dead-eye", deadEye);
    if (deadEye) audio.sfx("heartbeat");
    const beat = deadEye ? window.setInterval(() => audio.sfx("heartbeat"), 1300) : 0;
    const tick = window.setInterval(() => {
      setMeter((m) => Math.max(0, Math.min(1, m + (deadEye ? -0.02 : 0.01))));
    }, 100);
    return () => {
      window.clearInterval(beat);
      window.clearInterval(tick);
      document.documentElement.classList.remove("dead-eye");
    };
  }, [deadEye]);

  useEffect(() => {
    if (deadEye && meter <= 0) {
      const id = window.setTimeout(fire, 0);
      return () => window.clearTimeout(id);
    }
  }, [deadEye, meter, fire]);

  const paint = (e: React.PointerEvent) => {
    const id = nextId.current++;
    setMarks((ms) => [...ms, { id, x: e.clientX, y: e.clientY, fired: false }]);
    audio.sfx("type");
    window.clearTimeout(fireTimer.current);
    fireTimer.current = window.setTimeout(fire, 1100);
  };

  return (
    <>
      <div aria-hidden className="dead-eye-tint pointer-events-none fixed inset-0 z-40" />
      {deadEye && (
        <div
          className="fixed inset-0 z-[45] cursor-crosshair"
          onPointerDown={paint}
          role="presentation"
        >
          <p className="absolute left-1/2 top-6 -translate-x-1/2 font-rye text-lg text-[#f6d189] drop-shadow">
            Dead Eye: click to mark your targets
          </p>
          {marks.map((m) => (
            <span
              key={m.id}
              className={m.fired ? "dead-eye-mark fired" : "dead-eye-mark"}
              style={{ left: m.x, top: m.y }}
            />
          ))}
        </div>
      )}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 md:bottom-6 md:right-6">
        <Core value={1 - read * 0.6} label="Health">
          <svg viewBox="0 0 20 20" className="size-4" aria-hidden><path d="M10 17 C 2 11 2 5 6 4 C 8 3.5 9.4 5 10 6 C 10.6 5 12 3.5 14 4 C 18 5 18 11 10 17 Z" fill="currentColor" /></svg>
        </Core>
        <Core value={0.85} label="Stamina">
          <svg viewBox="0 0 20 20" className="size-4" aria-hidden><path d="M11 2 L 4 11 h5 l-1 7 l7 -9 h-5 Z" fill="currentColor" /></svg>
        </Core>
        <button
          type="button"
          onClick={() => setDeadEye((d) => !d)}
          aria-pressed={deadEye}
          aria-label={deadEye ? "Leave Dead Eye" : "Use Dead Eye"}
          className="flex items-center gap-2"
        >
          <Core value={meter} label="Dead Eye">
            <svg viewBox="0 0 20 20" className="size-4" aria-hidden><path d="M1 10 C 5 4 15 4 19 10 C 15 16 5 16 1 10 Z" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="10" cy="10" r="2.6" fill="#b3261e" /></svg>
          </Core>
          <kbd className="sel-key hidden !h-6 bg-[#e8d7b2] !text-[11px] text-[#2b1a10] sm:inline-grid">E</kbd>
        </button>
      </div>
    </>
  );
}

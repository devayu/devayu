"use client";

// Into the Pop room: two silkscreen pulls over the old page. A black squeegee
// bar drags one flat ink across, then a second pull lays the black key a few
// pixels off-register. The room is revealed by a channel flip: the picture
// rolls in hard steps behind black roll bars and is gone.

export const timing = { cover: 760, reveal: 300 };

export default function Cover({ phase }: { phase: "cover" | "reveal" }) {
  return (
    <div className="ppc" data-phase={phase} aria-hidden>
      <style>{CSS}</style>
      <div className="ppc-roll">
        <div className="ppc-ink">
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="ppc-art">
            <rect x="22" y="22" width="56" height="56" rx="3" fill="#FF5FA2" />
          </svg>
        </div>
        <div className="ppc-key">
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="ppc-art" fill="none" stroke="#111" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round">
            <rect x="22" y="22" width="56" height="56" rx="3" />
            <path d="M62 38 V56 H38" />
            <path d="M45 49 L37 56 L45 63" />
          </svg>
          <span className="ppc-word">Pop Art</span>
        </div>
      </div>
      <span className="ppc-bar ppc-bar-1" />
      <span className="ppc-bar ppc-bar-2" />
      <span className="ppc-rolls" />
    </div>
  );
}

const CSS = `
.ppc { position: fixed; inset: 0; overflow: hidden; pointer-events: auto; }
.ppc-roll { position: absolute; inset: 0; }
.ppc-ink, .ppc-key { position: absolute; inset: 0; display: grid; place-items: center; }
.ppc-ink { background: #FFD400; clip-path: inset(0 100% 0 0); animation: ppc-pull 420ms cubic-bezier(.55,0,.35,1) forwards; }
.ppc-key { clip-path: inset(0 100% 0 0); transform: translate(6px, 4px); animation: ppc-pull 420ms 300ms cubic-bezier(.55,0,.35,1) forwards; }
.ppc-art { width: min(70vmin, 640px); height: min(70vmin, 640px); }
.ppc-word {
  position: absolute; left: 50%; bottom: 9vh; transform: translateX(-50%) rotate(-3deg);
  font-family: var(--font-ultra), Georgia, serif; text-transform: uppercase; white-space: nowrap;
  font-size: clamp(2.4rem, 9vw, 7rem); line-height: 1; color: #E2231A; text-shadow: 5px 4px 0 #111;
}
.ppc-bar {
  position: absolute; top: -2vh; bottom: -2vh; left: 0; width: 22px; background: #111;
  transform: translateX(-30px); opacity: 0;
}
.ppc-bar-1 { animation: ppc-squeegee 420ms cubic-bezier(.55,0,.35,1) forwards; }
.ppc-bar-2 { animation: ppc-squeegee 420ms 300ms cubic-bezier(.55,0,.35,1) forwards; }
.ppc-rolls {
  position: absolute; inset: 0; opacity: 0;
  background: repeating-linear-gradient(to bottom, #111 0 7vh, transparent 7vh 19vh);
}
@keyframes ppc-pull { to { clip-path: inset(0 0 0 0); } }
@keyframes ppc-squeegee {
  0% { opacity: 1; transform: translateX(-30px); }
  96% { opacity: 1; }
  100% { opacity: 0; transform: translateX(calc(100vw + 10px)); }
}
.ppc[data-phase="reveal"] .ppc-ink, .ppc[data-phase="reveal"] .ppc-key { clip-path: inset(0 0 0 0); animation: none; }
.ppc[data-phase="reveal"] .ppc-bar { display: none; }
.ppc[data-phase="reveal"] .ppc-roll { animation: ppc-flip 280ms steps(1, end) forwards; }
.ppc[data-phase="reveal"] .ppc-rolls { animation: ppc-bars 280ms steps(1, end) forwards; }
@keyframes ppc-flip {
  0% { transform: translateY(0); clip-path: inset(0 0 0 0); }
  20% { transform: translateY(-14vh); clip-path: inset(0 0 0 0); }
  40% { transform: translateY(31vh); clip-path: inset(10vh 0 12vh 0); }
  60% { transform: translateY(-46vh); clip-path: inset(34vh 0 30vh 0); }
  80% { transform: translateY(0); clip-path: inset(49.5vh 0 49.5vh 0); }
  100% { transform: translateY(0); clip-path: inset(50vh 0 50vh 0); }
}
@keyframes ppc-bars {
  0% { opacity: 1; transform: translateY(0); }
  20% { opacity: 1; transform: translateY(6vh); }
  40% { opacity: 1; transform: translateY(-9vh); }
  60% { opacity: 1; transform: translateY(4vh); }
  80% { opacity: 0; }
  100% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .ppc-ink, .ppc-key { animation: none; clip-path: inset(0 0 0 0); }
  .ppc-bar { display: none; }
  .ppc[data-phase="reveal"] { opacity: 0; }
}
`;

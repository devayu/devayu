"use client";

// The way into the Bauhaus room: a Triadic Ballet costume (disc, spiral cone,
// bell skirt) tumbles across the screen in 90° steps, changing act as it
// goes (yellow, pink, black), and paper follows it over the old page. Then
// the paper parts along a diagonal rail and the room is there.

export const timing = { cover: 680, reveal: 620 };

const css = `
.bhc { position: fixed; inset: 0; overflow: hidden; pointer-events: none; }
.bhc-paper { position: absolute; inset: 0; animation: bhc-wipe 640ms cubic-bezier(0.55, 0, 0.35, 1) both; }
.bhc-half { position: absolute; inset: -2px; background: #EDE7D9; }
.bhc-a { clip-path: polygon(0 0, 100% 0, 100% 36%, 0 66%); }
.bhc-b { clip-path: polygon(0 65.6%, 100% 35.6%, 100% 100%, 0 100%); }
.bhc-seam { position: absolute; inset: 0; background: #D0331F; opacity: 0;
  clip-path: polygon(0 65.2%, 100% 35.2%, 100% 36.4%, 0 66.4%); }
.bhc-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 22px; background: #D0331F;
  transform: scaleY(0); transform-origin: top; animation: bhc-bar 200ms 440ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.bhc-track { position: absolute; left: 0; top: 50%; width: 0; height: 0;
  animation: bhc-track 640ms cubic-bezier(0.55, 0, 0.35, 1) both; }
.bhc-fig { position: absolute; width: 34vmin; height: 52vmin; left: -17vmin; top: -26vmin;
  animation: bhc-turn 640ms steps(4, end) both, bhc-act 640ms step-end both; color: #F0B419; }
.bhc-fig svg { width: 100%; height: 100%; display: block; }
.bhc[data-phase="reveal"] .bhc-paper { animation: none; }
.bhc[data-phase="reveal"] .bhc-a { animation: bhc-up 560ms 60ms cubic-bezier(0.7, 0, 0.2, 1) both; }
.bhc[data-phase="reveal"] .bhc-b { animation: bhc-down 560ms 60ms cubic-bezier(0.7, 0, 0.2, 1) both; }
.bhc[data-phase="reveal"] .bhc-seam { animation: bhc-seam 420ms cubic-bezier(0.6, 0, 0.3, 1) both; }
.bhc[data-phase="reveal"] .bhc-bar { animation: bhc-bar-out 300ms 120ms cubic-bezier(0.7, 0, 0.2, 1) both; transform: none; }
.bhc[data-phase="reveal"] .bhc-track { animation: bhc-exit 300ms cubic-bezier(0.55, 0, 1, 0.45) both; }
.bhc[data-phase="reveal"] .bhc-fig { animation: none; transform: rotate(360deg); color: #161514; }
@keyframes bhc-wipe { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes bhc-track { from { transform: translateX(0); } to { transform: translateX(100vw); } }
@keyframes bhc-exit { from { transform: translateX(100vw); } to { transform: translateX(calc(100vw + 60vmin)); } }
@keyframes bhc-turn { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes bhc-act { 0% { color: #F0B419; } 34% { color: #E7A9B4; } 67% { color: #161514; } 100% { color: #161514; } }
@keyframes bhc-bar { to { transform: scaleY(1); } }
@keyframes bhc-bar-out { to { transform: translateY(100%); } }
@keyframes bhc-seam { from { opacity: 1; transform: translateX(0); } to { opacity: 1; transform: translateX(100%); } }
@keyframes bhc-up { to { transform: translate(-14vw, -72svh); } }
@keyframes bhc-down { to { transform: translate(14vw, 72svh); } }
@media (prefers-reduced-motion: reduce) {
  .bhc-fig, .bhc-track { display: none; }
}
`;

export default function Cover({ phase }: { phase: "cover" | "reveal" }) {
  return (
    <div className="bhc" data-phase={phase} aria-hidden>
      <style>{css}</style>
      <div className="bhc-paper">
        <div className="bhc-half bhc-a" />
        <div className="bhc-half bhc-b" />
        <div className="bhc-bar" />
      </div>
      <div className="bhc-seam" />
      <div className="bhc-track">
        <div className="bhc-fig">
          {/* a Schlemmer costume: disc head, spiral cone, bell skirt */}
          <svg viewBox="0 0 100 150">
            <circle cx="50" cy="16" r="13" fill="currentColor" />
            <path d="M28 34 H72 L50 86 Z" fill="currentColor" />
            <path d="M38 52 H62 M42 64 H58 M46 76 H54" stroke="#EDE7D9" strokeWidth="3" />
            <path d="M50 82 C30 82 10 120 6 146 H94 C90 120 70 82 50 82 Z" fill="currentColor" />
            <rect x="0" y="40" width="100" height="5" fill="#D0331F" />
          </svg>
        </div>
      </div>
    </div>
  );
}

"use client";

import { audio } from "@/lib/audio/manager";
import { useEffect, useMemo, useRef, useState } from "react";
import { TzaraHat } from "./art";
import { FACES, dice, faceStyle, hash, type Face } from "./chance";

// A heading cut from four printings. Each word (or syllable, split with "|")
// gets its own face at 1.0×, 0.6× or 1.8× on a shared baseline; the loudest
// word is the only red one and the only 1.8× one; at most one slip leans.
// The draw is seeded, so it is the same every visit. The real words sit in a
// visually hidden span; the cut-up is aria-hidden.
//
// `hat`: Tzara's hat. A button shakes the slips for ~1.2s at 10fps, then they
// fall back in order (also runs once when the heading first scrolls in).
// `ransom`: every letter is cut from a different scrap and arrives one by one.

type Level = "h1" | "h2" | "h3";

type Props = {
  text: string;
  as?: Level;
  /** The single loudest word (without "|"): red and 1.8×. Defaults to the longest. */
  loud?: string;
  seed?: number;
  /** Index of the slip that leans, or false for none. Defaults to a chance pick. */
  lean?: number | false;
  hat?: boolean;
  ransom?: boolean;
  id?: string;
  className?: string;
};

type Slip = { text: string; word: number; face: Face; size: number; red: boolean; turn: number };

const SIZES = [1, 0.6, 1, 1, 0.6];

function cut(text: string, loud: string | undefined, seed: number, lean: number | false | undefined): Slip[] {
  const d = dice(seed);
  const words = text.split(" ");
  const plainWords = words.map((w) => w.replace(/\|/g, ""));
  const loudIndex = loud
    ? plainWords.findIndex((w) => w.replace(/[^\p{L}]/gu, "") === loud.replace(/[^\p{L}]/gu, ""))
    : plainWords.reduce((best, w, i, a) => (w.length > a[best].length ? i : best), 0);

  const slips: Slip[] = [];
  let lastFace = -1;
  words.forEach((w, wi) => {
    w.split("|").forEach((piece, pi) => {
      let f = d.int(0, 3);
      if (f === lastFace) f = (f + 1 + d.int(0, 2)) % 4;
      lastFace = f;
      const isLoud = wi === loudIndex;
      const size = isLoud && pi === 0 ? 1.8 : d.pick(SIZES);
      slips.push({ text: piece, word: wi, face: FACES[f], size, red: isLoud, turn: 0 });
    });
  });

  // At most one slip leans, between 4° and 10°, never the loud one.
  const candidates = slips.map((s, i) => (s.red ? -1 : i)).filter((i) => i >= 0);
  const leaner = lean === false ? -1 : lean ?? (candidates.length ? candidates[d.int(0, candidates.length - 1)] : -1);
  if (leaner >= 0 && slips[leaner]) slips[leaner].turn = d.sign() * Math.round(d.range(4, 10));
  return slips;
}

const strip = (w: string) => w.replace(/[^\p{L}]/gu, "").toLowerCase();

function ransomCut(text: string, loud: string | undefined, seed: number) {
  const d = dice(seed);
  const plain = text.replace(/\|/g, "");
  const words = plain.split(" ");
  const loudWord = loud ?? words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const scraps = ["#EDE6D3", "#E3D3A8", "#F6F1E4", "#1A1814", "#B9AC90", "#EDE6D3"];
  let i = 0;
  return words.map((w) => ({
    word: w,
    letters: w.split("").map((ch) => {
      const bg = strip(w) === strip(loudWord) ? "#D22B1F" : d.pick(scraps);
      const dark = bg === "#1A1814" || bg === "#D22B1F";
      return {
        ch,
        i: i++,
        face: FACES[d.int(0, 3)],
        size: d.range(0.78, 1.22),
        turn: d.range(-7, 7),
        lift: d.range(-0.08, 0.08),
        bg,
        fg: dark ? "#EDE6D3" : "#1A1814",
      };
    }),
  }));
}

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function DadaHeading({ text, as = "h2", loud, seed, lean, hat, ransom, id, className }: Props) {
  const Tag = as;
  const plain = text.replace(/\|/g, "");
  const s = seed ?? hash(plain);
  const slips = useMemo(() => cut(text, loud, s, lean), [text, loud, s, lean]);
  const ransomWords = useMemo(() => (ransom ? ransomCut(text, loud, s) : null), [ransom, text, loud, s]);
  const [shake, setShake] = useState<{ order: number[]; jolt: number[] } | null>(null);
  const timer = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const wordCount = text.split(" ").length;

  const scramble = (withSound: boolean) => {
    if (reduced() || timer.current) return;
    if (withSound) audio.sfx("tear");
    let tick = 0;
    const d = dice(Date.now() & 0xffff);
    timer.current = window.setInterval(() => {
      tick++;
      if (tick > 12) {
        window.clearInterval(timer.current!);
        timer.current = null;
        setShake(null);
        return;
      }
      setShake({
        order: Array.from({ length: wordCount }, () => d.int(0, wordCount * 3)),
        jolt: Array.from({ length: wordCount * 3 }, () => d.range(-1, 1)),
      });
    }, 100);
  };

  // Run the hat once when it first comes into view; arm the ransom letters
  // only if they start below the fold (so no-JS and above-the-fold readers
  // always see the words).
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    if (ransom) {
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight) el.dataset.ransom = "armed";
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (ransom) el.dataset.ransom = "play";
        if (hat) window.setTimeout(() => scramble(false), 250);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ransom, hat]);

  const words: Slip[][] = [];
  slips.forEach((sl) => (words[sl.word] ??= []).push(sl));

  return (
    <div ref={ref} className={`dd-hwrap ${className ?? ""}`}>
      <Tag id={id} className={`dd-h dd-h--${as}${ransom ? " dd-h--ransom" : ""}`}>
        <span className="dd-sr">{plain}</span>
        {ransomWords ? (
          <span className="dd-h-cut" aria-hidden>
            {ransomWords.map((w, wi) => (
              <span key={wi} className="dd-rw">
                {w.letters.map((l) => (
                  <span
                    key={l.i}
                    className="dd-rl"
                    style={
                      {
                        ...faceStyle(l.face, l.size),
                        "--i": l.i,
                        "--t": `${l.turn.toFixed(1)}deg`,
                        "--l": `${l.lift.toFixed(2)}em`,
                        background: l.bg,
                        color: l.fg,
                      } as React.CSSProperties
                    }
                  >
                    {l.ch}
                  </span>
                ))}
              </span>
            ))}
          </span>
        ) : (
          <span className="dd-h-cut" aria-hidden>
            {words.map((w, wi) => (
              <span
                key={wi}
                className="dd-hw"
                style={
                  shake
                    ? ({
                        order: shake.order[wi],
                        transform: `translateY(${(shake.jolt[wi] * 0.22).toFixed(2)}em) rotate(${(shake.jolt[wi + wordCount] * 14).toFixed(1)}deg)`,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                {w.map((sl, i) => (
                  <span
                    key={i}
                    className={`dd-hs${sl.red ? " dd-hs--red" : ""}`}
                    data-text={sl.text}
                    style={{
                      ...faceStyle(sl.face, sl.size),
                      transform: sl.turn ? `rotate(${sl.turn}deg)` : undefined,
                    }}
                  >
                    {sl.text}
                  </span>
                ))}
              </span>
            ))}
          </span>
        )}
      </Tag>
      {hat && (
        <button type="button" className="dd-hat" onClick={() => scramble(true)}>
          <TzaraHat className="dd-hat-icon" />
          <span className="dd-hat-label">shake it in Tzara&rsquo;s hat</span>
        </button>
      )}
    </div>
  );
}

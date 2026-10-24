"use client";

import { seeded } from "@/lib/seeded";
import { useEffect, useRef } from "react";

const rand = seeded(1729);
const blades = Array.from({ length: 86 }, (_, i) => {
  const x = (i / 86) * 1660 - 30 + rand() * 18;
  const h = 70 + rand() * 120;
  const bend = -10 - rand() * 30;
  return {
    x,
    y: 900 - rand() * 26,
    h,
    bend,
    plume: rand() > 0.55,
    delay: 0.9 + (i % 12) * 0.04 + rand() * 0.25,
    sway: 2.6 + rand() * 1.8,
  };
});

const pines = [
  { x: 170, y: 690, s: 1 },
  { x: 228, y: 698, s: 0.75 },
  { x: 282, y: 694, s: 0.9 },
  { x: 1500, y: 688, s: 1.1 },
  { x: 1556, y: 694, s: 0.8 },
];

const gusts = [
  { d: "M-200 250 C 150 225 400 280 720 250 S 1250 215 1800 255", dur: 8, delay: 0.5 },
  { d: "M-200 470 C 200 450 520 500 860 470 S 1350 440 1800 480", dur: 9.5, delay: 3.2 },
  { d: "M-200 610 C 260 590 600 630 980 600 S 1400 585 1800 615", dur: 7.2, delay: 5.4 },
];

export default function YoteiScene() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Wind follows the cursor: fast sideways motion bends the grass, then it
    // springs back to the prevailing westward lean.
    const base = -4;
    let lean = base;
    let target = base;
    let lastX: number | null = null;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      if (lastX !== null) {
        const vx = e.clientX - lastX;
        target = Math.max(-22, Math.min(18, base + vx * 0.9));
      }
      lastX = e.clientX;
    };

    const tick = () => {
      target += (base - target) * 0.04;
      lean += (target - lean) * 0.12;
      svg.style.setProperty("--lean", `${lean.toFixed(2)}deg`);
      svg.style.setProperty("--scroll", `${Math.min(window.scrollY, 900)}`);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const parallax = (depth: number) => ({
    transform: `translateY(calc(var(--scroll, 0) * ${depth}px))`,
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMaxYMax slice"
      className="absolute inset-0 h-full w-full max-md:inset-auto max-md:bottom-0 max-md:right-0 max-md:aspect-[16/9] max-md:h-[64%] max-md:w-auto max-md:translate-x-[7.5%]"
      aria-hidden
    >
      <defs>
        <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--mist)" stopOpacity="0" />
          <stop offset="0.55" stopColor="var(--mist)" />
          <stop offset="1" stopColor="var(--mist)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0.45" stopColor="var(--sun-glow)" />
          <stop offset="1" stopColor="var(--sun-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sun */}
      <g style={parallax(0.45)}>
        <g className="scene-sun">
          <circle cx="1250" cy="250" r="260" fill="url(#glow)" />
          <circle cx="1250" cy="250" r="112" fill="var(--sun)" />
        </g>
      </g>

      {/* High cloud bands, ukiyo-e style */}
      <g style={parallax(0.38)} opacity="0.85">
        <g className="scene-cloud" style={{ ["--dur" as string]: "70s" }}>
          <rect x="180" y="150" width="460" height="22" rx="11" fill="var(--cloud)" />
          <rect x="260" y="182" width="300" height="18" rx="9" fill="var(--cloud)" />
        </g>
        <g className="scene-cloud" style={{ ["--dur" as string]: "90s", animationDirection: "alternate-reverse" }}>
          <rect x="1300" y="120" width="380" height="20" rx="10" fill="var(--cloud)" />
        </g>
      </g>

      {/* Atsu: Mount Yōtei */}
      <g className="place-atsu" style={parallax(0.3)}>
        <g className="scene-settle" style={{ animationDelay: "0.3s" }}>
          <path
            d="M520 660 C 700 600, 860 420, 990 290 C 1010 270, 1030 262, 1050 262 L 1110 262 C 1130 262, 1150 270, 1170 290 C 1300 420, 1460 600, 1660 660 Z"
            fill="var(--mountain)"
          />
          <path
            d="M1110 262 C 1130 262 1150 270 1170 290 C 1300 420 1460 600 1660 660 L 1260 660 C 1230 520 1170 380 1110 262 Z"
            fill="var(--mountain-shade)"
          />
          <path
            d="M940 345 C 965 315, 985 292, 1000 280 C 1020 266, 1040 262, 1060 262 L 1100 262 C 1125 262, 1150 272, 1170 290 C 1190 310, 1210 330, 1228 352 L 1206 374 L 1190 352 L 1172 398 L 1152 360 L 1130 414 L 1112 366 L 1090 424 L 1070 368 L 1050 402 L 1032 362 L 1010 394 L 992 352 L 972 380 L 958 356 Z"
            fill="var(--snow)"
          />
          <path
            d="M1100 262 C 1125 262 1150 272 1170 290 C 1190 310 1210 330 1228 352 L 1206 374 L 1190 352 L 1172 398 L 1152 360 L 1130 414 L 1124 340 Z"
            fill="var(--snow-shade)"
          />
          {/* the summit crater lip */}
          <path d="M1048 266 Q 1080 274 1112 266" stroke="var(--snow-shade)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* Jin: Tsushima's soft ridges, a pagoda on the far one */}
      <g className="place-jin" style={parallax(0.3)}>
        <g className="scene-settle" style={{ animationDelay: "0.3s" }}>
          <path
            d="M-20 560 C 120 470 260 430 420 470 C 560 505 640 440 780 400 C 900 368 1000 420 1120 450 C 1260 488 1380 430 1500 440 C 1580 446 1640 470 1660 480 V 680 H -20 Z"
            fill="var(--mountain)"
            opacity="0.55"
          />
          <g transform="translate(822 404)" fill="var(--mountain)" opacity="0.8">
            {[0, 1, 2, 3, 4].map((t) => (
              <g key={t} transform={`translate(0 ${-t * 17})`}>
                <path d={`M${-26 + t * 3} 0 Q 0 -8 ${26 - t * 3} 0 L ${18 - t * 3} -5 H ${-18 + t * 3} Z`} />
                <rect x={-10 + t * 2} y="-14" width={20 - t * 4} height="10" />
              </g>
            ))}
            <path d="M0 -84 V -104" stroke="var(--mountain)" strokeWidth="2" />
          </g>
          <path
            d="M-20 620 C 160 560 300 540 460 575 C 620 610 760 520 920 500 C 1080 482 1200 560 1360 548 C 1480 538 1580 560 1660 575 V 700 H -20 Z"
            fill="var(--mountain)"
          />
        </g>
      </g>

      {/* Low cloud wrapping the mountain's waist */}
      <g style={parallax(0.26)}>
        <g className="scene-cloud" style={{ ["--dur" as string]: "48s" }}>
          <rect x="760" y="455" width="420" height="20" rx="10" fill="var(--cloud)" opacity="0.9" />
          <rect x="860" y="484" width="520" height="16" rx="8" fill="var(--cloud)" opacity="0.7" />
        </g>
      </g>

      {/* Wind */}
      {gusts.map((g, i) => (
        <path
          key={i}
          d={g.d}
          className="scene-gust"
          stroke="var(--wind)"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          style={{ ["--dur" as string]: `${g.dur}s`, animationDelay: `${g.delay}s` }}
        />
      ))}

      {/* Hills */}
      <g style={parallax(0.2)}>
        <rect x="-20" y="540" width="1700" height="120" fill="url(#mist)" />
        <path
          className="scene-settle"
          style={{ animationDelay: "0.55s" }}
          d="M-20 640 C 200 580 380 610 560 620 C 760 630 900 590 1100 612 C 1300 632 1450 600 1660 615 V 900 H -20 Z"
          fill="var(--hill-far)"
        />
      </g>
      <g style={parallax(0.12)}>
        <g className="scene-settle" style={{ animationDelay: "0.7s" }}>
          <path
            d="M-20 700 C 180 650 400 690 640 680 C 880 670 1000 720 1240 700 C 1420 685 1520 690 1660 680 V 900 H -20 Z"
            fill="var(--hill-mid)"
          />
          <g className="place-atsu">
            {pines.map((p, i) => (
              <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`} fill="var(--hill-near)">
                <path d="M0 -70 L 16 -40 L 8 -40 L 22 -14 L 10 -14 L 26 12 L -26 12 L -10 -14 L -22 -14 L -8 -40 L -16 -40 Z" />
                <rect x="-3" y="10" width="6" height="12" />
              </g>
            ))}
          </g>
          <g className="place-jin">
            {/* a torii on the hill */}
            <g transform="translate(1060 712)" fill="#9b2215">
              <rect x="-44" y="-118" width="9" height="118" />
              <rect x="35" y="-118" width="9" height="118" />
              <path d="M-66 -128 Q 0 -138 66 -128 L 70 -138 Q 0 -150 -70 -138 Z" fill="#1a0806" />
              <rect x="-60" y="-128" width="120" height="8" />
              <rect x="-52" y="-100" width="104" height="7" />
              <rect x="-4" y="-120" width="8" height="20" />
            </g>
            {/* the great maple */}
            <g transform="translate(470 706)">
              <path d="M-10 0 C -6 -40 -20 -70 -4 -110 C 6 -136 30 -150 40 -170 M -8 -70 C -40 -96 -70 -100 -96 -120 M 2 -112 C 20 -120 46 -112 70 -132" stroke="#1a0806" strokeWidth="14" strokeLinecap="round" fill="none" />
              <path d="M-10 0 C -6 -40 -20 -70 -4 -110" stroke="#1a0806" strokeWidth="22" strokeLinecap="round" fill="none" />
              {[
                [-100, -150, 52, "#8e1d12"],
                [-40, -190, 64, "#b3261e"],
                [40, -200, 60, "#c0392b"],
                [90, -160, 46, "#a52a1c"],
                [-10, -140, 50, "#d0452c"],
                [-150, -120, 34, "#b3261e"],
                [60, -120, 38, "#8e1d12"],
              ].map(([x, y, r, c], i) => (
                <circle key={i} cx={x} cy={y} r={r} fill={String(c)} className="maple-sway" style={{ animationDelay: `${-i * 0.7}s` }} />
              ))}
            </g>
          </g>
        </g>
      </g>
      <g style={parallax(0.06)}>
        <g className="scene-settle" style={{ animationDelay: "0.85s" }}>
          <path
            d="M-20 770 C 240 740 520 790 820 770 C 1100 750 1300 730 1660 745 V 900 H -20 Z"
            fill="var(--hill-near)"
          />
          {/* The wanderer, looking toward the mountain */}
          <g transform="translate(1388 742)">
            <path d="M-46 8 C -40 -14 30 -18 50 6 Z" fill="var(--hill-near)" />
            <path d="M-34 4 C -30 -12 24 -16 40 4 Z" fill="var(--ground)" />
            <g transform="translate(0 -6)">
              {/* scarf, blown west by the wind */}
              <g transform="translate(-2 -50) scale(-1 1)">
                <path className="scene-scarf" d="M0 0 C 14 -4, 26 6, 44 -2 C 36 4, 22 10, 0 6 Z" fill="var(--scarf)" />
              </g>
              <path d="M-14 0 C -16 -24 -10 -44 0 -50 C 10 -44 16 -24 14 0 Z" fill="var(--wanderer)" />
              <rect x="-6" y="-56" width="12" height="9" rx="3" fill="var(--wanderer)" />
              {/* kasa */}
              <path d="M-24 -55 L 0 -70 L 24 -55 Q 0 -50 -24 -55 Z" fill="var(--hat)" />
              {/* katana at the hip */}
              <path d="M-4 -26 L 26 -6" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </g>

      {/* Ground and susuki grass */}
      <path d="M-20 840 C 400 815 900 845 1660 820 V 900 H -20 Z" fill="var(--ground)" />
      {blades.map((b, i) => (
        <g key={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`}>
          <g
            className="scene-blade"
            style={{ animationDelay: `${b.delay.toFixed(2)}s` }}
          >
            <path
              style={{ ["--sway" as string]: `${b.sway.toFixed(2)}s`, animationDelay: `-${(b.sway * (i % 7) / 7).toFixed(2)}s` }}
              d={`M0 0 Q ${(b.bend * 0.3).toFixed(1)} ${(-b.h * 0.55).toFixed(1)} ${b.bend.toFixed(1)} ${(-b.h).toFixed(1)} Q ${(b.bend * 0.3 + 5).toFixed(1)} ${(-b.h * 0.55).toFixed(1)} 6 0 Z${
                b.plume
                  ? ` M${b.bend.toFixed(1)} ${(-b.h).toFixed(1)} q -10 -6 -6 -26 q 10 8 6 26 Z`
                  : ""
              }`}
              fill={b.plume ? "var(--grass-tip)" : "var(--grass)"}
            />
          </g>
        </g>
      ))}
    </svg>
  );
}

"use client";

import { realityFragment, realityVertex } from "@/components/journey/reality-shader";
import YoteiScene from "@/components/yotei/YoteiScene";
import { FrontierHero, NoirHero } from "@/components/worlds/heroes";
import NightCityStreet from "@/components/worlds/nightcity/NightCityStreet";
import { worlds, type WorldSlug } from "@/data/worlds";
import { audio } from "@/lib/audio/manager";
import { journey } from "@/lib/journey";
import { useEffect, useRef, useState } from "react";

// The world behind the whole journey. Every seam ([data-gate]) is a stretch of
// scroll that turns the reality dial from one world to the next; the scene
// transforms continuously with it, and in reverse when you scroll back up.

// How fast the camera drifts down the street in each reality.
const speed = (w: number) => {
  const s = [0.55, 1.0, 1.3, 0.45];
  const i = Math.min(2, Math.floor(w));
  return s[i] + (s[i + 1] - s[i]) * (w - i);
};

export default function Reality() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fallbackLayers = useRef<(HTMLDivElement | null)[]>([]);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = el.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });

    let draw: ((w: number, z: number, t: number, lx: number, ly: number) => void) | null = null;
    let resize = () => {};
    if (gl) {
      const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, realityVertex));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, realityFragment));
      gl.linkProgram(prog);
      if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.useProgram(prog);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(prog, "aPos");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        const u = (n: string) => gl.getUniformLocation(prog, n);
        const uRes = u("uRes"), uTime = u("uTime"), uW = u("uW"), uCamZ = u("uCamZ"), uLook = u("uLook"), uSteps = u("uSteps"), uJin = u("uJin");
        const mobile = window.innerWidth < 768;
        let scale = mobile ? 0.4 : 0.55;
        const steps = mobile ? 70 : 100;
        resize = () => {
          el.width = Math.max(1, Math.round(window.innerWidth * scale));
          el.height = Math.max(1, Math.round(window.innerHeight * scale));
          gl.viewport(0, 0, el.width, el.height);
        };
        resize();
        let slow = 0;
        let last = performance.now();
        draw = (w, z, t, lx, ly) => {
          const now = performance.now();
          if (now - last > 34) slow++;
          last = now;
          // If the GPU can't keep up, drop resolution once rather than stutter.
          if (slow > 45 && scale > 0.32) {
            scale *= 0.78;
            slow = 0;
            resize();
          }
          gl.uniform2f(uRes, el.width, el.height);
          gl.uniform1f(uTime, t);
          gl.uniform1f(uW, w);
          gl.uniform1f(uCamZ, z);
          gl.uniform2f(uLook, lx, ly);
          gl.uniform1f(uSteps, steps);
          gl.uniform1f(uJin, document.documentElement.dataset.theme === "jin" ? 1 : 0);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
      }
    }
    const noGl = !draw;
    const fb = window.setTimeout(() => setFallback(noGl), 0);
    window.addEventListener("resize", () => resize());

    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      look.tx = (e.clientX / window.innerWidth) * 2 - 1;
      look.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let frame = 0;
    let z = 20;
    let clock = 10;
    let prev = performance.now();
    // Unset until the first frame, so the starting world is always announced:
    // the music needs to know where you are even before anything changes.
    let current: WorldSlug | null = null;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const vh = window.innerHeight;

      // The reality dial: each seam contributes its own progress, 0 to 1.
      let w = 0;
      document.querySelectorAll<HTMLElement>("[data-gate]").forEach((gate) => {
        const rect = gate.getBoundingClientRect();
        const span = Math.max(1, rect.height - vh);
        const p = Math.min(1, Math.max(0, -rect.top / span));
        gate.style.setProperty("--p", p.toFixed(4));
        w += p;
      });

      // The current reality flips halfway through a seam.
      const next = worlds[Math.min(3, Math.round(w))].slug;
      if (next !== current) {
        current = next;
        journey.set(next);
        document.documentElement.dataset.world = next;
        audio.setWorld(next);
      }

      // Only render while a window onto the world is actually on screen.
      let visible = false;
      document.querySelectorAll<HTMLElement>("[data-window]").forEach((win) => {
        const r = win.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) visible = true;
      });
      if (!visible) return;

      if (!reduce) {
        clock += dt;
        z = (z + dt * speed(w)) % 616;
      }
      look.x += (look.tx - look.x) * 0.05;
      look.y += (look.ty - look.y) * 0.05;
      if (draw) draw(w, z, clock, look.x, look.y);
      else {
        fallbackLayers.current.forEach((layer, i) => {
          if (layer) layer.style.opacity = String(Math.max(0, 1 - Math.abs(w - i)));
        });
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(fb);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div aria-hidden data-reality-canvas className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      {fallback && (
        <div className="absolute inset-0">
          {[<NoirHero key="n" />, <FrontierHero key="f" />, <NightCityStreet key="c" />].map((hero, i) => (
            <div key={i} ref={(el) => void (fallbackLayers.current[i] = el)} className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
              {hero}
            </div>
          ))}
          <div
            ref={(el) => void (fallbackLayers.current[3] = el)}
            className="absolute inset-0"
            style={{ opacity: 0, background: "linear-gradient(to bottom, var(--sky-top), var(--sky-mid) 45%, var(--sky-bottom) 75%)" }}
          >
            <YoteiScene />
          </div>
        </div>
      )}
    </div>
  );
}

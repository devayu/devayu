"use client";

import Petals from "@/components/yotei/Petals";
import { useEffect, useRef } from "react";

// About a thousand petals (Atsu) or maple leaves (Jin), drawn on the GPU and
// carried by the wind. Moving the cursor pushes them; "Follow the wind" sends
// a gust through the whole field. Without WebGL the CSS petals stay.

const vertex = `
attribute vec2 aPos;
attribute float aRot;
attribute float aSize;
attribute float aTint;
uniform vec2 uRes;
varying float vRot;
varying float vTint;
void main() {
  gl_Position = vec4(aPos.x * 2.0 - 1.0, 1.0 - aPos.y * 2.0, 0.0, 1.0);
  gl_PointSize = aSize;
  vRot = aRot;
  vTint = aTint;
}`;

const fragment = `
precision mediump float;
uniform float uShape; // 0 = petal, 1 = maple leaf
uniform vec3 uA;
uniform vec3 uB;
varying float vRot;
varying float vTint;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float c = cos(vRot), s = sin(vRot);
  p = mat2(c, -s, s, c) * p;
  float inside;
  if (uShape < 0.5) {
    // a petal: a pointed ellipse with a small notch at its tip
    float d = length(p * vec2(1.0, 2.1));
    float notch = smoothstep(0.05, 0.0, abs(p.x)) * step(0.16, p.y);
    inside = smoothstep(0.45, 0.4, d) * (1.0 - notch);
  } else {
    // a maple leaf: five lobes around a centre, with a short stem
    float a = atan(p.y, p.x);
    float r = length(p);
    float lobes = 0.22 + 0.16 * pow(abs(cos(a * 2.5)), 0.6);
    inside = smoothstep(lobes + 0.02, lobes - 0.02, r) + step(r, 0.3) * smoothstep(0.03, 0.0, abs(p.x)) * step(0.0, p.y);
    inside = clamp(inside, 0.0, 1.0);
  }
  vec3 col = mix(uA, uB, vTint);
  // a little shading along the length, like light through a petal
  col *= 0.85 + 0.3 * (0.5 - p.y);
  gl_FragColor = vec4(col * inside, inside * 0.95);
}`;

const COLORS = {
  atsu: { a: [0.78, 0.16, 0.23], b: [0.96, 0.71, 0.76], shape: 0 },
  jin: { a: [0.75, 0.22, 0.17], b: [0.89, 0.65, 0.17], shape: 1 },
};

export default function WindField() {
  const wrap = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = wrap.current;
    if (!canvas || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const N = window.innerWidth < 768 ? 70 : 170;
    // Interleaved per particle: x, y, rot, size, tint
    const STRIDE = 5;
    const data = new Float32Array(N * STRIDE);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const spin = new Float32Array(N);
    const depth = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      // most leaves are far away and small; a few drift right past the lens
      depth[i] = Math.pow(Math.random(), 2.2) * 0.95 + 0.05;
      data[i * STRIDE] = Math.random();
      data[i * STRIDE + 1] = Math.random();
      data[i * STRIDE + 2] = Math.random() * Math.PI * 2;
      data[i * STRIDE + 3] = (7 + depth[i] * 34) * Math.min(window.devicePixelRatio || 1, 1.5);
      data[i * STRIDE + 4] = Math.random();
      spin[i] = (Math.random() - 0.5) * 3;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    const bind = (name: string, size: number, offset: number) => {
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, STRIDE * 4, offset * 4);
    };
    bind("aPos", 2, 0);
    bind("aRot", 1, 2);
    bind("aSize", 1, 3);
    bind("aTint", 1, 4);
    const uShape = gl.getUniformLocation(prog, "uShape");
    const uA = gl.getUniformLocation(prog, "uA");
    const uB = gl.getUniformLocation(prog, "uB");

    host.dataset.gl = "on";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // The cursor's own wind: velocity, in screen units per second, that decays.
    const mouse = { x: -1, y: -1, vx: 0, vy: 0, t: performance.now() };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const now = performance.now();
      const dt = Math.max(0.008, (now - mouse.t) / 1000);
      if (mouse.x >= 0) {
        mouse.vx = mouse.vx * 0.5 + ((x - mouse.x) / dt) * 0.5;
        mouse.vy = mouse.vy * 0.5 + ((y - mouse.y) / dt) * 0.5;
      }
      mouse.x = x;
      mouse.y = y;
      mouse.t = now;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let gust = 0;
    const onGust = () => (gust = 1);
    window.addEventListener("yotei:gust", onGust);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let frame = 0;
    let prev = performance.now();
    let time = 0;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      if (!visible) return;
      time += dt;
      gust *= Math.pow(0.5, dt);
      mouse.vx *= Math.pow(0.05, dt);
      mouse.vy *= Math.pow(0.05, dt);

      for (let i = 0; i < N; i++) {
        const o = i * STRIDE;
        let x = data[o];
        let y = data[o + 1];
        const d = depth[i];
        // prevailing westward wind, with slow eddies
        const wx = -0.07 - 0.035 * Math.sin(y * 6 + time * 0.5 + d * 3) - gust * (2.2 + 0.8 * Math.sin(y * 9 + time * 4));
        const wy = 0.035 + 0.025 * Math.cos(x * 5 + time * 0.7 + d * 2) + gust * 0.35 * Math.sin(x * 11 + time * 3);
        const grip = gust > 0.05 ? 6 : 2.2;
        vx[i] += (wx - vx[i]) * Math.min(1, dt * grip);
        vy[i] += (wy - vy[i]) * Math.min(1, dt * grip);
        // the cursor pushes whatever is near it
        const dx = x - mouse.x;
        const dy = (y - mouse.y) * 0.6;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 0.03) {
          const f = (1 - dist2 / 0.03) * dt * 3.2;
          vx[i] += mouse.vx * f;
          vy[i] += mouse.vy * f;
        }
        x += vx[i] * dt * (0.5 + d);
        y += vy[i] * dt * (0.5 + d);
        if (x < -0.04) {
          x = 1.04;
          y = Math.random() * 0.9;
        } else if (x > 1.06) x = -0.04;
        if (y > 1.04) {
          y = -0.04;
          x = Math.random() * 1.1;
        } else if (y < -0.08) y = 1.02;
        data[o] = x;
        data[o + 1] = y;
        data[o + 2] += (spin[i] + (Math.abs(vx[i]) + Math.abs(vy[i])) * 6) * dt;
      }

      const theme = document.documentElement.dataset.theme === "jin" ? COLORS.jin : COLORS.atsu;
      gl.uniform1f(uShape, theme.shape);
      gl.uniform3f(uA, theme.a[0], theme.a[1], theme.a[2]);
      gl.uniform3f(uB, theme.b[0], theme.b[1], theme.b[2]);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, N);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("yotei:gust", onGust);
      delete host.dataset.gl;
    };
  }, []);

  return (
    <div ref={wrap} className="wind-field pointer-events-none absolute inset-0 z-[5]">
      <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />
      <div className="wind-fallback">
        <Petals />
      </div>
    </div>
  );
}

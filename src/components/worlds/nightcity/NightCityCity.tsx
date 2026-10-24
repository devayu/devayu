"use client";

import NightCityStreet from "@/components/worlds/nightcity/NightCityStreet";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

// Night City in actual 3D: a raymarched street canyon of megablocks with lit
// windows, neon blade signs glowing through magenta fog, wet asphalt that
// mirrors everything, and the megatower at the end of the street. The camera
// drifts forward; the mouse turns your head. The SVG street underneath is the
// fallback when WebGL isn't available.

const vertex = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uLook;
uniform float uSteps;

float h11(float p) { return fract(sin(p * 127.1) * 43758.5453); }
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n21(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y);
}
float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}
vec3 neon(float h) {
  if (h < 0.3) return vec3(0.99, 0.93, 0.04);
  if (h < 0.55) return vec3(0.0, 0.94, 1.0);
  if (h < 0.8) return vec3(1.0, 0.17, 0.84);
  return vec3(1.0, 0.05, 0.24);
}

const float L1 = 7.0;
const float L2 = 11.0;

// Blade signs hanging off the near facades, sticking out over the street.
float signs(vec3 p, out float hue) {
  float side = p.x < 0.0 ? -1.0 : 1.0;
  float ax = abs(p.x);
  float id = floor(p.z / L1);
  float lz = p.z - (id + 0.5) * L1;
  float k = id * 7.7 + side * 3.0;
  hue = h11(k * 1.9);
  if (h11(k) < 0.42) return 1e3;
  float sy = 3.4 + h11(k * 1.3) * 6.0;
  float sh = 1.0 + h11(k * 2.9) * 2.4;
  return sdBox(vec3(ax - 4.05, p.y - sy, lz - 1.6), vec3(0.38, sh, 0.05));
}

// Scene: m.x = material (1 near block, 2 far tower, 3 sign, 4 ground),
// m.y = per-building hash.
float map(vec3 p, out vec2 m) {
  float side = p.x < 0.0 ? -1.0 : 1.0;
  float ax = abs(p.x);

  float id1 = floor(p.z / L1);
  float lz1 = p.z - (id1 + 0.5) * L1;
  float hs1 = h21(vec2(id1, side));
  float h1 = 7.0 + hs1 * 22.0;
  float d1 = sdBox(vec3(ax - 7.5, p.y - h1 * 0.5, lz1), vec3(3.0, h1 * 0.5, L1 * 0.5 - 0.35 - h11(id1 * 3.1 + side) * 0.6));

  float id2 = floor((p.z + 3.0) / L2);
  float lz2 = p.z + 3.0 - (id2 + 0.5) * L2;
  float hs2 = h21(vec2(id2 + 50.0, side));
  float h2 = 20.0 + hs2 * 50.0;
  float d2 = sdBox(vec3(ax - 15.5, p.y - h2 * 0.5, lz2), vec3(4.0, h2 * 0.5, L2 * 0.5 - 0.9));

  float hue;
  float ds = signs(p, hue);
  float dg = p.y;

  float d = min(min(d1, d2), min(ds, dg));
  if (d == d1) m = vec2(1.0, hs1);
  else if (d == d2) m = vec2(2.0, hs2);
  else if (d == ds) m = vec2(3.0, hue);
  else m = vec2(4.0, 0.0);
  return d;
}

// Never step past a repetition cell boundary, or we'd skip a neighbour.
float cellClamp(vec3 p, vec3 rd) {
  float az = max(abs(rd.z), 1e-3);
  float a = mod(p.z, L1);
  float b = mod(p.z + 3.0, L2);
  float c1 = rd.z > 0.0 ? (L1 - a) : a;
  float c2 = rd.z > 0.0 ? (L2 - b) : b;
  return min(c1, c2) / az + 0.02;
}

float march(vec3 ro, vec3 rd, float maxSteps, out vec2 m, out vec3 glow) {
  float t = 0.0;
  glow = vec3(0.0);
  for (int i = 0; i < 110; i++) {
    if (float(i) >= maxSteps) break;
    vec3 p = ro + rd * t;
    float d = map(p, m);
    float hue;
    float sd = signs(p, hue);
    // neon bleeding into the fog
    glow += neon(hue) * 0.018 / (1.0 + sd * sd * 6.0);
    if (d < 0.002 * t + 0.002) return t;
    t += min(d, cellClamp(p, rd)) * 0.9;
    if (t > 170.0) break;
  }
  m = vec2(0.0);
  return -1.0;
}

vec3 normalAt(vec3 p) {
  vec2 m;
  vec2 e = vec2(0.002, 0.0);
  return normalize(vec3(
    map(p + e.xyy, m) - map(p - e.xyy, m),
    map(p + e.yxy, m) - map(p - e.yxy, m),
    map(p + e.yyx, m) - map(p - e.yyx, m)));
}

vec3 fogColor(vec3 rd) {
  float horizon = smoothstep(0.35, 0.0, abs(rd.y));
  return mix(vec3(0.07, 0.01, 0.07), vec3(0.42, 0.06, 0.24), horizon);
}

vec3 sky(vec3 rd) {
  if (rd.y < 0.0) return fogColor(rd) * 1.3;
  vec3 c = mix(vec3(0.33, 0.04, 0.2), vec3(0.015, 0.0, 0.035), smoothstep(-0.02, 0.45, rd.y));
  // the megatower at the end of the street, with its halo
  float ax = abs(rd.x / max(rd.z, 0.01));
  float ay = rd.y / max(rd.z, 0.01);
  c += vec3(1.0, 0.18, 0.4) * exp(-ax * 9.0) * smoothstep(0.7, 0.0, ay) * 0.35;
  float spire = 0.5 - ax * 9.0;
  if (ax < 0.035 && ay < spire && rd.z > 0.0) {
    c = vec3(0.03, 0.01, 0.045);
    c += vec3(1.0, 0.1, 0.35) * step(0.9, fract(ay * 60.0)) * 0.45 * step(ax, 0.02);
    if (ay > spire - 0.02) c += vec3(1.0, 0.0, 0.2) * (0.6 + 0.4 * sin(uTime * 3.0));
  }
  return c;
}

vec3 shade(vec3 p, vec3 rd, vec2 m) {
  vec3 n = normalAt(p);
  if (m.x > 3.5) return vec3(0.0);
  if (m.x > 2.5) {
    // a sign: a lit frame around glowing glyphs, like vertical neon lettering
    float lx = fract(abs(p.x) * 2.63);              // across the blade
    float edge = smoothstep(0.12, 0.0, min(lx, 1.0 - lx));
    vec2 g = vec2(floor(abs(p.x) * 7.0), floor(p.y * 4.2));
    vec2 gf = fract(vec2(abs(p.x) * 7.0, p.y * 4.2));
    float glyph = step(0.45, h21(g + m.y * 17.0)) * step(0.15, gf.x) * step(gf.x, 0.85) * step(0.2, gf.y) * step(gf.y, 0.8);
    float flicker = step(0.06, fract(sin(floor(uTime * 9.0) + m.y * 40.0) * 999.0));
    float on = (flicker > 0.5 || m.y > 0.12) ? 1.0 : 0.3;
    return (vec3(0.03) + neon(m.y) * (edge * 2.2 + glyph * 1.8)) * on;
  }
  bool far = m.x > 1.5;
  vec2 uv = abs(n.x) > 0.5 ? vec2(p.z, p.y) : vec2(p.x, p.y);
  vec2 cell = far ? vec2(0.8, 1.1) : vec2(0.48, 0.66);
  vec2 wid = floor(uv / cell);
  vec2 w = fract(uv / cell);
  float aa = far ? 0.12 : 0.08;
  float win = smoothstep(0.18, 0.18 + aa, w.x) * smoothstep(0.82, 0.82 - aa, w.x)
            * smoothstep(0.24, 0.24 + aa, w.y) * smoothstep(0.76, 0.76 - aa, w.y);
  // some floors are entirely dark, some blinds half drawn
  win *= step(0.12, h21(vec2(wid.y, m.y * 33.0)));
  win *= mix(0.55, 1.0, step(0.5, w.y + h21(wid + 7.0) * 0.5));
  float lit = step(0.62 - m.y * 0.3, h21(wid + m.y * 91.0));
  vec3 warm = vec3(1.0, 0.68, 0.36);
  vec3 cool = vec3(0.45, 0.8, 1.0);
  vec3 wc = mix(warm, cool, step(0.72, h21(wid * 1.7 + 3.0)));
  vec3 col = vec3(0.02, 0.018, 0.035) + win * lit * wc * (far ? 1.0 : 1.35) * (0.6 + 0.4 * h21(wid * 3.3));
  // neon bands wrapping some blocks
  float bandY = 4.0 + fract(m.y * 13.0) * 14.0;
  col += (1.0 - smoothstep(0.0, 0.09, abs(p.y - bandY))) * step(0.6, m.y) * neon(fract(m.y * 7.0)) * 2.2;
  // rooftop light strip
  col += smoothstep(0.85, 1.0, n.y) * neon(fract(m.y * 3.0)) * 0.15;
  // grime near the street, rim light from the fog
  col *= 0.45 + 0.55 * smoothstep(0.0, 4.0, p.y);
  col += fogColor(rd) * pow(1.0 - abs(dot(n, -rd)), 4.0) * 0.4;
  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float z = mod(uTime * 1.3, 616.0);
  vec3 ro = vec3(0.0, 1.7, z);
  float yaw = uLook.x * 0.22;
  float pitch = 0.07 - uLook.y * 0.1;
  vec3 fwd = normalize(vec3(sin(yaw), sin(pitch), cos(yaw)));
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
  vec3 up = cross(fwd, right);
  vec3 rd = normalize(fwd * 1.45 + uv.x * right + uv.y * up);

  vec2 m;
  vec3 glow;
  float t = march(ro, rd, uSteps, m, glow);
  vec3 col;
  if (t < 0.0) {
    col = sky(rd);
  } else {
    vec3 p = ro + rd * t;
    col = shade(p, rd, m);
    if (m.x > 3.5) {
      // wet street: dark asphalt, a dashed centre line, puddles mirroring the city
      vec3 asphalt = vec3(0.012, 0.011, 0.018);
      float line = step(abs(p.x), 0.07) * step(0.5, fract(p.z / 4.0));
      asphalt += vec3(0.6, 0.55, 0.05) * line * 0.35;
      float puddle = smoothstep(0.42, 0.62, n21(p.xz * 0.35) * 0.7 + n21(p.xz * 1.3) * 0.3);
      vec3 rr = reflect(rd, vec3(0.0, 1.0, 0.0));
      rr.xz += (n21(p.xz * 9.0) - 0.5) * 0.05 * (1.0 - puddle);
      rr = normalize(rr);
      vec2 m2;
      vec3 g2;
      float t2 = march(p + vec3(0.0, 0.01, 0.0), rr, uSteps * 0.55, m2, g2);
      vec3 refl = t2 < 0.0 ? sky(rr) : shade(p + rr * t2, rr, m2);
      refl = mix(refl, fogColor(rr), 1.0 - exp(-max(t2, 60.0) * 0.02)) + g2;
      float fres = 0.25 + 0.75 * pow(1.0 - max(-rd.y, 0.0), 5.0);
      col = asphalt + refl * mix(0.4, 1.05, puddle) * fres;
      col += fogColor(rd) * 0.25 * exp(-p.y * 2.0);
    }
    col = mix(col, fogColor(rd), 1.0 - exp(-t * 0.024));
  }
  col += glow;

  // rain against the lens
  vec2 q = vec2(gl_FragCoord.x / 3.0, gl_FragCoord.y / 90.0 + uTime * 7.0 + h11(floor(gl_FragCoord.x / 3.0)) * 10.0);
  col += step(0.988, h21(vec2(floor(q.x), floor(q.y)))) * smoothstep(0.0, 1.0, fract(q.y)) * vec3(0.5, 0.8, 1.0) * 0.12;

  // grade: lift the blacks toward violet, gentle filmic shoulder, vignette
  col = col / (1.0 + col * 0.55);
  col = pow(col, vec3(0.9));
  col *= 1.0 - 0.45 * dot(uv * 0.9, uv * 0.9);
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function NightCityCity({ running = true, className }: { running?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const runningRef = useRef(running);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uLook = gl.getUniformLocation(prog, "uLook");
    const uSteps = gl.getUniformLocation(prog, "uSteps");

    // Raymarching is per-pixel work: render at a fraction of the screen and
    // let the fog and grade hide the upscale.
    const mobile = window.innerWidth < 768;
    let scale = mobile ? 0.4 : 0.55;
    const steps = mobile ? 70 : 100;
    const size = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * scale));
      canvas.height = Math.max(1, Math.round(r.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    size();
    window.addEventListener("resize", size);

    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      look.tx = (e.clientX / window.innerWidth) * 2 - 1;
      look.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let frame = 0;
    let clock = 8;
    let prev = performance.now();
    let slowFrames = 0;
    let drawn = false;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (!visible || !runningRef.current) return;
      // If the GPU can't keep up, drop resolution once rather than stutter.
      if (dt > 0.034) slowFrames++;
      if (slowFrames > 40 && scale > 0.35) {
        scale *= 0.75;
        slowFrames = 0;
        size();
      }
      if (!reduce) clock += dt;
      look.x += (look.tx - look.x) * 0.05;
      look.y += (look.ty - look.y) * 0.05;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, clock);
      gl.uniform2f(uLook, look.x, look.y);
      gl.uniform1f(uSteps, steps);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!drawn) {
        drawn = true;
        canvas.dataset.ready = "true";
      }
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className={cn("absolute inset-0", className)}>
      <NightCityStreet />
      <canvas
        ref={ref}
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100"
      />
    </div>
  );
}

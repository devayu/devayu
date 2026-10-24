"use client";

import { getTimeScale } from "@/lib/timewarp";
import { useEffect, useRef } from "react";

// Rain running down a window, with the city behind it refracted through
// every drop. The glass is fogged; dragging the cursor across it wipes a
// clear patch that slowly mists back over. The city itself is the hero SVG,
// rasterised once into a texture.

const vertex = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

// Drop maths after BigWings' "Heartfelt", simplified for WebGL 1.
const fragment = `
precision highp float;
uniform sampler2D uCity;
uniform sampler2D uWipe;
uniform vec2 uRes;
uniform float uTime;

float N(float t) { return fract(sin(t * 12345.564) * 7658.76); }
vec3 N13(float p) {
  vec3 p3 = fract(vec3(p) * vec3(.1031, .11369, .13787));
  p3 += dot(p3, p3.yzx + 19.19);
  return fract(vec3((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
}
float Saw(float b, float t) { return smoothstep(0., b, t) * smoothstep(1., b, t); }

vec2 DropLayer(vec2 uv, float t) {
  vec2 UV = uv;
  uv.y += t * 0.75;
  vec2 a = vec2(6., 1.);
  vec2 grid = a * 2.;
  vec2 id = floor(uv * grid);
  uv.y += N(id.x);
  id = floor(uv * grid);
  vec3 n = N13(id.x * 35.2 + id.y * 2376.1);
  vec2 st = fract(uv * grid) - vec2(.5, 0);
  float x = n.x - .5;
  float y = UV.y * 20.;
  x += sin(y + sin(y)) * (.5 - abs(x)) * (n.z - .5);
  x *= .7;
  float ti = fract(t + n.z);
  y = (Saw(.85, ti) - .5) * .9 + .5;
  float d = length((st - vec2(x, y)) * a.yx);
  float mainDrop = smoothstep(.4, .0, d);
  float r = sqrt(smoothstep(1., y, st.y));
  float cd = abs(st.x - x);
  float trail = smoothstep(.23 * r, .15 * r * r, cd);
  float trailFront = smoothstep(-.02, .02, st.y - y);
  trail *= trailFront * r * r;
  float yy = fract(UV.y * 10.) + (st.y - .5);
  float droplets = smoothstep(.3, 0., length(st - vec2(x, yy)));
  return vec2(mainDrop + droplets * r * trailFront, trail);
}

float StaticDrops(vec2 uv, float t) {
  uv *= 40.;
  vec2 id = floor(uv);
  uv = fract(uv) - .5;
  vec3 n = N13(id.x * 107.45 + id.y * 3543.654);
  vec2 p = (n.xy - .5) * .7;
  float fade = Saw(.025, fract(t + n.z));
  return smoothstep(.3, 0., length(uv - p)) * fract(n.z * 10.) * fade;
}

vec2 Drops(vec2 uv, float t) {
  float s = StaticDrops(uv, t) * 1.6;
  vec2 m1 = DropLayer(uv, t);
  vec2 m2 = DropLayer(uv * 1.85, t);
  float c = smoothstep(.3, 1., s + m1.x + m2.x);
  return vec2(c, max(m1.y, m2.y));
}

vec3 city(vec2 uv, float r) {
  vec3 c = texture2D(uCity, uv).rgb * 0.36;
  c += texture2D(uCity, uv + vec2(r, 0.)).rgb * 0.16;
  c += texture2D(uCity, uv - vec2(r, 0.)).rgb * 0.16;
  c += texture2D(uCity, uv + vec2(0., r)).rgb * 0.16;
  c += texture2D(uCity, uv - vec2(0., r)).rgb * 0.16;
  return c;
}

void main() {
  vec2 UV = gl_FragCoord.xy / uRes;
  vec2 uv = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  float t = uTime * .2;
  float wipe = texture2D(uWipe, vec2(UV.x, 1.0 - UV.y)).r;

  vec2 c = Drops(uv, t);
  vec2 e = vec2(.001, 0.);
  float cx = Drops(uv + e, t).x;
  float cy = Drops(uv + e.yx, t).x;
  vec2 n = vec2(cx - c.x, cy - c.x) * (1.0 - wipe * 0.85);

  // Fog is thick on the glass, gone inside drops, trails and wiped patches.
  float fog = (1.0 - smoothstep(.1, .2, c.x)) * (1.0 - c.y * 0.9) * (1.0 - wipe);
  vec3 col = city(UV + n, mix(0.0008, 0.009, fog));
  col = mix(col, col * 0.75 + vec3(0.05, 0.06, 0.075), fog * 0.6);
  col += smoothstep(0.2, 0.9, c.x) * 0.06 * (1.0 - wipe);
  // a cold edge vignette, like a window at night
  float v = smoothstep(1.25, 0.35, length(UV - 0.5) * 1.4);
  gl_FragColor = vec4(col * mix(0.55, 1.0, v), 1.0);
}
`;

export default function RainGlass({ source }: { source: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const svg = document.querySelector<SVGSVGElement>(source);
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!svg || !gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
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
    gl.uniform1i(gl.getUniformLocation(prog, "uCity"), 0);
    gl.uniform1i(gl.getUniformLocation(prog, "uWipe"), 1);

    const makeTex = (unit: number) => {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    };
    const cityTex = makeTex(0);
    const wipeTex = makeTex(1);

    // The wipe mask: a small canvas the cursor paints on, which slowly fogs back.
    const wipe = document.createElement("canvas");
    wipe.width = 160;
    wipe.height = 100;
    const wctx = wipe.getContext("2d")!;
    wctx.fillStyle = "#000";
    wctx.fillRect(0, 0, wipe.width, wipe.height);

    let ready = false;
    let disposed = false;
    const size = () => {
      const scale = window.innerWidth < 768 ? 0.6 : Math.min(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * scale));
      canvas.height = Math.max(1, Math.round(rect.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      return rect;
    };

    // Rasterise the city: clone the SVG at the canvas' size, draw it to an image.
    const rasterise = () => {
      const rect = size();
      const clone = svg.cloneNode(true) as SVGSVGElement;
      // The glass brings its own rain.
      clone.querySelectorAll(".art-rain").forEach((n) => n.remove());
      clone.setAttribute("width", String(Math.round(rect.width)));
      clone.setAttribute("height", String(Math.round(rect.height)));
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
      const img = new Image();
      img.onload = () => {
        if (disposed) return;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, cityTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        URL.revokeObjectURL(url);
        ready = true;
        canvas.dataset.ready = "true";
      };
      img.src = url;
    };
    rasterise();

    let last: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * wipe.width;
      const y = ((e.clientY - r.top) / r.height) * wipe.height;
      if (x < 0 || y < 0 || x > wipe.width || y > wipe.height) {
        last = null;
        return;
      }
      wctx.strokeStyle = "#fff";
      wctx.lineCap = "round";
      wctx.lineWidth = 14;
      wctx.beginPath();
      wctx.moveTo(last?.x ?? x, last?.y ?? y);
      wctx.lineTo(x, y);
      wctx.stroke();
      last = { x, y };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let frame = 0;
    let clock = 0;
    let prev = performance.now();
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (!ready || !visible) return;
      clock += dt * getTimeScale();
      // refog
      wctx.fillStyle = "rgba(0,0,0,0.012)";
      wctx.fillRect(0, 0, wipe.width, wipe.height);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, wipeTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wipe);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, clock + 12);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    frame = requestAnimationFrame(loop);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(rasterise, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [source]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100"
    />
  );
}

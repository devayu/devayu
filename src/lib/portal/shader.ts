// One full-screen fragment shader that draws every world's transition.
// It never samples the page: it paints a cover over it (phase 0), then
// uncovers the next page (phase 1) once the route has changed underneath.

export const MODES = { noir: 0, frontier: 1, "night-city": 2, yotei: 3 } as const;

const vertex = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uT;      // 0..1 within the current phase
uniform float uPhase;  // 0 = cover, 1 = reveal
uniform float uTime;
uniform float uMode;
uniform vec2 uOrigin;  // 0..1, y up
uniform vec3 uAccent;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
float ease(float t) { return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0; }

// Noir: ink pours down from the top in drips, lit along its edge by a
// streetlamp; on reveal it drains away downward.
vec4 noir(vec2 uv) {
  float drip = fbm(vec2(uv.x * 14.0, 0.0)) * 0.45 + fbm(vec2(uv.x * 70.0, 3.0)) * 0.12;
  float t = ease(uT);
  // Cover: ink is everything above a dripping line that falls.
  // Reveal: ink is everything below a line that falls, so it drains away.
  float d = uPhase < 0.5
    ? uv.y - (1.15 - t * 1.75 + drip)
    : (1.15 - t * 1.85 + drip * 0.8) - uv.y;
  float cover = smoothstep(0.0, 0.004, d);
  vec3 ink = vec3(0.022, 0.026, 0.034);
  float rain = step(0.992, hash(vec2(floor(uv.x * 240.0), 1.0))) * smoothstep(0.6, 1.0, fract(uv.y * 2.5 + uTime * 2.2 + hash(vec2(floor(uv.x * 240.0), 9.0))));
  ink += rain * 0.12;
  float edge = smoothstep(0.03, 0.0, abs(d)) * cover;
  vec3 col = mix(ink, vec3(0.91, 0.87, 0.65), edge * 0.85);
  return vec4(col, max(cover, edge));
}

// Frontier: the film burns through from where you clicked; on reveal the
// burnt frame burns away from the centre.
vec4 frontier(vec2 uv, float ar) {
  vec2 o = uPhase < 0.5 ? uOrigin : vec2(0.5);
  float d = length((uv - o) * vec2(ar, 1.0));
  float n = fbm(uv * vec2(ar, 1.0) * 3.5 + uTime * 0.15) * 0.45;
  float r = ease(uT) * (1.25 + 0.45);
  float front = r - (d + n);
  float burnt = uPhase < 0.5 ? smoothstep(0.0, 0.01, front) : smoothstep(0.0, 0.01, -front);
  float band = smoothstep(0.09, 0.0, abs(front));
  vec3 film = vec3(0.11, 0.05, 0.03);
  float grain = hash(uv * uRes + floor(uTime * 24.0)) * 0.06;
  float scratch = step(0.997, hash(vec2(floor(uv.x * 400.0), floor(uTime * 12.0)))) * 0.25;
  film += grain + scratch;
  vec3 hot = mix(vec3(1.0, 0.45, 0.08), vec3(1.0, 0.95, 0.7), smoothstep(0.05, 0.0, abs(front)));
  vec3 col = mix(film, hot, band);
  return vec4(col, max(burnt, band));
}

// Night City: the frame breaks into glitch blocks, with neon tears where
// the corruption is advancing.
vec4 nightCity(vec2 uv) {
  float row = floor(uv.y * 34.0);
  float cols = mix(5.0, 48.0, hash(vec2(row, 7.0)));
  float jitter = (hash(vec2(row, floor(uTime * 20.0))) - 0.5) * 0.04 * (1.0 - abs(uT * 2.0 - 1.0));
  float cell = floor((uv.x + jitter) * cols);
  float h = hash(vec2(cell, row));
  float t = uT * 1.25 - 0.12;
  float on = uPhase < 0.5 ? step(h, t) : step(t, h);
  float tear = smoothstep(0.05, 0.0, abs(h - t));
  vec3 base = vec3(0.012, 0.012, 0.02);
  float pick = hash(vec2(cell, row + 31.0));
  vec3 neon = pick < 0.5 ? vec3(0.99, 0.93, 0.04) : (pick < 0.8 ? vec3(0.0, 0.94, 1.0) : vec3(1.0, 0.0, 0.24));
  vec3 col = base + step(0.94, hash(vec2(cell, row + 99.0))) * neon * 0.9;
  col *= 0.85 + 0.15 * step(0.5, fract(uv.y * uRes.y * 0.5));
  col = mix(col, neon, tear);
  return vec4(col, max(on, tear * 0.9));
}

// Yōtei: two halves of ink close along a sword's path, a flash of steel
// cuts between them, then they part along the cut.
vec4 yotei(vec2 uv, float ar) {
  vec2 p = (uv - 0.5) * vec2(ar, 1.0);
  vec2 tng = normalize(vec2(1.0, 0.5));
  vec2 nrm = vec2(-tng.y, tng.x);
  float s = dot(p, nrm);
  float along = dot(p, tng);
  float t = ease(uT);
  float gap = uPhase < 0.5 ? (1.0 - t) * 1.3 : t * 1.4;
  float cover = smoothstep(0.0, 0.003, abs(s) - gap);
  float brush = fbm(vec2(along * 3.0, s * 26.0)) * 0.08;
  vec3 ink = vec3(0.04, 0.035, 0.04) + brush;
  float lip = smoothstep(0.012, 0.0, abs(abs(s) - gap)) * cover;
  vec3 col = mix(ink, uAccent, lip);
  float flashT = uPhase < 0.5 ? smoothstep(0.82, 1.0, uT) : 1.0 - smoothstep(0.0, 0.22, uT);
  float flash = smoothstep(0.006 + 0.01 * flashT, 0.0, abs(s)) * flashT;
  col = mix(col, vec3(1.0), flash);
  return vec4(col, max(cover, flash));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float ar = uRes.x / uRes.y;
  vec4 c;
  if (uMode < 0.5) c = noir(uv);
  else if (uMode < 1.5) c = frontier(uv, ar);
  else if (uMode < 2.5) c = nightCity(uv);
  else c = yotei(uv, ar);
  gl_FragColor = vec4(c.rgb * c.a, c.a);
}
`;

export type Uniforms = {
  t: number;
  phase: 0 | 1;
  time: number;
  mode: number;
  origin: [number, number];
  accent: [number, number, number];
};

export const createRenderer = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  let program: WebGLProgram;
  try {
    program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  } catch {
    return null;
  }
  gl.useProgram(program);

  // One triangle that covers the screen.
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const loc = (n: string) => gl.getUniformLocation(program, n);
  const u = {
    res: loc("uRes"),
    t: loc("uT"),
    phase: loc("uPhase"),
    time: loc("uTime"),
    mode: loc("uMode"),
    origin: loc("uOrigin"),
    accent: loc("uAccent"),
  };

  const resize = () => {
    // Cap the pixel ratio: the effect is soft, and this keeps phones smooth.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const w = Math.round(window.innerWidth * dpr);
    const h = Math.round(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
  };

  return {
    draw(v: Uniforms) {
      resize();
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.t, v.t);
      gl.uniform1f(u.phase, v.phase);
      gl.uniform1f(u.time, v.time);
      gl.uniform1f(u.mode, v.mode);
      gl.uniform2f(u.origin, v.origin[0], v.origin[1]);
      gl.uniform3f(u.accent, v.accent[0], v.accent[1], v.accent[2]);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    clear() {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
  };
};

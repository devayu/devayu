// One world, four realities. A single raymarched street whose every element is
// a function of uW (0 Noir, 1 Frontier, 2 Night City, 3 Yōtei): as uW moves,
// brownstones sink into mesas, mesas rise into megablocks, megablocks melt into
// hills under Mount Yōtei; the moon sets into the sun, rain turns to dust,
// to neon rain, to petals.

export const realityVertex = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

export const realityFragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uW;
uniform float uCamZ;
uniform vec2 uLook;
uniform float uSteps;
uniform float uJin;

float h11(float p) { return fract(sin(p * 127.1) * 43758.5453); }
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n21(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y);
}
float sm(float t) { return t * t * (3.0 - 2.0 * t); }
// A value keyed per reality, smoothly interpolated along uW.
float k4(float a, float b, float c, float d) {
  float x = clamp(uW, 0.0, 3.0);
  if (x < 1.0) return mix(a, b, sm(x));
  if (x < 2.0) return mix(b, c, sm(x - 1.0));
  return mix(c, d, sm(x - 2.0));
}
vec3 k4(vec3 a, vec3 b, vec3 c, vec3 d) {
  float x = clamp(uW, 0.0, 3.0);
  if (x < 1.0) return mix(a, b, sm(x));
  if (x < 2.0) return mix(b, c, sm(x - 1.0));
  return mix(c, d, sm(x - 2.0));
}
// How much of one reality is present right now (a hat around its index).
float wt(float i) { return clamp(1.0 - abs(uW - i), 0.0, 1.0); }

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}
vec3 neon(float h) {
  if (h < 0.3) return vec3(0.99, 0.93, 0.04);
  if (h < 0.55) return vec3(0.0, 0.94, 1.0);
  if (h < 0.8) return vec3(1.0, 0.17, 0.84);
  return vec3(1.0, 0.05, 0.24);
}

const float L1 = 7.0;
const float L2 = 11.0;

// ——— the world's parameters, keyed per reality ———
float pHeightBase() { return k4(4.0, 2.2, 7.0, -1.0); }
float pHeightVar() { return k4(5.0, 3.5, 22.0, 0.0); }
float pOffset() { return k4(7.5, 12.0, 7.5, 9.0); }
float pHalfWidth() { return k4(3.0, 6.0, 3.0, 4.5); }
float pGap() { return k4(1.0, 0.0, 1.0, 0.0); }
float pRound() { return k4(0.05, 1.4, 0.05, 1.6); }
float pFarHeight() { return k4(6.0, 5.0, 20.0, 0.0); }
float pFarVar() { return k4(8.0, 6.0, 50.0, 0.0); }
float pSigns() { return wt(2.0); }
float pLamps() { return wt(0.0); }
float pMountain() { return sm(clamp(uW - 2.0, 0.0, 1.0)); }
float pTerrain() { return sm(clamp(uW - 2.2, 0.0, 0.8) / 0.8); }
// rolling meadow that rises away from the path
float terrain(vec3 p) {
  float away = smoothstep(3.0, 13.0, abs(p.x));
  float swell = 1.6 + 3.4 * n21(p.xz * 0.045) + 1.2 * n21(p.xz * 0.13);
  return away * swell;
}

float signs(vec3 p, out float hue) {
  float s = pSigns();
  hue = 0.0;
  if (s < 0.02) return 1e3;
  float side = p.x < 0.0 ? -1.0 : 1.0;
  float ax = abs(p.x);
  float id = floor(p.z / L1);
  float lz = p.z - (id + 0.5) * L1;
  float k = id * 7.7 + side * 3.0;
  hue = h11(k * 1.9);
  if (h11(k) < 0.42) return 1e3;
  float sy = 3.4 + h11(k * 1.3) * 6.0;
  float sh = (1.0 + h11(k * 2.9) * 2.4) * s;
  return sdRoundBox(vec3(ax - 4.05, p.y - sy, lz - 1.6), vec3(0.38 * s, sh, 0.05), 0.02);
}

float lamps(vec3 p) {
  float s = pLamps();
  if (s < 0.02) return 1e3;
  float ax = abs(p.x);
  float lz = p.z - (floor(p.z / L1) + 0.5) * L1;
  vec2 q = vec2(length(vec2(ax - 3.6, lz)), p.y);
  float post = max(q.x - 0.07, abs(p.y - 2.3 * s) - 2.3 * s);
  float head = length(vec3(ax - 3.3, p.y - 4.55 * s, lz)) - 0.16 * s;
  return min(post, head);
}

float mountain(vec3 p) {
  float s = pMountain();
  if (s < 0.01) return 1e3;
  vec3 q = p - vec3(0.0, -2.0, uCamZ + 120.0);
  float r = length(q.xz);
  float ang = atan(q.z, q.x);
  float H = 46.0 * s;
  float R = 95.0;
  float slope = H / R;
  float ridges = sin(ang * 9.0) * 0.6 + sin(ang * 23.0) * 0.25;
  float d = (r * slope + q.y - H + ridges * s) / sqrt(1.0 + slope * slope);
  return max(d, q.y - H + 3.5 * s);
}

// m.x: 1 near block, 2 far block, 3 sign, 4 ground, 5 lamp, 6 mountain
float map(vec3 p, out vec2 m) {
  float side = p.x < 0.0 ? -1.0 : 1.0;
  float ax = abs(p.x);
  float hb = pHeightBase(), hv = pHeightVar();
  float off = pOffset(), hw = pHalfWidth(), rr = pRound();

  float id1 = floor(p.z / L1);
  float lz1 = p.z - (id1 + 0.5) * L1;
  float hs1 = h21(vec2(id1, side));
  float h1 = hb + hs1 * hv;
  float halfLen = L1 * 0.5 - (0.35 + h11(id1 * 3.1 + side) * 0.6) * pGap() + rr * 0.2 * (1.0 - pGap());
  float d1 = h1 < 0.25 ? 1e3 : sdRoundBox(vec3(ax - off, p.y - h1 * 0.5, lz1), vec3(hw, h1 * 0.5, halfLen), min(rr, h1 * 0.45));

  float id2 = floor((p.z + 3.0) / L2);
  float lz2 = p.z + 3.0 - (id2 + 0.5) * L2;
  float hs2 = h21(vec2(id2 + 50.0, side));
  float h2 = pFarHeight() + hs2 * pFarVar();
  float d2 = h2 < 0.3 ? 1e3 : sdRoundBox(vec3(ax - (off + 8.0), p.y - h2 * 0.5, lz2), vec3(4.0, h2 * 0.5, L2 * 0.5 - 0.9 * pGap()), min(rr, h2 * 0.45));

  float hue;
  float ds = signs(p, hue);
  float dl = lamps(p);
  float dm = mountain(p);
  float tw = pTerrain();
  float dg = tw > 0.01 ? (p.y - terrain(p) * tw) * 0.7 : p.y;

  float d = min(min(min(d1, d2), min(ds, dg)), min(dl, dm));
  if (d == d1) m = vec2(1.0, hs1);
  else if (d == d2) m = vec2(2.0, hs2);
  else if (d == ds) m = vec2(3.0, hue);
  else if (d == dl) m = vec2(5.0, 0.0);
  else if (d == dm) m = vec2(6.0, 0.0);
  else m = vec2(4.0, 0.0);
  return d;
}

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
  float s = pSigns();
  float lampW = pLamps();
  for (int i = 0; i < 110; i++) {
    if (float(i) >= maxSteps) break;
    vec3 p = ro + rd * t;
    float d = map(p, m);
    if (s > 0.02) {
      float hue;
      float sd = signs(p, hue);
      glow += neon(hue) * 0.018 * s / (1.0 + sd * sd * 6.0);
    }
    if (lampW > 0.02) {
      float ax = abs(p.x);
      float lz = p.z - (floor(p.z / L1) + 0.5) * L1;
      float ld = length(vec3(ax - 3.3, p.y - 4.55, lz));
      glow += vec3(1.0, 0.82, 0.5) * 0.02 * lampW / (1.0 + ld * ld * 2.5);
    }
    if (d < 0.002 * t + 0.002) return t;
    t += min(d, cellClamp(p, rd)) * 0.9;
    if (t > 175.0) break;
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

// ——— light and air ———
vec3 yoteiSkyTop() { return mix(vec3(0.96, 0.86, 0.82), vec3(0.16, 0.06, 0.04), uJin); }
vec3 yoteiSkyLow() { return mix(vec3(0.93, 0.94, 0.95), vec3(0.94, 0.66, 0.23), uJin); }

vec3 fogColor(vec3 rd) {
  float horizon = smoothstep(0.35, 0.0, abs(rd.y));
  vec3 lo = k4(vec3(0.05, 0.06, 0.08), vec3(0.85, 0.48, 0.24), vec3(0.07, 0.01, 0.07), yoteiSkyLow() * 0.92);
  vec3 hi = k4(vec3(0.16, 0.18, 0.22), vec3(1.0, 0.74, 0.42), vec3(0.42, 0.06, 0.24), yoteiSkyLow());
  return mix(lo, hi, horizon);
}
float fogDensity() { return k4(0.034, 0.009, 0.024, 0.014); }

vec3 sunDir() {
  return normalize(k4(vec3(0.42, 0.42, 1.0), vec3(0.0, 0.06, 1.0), vec3(0.0, 0.32, 1.0), vec3(0.34, 0.36, 1.0)));
}
float sunSize() { return k4(0.045, 0.12, 0.0, 0.085); }
vec3 sunColor() { return k4(vec3(0.85, 0.85, 0.8), vec3(1.0, 0.88, 0.58), vec3(1.0, 0.2, 0.4), mix(vec3(0.78, 0.16, 0.23), vec3(1.0, 0.9, 0.62), uJin)); }

vec3 sky(vec3 rd) {
  if (rd.y < 0.0) return fogColor(rd) * 1.2;
  vec3 top = k4(vec3(0.015, 0.02, 0.035), vec3(0.42, 0.16, 0.08), vec3(0.015, 0.0, 0.035), yoteiSkyTop());
  vec3 low = k4(vec3(0.1, 0.12, 0.16), vec3(1.0, 0.7, 0.36), vec3(0.33, 0.04, 0.2), yoteiSkyLow());
  vec3 c = mix(low, top, smoothstep(-0.02, 0.5, rd.y));
  // the moon, the setting sun, the crimson disc: one body moving across realities
  float cs = dot(rd, sunDir());
  float size = sunSize();
  if (size > 0.001) {
    float disc = smoothstep(cos(size), cos(size * 0.94), cs);
    c = mix(c, sunColor(), disc);
    c += sunColor() * pow(max(cs, 0.0), 40.0) * k4(0.15, 0.6, 0.0, 0.35);
  }
  // the megatower at the end of the street
  float tw = wt(2.0);
  if (tw > 0.01 && rd.z > 0.0) {
    float ax = abs(rd.x / rd.z);
    float ay = rd.y / rd.z;
    c += vec3(1.0, 0.18, 0.4) * exp(-ax * 9.0) * smoothstep(0.7, 0.0, ay) * 0.35 * tw;
    float spire = (0.5 - ax * 9.0) * tw;
    if (ax < 0.035 && ay < spire) {
      c = mix(c, vec3(0.03, 0.01, 0.045), tw);
      c += vec3(1.0, 0.1, 0.35) * step(0.9, fract(ay * 60.0)) * 0.45 * step(ax, 0.02) * tw;
    }
  }
  return c;
}

vec3 shade(vec3 p, vec3 rd, vec2 m) {
  vec3 n = normalAt(p);
  vec3 L = sunDir();
  float diff = max(dot(n, L), 0.0);
  if (m.x > 5.5) {
    // the mountain: slate (or ember for Jin), snow above a jagged line
    float snowLine = 46.0 * pMountain() * 0.62 + sin(atan(p.z - uCamZ - 120.0, p.x) * 14.0) * 1.6 - 2.0;
    vec3 rock = mix(vec3(0.36, 0.43, 0.5), vec3(0.23, 0.12, 0.1), uJin);
    vec3 snow = mix(vec3(1.0), vec3(0.91, 0.72, 0.47), uJin);
    vec3 col = mix(rock, snow, smoothstep(snowLine, snowLine + 0.6, p.y));
    return col * (0.55 + 0.45 * diff);
  }
  if (m.x > 4.5) {
    return vec3(0.02) + vec3(1.0, 0.82, 0.5) * smoothstep(4.3, 4.6, p.y) * 2.0;
  }
  if (m.x > 3.5) return vec3(0.0);
  if (m.x > 2.5) {
    float lx = fract(abs(p.x) * 2.63);
    float edge = smoothstep(0.12, 0.0, min(lx, 1.0 - lx));
    vec2 g = vec2(floor(abs(p.x) * 7.0), floor(p.y * 4.2));
    vec2 gf = fract(vec2(abs(p.x) * 7.0, p.y * 4.2));
    float glyph = step(0.45, h21(g + m.y * 17.0)) * step(0.15, gf.x) * step(gf.x, 0.85) * step(0.2, gf.y) * step(gf.y, 0.8);
    float flicker = step(0.06, fract(sin(floor(uTime * 9.0) + m.y * 40.0) * 999.0));
    float on = (flicker > 0.5 || m.y > 0.12) ? 1.0 : 0.3;
    return (vec3(0.03) + neon(m.y) * (edge * 2.2 + glyph * 1.8)) * on;
  }

  bool far = m.x > 1.5;
  // surface: brick, sandstone with strata, black glass, grassy hillside
  vec3 brick = vec3(0.07, 0.055, 0.06);
  vec3 sand = mix(vec3(0.95, 0.52, 0.26), vec3(0.74, 0.36, 0.18), step(0.5, fract(p.y * 0.9 + n21(p.xz * 0.2) * 0.6)));
  vec3 glass = vec3(0.02, 0.018, 0.035);
  vec3 slate = mix(vec3(0.36, 0.43, 0.5), vec3(0.3, 0.14, 0.08), uJin);
  vec3 grass = mix(vec3(0.78, 0.64, 0.4), vec3(0.88, 0.62, 0.15), uJin) * (0.85 + 0.3 * n21(p.xz * 3.0));
  vec3 hill = mix(grass, slate, smoothstep(0.8, 2.6, p.y));
  vec3 base = k4(brick, sand, glass, hill);
  float lit = k4(0.25, 0.9, 0.15, 0.7);
  // sunlight plus warm bounce from the sky, strongest in the desert
  vec3 col = base * (lit * (0.45 + 0.75 * diff) + (1.0 - lit)) + base * fogColor(vec3(0.0, 0.1, 1.0)) * 0.35 * wt(1.0);

  // windows: sparse and warm in Noir, none in the desert, a sea of them in Night City
  float winW = k4(0.75, 0.0, 1.0, 0.0);
  if (winW > 0.01) {
    vec2 uv = abs(n.x) > 0.5 ? vec2(p.z, p.y) : vec2(p.x, p.y);
    vec2 cell = far ? vec2(0.8, 1.1) : vec2(0.48, 0.66);
    vec2 wid = floor(uv / cell);
    vec2 w = fract(uv / cell);
    float aa = far ? 0.12 : 0.08;
    float win = smoothstep(0.18, 0.18 + aa, w.x) * smoothstep(0.82, 0.82 - aa, w.x)
              * smoothstep(0.24, 0.24 + aa, w.y) * smoothstep(0.76, 0.76 - aa, w.y);
    win *= step(0.12, h21(vec2(wid.y, m.y * 33.0)));
    float density = k4(0.82, 1.0, 0.62 - m.y * 0.3, 1.0);
    float on = step(density, h21(wid + m.y * 91.0));
    vec3 wc = mix(vec3(1.0, 0.68, 0.36), vec3(0.45, 0.8, 1.0), step(0.72, h21(wid * 1.7 + 3.0)) * wt(2.0));
    col += win * on * wc * (far ? 1.0 : 1.35) * (0.6 + 0.4 * h21(wid * 3.3)) * winW * (0.4 + 0.6 * smoothstep(0.2, 1.5, p.y));
  }
  // neon bands on the megablocks
  float bandY = 4.0 + fract(m.y * 13.0) * 14.0;
  col += (1.0 - smoothstep(0.0, 0.09, abs(p.y - bandY))) * step(0.6, m.y) * neon(fract(m.y * 7.0)) * 2.2 * wt(2.0);

  col *= mix(0.45, 0.85, wt(1.0) + wt(3.0)) + (1.0 - mix(0.45, 0.85, wt(1.0) + wt(3.0))) * smoothstep(0.0, 4.0, p.y);
  col += fogColor(rd) * pow(1.0 - abs(dot(n, -rd)), 4.0) * 0.4;
  return col;
}

// ——— the window you're looking through (Noir only): rain on glass ———
float Saw(float b, float t) { return smoothstep(0.0, b, t) * smoothstep(1.0, b, t); }
vec3 N13(float p) {
  vec3 p3 = fract(vec3(p) * vec3(.1031, .11369, .13787));
  p3 += dot(p3, p3.yzx + 19.19);
  return fract(vec3((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
}
vec2 dropLayer(vec2 uv, float t) {
  vec2 UV = uv;
  uv.y += t * 0.75;
  vec2 a = vec2(6.0, 1.0);
  vec2 grid = a * 2.0;
  vec2 id = floor(uv * grid);
  uv.y += h11(id.x);
  id = floor(uv * grid);
  vec3 n = N13(id.x * 35.2 + id.y * 2376.1);
  vec2 st = fract(uv * grid) - vec2(0.5, 0.0);
  float x = n.x - 0.5;
  float y = UV.y * 20.0;
  x += sin(y + sin(y)) * (0.5 - abs(x)) * (n.z - 0.5);
  x *= 0.7;
  float ti = fract(t + n.z);
  y = (Saw(0.85, ti) - 0.5) * 0.9 + 0.5;
  float d = length((st - vec2(x, y)) * a.yx);
  float mainDrop = smoothstep(0.4, 0.0, d);
  float r = sqrt(smoothstep(1.0, y, st.y));
  float trail = smoothstep(0.23 * r, 0.15 * r * r, abs(st.x - x)) * smoothstep(-0.02, 0.02, st.y - y) * r * r;
  return vec2(mainDrop, trail);
}
float glassDrops(vec2 uv, float t) {
  vec2 a = dropLayer(uv, t);
  vec2 b = dropLayer(uv * 1.85, t);
  return smoothstep(0.3, 1.0, a.x + b.x + max(a.y, b.y) * 0.4);
}

// ——— weather, painted on the lens ———
vec3 weather(vec2 frag, vec3 col) {
  float t = uTime;
  // rain: grey in Noir, cyan in Night City
  float rw = k4(1.0, 0.0, 0.7, 0.0);
  if (rw > 0.01) {
    vec2 q = vec2(frag.x / 3.0, frag.y / 90.0 + t * 7.0 + h11(floor(frag.x / 3.0)) * 10.0);
    float streak = step(0.986, h21(vec2(floor(q.x), floor(q.y)))) * smoothstep(0.0, 1.0, fract(q.y));
    col += streak * rw * k4(vec3(0.55, 0.62, 0.7), vec3(0.5), vec3(0.4, 0.85, 1.0), vec3(0.5)) * 0.14;
  }
  // dust motes drifting in the desert light
  float dw = wt(1.0);
  if (dw > 0.01) {
    vec2 g = frag / 26.0 + vec2(t * 0.35, sin(t * 0.3) * 0.4);
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5 - (vec2(h21(id), h21(id + 4.0)) - 0.5) * 0.7;
    col += vec3(1.0, 0.85, 0.6) * smoothstep(0.07, 0.0, length(f)) * step(0.7, h21(id + 9.0)) * dw * 0.35;
  }
  return col;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5 * uRes) / uRes.y;

  // Noir's window: drops refract the view; they evaporate as the reality turns
  float glassW = wt(0.0);
  vec2 refr = vec2(0.0);
  float drops = 0.0;
  if (glassW > 0.01) {
    float gt = uTime * 0.2;
    drops = glassDrops(uv, gt);
    float dx = glassDrops(uv + vec2(0.002, 0.0), gt) - drops;
    float dy = glassDrops(uv + vec2(0.0, 0.002), gt) - drops;
    refr = vec2(dx, dy) * glassW * 0.9;
  }

  vec3 ro = vec3(0.0, k4(1.7, 1.8, 1.7, 1.6), uCamZ);
  float yaw = uLook.x * 0.22;
  float pitch = k4(0.05, 0.03, 0.07, 0.07) - uLook.y * 0.1;
  vec3 fwd = normalize(vec3(sin(yaw), sin(pitch), cos(yaw)));
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
  vec3 up = cross(fwd, right);
  vec3 rd = normalize(fwd * 1.45 + (uv.x + refr.x) * right + (uv.y + refr.y) * up);

  vec2 m;
  vec3 glow;
  float t = march(ro, rd, uSteps, m, glow);
  vec3 col;
  if (t < 0.0) {
    col = sky(rd);
  } else {
    vec3 p = ro + rd * t;
    col = shade(p, rd, m);
    if (m.x > 3.5 && m.x < 4.5) {
      // the street: wet asphalt, desert dirt, flooded neon, a pale path
      vec3 asphalt = vec3(0.012, 0.011, 0.018);
      vec3 dirt = vec3(0.78, 0.46, 0.25) * (0.8 + 0.2 * n21(p.xz * 0.8));
      vec3 path = mix(vec3(0.82, 0.84, 0.87), vec3(0.42, 0.24, 0.1), uJin) * (0.85 + 0.15 * n21(p.xz * 2.0));
      vec3 groundC = k4(asphalt, dirt, asphalt, path);
      float meadow = smoothstep(3.2, 6.0, abs(p.x)) * pTerrain();
      if (meadow > 0.01) {
        vec3 slate = mix(vec3(0.36, 0.43, 0.5), vec3(0.3, 0.14, 0.08), uJin);
        vec3 grass = mix(vec3(0.8, 0.66, 0.4), vec3(0.9, 0.63, 0.16), uJin) * (0.8 + 0.35 * n21(p.xz * 4.0));
        vec3 field = mix(grass, slate, smoothstep(2.2, 4.8, p.y));
        vec3 gn = normalAt(p);
        field *= 0.6 + 0.4 * max(dot(gn, sunDir()), 0.0);
        groundC = mix(groundC, field, meadow);
      }
      float line = step(abs(p.x), 0.07) * step(0.5, fract(p.z / 4.0)) * (wt(0.0) + wt(2.0));
      groundC += vec3(0.6, 0.55, 0.05) * line * 0.35;
      float reflW = k4(0.75, 0.0, 1.0, 0.05);
      col = groundC * mix(0.6 + 0.4 * max(sunDir().y, 0.0), 1.0, wt(1.0) + wt(3.0));
      if (reflW > 0.02) {
        float puddle = smoothstep(0.42, 0.62, n21(p.xz * 0.35) * 0.7 + n21(p.xz * 1.3) * 0.3);
        vec3 rr = reflect(rd, vec3(0.0, 1.0, 0.0));
        rr.xz += (n21(p.xz * 9.0) - 0.5) * 0.05 * (1.0 - puddle);
        rr = normalize(rr);
        vec2 m2;
        vec3 g2;
        float t2 = march(p + vec3(0.0, 0.01, 0.0), rr, uSteps * 0.5, m2, g2);
        vec3 refl = t2 < 0.0 ? sky(rr) : shade(p + rr * t2, rr, m2);
        refl = mix(refl, fogColor(rr), 1.0 - exp(-max(t2, 60.0) * 0.02)) + g2;
        float fres = 0.25 + 0.75 * pow(1.0 - max(-rd.y, 0.0), 5.0);
        col += refl * mix(0.4, 1.05, puddle) * fres * reflW;
      }
      col += fogColor(rd) * 0.25 * exp(-p.y * 2.0);
    }
    col = mix(col, fogColor(rd), 1.0 - exp(-t * fogDensity()));
  }
  col += glow;
  col = weather(frag, col);

  // the glass itself: a cool sheen on every drop
  col += drops * glassW * vec3(0.08, 0.09, 0.1);
  col = mix(col, col * 0.8 + vec3(0.03, 0.035, 0.045), glassW * 0.35 * (1.0 - drops));

  col = col / (1.0 + col * 0.55);
  col = pow(col, vec3(0.9));
  col *= 1.0 - k4(0.55, 0.35, 0.45, 0.25) * dot(uv * 0.9, uv * 0.9);
  gl_FragColor = vec4(col, 1.0);
}
`;

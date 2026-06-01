import * as THREE from "three";

export const flowParticleVertexShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 aSeed;

  uniform float uTime;
  uniform float uFlow;
  uniform float uSize;

  varying float vAlpha;
  varying float vDepth;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 flowField(vec3 p, float t) {
    float n1 = snoise(p * 0.35 + vec3(t * 0.07, t * 0.04, t * 0.03));
    float n2 = snoise(p * 0.65 + aSeed + vec3(t * 0.05, -t * 0.06, t * 0.04));
    float n3 = snoise(p * 1.1 + vec3(-t * 0.03, t * 0.08, t * 0.02));
    return vec3(n1, n2, n3);
  }

  void main() {
    vec3 base = position;
    float t = uTime * uFlow;
    vec3 flow = flowField(base * 0.22 + aSeed * 0.5, t);
    vec3 swirl = vec3(
      sin(base.y * 0.15 + t * 0.6 + aSeed.x * 6.28),
      cos(base.x * 0.12 - t * 0.45 + aSeed.y * 6.28),
      sin(base.z * 0.1 + t * 0.35)
    ) * 0.35;

    vec3 pos = base + flow * 2.8 + swirl;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthFade = smoothstep(18.0, 2.0, -mvPosition.z);
    vAlpha = depthFade * (0.35 + aSize * 0.45);
    vDepth = -mvPosition.z;

    gl_PointSize = uSize * aSize * (220.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.5, 6.0);
  }
`;

export const flowParticleFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uBrightness;

  varying float vAlpha;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    float core = exp(-dist * dist * 14.0);
    float halo = exp(-dist * 6.0) * 0.35;
    float alpha = (core + halo) * vAlpha * uBrightness;
    vec3 col = mix(uColor * 0.6, uColor, core);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function createFlowParticleGeometry(count: number, spread: number) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.pow(Math.random(), 0.55) * spread;

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
    positions[i3 + 2] = r * Math.cos(phi) - spread * 0.15;

    seeds[i3] = Math.random() * 10;
    seeds[i3 + 1] = Math.random() * 10;
    seeds[i3 + 2] = Math.random() * 10;
    sizes[i] = 0.3 + Math.random() * 0.7;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  return geo;
}

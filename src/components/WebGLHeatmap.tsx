import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform float time;
  uniform vec2 resolution;
  uniform float speed;
  uniform float innerGlow;
  uniform float outerGlow;
  uniform float contour;
  uniform float noiseAmount;
  uniform vec4 c0;
  uniform vec4 c1;
  uniform vec4 c2;
  uniform vec4 c3;
  uniform vec4 c4;
  uniform vec4 c5;
  uniform vec4 c6;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  vec3 palette(float t) {
    t = clamp(t, 0.0, 1.0);
    float s = t * 6.0;
    int i = int(floor(s));
    float f = fract(s);
    if (i == 0) return mix(c0.rgb, c1.rgb, f);
    if (i == 1) return mix(c1.rgb, c2.rgb, f);
    if (i == 2) return mix(c2.rgb, c3.rgb, f);
    if (i == 3) return mix(c3.rgb, c4.rgb, f);
    if (i == 4) return mix(c4.rgb, c5.rgb, f);
    return mix(c5.rgb, c6.rgb, f);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(resolution.x / resolution.y, 1.0);
    // vUv already has y up (0 = bottom); keep it consistent so apex is at top.

    float r = 0.28;
    float d = (abs(p.x) + abs(p.y)) - r;

    float n = snoise(p * 2.5 + vec2(time * speed * 0.2, -time * speed * 0.15));
    d += n * noiseAmount;

    float phase = time * speed * 0.15;

    vec2 apex = vec2(0.0, r);
    float distApex = length(p - apex);
    float innerSpread = r * (1.4 + (1.0 - innerGlow) * 1.6);
    float tIn = clamp(distApex / innerSpread - phase, 0.0, 0.72);

    float tOut = clamp(0.42 + (d / max(outerGlow, 0.001)) * 0.58 - phase, 0.42, 1.0);

    vec3 colIn = palette(tIn);
    vec3 colOut = palette(tOut);

    float inside = step(d, 0.0);
    vec3 col = mix(colOut, colIn, inside);

    float rim = 1.0 - smoothstep(0.0, 0.008, abs(d));
    col = mix(col, vec3(1.0, 0.98, 0.88), rim * contour * 0.65);

    float alphaOut = 1.0 - smoothstep(0.0, outerGlow, d);
    float alpha = mix(alphaOut, 1.0, inside);
    alpha = clamp(alpha + rim * contour * 0.4, 0.0, 1.0);

    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

const DEFAULT_COLORS: [string, string, string, string, string, string, string] = [
  "#ff2400",
  "#ff7a1a",
  "#ffd54a",
  "#a8e6ff",
  "#3f9cff",
  "#0b3b8f",
  "#000814",
];

type Props = {
  colors?: [string, string, string, string, string, string, string];
  speed?: number;
  innerGlow?: number;
  outerGlow?: number;
  contour?: number;
  noiseAmount?: number;
  width?: number;
  height?: number;
};

const parseColor = (hex: string): [number, number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [
        parseInt(m[1], 16) / 255,
        parseInt(m[2], 16) / 255,
        parseInt(m[3], 16) / 255,
        1,
      ]
    : [0, 0, 0, 1];
};

export default function WebGLHeatmap({
  colors = DEFAULT_COLORS,
  speed = 0.5,
  innerGlow = 0.6,
  outerGlow = 0.55,
  contour = 0.8,
  noiseAmount = 0.0,
  width = 320,
  height = 320,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true }) ||
               canvas.getContext("experimental-webgl");
    if (!gl) return;
    const glCtx = gl as WebGLRenderingContext;

    glCtx.enable(glCtx.BLEND);
    glCtx.blendFunc(glCtx.ONE, glCtx.ONE_MINUS_SRC_ALPHA);

    const compile = (type: number, src: string) => {
      const s = glCtx.createShader(type)!;
      glCtx.shaderSource(s, src);
      glCtx.compileShader(s);
      if (!glCtx.getShaderParameter(s, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(glCtx.VERTEX_SHADER, vertexShaderSource);
    const fs = compile(glCtx.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const prog = glCtx.createProgram()!;
    glCtx.attachShader(prog, vs);
    glCtx.attachShader(prog, fs);
    glCtx.linkProgram(prog);
    glCtx.useProgram(prog);

    const buffer = glCtx.createBuffer();
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, buffer);
    glCtx.bufferData(
      glCtx.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      glCtx.STATIC_DRAW
    );
    const posLoc = glCtx.getAttribLocation(prog, "position");
    glCtx.enableVertexAttribArray(posLoc);
    glCtx.vertexAttribPointer(posLoc, 2, glCtx.FLOAT, false, 0, 0);

    const uTime = glCtx.getUniformLocation(prog, "time");
    const uRes = glCtx.getUniformLocation(prog, "resolution");
    const uSpeed = glCtx.getUniformLocation(prog, "speed");
    const uInner = glCtx.getUniformLocation(prog, "innerGlow");
    const uOuter = glCtx.getUniformLocation(prog, "outerGlow");
    const uContour = glCtx.getUniformLocation(prog, "contour");
    const uNoise = glCtx.getUniformLocation(prog, "noiseAmount");
    const stops = ["c0","c1","c2","c3","c4","c5","c6"].map(n =>
      glCtx.getUniformLocation(prog, n)
    );

    glCtx.viewport(0, 0, canvas.width, canvas.height);
    glCtx.uniform2f(uRes, canvas.width, canvas.height);
    glCtx.uniform1f(uSpeed, speed);
    glCtx.uniform1f(uInner, innerGlow);
    glCtx.uniform1f(uOuter, outerGlow);
    glCtx.uniform1f(uContour, contour);
    glCtx.uniform1f(uNoise, noiseAmount);
    for (let i = 0; i < 7; i++) {
      glCtx.uniform4fv(stops[i], parseColor(colors[i]));
    }

    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      glCtx.uniform1f(uTime, t);
      glCtx.clearColor(0, 0, 0, 0);
      glCtx.clear(glCtx.COLOR_BUFFER_BIT);
      glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [colors, speed, innerGlow, outerGlow, contour, noiseAmount, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, display: "block" }}
    />
  );
}

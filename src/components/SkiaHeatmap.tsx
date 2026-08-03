import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClock,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useDerivedValue } from "react-native-reanimated";

// Diamond thermal shader.
// Interior: palette sampled by distance-from-apex (top vertex), giving a
// directional hot->cold gradient with concave arcs meeting at the bottom.
// Exterior: cool half of the palette radiates from the shape's SDF and fades
// through blue to black.
const SHADER_CODE = `
uniform float time;
uniform float2 resolution;
uniform float speed;
uniform float innerGlow;
uniform float outerGlow;
uniform float contour;
uniform float noiseAmount;
uniform float4 c0;
uniform float4 c1;
uniform float4 c2;
uniform float4 c3;
uniform float4 c4;
uniform float4 c5;
uniform float4 c6;

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

vec4 main(vec2 pos) {
  vec2 uv = pos.xy / resolution.xy;
  vec2 p = (uv - 0.5) * vec2(resolution.x / resolution.y, 1.0);
  p.y = -p.y; // +y up so the "apex" sits at the top

  float r = 0.28;
  // Diamond (rotated square) SDF
  float d = (abs(p.x) + abs(p.y)) - r;

  // Wavy edge
  float n = snoise(p * 2.5 + vec2(time * speed * 0.2, -time * speed * 0.15));
  d += n * noiseAmount;

  float phase = time * speed * 0.15;

  // Interior: distance from top vertex (apex) → palette 0..0.72
  vec2 apex = vec2(0.0, r);
  float distApex = length(p - apex);
  float innerSpread = r * (1.4 + (1.0 - innerGlow) * 1.6);
  float tIn = clamp(distApex / innerSpread - phase, 0.0, 0.72);

  // Exterior: SDF distance → palette 0.42..1.0 (cool → black)
  float tOut = clamp(0.42 + (d / max(outerGlow, 0.001)) * 0.58 - phase, 0.42, 1.0);

  vec3 colIn = palette(tIn);
  vec3 colOut = palette(tOut);

  float inside = step(d, 0.0);
  vec3 col = mix(colOut, colIn, inside);

  // Bright neon rim right at the silhouette
  float rim = 1.0 - smoothstep(0.0, 0.008, abs(d));
  col = mix(col, vec3(1.0, 0.98, 0.88), rim * contour * 0.65);

  // Alpha: full inside, radial fade outside, rim adds a small kick
  float alphaOut = 1.0 - smoothstep(0.0, outerGlow, d);
  float alpha = mix(alphaOut, 1.0, inside);
  alpha = clamp(alpha + rim * contour * 0.4, 0.0, 1.0);

  return vec4(col * alpha, alpha);
}
`;

const DEFAULT_COLORS: [string, string, string, string, string, string, string] = [
  "#ff2400", // hot red
  "#ff7a1a", // orange
  "#ffd54a", // yellow
  "#a8e6ff", // light cyan
  "#3f9cff", // cyan-blue
  "#0b3b8f", // deep blue
  "#000814", // near-black
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

const parseColor = (hex: string): number[] => {
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

export default function SkiaHeatmap({
  colors = DEFAULT_COLORS,
  speed = 0.5,
  innerGlow = 0.6,
  outerGlow = 0.55,
  contour = 0.8,
  noiseAmount = 0.0,
  width = 320,
  height = 320,
}: Props) {
  const clock = useClock();

  const shader = useMemo(() => {
    try {
      return Skia.RuntimeEffect?.Make(SHADER_CODE);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  const uniforms = useDerivedValue(() => ({
    time: clock.value * 0.001,
    resolution: [width, height],
    speed,
    innerGlow,
    outerGlow,
    contour,
    noiseAmount,
    c0: parseColor(colors[0]),
    c1: parseColor(colors[1]),
    c2: parseColor(colors[2]),
    c3: parseColor(colors[3]),
    c4: parseColor(colors[4]),
    c5: parseColor(colors[5]),
    c6: parseColor(colors[6]),
  }), [clock, colors, speed, innerGlow, outerGlow, contour, noiseAmount, width, height]);

  if (!shader) return null;

  return (
    <View style={[styles.container, { width, height }]}>
      <Canvas style={{ width, height }}>
        <Fill>
          <Shader source={shader} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

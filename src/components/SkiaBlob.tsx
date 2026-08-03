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

const SHADER_CODE = `
uniform float time;
uniform vec4 color1;
uniform vec4 color2;
uniform vec4 color3;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec4 main(vec2 pos) {
    vec2 uv = pos.xy / 280.0;
    vec2 p = uv * 2.0 - 1.0; 
    
    // 1. Sleek minimalist geometry (Sharp Diamond SDF)
    float d = abs(p.x) + abs(p.y);
    float shapeMask = smoothstep(0.62, 0.60, d); // Sharp cut-off for the glass
    float borderMask = smoothstep(0.57, 0.60, d) * shapeMask; // Sharp glowing border
    float innerGlow = smoothstep(0.4, 0.60, d) * shapeMask; // Soft light bleed from border
    
    // 2. Elegant, slow-moving fluid (Lower frequency, smoother)
    float n1 = snoise(p * 1.0 + time * 0.2);
    float n2 = snoise(p * 1.5 - time * 0.15 + vec2(n1, n1));
    float fluid = snoise(p * 0.8 + vec2(n1, n2) * 0.5);
    
    // 3. Thermal Gradient Colors (Smooth interpolation)
    vec3 thermal = mix(color1.rgb, color2.rgb, smoothstep(-0.5, 0.5, n1));
    thermal = mix(thermal, color3.rgb, smoothstep(-0.5, 0.5, fluid));
    
    // 4. Center Void & Glowing Edge Pooling
    // Fluid pools beautifully near the edges and fades into a deep black void in the center.
    float voidMask = smoothstep(0.25, 0.58, d + fluid * 0.15); 
    vec3 interiorCol = thermal * voidMask * 0.8; 
    
    // 5. Specular Edge Lighting (Sleek, sharp glint)
    float angle = atan(p.y, p.x);
    float edgeSweep = pow(clamp(sin(angle * 2.0 + time * 2.0), 0.0, 1.0), 12.0);
    vec3 brightEdge = mix(thermal, vec3(1.0), 0.9) * edgeSweep;
    
    // 6. Refined Luminous Aura (Soft light bleed, very subtle smoke)
    float smokeBase = snoise(p * 1.2 - time * 0.1);
    float auraMask = smoothstep(0.95, 0.6, d - smokeBase * 0.05);
    vec3 auraCol = mix(color1.rgb, color2.rgb, 0.5) * 0.3 * auraMask;
    
    // 7. Compositing
    vec3 finalRGB = interiorCol + (thermal * innerGlow * 0.6); 
    
    // Intense, sharp glowing border
    finalRGB += (thermal * 1.2 + brightEdge * 2.0) * borderMask;
    
    // Blend with aura
    finalRGB = (finalRGB * shapeMask) + (auraCol * (1.0 - shapeMask));
    
    // 8. Alpha computation
    float finalAlpha = clamp(shapeMask + auraMask * 0.8, 0.0, 1.0);
    
    return vec4(finalRGB * finalAlpha, finalAlpha);
}
`;

export default function SkiaBlob({
  colors = ["#112069", "#3265e7", "#ff4d00"],
}: {
  colors?: [string, string, string];
}) {
  const clock = useClock();

  // Create shader safely
  const shader = useMemo(() => {
    try {
      return Skia.RuntimeEffect?.Make(SHADER_CODE);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  const uniforms = useDerivedValue(() => {
    // Parse hex colors to normalized RGBA (0-1)
    const parseColor = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? [
            parseInt(result[1], 16) / 255.0,
            parseInt(result[2], 16) / 255.0,
            parseInt(result[3], 16) / 255.0,
            1.0,
          ]
        : [0, 0, 0, 1.0];
    };

    return {
      time: clock.value * 0.001,
      color1: parseColor(colors[0]),
      color2: parseColor(colors[1]),
      color3: parseColor(colors[2]),
    };
  }, [colors, clock]);

  if (!shader) return null;

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Fill>
          <Shader source={shader} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    width: 280,
    height: 280,
  },
});

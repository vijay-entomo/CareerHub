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
  uniform vec4 color1;
  uniform vec4 color2;
  uniform vec4 color3;
  varying vec2 vUv;

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

  void main() {
    vec2 uv = vUv * 2.0 - 1.0; 
    
    // 1. Sleek minimalist geometry (Sharp Diamond SDF)
    float d = abs(uv.x) + abs(uv.y);
    float shapeMask = smoothstep(0.62, 0.60, d); // Sharp cut-off for the glass
    float borderMask = smoothstep(0.57, 0.60, d) * shapeMask; // Sharp glowing border
    float innerGlow = smoothstep(0.4, 0.60, d) * shapeMask; // Soft light bleed from border
    
    // 2. Elegant, slow-moving fluid (Lower frequency, smoother)
    float n1 = snoise(uv * 1.0 + time * 0.2);
    float n2 = snoise(uv * 1.5 - time * 0.15 + vec2(n1));
    float fluid = snoise(uv * 0.8 + vec2(n1, n2) * 0.5);
    
    // 3. Thermal Gradient Colors (Smooth interpolation)
    vec3 thermal = mix(color1.rgb, color2.rgb, smoothstep(-0.5, 0.5, n1));
    thermal = mix(thermal, color3.rgb, smoothstep(-0.5, 0.5, fluid));
    
    // 4. Center Void & Glowing Edge Pooling
    // Fluid pools beautifully near the edges and fades into a deep black void in the center.
    float voidMask = smoothstep(0.25, 0.58, d + fluid * 0.15); 
    vec3 interiorCol = thermal * voidMask * 0.8; 
    
    // 5. Specular Edge Lighting (Sleek, sharp glint)
    float angle = atan(uv.y, uv.x);
    float edgeSweep = pow(clamp(sin(angle * 2.0 + time * 2.0), 0.0, 1.0), 12.0);
    vec3 brightEdge = mix(thermal, vec3(1.0), 0.9) * edgeSweep;
    
    // 6. Refined Luminous Aura (Soft light bleed, very subtle smoke)
    float smokeBase = snoise(uv * 1.2 - time * 0.1);
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
    
    gl_FragColor = vec4(finalRGB * finalAlpha, finalAlpha);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

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

export default function WebGLDiamond({
  colors,
}: {
  colors: [string, string, string];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    const timeLoc = gl.getUniformLocation(program, "time");
    const color1Loc = gl.getUniformLocation(program, "color1");
    const color2Loc = gl.getUniformLocation(program, "color2");
    const color3Loc = gl.getUniformLocation(program, "color3");

    const c1 = parseColor(colors[0]);
    const c2 = parseColor(colors[1]);
    const c3 = parseColor(colors[2]);

    gl.uniform4f(color1Loc, c1[0], c1[1], c1[2], c1[3]);
    gl.uniform4f(color2Loc, c2[0], c2[1], c2[2], c2[3]);
    gl.uniform4f(color3Loc, c3[0], c3[1], c3[2], c3[3]);

    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      const time = (Date.now() - startTime) * 0.001;
      gl.uniform1f(timeLoc, time);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors]);

  return (
    // @ts-ignore - React Native web uses standard DOM attributes on lower case tags
    <canvas
      ref={canvasRef}
      width={280}
      height={280}
      style={{ width: 280, height: 280 }}
    />
  );
}

import { Platform } from "react-native";
import SkiaHeatmap from "./SkiaHeatmap";
import WebGLHeatmap from "./WebGLHeatmap";

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

export default function HeatmapShader(props: Props) {
  if (Platform.OS === "web") return <WebGLHeatmap {...props} />;
  return <SkiaHeatmap {...props} />;
}

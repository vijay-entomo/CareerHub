import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { useTheme } from "@/hooks/use-theme";

type Size = "sm" | "md" | "lg" | "xl";
type Tone = "neutral" | "primary" | "danger" | "success" | "warning";

interface IconTileProps {
  Icon: LucideIcon;
  size?: Size;
  tone?: Tone;
  /** Optional per-instance accent color; overrides `tone`. */
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const SIZE_MAP: Record<Size, { box: number; radius: number; icon: number }> = {
  sm: { box: 40, radius: 12, icon: 18 },
  md: { box: 56, radius: 16, icon: 24 },
  lg: { box: 72, radius: 20, icon: 30 },
  xl: { box: 80, radius: 24, icon: 32 },
};

export const IconTile = ({
  Icon,
  size = "md",
  tone = "neutral",
  color,
  strokeWidth = 2,
  style,
  accessibilityLabel,
}: IconTileProps) => {
  const theme = useTheme();
  const { box, radius, icon } = SIZE_MAP[size];
  const isDark = theme.mode === "dark";

  const customPalette = color
    ? { bg: color + "1F", fg: color } // ~12% opacity tint
    : null;

  // Neutral resolves to a tint of the theme's foreground —
  // black-tint on light mode, white-tint on dark mode.
  const palette: Record<Tone, { bg: string; fg: string }> = {
    neutral: {
      bg: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      fg: theme.text,
    },
    primary: {
      bg: isDark ? "rgba(215,254,3,0.14)" : "rgba(215,254,3,0.18)",
      fg: theme.primary,
    },
    danger: {
      bg: isDark ? "rgba(255,69,58,0.16)" : "rgba(255,59,48,0.12)",
      fg: theme.danger ?? "#FF3B30",
    },
    success: {
      bg: isDark ? "rgba(50,215,75,0.16)" : "rgba(52,199,89,0.12)",
      fg: theme.success ?? "#34C759",
    },
    warning: {
      bg: isDark ? "rgba(255,159,10,0.16)" : "rgba(245,158,11,0.14)",
      fg: theme.warning ?? "#F59E0B",
    },
  };

  const { bg, fg } = customPalette ?? palette[tone];

  return (
    <View
      style={[
        {
          width: box,
          height: box,
          borderRadius: radius,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? "image" : undefined}
    >
      <Icon size={icon} color={fg} strokeWidth={strokeWidth} />
    </View>
  );
};

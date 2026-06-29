/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export function getContrastColor(hex: string) {
  // Strip hash and handle short/long hex + alpha
  hex = hex.replace("#", "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");

  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;

  // Calculate perceptive luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export function getGlowColor(hex: string) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  // take only rgb, strip existing alpha
  const baseHex = hex.substring(0, 6);
  // append 30% opacity hex (4D)
  return `#${baseHex}4D`;
}

export function getBorderColor(hex: string) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  // take only rgb, strip existing alpha
  const baseHex = hex.substring(0, 6);
  // append 40% opacity hex (66)
  return `#${baseHex}66`;
}

const lightPrimary = "#000000ff";
const darkPrimary = "#D7FE03";

export const Colors = {
  light: {
    text: "#000000",
    background: "#dfe9f1",
    backgroundElement: "#FFFFFF", // Crisp white cards for light mode
    backgroundSelected: "#E0E1E6",
    textSecondary: "#60646C",
    border: "#E5E5E5",
    primary: lightPrimary, // The main primary color
    primaryForeground: getContrastColor(lightPrimary), // Auto-adjusts!
    primaryGlow: getGlowColor(lightPrimary),
    primaryBorder: getBorderColor(lightPrimary),
    danger: "#FF3B30",
    warning: "#F59E0B",
    success: "#34C759",
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",
    textSecondary: "#B0B4BA",
    border: "rgba(255, 255, 255, 0.15)",
    primary: darkPrimary,
    primaryForeground: getContrastColor(darkPrimary),
    primaryGlow: getGlowColor(darkPrimary),
    primaryBorder: getBorderColor(darkPrimary),
    danger: "#FF453A",
    warning: "#FF9F0A",
    success: "#32D74B",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

const isWeb = Platform.OS === "web";

export const AppFonts = {
  urbanist: {
    regular: isWeb ? "'Urbanist', sans-serif" : "Urbanist_400Regular",
    medium: isWeb ? "'Urbanist', sans-serif" : "Urbanist_500Medium",
    semiBold: isWeb ? "'Urbanist', sans-serif" : "Urbanist_600SemiBold",
    bold: isWeb ? "'Urbanist', sans-serif" : "Urbanist_700Bold",
    black: isWeb ? "'Urbanist', sans-serif" : "Urbanist_900Black",
  },
  inter: {
    regular: isWeb ? "'Inter', sans-serif" : "Inter_400Regular",
    medium: isWeb ? "'Inter', sans-serif" : "Inter_500Medium",
    semiBold: isWeb ? "'Inter', sans-serif" : "Inter_600SemiBold",
    bold: isWeb ? "'Inter', sans-serif" : "Inter_700Bold",
    black: isWeb ? "'Inter', sans-serif" : "Inter_900Black",
  },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const BorderRadius = {
  button: 0, // Centralized button radius
  input: 0, // Centralized input radius
  card: 16,
  pill: 999,
} as const;

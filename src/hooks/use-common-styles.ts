import { useTheme } from "@/hooks/use-theme";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useCommonStyles() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background, // Explicitly enforce it at the component level
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 100, // Space for the fixed Header
      paddingBottom: Math.max(insets.bottom + 24, 40), // Standardized padding for sub-pages
    },
    scrollContentFullBleed: {
      // paddingHorizontal: 20,
      paddingTop: 100,
      paddingBottom: 100,
    },
    grid: {
      gap: 16,
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    card: {
      backgroundColor: theme.backgroundElement,
      borderRadius: 24,
      ...Platform.select({
        ios: {
          shadowColor: theme.mode === "dark" ? "#000" : "#888",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: theme.mode === "dark" ? 0.3 : 0.08,
          shadowRadius: 24,
        },
        android: {
          elevation: 4,
        },
      }),
      // @ts-ignore
      borderCurve: "continuous",
    },
  });
}

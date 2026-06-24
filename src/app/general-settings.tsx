import { Check } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { AppFonts } from "@/constants/theme";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { Header } from "../components/Header";

const COLOR_PRESETS = [
  { id: "lime", color: "#D7FE03", name: "Lime Green" },
  { id: "azure", color: "#007AFF", name: "Azure Blue" },
  { id: "pink", color: "#FF2A55", name: "Neon Pink" },
  { id: "purple", color: "#B983FF", name: "Electric Purple" },
];

const FONT_PRESETS = [
  { id: "urbanist", name: "Urbanist", desc: "Modern, geometric" },
  { id: "inter", name: "Inter", desc: "Clean, highly legible" },
];

export default function GeneralSettings() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);

  const scrollY = useSharedValue(0);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleColorChange = (hex: string) => {
    theme.setPrimaryColor(hex);
  };

  const handleFontChange = (fontId: keyof typeof AppFonts) => {
    theme.setFontFamily(fontId);
  };

  return (
    <View style={commonStyles.container}>
      <Header title="General Settings" scrollY={scrollY} />

      <Animated.ScrollView
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.sectionTitle}>THEME COLOR</Text>
        <View style={styles.section}>
          {COLOR_PRESETS.map((preset, index) => {
            // Because theme.primary dynamically updates based on state OR defaults to darkPrimary,
            // we check if activePrimaryColor matches or if it's the default darkPrimary
            const isActive =
              theme.activePrimaryColor === preset.color ||
              (!theme.activePrimaryColor && preset.id === "lime");

            return (
              <View key={preset.id}>
                <Pressable
                  style={({ pressed }) => [
                    styles.settingRow,
                    pressed && { backgroundColor: theme.backgroundElement },
                  ]}
                  onPress={() => handleColorChange(preset.color)}
                >
                  <View style={styles.settingLeft}>
                    <View
                      style={[
                        styles.colorPreview,
                        { backgroundColor: preset.color },
                      ]}
                    />
                    <Text style={styles.settingText}>{preset.name}</Text>
                  </View>
                  {isActive && <Check size={20} color={theme.text} />}
                </Pressable>
                {index < COLOR_PRESETS.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>TYPOGRAPHY</Text>
        <View style={styles.section}>
          {FONT_PRESETS.map((preset, index) => {
            const isActive = theme.activeFontFamily === preset.id;

            return (
              <View key={preset.id}>
                <Pressable
                  style={({ pressed }) => [
                    styles.settingRow,
                    pressed && { backgroundColor: theme.backgroundElement },
                  ]}
                  onPress={() =>
                    handleFontChange(preset.id as keyof typeof AppFonts)
                  }
                >
                  <View style={styles.settingLeft}>
                    <View>
                      <Text style={styles.settingText}>{preset.name}</Text>
                      <Text style={styles.settingDesc}>{preset.desc}</Text>
                    </View>
                  </View>
                  {isActive && <Check size={20} color={theme.text} />}
                </Pressable>
                {index < FONT_PRESETS.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: 13,
      fontFamily: theme.fonts.bold,
      color: theme.textSecondary,
      paddingHorizontal: 16,
      marginBottom: 8,
      marginTop: 24,
      letterSpacing: 0.5,
    },
    section: {
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: theme.backgroundElement,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 18,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    colorPreview: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 14,
    },
    settingText: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.text,
    },
    settingDesc: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      marginTop: 4,
    },
    divider: {
      height: 1,
      marginLeft: 56, // Align with text inside standard sections
      backgroundColor: theme.background, // Match screen background so it looks transparent
    },
  });

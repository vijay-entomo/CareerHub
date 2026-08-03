import { Check, Palette } from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import ColorPicker, {
  HueSlider,
  Panel1,
  Preview,
  Swatches,
} from "reanimated-color-picker";
import { Button } from "@/components/Button";

import { AppFonts } from "@/constants/theme";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { Header } from "../components/Header";

const COLOR_PRESETS = [
  { id: "lime", color: "#D7FE03", name: "Lime Green" },
  { id: "azure", color: "#007AFF", name: "Azure Blue" },
  { id: "pink", color: "#FF2A55", name: "Neon Pink" },
  { id: "purple", color: "#B983FF", name: "Electric Purple" },
  { id: "yellow", color: "#ffff1e", name: "Yellow" },
  { id: "electricGreen", color: "#c7ff2e", name: "Electric Green" },
];

const CTA_COLOR_PRESETS = [
  { id: "black",   color: "#000000", name: "Obsidian (default)" },
  { id: "ink",     color: "#0F172A", name: "Ink" },
  { id: "indigo",  color: "#4F46E5", name: "Indigo" },
  { id: "emerald", color: "#10B981", name: "Emerald" },
  { id: "sunset",  color: "#F97316", name: "Sunset" },
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
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [pickerValue, setPickerValue] = useState<string>(theme.ctaColor);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleColorChange = (hex: string) => {
    theme.setPrimaryColor(hex);
  };

  const handleCtaColorChange = (hex: string) => {
    theme.setCtaColor(hex);
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
                  <AnimatePresence>
                    {isActive && (
                      <MotiView
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <Check size={20} color={theme.text} />
                      </MotiView>
                    )}
                  </AnimatePresence>
                </Pressable>
                {index < COLOR_PRESETS.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>CTA / BUTTON COLOR</Text>
        <View style={styles.section}>
          {CTA_COLOR_PRESETS.map((preset) => {
            const isActive =
              theme.activeCtaColor === preset.color ||
              (!theme.activeCtaColor && preset.id === "black");

            return (
              <View key={preset.id}>
                <Pressable
                  style={({ pressed }) => [
                    styles.settingRow,
                    pressed && { backgroundColor: theme.backgroundElement },
                  ]}
                  onPress={() => handleCtaColorChange(preset.color)}
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
                  <AnimatePresence>
                    {isActive && (
                      <MotiView
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Check size={20} color={theme.text} />
                      </MotiView>
                    )}
                  </AnimatePresence>
                </Pressable>
                <View style={styles.divider} />
              </View>
            );
          })}

          {/* Custom color picker row */}
          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              pressed && { backgroundColor: theme.backgroundElement },
            ]}
            onPress={() => {
              setPickerValue(theme.ctaColor);
              setPickerOpen(true);
            }}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.colorPreview, styles.rainbowSwatch]}>
                <Palette size={14} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <View>
                <Text style={styles.settingText}>Custom color</Text>
                {theme.activeCtaColor &&
                  !CTA_COLOR_PRESETS.some((p) => p.color === theme.activeCtaColor) && (
                    <Text style={styles.settingDesc}>{theme.activeCtaColor.toUpperCase()}</Text>
                  )}
              </View>
            </View>
            <AnimatePresence>
              {theme.activeCtaColor &&
                !CTA_COLOR_PRESETS.some((p) => p.color === theme.activeCtaColor) && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Check size={20} color={theme.text} />
                  </MotiView>
                )}
            </AnimatePresence>
          </Pressable>
        </View>

        {/* Color-picker modal */}
        <Modal
          visible={isPickerOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setPickerOpen(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setPickerOpen(false)}
          >
            <Pressable
              style={[styles.pickerCard, { backgroundColor: theme.backgroundElement }]}
              onPress={() => { /* swallow taps inside card */ }}
            >
              <Text style={[styles.pickerTitle, { color: theme.text, fontFamily: theme.fonts.bold }]}>
                Pick a CTA color
              </Text>

              <ColorPicker
                value={pickerValue}
                onChange={({ hex }) => setPickerValue(hex)}
                style={{ gap: 16 }}
              >
                <Preview hideInitialColor style={{ height: 36, borderRadius: 12 }} />
                <Panel1 style={{ borderRadius: 16 }} />
                <HueSlider style={{ borderRadius: 999 }} />
                <Swatches
                  colors={CTA_COLOR_PRESETS.map((p) => p.color)}
                  style={{ flexWrap: "wrap", gap: 8 }}
                  swatchStyle={{ width: 32, height: 32, borderRadius: 16, borderWidth: 0 }}
                />
              </ColorPicker>

              <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Cancel"
                    variant="secondary"
                    shape="rounded"
                    onPress={() => setPickerOpen(false)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    title="Save"
                    variant="primary"
                    shape="rounded"
                    onPress={() => {
                      handleCtaColorChange(pickerValue);
                      setPickerOpen(false);
                    }}
                  />
                </View>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

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
                  <AnimatePresence>
                    {isActive && (
                      <MotiView
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <Check size={20} color={theme.text} />
                      </MotiView>
                    )}
                  </AnimatePresence>
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
    rainbowSwatch: {
      backgroundColor: "#8B5CF6",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      // A cheap "rainbow" via a conic-ish stack — a solid bg with icon reads as "any color".
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    pickerCard: {
      width: "100%",
      maxWidth: 380,
      borderRadius: 24,
      padding: 20,
    },
    pickerTitle: {
      fontSize: 18,
      marginBottom: 16,
      textAlign: "center",
    },
  });

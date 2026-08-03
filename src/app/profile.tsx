import { useRouter } from "expo-router";
import {
  CheckCircle2,
  ChevronRight,
  Edit2,
  HelpCircle,
  Info,
  Languages,
  LogOut,
  Moon,
  ShieldCheck,
  SlidersHorizontal,
  User,
} from "lucide-react-native";
import { MotiView } from "moti";
import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "react-i18next";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Toggle } from "../components/Toggle";

export default function ProfileSettings() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const router = useRouter();

  const scrollY = useSharedValue(0);
  const { i18n } = useTranslation();

  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState(
    i18n.language?.startsWith("tl") ? "tl" : "en",
  );

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={commonStyles.container}>
      <Header title="Profile" scrollY={scrollY} />

      <Animated.ScrollView
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=11" }}
              style={styles.profileImageLarge}
            />
          </View>

          <Text style={styles.profileNameLarge}>Brittni Lando</Text>
          <Text style={styles.profileEmail}>brittnilonda5487@gmail.com</Text>

          <Button
            title="Edit Profile"
            variant="primary"
            size="small"
            onPress={() => router.push("/edit-profile")}
            icon={<Edit2 size={16} />}
          />
        </View>

        {/* Settings Section 1 */}
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              pressed && { backgroundColor: "rgba(150,150,150,0.1)" },
            ]}
            onPress={() => router.push("/master-profile/master-profile")}
          >
            <View style={styles.settingLeft}>
              <User size={20} color={theme.textSecondary} />
              <Text style={styles.settingText}>Master profile</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              pressed && { backgroundColor: "rgba(150,150,150,0.1)" },
            ]}
            onPress={() => router.push("/general-settings")}
          >
            <View style={styles.settingLeft}>
              <SlidersHorizontal size={20} color={theme.textSecondary} />
              <Text style={styles.settingText}>General settings</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </Pressable>
        </View>

        {/* Settings Section 2 */}
        <Text style={styles.sectionTitle}>PREFERENCE</Text>
        <View style={styles.section}>
          <Pressable
            onPress={() => setIsLanguageModalVisible(true)}
            style={({ pressed }) => [
              styles.settingRow,
              pressed && { backgroundColor: "rgba(150,150,150,0.1)" },
            ]}
          >
            <View style={styles.settingLeft}>
              <Languages size={20} color={theme.textSecondary} />
              <Text style={styles.settingText}>Language</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: theme.fonts.medium,
                  color: theme.textSecondary,
                  marginRight: 8,
                  fontSize: 14,
                }}
              >
                {currentLang === "en" ? "English" : "Filipino"}
              </Text>
              <ChevronRight size={20} color={theme.textSecondary} />
            </View>
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              { paddingVertical: 6, minHeight: 56 }, // offset Toggle's 44 minHeight
              pressed && { backgroundColor: "rgba(150,150,150,0.1)" },
            ]}
            onPress={() =>
              theme.setTheme(theme.mode === "dark" ? "light" : "dark")
            }
          >
            <View style={styles.settingLeft}>
              <Moon size={20} color={theme.textSecondary} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <View pointerEvents="none">
              <Toggle value={theme.mode === "dark"} onValueChange={() => {}} />
            </View>
          </Pressable>
        </View>

        {/* Settings Section 3 */}
        <Text style={styles.sectionTitle}>SUPPORT</Text>
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              pressed && { backgroundColor: "rgba(150,150,150,0.1)" },
            ]}
          >
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color={theme.textSecondary} />
              <Text style={styles.settingText}>FAQ</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              pressed && { backgroundColor: "rgba(150,150,150,0.1)" },
            ]}
          >
            <View style={styles.settingLeft}>
              <Info size={20} color={theme.textSecondary} />
              <Text style={styles.settingText}>Terms of service</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              pressed && { backgroundColor: "rgba(150,150,150,0.1)" },
            ]}
          >
            <View style={styles.settingLeft}>
              <ShieldCheck size={20} color={theme.textSecondary} />
              <Text style={styles.settingText}>User policy</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </Pressable>
        </View>

        {/* Logout Button */}
        <Button
          title="Log Out"
          variant="ghost"
          fullWidth
          onPress={() => {
            router.dismissAll?.();
            router.replace("/login");
          }}
          icon={<LogOut size={20} color="#FF3B30" />}
          textStyle={{ color: "#FF3B30" }}
          style={{ backgroundColor: theme.backgroundElement, marginTop: 8 }}
        />

        {/* Version Details */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0 (Build 1)</Text>
        </View>
      </Animated.ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsLanguageModalVisible(false)}
          />
          <MotiView
            from={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            style={{
              width: "85%",
              backgroundColor: theme.mode === "dark" ? "#1E1E1E" : "#F8F8F8",
              borderRadius: 24,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: theme.fonts.semiBold,
                  fontSize: 17,
                  color: theme.text,
                }}
              >
                Select Language
              </Text>
            </View>

            {[
              { id: "en", label: "English", active: true },
              { id: "tl", label: "Filipino", active: true },
              { id: "es", label: "Spanish", active: false },
              { id: "fr", label: "French", active: false },
              { id: "de", label: "German", active: false },
              { id: "ja", label: "Japanese", active: false },
            ].map((lang) => {
              const isSelected = currentLang === lang.id;
              return (
                <Pressable
                  key={lang.id}
                  disabled={!lang.active}
                  onPress={() => {
                    setCurrentLang(lang.id);
                    i18n.changeLanguage(lang.id);
                    // Add a tiny delay so the user sees the checkmark appear before modal closes
                    setTimeout(() => setIsLanguageModalVisible(false), 200);
                  }}
                  style={({ pressed }) => [
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderTopWidth: StyleSheet.hairlineWidth,
                      borderTopColor:
                        theme.mode === "dark"
                          ? "rgba(255,255,255,0.15)"
                          : "rgba(0,0,0,0.15)",
                      backgroundColor:
                        pressed && lang.active
                          ? theme.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.05)"
                          : "transparent",
                    },
                  ]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: isSelected
                          ? theme.fonts.semiBold
                          : theme.fonts.regular,
                        fontSize: 17,
                        color: !lang.active
                          ? theme.textSecondary
                          : isSelected
                            ? "#007AFF"
                            : theme.text,
                      }}
                    >
                      {lang.label}
                    </Text>
                    {!lang.active && (
                      <View
                        style={{
                          backgroundColor:
                            theme.mode === "dark"
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.05)",
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 4,
                          marginLeft: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: theme.fonts.medium,
                            fontSize: 10,
                            color: theme.textSecondary,
                            textTransform: "uppercase",
                          }}
                        >
                          Coming Soon
                        </Text>
                      </View>
                    )}
                  </View>
                  {isSelected && <CheckCircle2 size={20} color="#007AFF" />}
                </Pressable>
              );
            })}
          </MotiView>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    profileHeader: {
      alignItems: "center",
      marginBottom: 32,
      marginTop: 10,
    },
    imageContainer: {
      position: "relative",
      marginBottom: 16,
    },
    profileImageLarge: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    profileNameLarge: {
      fontSize: 24,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      marginBottom: 20,
    },
    editProfileButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.text, // Dark pill
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 999,
    },
    editProfileText: {
      color: theme.background,
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
    },
    sectionTitle: {
      fontSize: 13,
      fontFamily: theme.fonts.bold,
      color: theme.textSecondary,
      paddingHorizontal: 16,
      marginBottom: 8,
      marginTop: 8,
      letterSpacing: 0.5,
    },
    section: {
      borderRadius: 24,
      marginBottom: 24,
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
    settingText: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      marginLeft: 14,
      color: theme.text,
    },
    divider: {
      height: 1,
      marginLeft: 52, // Align with text
      backgroundColor: theme.background,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 18,
      borderRadius: 999, // Full pill shape
      marginTop: 8,
      backgroundColor: theme.backgroundElement,
    },
    logoutText: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      marginLeft: 8,
      color: "#FF3B30",
    },
    versionContainer: {
      alignItems: "center",
      marginTop: 32,
      marginBottom: 16,
    },
    versionText: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      letterSpacing: 0.5,
    },
  });

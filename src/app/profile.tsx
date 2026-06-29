import { useRouter } from "expo-router";
import {
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
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { Header } from "../components/Header";
import { Toggle } from "../components/Toggle";

export default function ProfileSettings() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const router = useRouter();

  const scrollY = useSharedValue(0);

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

          <Pressable
            style={({ pressed }) => [
              styles.editProfileButton,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => router.push("/edit-profile")}
          >
            <Edit2
              size={16}
              color={theme.background}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
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
            style={({ pressed }) => [
              styles.settingRow,
              pressed && { backgroundColor: "rgba(150,150,150,0.1)" },
            ]}
          >
            <View style={styles.settingLeft}>
              <Languages size={20} color={theme.textSecondary} />
              <Text style={styles.settingText}>Language</Text>
            </View>
            <ChevronRight size={20} color={theme.textSecondary} />
          </Pressable>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Moon size={20} color={theme.textSecondary} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Toggle
              value={theme.mode === "dark"}
              onValueChange={(val) => theme.setTheme(val ? "dark" : "light")}
            />
          </View>
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
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { backgroundColor: "rgba(150,150,150,0.1)" },
          ]}
          onPress={() => router.replace("/login")}
        >
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        {/* Version Details */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0 (Build 1)</Text>
        </View>
      </Animated.ScrollView>
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

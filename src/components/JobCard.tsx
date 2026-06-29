import { useTheme } from "@/hooks/use-theme";
import {
  Bookmark,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  FileText,
  Globe,
} from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Header } from "./Header";

export interface JobCardProps {
  companyName: string;
  companyLogoUri?: string;
  matchLevel?: "HIGH" | "MEDIUM" | "LOW";
  postedDate: string;
  title: string;
  isAssessmentRequired?: boolean;
  employmentType: string;
  salary: string;
  experience: string;
  location: string;
  applicantCount: string;
  onPress?: () => void;
  onBookmarkPress?: () => void;
}

export function JobCard({
  companyName,
  companyLogoUri,
  matchLevel = "HIGH",
  postedDate,
  title,
  isAssessmentRequired = false,
  employmentType,
  salary,
  experience,
  location,
  applicantCount,
  onPress,
  onBookmarkPress,
}: JobCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const scrollY = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <>
      <View style={styles.cardContainer}>
        {/* Top Header Row */}
        <View style={styles.topRow}>
          <View style={styles.logoContainer}>
            {companyLogoUri ? (
              <Image
                source={{ uri: companyLogoUri }}
                style={styles.logo}
                resizeMode="contain"
              />
            ) : (
              <View
                style={[
                  styles.logo,
                  { backgroundColor: theme.primary, borderRadius: 20 },
                ]}
              />
            )}
          </View>

          <View style={styles.matchContainer}>
            <Text style={styles.matchLevelText}>{matchLevel}</Text>
            <Text style={styles.matchSubText}>Match</Text>
          </View>
        </View>

        {/* Sub Header Row */}
        <View style={styles.subHeaderRow}>
          <Text style={styles.companyNameText}>{companyName}</Text>
          <Globe size={16} color={theme.text} style={styles.globeIcon} />
          <Text style={styles.postedDateText}>Posted on: {postedDate}</Text>
        </View>

        {/* Title */}
        <Text style={styles.titleText} numberOfLines={2}>
          {title}
        </Text>

        {/* Tags / Pills */}
        <View style={styles.tagsContainer}>
          {isAssessmentRequired && (
            <View style={[styles.tagPill, styles.assessmentPill]}>
              <FileText
                size={14}
                color={theme.primary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.tagText,
                  { color: theme.primary, fontFamily: theme.fonts.bold },
                ]}
              >
                Assessment Required
              </Text>
            </View>
          )}
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>{employmentType}</Text>
          </View>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>{salary}</Text>
          </View>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>{experience}</Text>
          </View>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>{location}</Text>
          </View>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>{applicantCount}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer Row */}
        <View style={styles.footerRow}>
          <Pressable onPress={onBookmarkPress} style={styles.bookmarkBtn}>
            <Bookmark size={24} color={theme.text} />
          </Pressable>
          <Pressable
            onPress={() => {
              setDetailsVisible(true);
              onPress?.();
            }}
            style={styles.viewJobBtn}
          >
            <Text style={styles.viewJobText}>View Job</Text>
          </Pressable>
        </View>
      </View>

      {/* FULL SCREEN JOB DETAILS MODAL */}
      <Modal
        visible={detailsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Header
            title="Job Details"
            showBack
            onBack={() => setDetailsVisible(false)}
            scrollY={scrollY}
            solidBackgroundColor="#E8CFFF"
          />

          <Animated.ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Massive Purple Background that scrolls up */}
            <View style={styles.modalHeaderBg}>
              <Text style={styles.watermarkText} numberOfLines={1}>
                {companyName}
              </Text>
            </View>

            {/* Overlapping Logo */}
            <View style={styles.modalLogoWrapper}>
              {companyLogoUri ? (
                <Image
                  source={{ uri: companyLogoUri }}
                  style={styles.modalLogo}
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={[styles.modalLogo, { backgroundColor: theme.primary }]}
                />
              )}
            </View>

            {/* Title */}
            <Text style={styles.modalJobTitle}>{title}</Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>salary</Text>
                <Text style={styles.statValue}>{salary}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Job Time</Text>
                <Text style={styles.statValue}>{employmentType}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Location</Text>
                <Text style={styles.statValue}>{location}</Text>
              </View>
            </View>

            {/* Qualifications */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionIconBg}>
                  <Briefcase size={20} color={theme.text} />
                </View>
                <Text style={styles.sectionTitle}>Qualifications</Text>
              </View>
              <View style={styles.qualificationsList}>
                {[
                  "Minimum 2 years UX experience",
                  "Strong UI/UX design skills",
                  "Proficient in Figma, Adobe XD",
                  "Solid UX research knowledge",
                ].map((q, i) => (
                  <View key={i} style={styles.qualRow}>
                    <CheckCircle2 size={18} color={theme.textSecondary} />
                    <Text style={styles.qualText}>{q}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Job Overview */}
            <View style={styles.overviewContainer}>
              <Text style={styles.sectionTitle}>Job Overview</Text>
              <Text style={styles.overviewText}>
                A UX Designer creates seamless and user-friendly digital
                experiences. They focus on user research, wireframing,
                prototyping, and testing to craft intuitive interfaces. Their
                goal{" "}
                <Text
                  style={{ fontFamily: theme.fonts.bold, color: theme.text }}
                >
                  See More...
                </Text>
              </Text>
            </View>
          </Animated.ScrollView>

          {/* Sticky Bottom Bar */}
          <View style={styles.stickyBottomBar}>
            <TouchableOpacity style={styles.bottomBookmarkBtn}>
              <Bookmark size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn}>
              <Text style={styles.applyBtnText}>Apply Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: theme.backgroundElement || theme.background,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    logoContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "#F5F5F5",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    logo: {
      width: 44,
      height: 44,
    },
    matchContainer: {
      alignItems: "flex-end",
    },
    matchLevelText: {
      fontSize: 18,
      fontFamily: theme.fonts.black || theme.fonts.bold,
      color: theme.text,
      lineHeight: 22,
    },
    matchSubText: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    subHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    companyNameText: {
      fontSize: 15,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    globeIcon: {
      marginHorizontal: 6,
    },
    postedDateText: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    titleText: {
      fontSize: 22,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 16,
      lineHeight: 28,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 20,
    },
    tagPill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 100,
      borderWidth: 1,
      borderColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
    },
    assessmentPill: {
      borderColor: theme.primary,
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(255,255,255,0.05)"
          : "rgba(255, 214, 0, 0.05)",
    },
    tagText: {
      fontSize: 13,
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
    },
    divider: {
      height: 1,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      marginBottom: 20,
    },
    footerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    bookmarkBtn: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    },
    viewJobBtn: {
      flex: 1,
      height: 48,
      backgroundColor: theme.primary,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 16,
    },
    viewJobText: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      color: "#000000",
    },

    // --- MODAL STYLES ---
    modalContainer: {
      flex: 1,
      backgroundColor: theme.background, // Match app background
    },
    modalScroll: {
      flex: 1,
    },
    modalHeaderBg: {
      backgroundColor: "#E8CFFF", // Light purple from reference
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      paddingBottom: 40,
      paddingTop: 100, // Make room for the floating Header
      position: "relative",
      overflow: "hidden",
    },
    watermarkText: {
      position: "absolute",
      top: 60,
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 100,
      fontFamily: theme.fonts.black || theme.fonts.bold,
      color: "rgba(255,255,255,0.4)",
    },
    modalLogoWrapper: {
      alignSelf: "center",
      marginTop: -40, // overlap the purple header 
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    modalLogo: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    modalJobTitle: {
      fontSize: 24,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      textAlign: "center",
      marginTop: 16,
      marginBottom: 24,
    },
    statsRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      paddingVertical: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      marginBottom: 6,
    },
    statValue: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      color: "#111",
    },
    sectionContainer: {
      backgroundColor: "#FFFFFF",
      marginHorizontal: 20,
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
    },
    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      gap: 16,
    },
    sectionIconBg: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "#F0F0F0",
      justifyContent: "center",
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: "#111",
    },
    qualificationsList: {
      gap: 16,
    },
    qualRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    qualText: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: "#333",
      flex: 1,
    },
    overviewContainer: {
      paddingHorizontal: 20,
      marginBottom: 40,
    },
    overviewText: {
      marginTop: 12,
      fontSize: 15,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      lineHeight: 24,
    },
    stickyBottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.backgroundElement || theme.background,
      paddingHorizontal: 20,
      paddingVertical: 20,
      // paddingBottom: 40, // safe area padding
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      borderTopWidth: 1,
      borderTopColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    },
    bottomBookmarkBtn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F0F0F0",
      justifyContent: "center",
      alignItems: "center",
    },
    applyBtn: {
      flex: 1,
      height: 56,
      backgroundColor: "#AEE499", // light green from image
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
    },
    applyBtnText: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      color: "#111",
    },
  });

import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import {
  BarChart,
  Edit3,
  FileText,
  MoreVertical,
  PenTool,
  PlusCircle,
  Trash2,
  Wand2,
} from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Header } from "../../components/Header";
import { SectionHeader } from "../../components/SectionHeader";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;

const MOCK_RESUMES = [
  {
    id: "r1",
    title: "Senior Frontend Engineer",
    date: "Updated 2h ago",
    score: 92,
    color: "#B983FF", // Purple
  },
  {
    id: "r2",
    title: "UX/UI Designer",
    date: "Updated 1w ago",
    score: 85,
    color: "#FF9F43", // Orange
  },
];

const TOOLS = [
  {
    id: "create",
    title: "Create\nResume",
    subtitle: "Start fresh or from profile",
    icon: PlusCircle,
    color: "#28C76F",
    route: "/resume/create",
  },
  {
    id: "cover-letter",
    title: "Cover\nLetter",
    subtitle: "AI generated letter",
    icon: PenTool,
    color: "#00CFE8",
    route: "/resume/cover-letter",
  },
  {
    id: "optimizer",
    title: "AI\nOptimizer",
    subtitle: "Improve your content",
    icon: Wand2,
    color: "#EA5455",
    route: "/resume/optimizer",
  },
  {
    id: "score",
    title: "Check\nScore",
    subtitle: "ATS compatibility",
    icon: BarChart,
    color: "#7367F0",
    route: "/resume/score",
  },
];

export default function ResumeMain() {
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
      <Header
        title="Resume Hub"
        showBack
        onBack={() => router.back()}
        scrollY={scrollY}
      />
      <Animated.ScrollView
        contentContainerStyle={[commonStyles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        <SectionHeader
          title="My Resumes"
          onSeeAll={() => {}}
          actionLabel="View All"
        />

        {/* Horizontal Scroll for Resumes */}
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
          style={{ marginBottom: 32 }}
        >
          {MOCK_RESUMES.map((resume) => (
            <View
              key={resume.id}
              style={[
                styles.resumeCard,
                commonStyles.liquidGlassBorder,
                { backgroundColor: theme.backgroundElement },
              ]}
            >
              <View style={styles.resumeCardTop}>
                <View
                  style={[
                    styles.resumeIconWrapper,
                    { backgroundColor: resume.color + "15" },
                  ]}
                >
                  <FileText size={24} color={resume.color} strokeWidth={2} />
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.moreButton,
                    { opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  <MoreVertical size={20} color={theme.textSecondary} />
                </Pressable>
              </View>

              <View style={styles.resumeCardContent}>
                <Text style={styles.resumeTitle} numberOfLines={1}>
                  {resume.title}
                </Text>
                <Text style={styles.resumeDate}>{resume.date}</Text>
              </View>

              <View style={styles.resumeCardFooter}>
                <View style={styles.scorePill}>
                  <Text style={[styles.scoreText, { color: resume.color }]}>
                    {resume.score}
                  </Text>
                  <Text style={styles.scoreLabel}>ATS Score</Text>
                </View>

                <View style={styles.actionButtons}>
                  <Pressable style={styles.iconButton}>
                    <Edit3 size={18} color={theme.text} />
                  </Pressable>
                  <Pressable style={styles.iconButton}>
                    <Trash2 size={18} color={theme.error || "#EA5455"} />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
          {/* Add New Resume Placeholder */}
          <Pressable
            style={[
              styles.resumeCard,
              styles.addResumeCard,
              {
                borderColor: theme.border,
                backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.02)" : "#F8F8F8",
              },
            ]}
            onPress={() => router.push("/resume/create")}
          >
            <View
              style={[
                styles.addResumeIconWrapper,
                { backgroundColor: theme.primary + "15" },
              ]}
            >
              <PlusCircle size={32} color={theme.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.addResumeTitle}>New Resume</Text>
            <Text style={styles.addResumeSubtitle}>Start from scratch</Text>
          </Pressable>
        </Animated.ScrollView>

        <SectionHeader title="AI Tools" />
        <View style={styles.toolsGrid}>
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Pressable
                key={tool.id}
                style={({ pressed }) => [
                  styles.toolCard,
                  commonStyles.liquidGlassBorder,
                  { backgroundColor: tool.color + "15" },
                  pressed && { transform: [{ scale: 0.96 }] },
                ]}
                onPress={() => router.push(tool.route as any)}
              >
                <View style={styles.toolIconWrapper}>
                  <Icon size={28} color={tool.color} strokeWidth={2} />
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>

                {/* Subtle Background Icon */}
                <View style={styles.toolBgIcon}>
                  <Icon size={80} color={tool.color} opacity={0.1} />
                </View>
              </Pressable>
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    resumeCard: {
      width: CARD_WIDTH,
      borderRadius: 32,
      padding: 24,
      justifyContent: "space-between",
      ...(Platform.OS === "ios" ? { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20 } : { elevation: 4 }),
    },
    resumeCardTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    resumeIconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      // @ts-ignore
      borderCurve: "continuous",
    },
    moreButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      marginRight: -10,
      marginTop: -10,
    },
    resumeCardContent: {
      marginBottom: 24,
    },
    resumeTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 6,
    },
    resumeDate: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    resumeCardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: "rgba(150, 150, 150, 0.1)",
    },
    scorePill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F5F5F5",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 99,
      gap: 6,
    },
    scoreText: {
      fontSize: 14,
      fontFamily: theme.fonts.bold,
    },
    scoreLabel: {
      fontSize: 12,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 12,
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F5F5F5",
      alignItems: "center",
      justifyContent: "center",
    },
    addResumeCard: {
      borderWidth: 1,
      borderStyle: "dashed",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    addResumeIconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    addResumeTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 6,
    },
    addResumeSubtitle: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    toolsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 20,
      justifyContent: "space-between",
      gap: 16,
    },
    toolCard: {
      width: (width - 40 - 16) / 2, // 2 columns
      aspectRatio: 1,
      borderRadius: 32,
      padding: 20,
      justifyContent: "space-between",
      overflow: "hidden",
    },
    toolIconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    toolTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      lineHeight: 22,
      marginBottom: 6,
    },
    toolSubtitle: {
      fontSize: 12,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    toolBgIcon: {
      position: "absolute",
      right: -20,
      bottom: -20,
      zIndex: -1,
    },
  });

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
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Header } from "../../components/Header";
import { IconTile } from "@/components/IconTile";
import { SectionHeader } from "../../components/SectionHeader";

// ── Layout tokens (4/8 rhythm) ─────────────────────────────────────────
const PAGE_HPAD = 20;
const SECTION_GAP = 32;
const CARD_GAP = 16;
const CARD_INNER_PAD = 20;

const { width } = Dimensions.get("window");
// Cap width so cards don't balloon on tablets.
const CARD_WIDTH = Math.min(width * 0.78, 320);

const MOCK_RESUMES = [
  {
    id: "r1",
    title: "Senior Frontend Engineer",
    date: "Updated 2h ago",
    score: 92,
    color: "#B983FF",
  },
  {
    id: "r2",
    title: "UX/UI Designer",
    date: "Updated 1w ago",
    score: 85,
    color: "#FF9F43",
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
        contentContainerStyle={[
          commonStyles.scrollContent,
          { paddingBottom: 120 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        <SectionHeader title="My Resumes" />

        {/* Horizontal Scroll for Resumes */}
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: PAGE_HPAD,
            gap: CARD_GAP,
          }}
          snapToInterval={CARD_WIDTH + CARD_GAP}
          decelerationRate="fast"
          style={{ marginBottom: SECTION_GAP }}
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
                <IconTile
                  Icon={FileText}
                  size="md"
                  color={resume.color}
                  accessibilityLabel="Resume file"
                />
                <Pressable
                  style={({ pressed }) => [
                    styles.moreButton,
                    { opacity: pressed ? 0.5 : 1 },
                  ]}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="More options"
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
                  <Pressable
                    style={({ pressed }) => [
                      styles.iconButton,
                      pressed && { opacity: 0.6 },
                    ]}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Edit resume"
                  >
                    <Edit3 size={18} color={theme.text} />
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.iconButton,
                      pressed && { opacity: 0.6 },
                    ]}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Delete resume"
                  >
                    <Trash2 size={18} color={theme.danger ?? "#EA5455"} />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}

          {/* Add New Resume Placeholder */}
          <Pressable
            style={({ pressed }) => [
              styles.resumeCard,
              styles.addResumeCard,
              {
                borderColor: theme.border,
                backgroundColor:
                  theme.mode === "dark"
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(0,0,0,0.02)",
              },
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
            ]}
            onPress={() => router.push("/resume/create")}
            accessibilityRole="button"
            accessibilityLabel="Create a new resume"
          >
            <IconTile
              Icon={PlusCircle}
              size="lg"
              tone="primary"
              strokeWidth={1.5}
              style={{ marginBottom: 16 }}
            />
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
                  pressed && { transform: [{ scale: 0.97 }], opacity: 0.95 },
                ]}
                onPress={() => router.push(tool.route as any)}
                accessibilityRole="button"
                accessibilityLabel={`${tool.title.replace("\n", " ")} — ${tool.subtitle}`}
              >
                <IconTile
                  Icon={Icon}
                  size="md"
                  color={tool.color}
                  style={styles.toolIconWrapper}
                />
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>

                {/* Subtle Background Icon */}
                <View style={styles.toolBgIcon} pointerEvents="none">
                  <Icon size={96} color={tool.color} opacity={0.08} />
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
      borderRadius: 28,
      padding: CARD_INNER_PAD,
      justifyContent: "space-between",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
        },
        android: { elevation: 3 },
        default: {},
      }),
    },
    resumeCardTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    moreButton: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    resumeCardContent: {
      marginBottom: 20,
    },
    resumeTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 4,
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
      borderTopColor:
        theme.mode === "dark"
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.06)",
    },
    scorePill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
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
      gap: 8,
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      alignItems: "center",
      justifyContent: "center",
    },
    addResumeCard: {
      borderWidth: 1.5,
      borderStyle: "dashed",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 32,
    },
    addResumeTitle: {
      fontSize: 17,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 4,
    },
    addResumeSubtitle: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    toolsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: PAGE_HPAD,
      justifyContent: "space-between",
      gap: CARD_GAP,
    },
    toolCard: {
      width: (width - PAGE_HPAD * 2 - CARD_GAP) / 2,
      aspectRatio: 1,
      borderRadius: 28,
      padding: CARD_INNER_PAD,
      justifyContent: "space-between",
      overflow: "hidden",
    },
    toolIconWrapper: {
      marginBottom: 12,
    },
    toolTitle: {
      fontSize: 17,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      lineHeight: 22,
      marginBottom: 4,
    },
    toolSubtitle: {
      fontSize: 12,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    toolBgIcon: {
      position: "absolute",
      right: -16,
      bottom: -16,
      zIndex: -1,
    },
  });

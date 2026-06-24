import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  ChevronRight,
  FileText,
  LayoutGrid,
  List,
  Megaphone,
  MonitorPlay,
  Route,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { GlassIconButton, Header } from "../../components/Header";

const MENU_ITEMS = [
  {
    id: "profile",
    title: "Master Profile",
    subtitle: "Manage your details",
    icon: User,
    route: "/profile",
    color: "#B983FF", // Purple
    metrics: [
      { label: "Completion", value: "85%" },
      { label: "Profile Views", value: "142" },
    ],
    progress: 85,
  },
  {
    id: "announcements",
    title: "Announcements",
    subtitle: "Stay updated",
    icon: Megaphone,
    route: "/announcements",
    color: "#FF9F43", // Orange
    metrics: [
      { label: "Unread", value: "3" },
      { label: "Total", value: "24" },
    ],
  },
  {
    id: "learn",
    title: "Learn",
    subtitle: "Access courses",
    icon: BookOpen,
    route: "/(tabs)/learn",
    color: "#00CFE8", // Cyan
    metrics: [
      { label: "Active Courses", value: "2" },
      { label: "Hours Learned", value: "14h" },
    ],
    progress: 60,
  },
  {
    id: "career",
    title: "Career Pathways",
    subtitle: "Discover your path",
    icon: Route,
    route: "/(tabs)/career",
    color: "#28C76F", // Green
    metrics: [
      { label: "Current Level", value: "Mid" },
      { label: "Next Milestone", value: "Senior" },
    ],
    progress: 40,
  },
  {
    id: "jobs",
    title: "Jobs",
    subtitle: "Find opportunities",
    icon: Briefcase,
    route: "/jobs",
    color: "#EA5455", // Red
    metrics: [
      { label: "Saved Jobs", value: "12" },
      { label: "New Matches", value: "5" },
    ],
  },
  {
    id: "interview",
    title: "Interview Prep",
    subtitle: "Practice skills",
    icon: MonitorPlay,
    route: "/interview",
    color: "#7367F0", // Indigo
    metrics: [
      { label: "Mock Interviews", value: "4" },
      { label: "Avg Score", value: "88/100" },
    ],
  },
  {
    id: "resume",
    title: "Resume",
    subtitle: "Build your CV",
    icon: FileText,
    route: "/resume",
    color: "#FFB400", // Yellow
    metrics: [
      { label: "Versions", value: "3" },
      { label: "Last Update", value: "2d ago" },
    ],
  },
];

export default function More() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  // Default to false (Grid / Dashboard mode)
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollY = useSharedValue(0);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={commonStyles.container}>
      <Header
        title="Explore"
        showBack={false}
        isTabScreen={true}
        scrollY={scrollY}
        rightComponent={
          <GlassIconButton
            onPress={() => setIsExpanded(!isExpanded)}
            scrollY={scrollY}
          >
            {isExpanded ? (
              <LayoutGrid size={22} color={theme.text} strokeWidth={2.5} />
            ) : (
              <List size={22} color={theme.text} strokeWidth={2.5} />
            )}
          </GlassIconButton>
        }
      />

      <Animated.ScrollView
        contentContainerStyle={commonStyles.scrollContentFullBleed}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        <View
          style={[
            commonStyles.grid,
            !isExpanded && commonStyles.gridContainer,
            { paddingHorizontal: 20 },
          ]}
        >
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  commonStyles.card,
                  !isExpanded && [
                    styles.cardGrid,
                    { backgroundColor: item.color + "25", borderWidth: 0 },
                  ],
                  isExpanded && styles.cardExpanded,
                  { transform: [{ scale: pressed ? 0.96 : 1 }] },
                ]}
                onPress={() => router.push(item.route as any)}
              >
                {!isExpanded ? (
                  <>
                    {/* Background Watermark Icon */}
                    <View
                      style={{
                        position: "absolute",
                        right: -25,
                        bottom: -25,
                        opacity: 0.1,
                      }}
                    >
                      <Icon size={120} color={item.color} />
                    </View>

                    {/* Smooth Squircle Cutout & Button */}
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 56,
                        height: 56,
                        zIndex: 2,
                      }}
                    >
                      {/* Main white cutout curve */}
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: 56,
                          height: 56,
                          backgroundColor: theme.background,
                          borderBottomLeftRadius: 28,
                        }}
                      />
                      {/* Top Fillet */}
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          left: -20,
                          width: 20,
                          height: 20,
                          backgroundColor: theme.background,
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: item.color + "25",
                            borderTopRightRadius: 20,
                          }}
                        />
                      </View>
                      {/* Right Fillet */}
                      <View
                        style={{
                          position: "absolute",
                          bottom: -20,
                          right: 0,
                          width: 20,
                          height: 20,
                          backgroundColor: theme.background,
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: item.color + "25",
                            borderTopRightRadius: 20,
                          }}
                        />
                      </View>
                      {/* Inner Circular Button */}
                      <View
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: item.color + "25",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowUpRight size={20} color={theme.text} />
                      </View>
                    </View>

                    <View style={styles.gridCardContent}>
                      <Text style={styles.gridCardTitle}>
                        {item.title.replace(" ", "\n")}
                      </Text>
                      <Text style={styles.gridCardSubtitle}>
                        {item.subtitle}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.cardHeader}>
                      <View
                        style={[
                          styles.iconWrapper,
                          { backgroundColor: item.color + "15" },
                        ]}
                      >
                        <Icon size={24} color={item.color} strokeWidth={2.5} />
                      </View>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                      </View>
                      <View style={styles.chevronWrapper}>
                        <ChevronRight
                          size={18}
                          color={theme.textSecondary}
                          opacity={0.5}
                        />
                      </View>
                    </View>

                    {item.metrics && (
                      <View style={styles.metricsContainer}>
                        <View style={styles.metricsRow}>
                          {item.metrics.map((m, i) => (
                            <View key={i} style={styles.metricBlock}>
                              <Text
                                style={[
                                  styles.metricValue,
                                  { color: theme.text },
                                ]}
                              >
                                {m.value}
                              </Text>
                              <Text style={styles.metricLabel}>{m.label}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </>
                )}
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
    cardGrid: {
      width: "47.5%",
      aspectRatio: 1,
      padding: 18,
      borderRadius: 32,
      overflow: "hidden",
      justifyContent: "space-between",
    },

    gridCardContent: {
      flex: 1,
      justifyContent: "flex-end",
      paddingBottom: 8,
    },
    gridCardTitle: {
      fontSize: 22,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      lineHeight: 28,
    },
    gridCardSubtitle: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      marginTop: 4,
    },

    cardExpanded: {
      width: "100%",
      padding: 20,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    cardHeaderGrid: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    iconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      // @ts-ignore
      borderCurve: "continuous",
    },
    iconWrapperGrid: {
      marginRight: 0,
      marginBottom: 16,
    },
    cardContent: {
      flex: 1,
    },
    cardContentGrid: {
      width: "100%",
    },
    cardTitle: {
      fontSize: 17,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 4,
    },
    cardTitleGrid: {
      fontSize: 16,
      marginBottom: 6,
    },
    cardSubtitle: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    cardSubtitleGrid: {
      fontSize: 12,
    },
    chevronWrapper: {
      paddingLeft: 12,
    },
    metricsContainer: {
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: "rgba(150, 150, 150, 0.1)",
    },
    metricsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    metricBlock: {
      flex: 1,
    },
    metricValue: {
      fontSize: 16,
      fontFamily: theme.fonts.black,
      marginBottom: 4,
    },
    metricLabel: {
      fontSize: 12,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
  });

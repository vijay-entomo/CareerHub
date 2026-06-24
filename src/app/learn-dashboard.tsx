import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { ChevronDown, Flame, Trophy, Zap } from "lucide-react-native";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Svg, {
  Defs,
  G,
  Line,
  Pattern,
  Rect,
  Text as SvgText,
} from "react-native-svg";
import { Header } from "../components/Header";

const { width } = Dimensions.get("window");

const CHART_DATA = [
  { day: "Mon", value: 2.8, type: "hatched" },
  { day: "Tue", value: 4.8, type: "solid" },
  { day: "Wed", value: 3.2, type: "hatched" },
  { day: "Thu", value: 4.5, type: "solid" },
  { day: "Fri", value: 4.7, type: "solid" },
  { day: "Sat", value: 2.4, type: "hatched" },
  { day: "Sun", value: 3.1, type: "hatched" },
];

export default function LearnDashboard() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const scrollY = useSharedValue(0);

  const chartHeight = 180;
  const chartWidth = width - 40;
  const maxHours = 5;
  const barWidth = (chartWidth - 40) / 7 - 12; // 7 days, 12 gap
  const yAxisTicks = [1, 2, 3, 4, 5];

  const handleScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  return (
    <View style={commonStyles.container}>
      <Header title="" scrollY={scrollY} />

      <ScrollView
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* TOP SECTION: Time Spent Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>21h 15 min</Text>
            <Pressable style={styles.dropdownBtn}>
              <Text style={styles.dropdownText}>This week</Text>
              <ChevronDown size={16} color="#FFF" />
            </Pressable>
          </View>

          <View style={{ height: chartHeight + 40, marginTop: 32 }}>
            <Svg width="100%" height="100%">
              <Defs>
                <Pattern
                  id="hatch"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="8"
                  patternTransform="rotate(45)"
                >
                  <Line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="8"
                    stroke={theme.text}
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                </Pattern>
              </Defs>

              {/* Y Axis Lines */}
              {yAxisTicks.map((tick) => {
                const y = chartHeight - (tick / maxHours) * chartHeight;
                return (
                  <G key={`grid-${tick}`}>
                    <Line
                      x1="30"
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke={
                        theme.mode === "dark"
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)"
                      }
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <SvgText
                      x="0"
                      y={y + 4}
                      fill={
                        theme.mode === "dark"
                          ? "rgba(255,255,255,0.5)"
                          : "rgba(0,0,0,0.5)"
                      }
                      fontSize="12"
                      fontWeight="500"
                    >
                      {tick}h
                    </SvgText>
                  </G>
                );
              })}

              {/* Bars */}
              {CHART_DATA.map((data, idx) => {
                const barH = (data.value / maxHours) * chartHeight;
                const x = 40 + idx * (barWidth + 12);
                const y = chartHeight - barH;

                return (
                  <G key={`bar-${idx}`}>
                    <Rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barH}
                      rx={8}
                      fill={
                        data.type === "solid" ? theme.primary : "url(#hatch)"
                      }
                    />
                    <SvgText
                      x={x + barWidth / 2}
                      y={chartHeight + 24}
                      fill={theme.text}
                      fontSize="12"
                      fontWeight="500"
                      textAnchor="middle"
                    >
                      {data.day}
                    </SvgText>
                  </G>
                );
              })}
            </Svg>
          </View>
        </View>

        {/* METRICS GRID 1 */}
        <View style={styles.gridRow}>
          <View
            style={[styles.gridCard, { backgroundColor: "#A3F8A6", flex: 1.1 }]}
          >
            <Text style={[styles.cardLabel, { color: "#1A1A1A" }]}>
              Courses completed
            </Text>
            <Text style={[styles.cardValue, { color: "#1A1A1A" }]}>7</Text>
            <Text style={[styles.cardSubText, { color: "#1A1A1A" }]}>
              this year
            </Text>
          </View>
          <View
            style={[
              styles.gridCard,
              {
                backgroundColor:
                  theme.mode === "dark" ? "rgba(255,255,255,0.03)" : "#F4F4F5",
                flex: 1,
              },
            ]}
          >
            <Text style={styles.cardLabel}>Average test score</Text>
            <Text style={styles.cardValue}>88%</Text>
            <Text style={styles.cardSubText}>more than 62% of users</Text>
          </View>
        </View>

        {/* METRICS GRID 2 */}
        <View style={styles.gridRow}>
          <View
            style={[
              styles.gridCard,
              {
                backgroundColor:
                  theme.mode === "dark" ? "rgba(255,255,255,0.03)" : "#F4F4F5",
                flex: 1.1,
              },
            ]}
          >
            <Text style={styles.cardLabel}>Lessons completed</Text>
            <Text style={styles.cardValue}>92</Text>
            <Text style={styles.cardSubText}>more than 53% of users</Text>
          </View>
          <View
            style={[
              styles.gridCard,
              {
                backgroundColor:
                  theme.mode === "dark" ? "rgba(255,255,255,0.03)" : "#F4F4F5",
                flex: 1,
              },
            ]}
          >
            <Text style={styles.cardLabel}>Certificates</Text>
            <Text style={styles.cardValue}>2</Text>
            <Text style={styles.cardSubText}>available for download</Text>
          </View>
        </View>

        {/* EXTRA ANALYTICS */}
        <Text style={styles.sectionTitle}>Learning Insights</Text>

        <View style={styles.insightsContainer}>
          <View
            style={[
              styles.insightRow,
              { borderBottomWidth: 1, borderBottomColor: theme.border },
            ]}
          >
            <View style={styles.insightIconWrapper}>
              <Flame size={24} color="#FF5A5F" />
            </View>
            <View style={styles.insightTextContent}>
              <Text style={styles.insightTitle}>12 Day Streak!</Text>
              <Text style={styles.insightDesc}>
                You're in the top 5% of active learners this month.
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.insightRow,
              { borderBottomWidth: 1, borderBottomColor: theme.border },
            ]}
          >
            <View style={styles.insightIconWrapper}>
              <Trophy size={24} color="#FFC107" />
            </View>
            <View style={styles.insightTextContent}>
              <Text style={styles.insightTitle}>4,250 XP Gained</Text>
              <Text style={styles.insightDesc}>
                Only 750 XP away from unlocking the Master Badge.
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "85%" }]} />
            </View>
          </View>

          <View style={styles.insightRow}>
            <View style={styles.insightIconWrapper}>
              <Zap size={24} color={theme.primary} />
            </View>
            <View style={styles.insightTextContent}>
              <Text style={styles.insightTitle}>Fastest Skill Growth</Text>
              <Text style={styles.insightDesc}>
                React Native • +18% proficiency this week
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    chartContainer: {
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.03)" : "#F4F4F5",
      borderRadius: 24,
      padding: 24,
      marginBottom: 16,
    },
    chartHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    chartTitle: {
      fontSize: 32,
      fontFamily: theme.fonts.black,
      color: theme.text,
    },
    dropdownBtn: {
      backgroundColor: theme.primary,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 24,
      gap: 6,
    },
    dropdownText: {
      color: "#FFF",
      fontFamily: theme.fonts.bold,
      fontSize: 14,
    },
    gridRow: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 16,
    },
    gridCard: {
      borderRadius: 20,
      padding: 20,
      justifyContent: "space-between",
      minHeight: 140,
    },
    cardLabel: {
      fontFamily: theme.fonts.medium,
      fontSize: 15,
      color: theme.text,
      opacity: 0.8,
      marginBottom: 16,
    },
    cardValue: {
      fontFamily: theme.fonts.black,
      fontSize: 40,
      color: theme.text,
      marginBottom: 8,
    },
    cardSubText: {
      fontFamily: theme.fonts.regular,
      fontSize: 13,
      color: theme.text,
      opacity: 0.6,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginTop: 24,
      marginBottom: 16,
    },
    insightsContainer: {
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.03)" : "#F4F4F5",
      borderRadius: 24,
      paddingHorizontal: 20,
      paddingVertical: 8,
      marginBottom: 40,
    },
    insightRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      gap: 16,
    },
    insightIconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
      alignItems: "center",
      justifyContent: "center",
    },
    insightTextContent: {
      flex: 1,
    },
    insightTitle: {
      fontFamily: theme.fonts.bold,
      fontSize: 16,
      color: theme.text,
      marginBottom: 4,
    },
    insightDesc: {
      fontFamily: theme.fonts.regular,
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    progressBarBg: {
      position: "absolute",
      bottom: -8,
      left: 64,
      right: 0,
      height: 4,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      borderRadius: 2,
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.primary,
      borderRadius: 2,
    },
  });

import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Check,
  Compass,
  Crown,
  Lock,
  MapPin,
  Search,
  Sparkles,
  Target,
} from "lucide-react-native";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Defs,
  G,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

import { Button } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";
import { GlassIconButton, Header } from "../../components/Header";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedDashedLine = ({ theme }: { theme: any }) => {
  const dashOffset = useSharedValue(0);

  useEffect(() => {
    dashOffset.value = withRepeat(
      withTiming(-28, { duration: 1200, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: dashOffset.value,
    };
  });

  return (
    <View
      style={{
        flex: 1,
        height: 2,
        marginHorizontal: 8,
        overflow: "hidden",
        opacity: theme.mode === "dark" ? 0.6 : 0.4,
        marginTop: -20,
      }}
    >
      <Svg width="100%" height="2" style={{ overflow: "visible" }}>
        <AnimatedPath
          d="M 0 1 L 1000 1"
          stroke={theme.mode === "dark" ? "#818CF8" : "#6366F1"}
          strokeWidth="2.5"
          strokeDasharray="6,8"
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

const LockedRoadmapCard = ({
  theme,
  commonStyles,
}: {
  theme: any;
  commonStyles: any;
}) => {
  return (
    <View
      style={{
        marginTop: 32,
        borderRadius: 40,
        backgroundColor: theme.mode === "dark" ? "#1E1E2D" : "#FFFFFF",
        overflow: "hidden",
        borderWidth: 1.5,
        borderColor:
          theme.mode === "dark"
            ? "rgba(255,255,255,0.05)"
            : "rgba(99, 102, 241, 0.15)", // Premium colored border instead of sad gray
        // Pop-out shadow
        shadowColor: theme.mode === "dark" ? "#000" : "rgba(99, 102, 241, 0.4)", // Tinted shadow
        shadowOffset: { width: 0, height: 24 },
        shadowOpacity: theme.mode === "dark" ? 0.5 : 0.2,
        shadowRadius: 32,
        elevation: 12,
        padding: 32,
      }}
    >
      {/* Vibrant Aurora Background layer via SVG */}
      <View style={StyleSheet.absoluteFillObject}>
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor:
                theme.mode === "dark" ? "transparent" : "#FAFAFF",
            },
          ]}
        />
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="grad1" cx="0%" cy="0%" rx="100%" ry="100%">
              <Stop
                offset="0"
                stopColor={
                  theme.mode === "dark"
                    ? "rgba(99, 102, 241, 0.25)"
                    : "rgba(99, 102, 241, 0.18)"
                }
              />
              <Stop offset="1" stopColor="transparent" />
            </RadialGradient>
            <RadialGradient id="grad2" cx="100%" cy="100%" rx="100%" ry="100%">
              <Stop
                offset="0"
                stopColor={
                  theme.mode === "dark"
                    ? "rgba(236, 72, 153, 0.25)"
                    : "rgba(250, 204, 21, 0.2)"
                }
              />
              <Stop offset="1" stopColor="transparent" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad1)" />
          <Rect width="100%" height="100%" fill="url(#grad2)" />
        </Svg>
      </View>

      {/* Huge Bold Title */}
      <Text
        style={{
          fontFamily: theme.fonts.black,
          fontSize: 32,
          color: theme.text,
          lineHeight: 36,
          letterSpacing: -1,
          marginBottom: 16,
        }}
      >
        Unlock Your{"\n"}True Potential.
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontFamily: theme.fonts.medium,
          fontSize: 15,
          color: theme.textSecondary,
          lineHeight: 22,
          marginBottom: 48,
          paddingRight: 10,
        }}
      >
        Discover the precise skills and steps needed to transition from your
        current position to your ultimate dream role.
      </Text>

      {/* Visual Journey Map (Flex Layout to prevent overflow) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginBottom: 48,
        }}
      >
        {/* NOW Node */}
        <View style={{ alignItems: "center", width: 48 }}>
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: "#3B82F6",
              borderWidth: 4,
              borderColor: theme.mode === "dark" ? "#1E1E2D" : "#FFFFFF",
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.6,
              shadowRadius: 8,
              elevation: 5,
            }}
          />
          <Text
            style={{
              fontFamily: theme.fonts.bold,
              fontSize: 10,
              color: theme.text,
              marginTop: 8,
              letterSpacing: 0.5,
            }}
          >
            NOW
          </Text>
        </View>

        {/* The Dashed Path (Animated Left) */}
        <AnimatedDashedLine theme={theme} />

        {/* THE LOCK (Center Blockade) */}
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: theme.mode === "dark" ? "#2D2D3D" : "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
            marginTop: -20,
            shadowColor:
              theme.mode === "dark" ? "#000" : "rgba(148, 163, 184, 0.4)",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 10,
            borderWidth: 1.5,
            borderColor:
              theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "#E2E8F0",
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor:
                theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F1F5F9",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Lock
              size={18}
              color={theme.mode === "dark" ? theme.text : "#475569"}
              strokeWidth={2.5}
            />
          </View>
        </View>

        {/* The Dashed Path (Animated Right) */}
        <AnimatedDashedLine theme={theme} />

        {/* DREAM ROLE Node */}
        <View style={{ alignItems: "center", width: 56 }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: "#F59E0B",
              borderWidth: 4,
              borderColor: theme.mode === "dark" ? "#1E1E2D" : "#FFFFFF",
              shadowColor: "#F59E0B",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.6,
              shadowRadius: 10,
              elevation: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sparkles size={12} color="#FFF" />
          </View>
          <Text
            style={{
              fontFamily: theme.fonts.bold,
              fontSize: 10,
              color: theme.text,
              marginTop: 8,
              letterSpacing: 0.5,
              textAlign: "center",
            }}
          >
            DREAM
          </Text>
        </View>
      </View>

      {/* Call to Action Button */}
      <View>
        <Button
          title="Complete Profile to Unlock"
          variant="primary"
          style={{ width: "100%" }}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

type StepStatus = "completed" | "current" | "pending" | "goal";
type Step = { title: string; subtitle: string; status: StepStatus; skillGap?: number };

const PathTimeline = ({
  theme,
  commonStyles,
  title,
  steps,
  ctaLabel = "View Full Journey",
  onCtaPress,
}: {
  theme: any;
  commonStyles: any;
  title?: string;
  steps: Step[];
  ctaLabel?: string;
  onCtaPress: () => void;
}) => {
  const completedCount = steps.filter(
    (s) => s.status === "completed" || s.status === "current",
  ).length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  const isDark = theme.mode === "dark";
  const trackColor = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const railColor = isDark ? "rgba(255,255,255,0.10)" : "#E2E8F0";
  const goldColor = "#F59E0B";
  const pathAccent = theme.text;
  const iconColor = theme.background;

  return (
    <View style={{ marginBottom: 24 }}>
      {title ? <SectionHeader title={title} /> : null}

      <View style={[commonStyles.card, { padding: 20, paddingVertical: 24 }]}>
        {/* Progress header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontFamily: theme.fonts.semiBold,
              fontSize: 13,
              color: theme.textSecondary,
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}
          >
            Your journey
          </Text>
          <Text
            style={{
              fontFamily: theme.fonts.bold,
              fontSize: 13,
              color: theme.text,
            }}
          >
            {progressPct}% complete
          </Text>
        </View>
        <View
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: trackColor,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <MotiView
            from={{ width: "0%" }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: "timing", duration: 800, delay: 200 }}
            style={{
              height: "100%",
              backgroundColor: pathAccent,
              borderRadius: 3,
            }}
          />
        </View>

        {/* Steps */}
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          const isGoal = step.status === "goal";
          const isPending = step.status === "pending";

          // Line above/below each node so completed portion shows as accent, upcoming as muted.
          const lineTopColor =
            index === 0
              ? "transparent"
              : steps[index - 1].status === "completed" ||
                  steps[index - 1].status === "current"
                ? pathAccent
                : railColor;
          const lineBottomColor = isLast
            ? "transparent"
            : isCompleted || isCurrent
              ? pathAccent
              : railColor;

          // Node styling per status
          const nodeBg = isCompleted
            ? pathAccent
            : isCurrent
              ? pathAccent
              : isGoal
                ? goldColor
                : isDark
                  ? "rgba(255,255,255,0.06)"
                  : "#F1F5F9";
          const nodeBorder = isCurrent
            ? pathAccent
            : isGoal
              ? goldColor
              : isDark
                ? "rgba(255,255,255,0.10)"
                : "#E2E8F0";

          return (
            <View key={index} style={{ flexDirection: "row", minHeight: 68 }}>
              {/* Rail column */}
              <View style={{ width: 36, alignItems: "center" }}>
                {/* Line above */}
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    height: 22,
                    width: 2,
                    backgroundColor: lineTopColor,
                  }}
                />
                {/* Node */}
                <View style={{ marginTop: 14 }}>
                  {isCurrent && (
                    <MotiView
                      from={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{
                        type: "timing",
                        duration: 1600,
                        loop: true,
                        repeatReverse: false,
                      }}
                      style={{
                        position: "absolute",
                        top: -6,
                        left: -6,
                        right: -6,
                        bottom: -6,
                        borderRadius: 24,
                        backgroundColor: pathAccent,
                      }}
                    />
                  )}
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: nodeBg,
                      borderWidth: 2,
                      borderColor: nodeBorder,
                      justifyContent: "center",
                      alignItems: "center",
                      shadowColor: isCurrent
                        ? pathAccent
                        : isGoal
                          ? goldColor
                          : "transparent",
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: isCurrent || isGoal ? 0.5 : 0,
                      shadowRadius: 8,
                      elevation: isCurrent || isGoal ? 4 : 0,
                    }}
                  >
                    {isCompleted && (
                      <Check size={12} color={iconColor} strokeWidth={3.5} />
                    )}
                    {isCurrent && (
                      <MapPin
                        size={11}
                        color={iconColor}
                        strokeWidth={3}
                        fill={iconColor}
                      />
                    )}
                    {isGoal && (
                      <Crown size={12} color="#0F172A" strokeWidth={2.5} />
                    )}
                    {isPending && (
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: isDark ? "#475569" : "#94A3B8",
                        }}
                      />
                    )}
                  </View>
                </View>
                {/* Line below */}
                <View
                  style={{
                    position: "absolute",
                    top: 40,
                    bottom: 0,
                    width: 2,
                    backgroundColor: lineBottomColor,
                  }}
                />
              </View>

              {/* Content column */}
              <View style={{ flex: 1, marginLeft: 16, paddingVertical: 6 }}>
                <View
                  style={[
                    {
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: 14,
                      marginTop: -2,
                    },
                    isCurrent && {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(15,23,42,0.03)",
                      borderWidth: 1,
                      borderColor: isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(15,23,42,0.06)",
                    },
                    isGoal && {
                      backgroundColor: isDark
                        ? "rgba(245,158,11,0.06)"
                        : "rgba(245,158,11,0.08)",
                      borderWidth: 1,
                      borderColor: "rgba(245,158,11,0.25)",
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily:
                          isCompleted || isCurrent || isGoal
                            ? theme.fonts.bold
                            : theme.fonts.medium,
                        fontSize: 15,
                        color: isPending ? theme.textSecondary : theme.text,
                        flex: 1,
                      }}
                    >
                      {step.title}
                    </Text>
                    {isCurrent && (
                      <View
                        style={{
                          marginLeft: 8,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 8,
                          backgroundColor: pathAccent,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: theme.fonts.bold,
                            fontSize: 9,
                            color: iconColor,
                            letterSpacing: 0.6,
                          }}
                        >
                          NOW
                        </Text>
                      </View>
                    )}
                    {isGoal && (
                      <View
                        style={{
                          marginLeft: 8,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 8,
                          backgroundColor: goldColor,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: theme.fonts.bold,
                            fontSize: 9,
                            color: "#0F172A",
                            letterSpacing: 0.6,
                          }}
                        >
                          GOAL
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2, flexWrap: "wrap" }}>
                    <Text
                      style={{
                        fontFamily: theme.fonts.medium,
                        fontSize: 12,
                        color: isCurrent
                          ? theme.text
                          : isGoal
                            ? goldColor
                            : theme.textSecondary,
                      }}
                    >
                      {step.subtitle}
                    </Text>
                    
                    {step.skillGap !== undefined && step.skillGap > 0 && (
                      <>
                        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.textSecondary, marginHorizontal: 6, opacity: 0.5 }} />
                        <Text style={{ fontFamily: theme.fonts.medium, fontSize: 12, color: theme.textSecondary }}>
                          {step.skillGap} skill gap{step.skillGap !== 1 ? "s" : ""}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ marginTop: 20 }}>
          <Button
            title={ctaLabel}
            variant="primary"
            onPress={onCtaPress}
            style={{ width: "100%" }}
          />
        </View>
      </View>
    </View>
  );
};

// Two ready-made variants keyed off the user's current role index in the ladder.
const PathTimelineInProgressCard = ({
  theme,
  commonStyles,
}: {
  theme: any;
  commonStyles: any;
}) => {
  const router = useRouter();
  const steps: Step[] = [
    {
      title: "Junior Product Designer",
      subtitle: "Completed",
      status: "completed",
    },
    { title: "Product Designer", subtitle: "You are here", status: "current" },
    {
      title: "Senior Product Designer",
      subtitle: "3 years away",
      status: "pending",
      skillGap: 3,
    },
    { title: "Design Lead", subtitle: "6 years away", status: "pending", skillGap: 7 },
    {
      title: "Chief Design Officer",
      subtitle: "Ultimate goal",
      status: "goal",
      skillGap: 12,
    },
  ];
  return (
    <PathTimeline
      theme={theme}
      commonStyles={commonStyles}
      steps={steps}
      ctaLabel="Continue Where You Left Off"
      onCtaPress={() => router.push("/career-pathways/path-details")}
    />
  );
};

const PathTimelineStartingCard = ({
  theme,
  commonStyles,
}: {
  theme: any;
  commonStyles: any;
}) => {
  const router = useRouter();
  const steps: Step[] = [
    {
      title: "Junior Product Designer",
      subtitle: "You are here — just getting started",
      status: "current",
    },
    { title: "Product Designer", subtitle: "2 years away", status: "pending", skillGap: 2 },
    {
      title: "Senior Product Designer",
      subtitle: "5 years away",
      status: "pending",
      skillGap: 5,
    },
    { title: "Design Lead", subtitle: "8 years away", status: "pending", skillGap: 9 },
    {
      title: "Chief Design Officer",
      subtitle: "Ultimate goal",
      status: "goal",
      skillGap: 14,
    },
  ];
  return (
    <PathTimeline
      theme={theme}
      commonStyles={commonStyles}
      steps={steps}
      ctaLabel="Start This Journey"
      onCtaPress={() => router.push("/career-pathways/path-details")}
    />
  );
};

// ---- Recommendation hero ---------------------------------------------------

const RecommendedPathCard = ({
  theme,
  commonStyles,
  onPress,
}: {
  theme: any;
  commonStyles: any;
  onPress: () => void;
}) => {
  const isDark = theme.mode === "dark";
  // Mock recommendation payload — replace with real data when wired up.
  const rec = {
    title: "Senior Product Designer",
    reason: "Based on your master profile and career goals.",
    match: 94,
    meta: ["3 yr timeline", "5 skills to build", "6 modules"],
  };

  return (
    <View>
      <SectionHeader title="Recommended for You" />
      <Pressable onPress={onPress}>
        <View
          style={[
            commonStyles.card,
            { padding: 24, overflow: "hidden", position: "relative" },
          ]}
        >
          {/* Soft aurora tint */}
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            <Svg width="100%" height="100%">
              <Defs>
                <RadialGradient id="recA" cx="85%" cy="15%" rx="80%" ry="80%">
                  <Stop
                    offset="0"
                    stopColor={
                      isDark ? "rgba(99,102,241,0.28)" : "rgba(99,102,241,0.14)"
                    }
                  />
                  <Stop offset="1" stopColor="transparent" />
                </RadialGradient>
                <RadialGradient id="recB" cx="10%" cy="90%" rx="70%" ry="70%">
                  <Stop
                    offset="0"
                    stopColor={
                      isDark ? "rgba(236,72,153,0.20)" : "rgba(250,204,21,0.16)"
                    }
                  />
                  <Stop offset="1" stopColor="transparent" />
                </RadialGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#recA)" />
              <Rect width="100%" height="100%" fill="url(#recB)" />
            </Svg>
          </View>

          {/* Match score */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              marginBottom: 12,
            }}
          >
            <Sparkles size={14} color={theme.text} />
            <Text
              style={{
                fontFamily: theme.fonts.black,
                fontSize: 22,
                color: theme.text,
                marginLeft: 6,
              }}
            >
              {rec.match}
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.semiBold,
                fontSize: 11,
                color: theme.textSecondary,
                marginLeft: 3,
              }}
            >
              % match
            </Text>
          </View>

          {/* Role + reason */}
          <Text
            style={{
              fontFamily: theme.fonts.black,
              fontSize: 26,
              color: theme.text,
              letterSpacing: -0.5,
              lineHeight: 30,
              marginBottom: 6,
            }}
          >
            {rec.title}
          </Text>
          <Text
            style={{
              fontFamily: theme.fonts.medium,
              fontSize: 14,
              color: theme.textSecondary,
              lineHeight: 20,
              marginBottom: 20,
            }}
          >
            {rec.reason}
          </Text>

          {/* Meta chips */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            {rec.meta.map((chip) => (
              <View
                key={chip}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(15,23,42,0.05)",
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fonts.medium,
                    fontSize: 11,
                    color: theme.textSecondary,
                  }}
                >
                  {chip}
                </Text>
              </View>
            ))}
          </View>

          <Button
            title="Explore This Pathway"
            variant="primary"
            onPress={onPress}
            style={{ width: "100%" }}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default function CareerPathwaysMain() {
  const commonStyles = useCommonStyles();
  const theme = useTheme();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const [isCopilotModalVisible, setIsCopilotModalVisible] = useState(false);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "timing",
        duration: 250,
        easing: Easing.out(Easing.ease),
      }}
      style={commonStyles.container}
    >
      <Header
        title="Career Pathways"
        showBack={false}
        isTabScreen={true}
        scrollY={scrollY}
        rightComponent={
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <GlassIconButton
              onPress={() => router.push("/career-pathways/career-search")}
              scrollY={scrollY}
            >
              <Search size={22} color={theme.text} />
            </GlassIconButton>
          </View>
        }
      />

      <Animated.ScrollView
        contentContainerStyle={[
          commonStyles.scrollContentFullBleed,
          { paddingHorizontal: 20 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        <Pressable onPress={() => setIsCopilotModalVisible(true)}>
          {Platform.OS === "web" && (
            <style>{`
              [data-class~="ai-copilot-card"] {
                border-radius: 48px !important;
              }
              [data-class~="ai-copilot-card-inner"] {
                border-radius: 42px !important;
              }
              @supports (corner-shape: squircle) {
                [data-class~="ai-copilot-card"], [data-class~="ai-copilot-card-inner"] {
                  corner-shape: squircle !important;
                }
              }
            `}</style>
          )}
          <View
            // @ts-ignore
            dataSet={{ class: "ai-copilot-card" }}
            style={{
              width: "100%",
              padding: 6,
              borderRadius: 48,
              // @ts-ignore
              cornerCurve: "continuous",
              backgroundColor:
                theme.mode === "dark"
                  ? "rgba(255, 175, 140, 0.15)"
                  : "rgba(255, 175, 140, 0.2)",
              borderWidth: 1.5,
              borderColor:
                theme.mode === "dark"
                  ? "rgba(255, 175, 140, 0.3)"
                  : "rgba(255, 175, 140, 0.5)",
            }}
          >
            <View
              // @ts-ignore
              dataSet={{ class: "ai-copilot-card-inner" }}
              style={[
                {
                  width: "100%",
                  padding: 20,
                  borderRadius: 42,
                  // @ts-ignore
                  cornerCurve: "continuous",
                  backgroundColor: "#FFF0E5",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                // @ts-ignore
                {
                  backgroundImage: `radial-gradient(at 15% 50%, rgba(255, 175, 140, 0.9) 0px, transparent 50%), radial-gradient(at 45% 10%, rgba(255, 145, 215, 0.8) 0px, transparent 60%), radial-gradient(at 90% 40%, rgba(255, 180, 150, 0.9) 0px, transparent 60%), radial-gradient(at 50% 90%, rgba(255, 230, 200, 0.8) 0px, transparent 50%)`,
                },
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    opacity: 0.9,
                    marginRight: 14,
                  }}
                >
                  <Svg viewBox="0 0 89.776 89.776" width="100%" height="100%">
                    <G fill="#111111">
                      <Path d="m24.291 19.8c-2.5 3.4-6.9 5.7-11 7-1.3.2-2.5.6-3.5 1.1-1.6.7-.8 3.3.9 3.3 5-.1 10.4-1 13.3 4 1.3 2.3 1.4 5.1 1.8 7.6.5 4.1 1.7 14 1.8 14.1.4 3.2 5.7 3.1 5.6-1.3-.2-6.1.7-12.8 3.5-18.2 1.2-2.4 3.1-4.5 5.4-5.9 1-.6 2.1-1 3.2-1.3 1.4.2 2.8.1 4.1-.2 2.5-.6 2.1-3.8 0-4.6-2.9-1-5.9-1-8.8-2.5-2.5-1.3-4.5-3.2-6.1-5.6-1.7-2.6-2.2-5.2-2.5-7.9 0-2.4-.1-4.8-.2-7-.1-3.2-5.1-3.2-5 0 .1 1.9.2 4.1.3 6.4v1.2c-.3 3.7-.9 7.2-2.8 9.8zm3.6 3.3c.8-.9 1.4-1.9 1.9-3 .2.3.3.5.5.8 1.8 2.8 4.8 5.5 8.2 7.4-2.2 1.4-4.1 3.2-5.2 4.7-1.3 1.7-2.3 3.7-3.1 5.8-.7-3.8-2.1-7.1-5.2-9.6-.7-.6-1.6-1-2.4-1.4 1.9-1.5 3.8-3 5.3-4.7z" />
                      <Path d="m57.491 44c-.8.1-1.5.4-2.3.7-1 .5-.5 2 .6 2 3.7 0 7.7-.5 8.9 4 .3 1.2.4 2.6.5 3.8.3 2.4.6 4.8.9 7.2v.3c0 .2 0 .4.1.6v.2c.3 2.1 2.8 2 3.2.3.2-.3.3-.6.3-1.1-.1-3.8.4-8.3 2.3-11.7 1.5-2.6 3.5-3.3 5.8-4.2h1.6c1.6-.2 2.1-2.5.4-2.9-3.6-1-6.9-1.5-9.2-4.9-1-1.5-1.5-3.1-1.7-4.8 0-1.6-.1-3.2-.1-4.7-.1-2-3.2-2-3.1 0 0 1 .3 7.8-1.2 10.5-1.4 2.4-4.4 3.8-7 4.7zm9.1-2.5c.4-.5.8-1.1 1.1-1.7 1.4 2.1 3.4 3.8 5.5 5-1.2.7-2.3 1.7-3 2.5-1 1.2-1.8 2.6-2.4 4.1-.6-3.2-2.5-5.7-5-6.8 1.6-.8 2.8-1.8 3.8-3.1z" />
                      <Path d="m47.391 63.8c-1.8-2.5-1.8-8-1.8-9.5-.1-2-3.2-2-3.1 0 0 1 .1 7.6-1.2 10.5-1.1 2.5-4.4 3.8-7 4.6-.8.1-1.5.4-2.3.7-1 .5-.5 2 .6 2 3.7 0 7.7-.5 8.9 4 .3 1.2.4 2.6.5 3.8.3 2.4.6 4.8.9 7.2v.3c0 .2 0 .4.1.6v.2c.3 2.1 2.8 2 3.2.3.2-.3.3-.6.3-1.1-.1-3.8.4-8.3 2.3-11.7 1.5-2.6 3.5-3.3 5.8-4.2h1.6c1.6-.2 2.1-2.5.4-2.9-3.6-.9-6.8-1.5-9.2-4.8zm-.3 9c-1 1.2-1.8 2.6-2.4 4.1-.6-3.2-2.5-5.7-5-6.8 1.4-.8 2.7-1.8 3.7-3.1.4-.5.8-1.1 1.1-1.7 1.4 2.1 3.4 3.8 5.5 5-1.2.7-2.2 1.6-2.9 2.5z" />
                    </G>
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: theme.fonts.bold,
                      fontSize: 16,
                      color: "#111111",
                    }}
                  >
                    Career Exploration
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.fonts.medium,
                      fontSize: 13,
                      color: "rgba(17, 17, 17, 0.75)",
                      marginTop: 2,
                    }}
                  >
                    Discover tailored domains and the full career spectrum
                  </Text>
                </View>
              </View>
              <View
                style={[
                  {
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  },
                  commonStyles.liquidGlassBorder,
                ]}
              >
                {Platform.OS === "web" ? (
                  <View
                    style={[
                      StyleSheet.absoluteFillObject,
                      {
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                      } as any,
                    ]}
                  />
                ) : (
                  <BlurView
                    intensity={30}
                    tint="light"
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <View style={{ zIndex: 1, elevation: 1 }}>
                  <ArrowRight size={16} color="#111111" strokeWidth={3} />
                </View>
              </View>
            </View>
          </View>
        </Pressable>

        <RecommendedPathCard
          theme={theme}
          commonStyles={commonStyles}
          onPress={() => router.push("/career-pathways/path-details")}
        />

        <SectionHeader title="Your Saved Paths" />
        <PathTimelineStartingCard theme={theme} commonStyles={commonStyles} />
        <PathTimelineInProgressCard theme={theme} commonStyles={commonStyles} />
      </Animated.ScrollView>

      <Modal
        visible={isCopilotModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCopilotModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor:
              theme.mode === "dark" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
          onPress={() => setIsCopilotModalVisible(false)}
        >
          {/* Modal Container */}
          <Pressable
            style={{
              width: "100%",
              backgroundColor: theme.mode === "dark" ? "#1E1E2D" : "#FFFFFF",
              borderRadius: 32,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 20,
              borderWidth: 1,
              borderColor:
                theme.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={{ marginBottom: 24, alignItems: "center" }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor:
                    theme.mode === "dark" ? "#2D2D3D" : "#FAFAFA",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor:
                    theme.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "#F1F5F9",
                }}
              >
                <Sparkles size={24} color={theme.text} />
              </View>
              <Text
                style={{
                  fontFamily: theme.fonts.black,
                  fontSize: 24,
                  color: theme.text,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Career Discovery
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.medium,
                  fontSize: 14,
                  color: theme.textSecondary,
                  textAlign: "center",
                  paddingHorizontal: 10,
                }}
              >
                Choose your exploration path to unlock tailored opportunities.
              </Text>
            </View>

            <View style={{ gap: 16 }}>
              {/* Option 1: Amber/Gold Design */}
              <Pressable
                style={[
                  commonStyles.card,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 20,
                    backgroundColor:
                      theme.mode === "dark" ? "#2D2D3D" : "#FFFFFF",
                    borderWidth: 1,
                    borderColor:
                      theme.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "#F1F5F9",
                    shadowColor: "#F59E0B",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  },
                ]}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "rgba(245, 158, 11, 0.15)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <Target size={24} color="#F59E0B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: theme.fonts.bold,
                      fontSize: 16,
                      color: theme.text,
                      marginBottom: 4,
                    }}
                  >
                    Recommended Domains
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.fonts.medium,
                      fontSize: 13,
                      color: theme.textSecondary,
                      lineHeight: 18,
                    }}
                  >
                    Explore tailored domains and see the precise path to reach
                    them.
                  </Text>
                </View>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 12,
                  }}
                >
                  <ArrowRight size={16} color="#F59E0B" strokeWidth={2.5} />
                </View>
              </Pressable>

              {/* Option 2: Cyan/Teal Design */}
              <Pressable
                onPress={() => {
                  setIsCopilotModalVisible(false);
                  router.push("/career-pathways/career-spectrum");
                }}
                style={[
                  commonStyles.card,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 20,
                    backgroundColor:
                      theme.mode === "dark" ? "#2D2D3D" : "#FFFFFF",
                    borderWidth: 1,
                    borderColor:
                      theme.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "#F1F5F9",
                    shadowColor: "#06B6D4",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  },
                ]}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "rgba(6, 182, 212, 0.15)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <Compass size={24} color="#06B6D4" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: theme.fonts.bold,
                      fontSize: 16,
                      color: theme.text,
                      marginBottom: 4,
                    }}
                  >
                    Full Career Spectrum
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.fonts.medium,
                      fontSize: 13,
                      color: theme.textSecondary,
                      lineHeight: 18,
                    }}
                  >
                    Go beyond tailored picks and explore entirely new untouched
                    roles.
                  </Text>
                </View>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "rgba(6, 182, 212, 0.1)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 12,
                  }}
                >
                  <ArrowRight size={16} color="#06B6D4" strokeWidth={2.5} />
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </MotiView>
  );
}

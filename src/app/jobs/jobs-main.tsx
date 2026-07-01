import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { ArrowRight, Bookmark, Flame, Sparkles, Target } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { G, Path } from "react-native-svg";
import { AnimatedTabs } from "../../components/AnimatedTabs";
import { AutoContrastIcon } from "../../components/AutoContrast";
import { Header } from "../../components/Header";
import { JobCard } from "../../components/JobCard";
import { SectionHeader } from "../../components/SectionHeader";

const TRACKED_JOBS = [
  {
    id: "j1",
    company: "Google",
    title: "Senior UX Designer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
    progress: 75,
    status: "Interviewing",
  },
  {
    id: "j2",
    company: "Apple",
    title: "Product Designer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/512px-Apple_logo_black.svg.png",
    progress: 50,
    status: "Under Review",
  },
  {
    id: "j3",
    company: "Netflix",
    title: "UI Engineer",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/512px-Netflix_2015_logo.svg.png",
    progress: 25,
    status: "Applied",
  },
];

const TrackJobsDeck = ({ jobs, theme, styles }: any) => {
  const deckScrollY = useSharedValue(0);
  const deckData = jobs.slice(0, 3);
  const CONTAINER_HEIGHT = 132;

  const onDeckScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      deckScrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.deckContainer}>
      <View style={styles.deckCardsWrapper}>
        {deckData.map((job: any, index: number) => {
          const animatedStyle = useAnimatedStyle(() => {
            const position = deckScrollY.value / CONTAINER_HEIGHT - index;

            const depth = interpolate(
              position,
              [-2, -1, 0, 1, 2],
              [2, 1, 0, 2, 1],
              "clamp",
            );

            const arcOffset = interpolate(
              position,
              [0, 0.5, 1],
              [0, -40, 0],
              "clamp",
            );

            const translateY =
              interpolate(depth, [0, 1, 2], [0, 14, 28], "clamp") + arcOffset;
            const scale = interpolate(
              depth,
              [0, 1, 2],
              [1, 0.92, 0.84],
              "clamp",
            );
            const opacity = interpolate(
              depth,
              [0, 1, 2],
              [1, 0.7, 0.3],
              "clamp",
            );

            let zIndex = 1;
            if (position > 0 && position < 1) {
              zIndex = position < 0.5 ? 10 : 1;
            } else {
              zIndex = Math.round(
                interpolate(depth, [0, 1, 2], [10, 9, 1], "clamp"),
              );
            }

            return {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              transform: [{ translateY }, { scale }],
              opacity,
              zIndex,
            };
          });

          return (
            <Animated.View style={[animatedStyle]} key={job.id}>
              <View style={styles.compactLearningCard}>
                <Image
                  source={{ uri: job.logo }}
                  style={styles.compactCardImage}
                />
                <View style={styles.compactCardContent}>
                  <Text style={styles.compactCardProvider}>
                    {job.company} • {job.status}
                  </Text>
                  <Text style={styles.compactCardTitle} numberOfLines={1}>
                    {job.title}
                  </Text>
                </View>
                <Pressable style={styles.compactPlayButton}>
                  <ArrowRight
                    size={16}
                    color={theme.mode === "dark" ? "#000" : "#FFF"}
                  />
                </Pressable>
              </View>
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.deckPaginationRight}>
        {deckData.map((_: any, i: number) => {
          const dotStyle = useAnimatedStyle(() => {
            const position = Math.abs(deckScrollY.value / CONTAINER_HEIGHT - i);
            const dotHeight = interpolate(position, [0, 1], [16, 6], "clamp");
            const opacity = interpolate(position, [0, 1], [1, 0.3], "clamp");
            return {
              height: dotHeight,
              opacity,
              backgroundColor: theme.text,
            };
          });
          return <Animated.View key={i} style={[styles.deckDot, dotStyle]} />;
        })}
      </View>

      <Animated.ScrollView
        snapToInterval={CONTAINER_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        showsVerticalScrollIndicator={false}
        onScroll={onDeckScroll}
        scrollEventThrottle={16}
        style={[
          StyleSheet.absoluteFill,
          {
            zIndex: 20,
            // @ts-ignore
            scrollSnapType: "y mandatory",
          },
        ]}
      >
        {deckData.map((job: any, i: number) => (
          <Pressable
            key={i}
            style={[
              { height: CONTAINER_HEIGHT },
              // @ts-ignore
              { scrollSnapAlign: "start", scrollSnapStop: "always" },
            ]}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default function JobsMain() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const router = useRouter();

  const scrollY = useSharedValue(0);
  const JOB_TABS = [
    { id: "Trending", label: "Trending", icon: Flame },
    { id: "Recommended", label: "Recommended", icon: Target },
    { id: "New Addition", label: "New Addition", icon: Sparkles },
    { id: "Bookmarked", label: "Bookmarked", icon: Bookmark },
  ];
  const [activeJobTab, setActiveJobTab] = useState(JOB_TABS[0].id);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={commonStyles.container}>
      <View style={{ flex: 1 }}>
        <Header
          title="Explore Jobs"
          showBack
          onBack={() => router.back()}
          scrollY={scrollY}
        />
        <Animated.ScrollView
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleVerticalScroll}
          scrollEventThrottle={16}
        >
          <Pressable onPress={() => router.push("/jobs/ai-wizard")}>
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
                backgroundColor: theme.mode === "dark" ? "rgba(255, 175, 140, 0.15)" : "rgba(255, 175, 140, 0.2)",
                borderWidth: 1.5,
                borderColor: theme.mode === "dark" ? "rgba(255, 175, 140, 0.3)" : "rgba(255, 175, 140, 0.5)",
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
                    AI Career Co-Pilot
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.fonts.medium,
                      fontSize: 13,
                      color: "rgba(17, 17, 17, 0.75)",
                      marginTop: 2,
                    }}
                  >
                    Discover opportunities tailored to your expertise
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

          <View>
            {/* Track Your Jobs Section */}
            <SectionHeader
              title="Application Pipeline"
              onSeeAll={() => console.log("See all tracked jobs")}
            />
            <TrackJobsDeck jobs={TRACKED_JOBS} theme={theme} styles={styles} />
            <Text style={[styles.compactEncourageMessage]}>
              Employers are actively reviewing your applications. Stay responsive to accelerate your hiring journey.
            </Text>

            {/* ALL JOBS */}
            <SectionHeader
              title="Explore Opportunities"
              onSeeAll={() => console.log("See all jobs")}
            />
            <AnimatedTabs
              tabs={JOB_TABS}
              activeTab={activeJobTab}
              onTabChange={setActiveJobTab}
            />
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.horizontalScroll,
                { alignItems: "stretch" },
              ]}
              decelerationRate="fast"
              snapToInterval={300 + 16}
            >
              {(() => {
                const list =
                  activeJobTab === "Recommended"
                    ? TRACKED_JOBS
                    : activeJobTab === "Recent"
                      ? [...TRACKED_JOBS].slice(1, 3)
                      : [...TRACKED_JOBS].reverse();

                const displayList = list.slice(0, 3);
                return (
                  <>
                    {displayList.map((job) => (
                      <View key={job.id} style={{ width: 300, height: "100%" }}>
                        <JobCard
                          companyName={job.company}
                          companyLogoUri={job.logo}
                          matchLevel="HIGH"
                          postedDate="2 days ago"
                          title={job.title}
                          isAssessmentRequired={true}
                          employmentType="Full Time"
                          salary="$125K"
                          experience="Min 2 Yrs"
                          location="New York"
                          applicantCount="45 Applicants"
                        />
                      </View>
                    ))}
                    <Pressable
                      style={styles.viewAllCard}
                      onPress={() => console.log("View all jobs")}
                    >
                      <View style={styles.viewAllIconWrapper}>
                        <AutoContrastIcon
                          Icon={ArrowRight}
                          bgColor={theme.primary}
                          size={24}
                        />
                      </View>
                      <Text style={styles.viewAllText}>View All{"\n"}Jobs</Text>
                    </Pressable>
                  </>
                );
              })()}
            </Animated.ScrollView>
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    compactEncourageMessage: {
      fontFamily: theme.fonts.medium,
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 0,
      // paddingHorizontal: 24,
      lineHeight: 18,
      textAlign: "center",
    },
    deckContainer: {
      flexDirection: "row",
      marginBottom: 12,
      height: 132,
      position: "relative",
    },
    deckCardsWrapper: {
      flex: 1,
      marginRight: 16,
      height: 132,
      position: "relative",
    },
    deckPaginationRight: {
      width: 8,
      height: 84,
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
    },
    deckDot: {
      width: 6,
      borderRadius: 3,
    },
    compactLearningCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.backgroundElement,
      borderRadius: 20,
      padding: 16,
      ...(theme.mode === "light"
        ? {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
          }
        : {}),
    },
    compactCardImage: {
      width: 76,
      height: 76,
      borderRadius: 16,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "#F0F0F0",
      resizeMode: "contain",
    },
    compactCardContent: {
      flex: 1,
      marginLeft: 14,
      marginRight: 10,
      justifyContent: "center",
    },
    compactCardProvider: {
      fontFamily: theme.fonts.bold,
      fontSize: 11,
      color: theme.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    compactCardTitle: {
      fontFamily: theme.fonts.bold,
      fontSize: 16,
      color: theme.text,
      marginBottom: 8,
    },
    compactProgressContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    compactProgressBarBg: {
      flex: 1,
      height: 6,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "#E5E5E5",
      borderRadius: 3,
      overflow: "hidden",
    },
    compactProgressBarFill: {
      height: "100%",
      backgroundColor: theme.primary,
      borderRadius: 3,
    },
    compactProgressText: {
      fontFamily: theme.fonts.bold,
      fontSize: 12,
      color: theme.text,
      width: 32,
      textAlign: "right",
    },
    compactPlayButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.text,
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: 2,
    },
    horizontalScroll: {
      // paddingHorizontal: 20,
      gap: 16,
    },
    viewAllCard: {
      width: 140,
      height: "100%",
      borderRadius: 24,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:
        theme.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#F8F8F8",
      borderColor:
        theme.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : theme.border,
      gap: 12,
      marginLeft: 4,
    },
    viewAllIconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    viewAllText: {
      fontFamily: theme.fonts.bold,
      fontSize: 14,
      color: theme.text,
      textAlign: "center",
    },
  });

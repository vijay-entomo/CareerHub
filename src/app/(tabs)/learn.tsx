import { AutoContrastIcon } from "@/components/AutoContrast";
import { Button } from "@/components/Button";
import { CourseCard } from "@/components/CourseCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Camera,
  Code2,
  Flame,
  Megaphone,
  MessageCircle,
  Monitor,
  Music,
  Paintbrush,
  PieChart,
  Play,
  Search,
  Sparkles,
  Star,
  Target,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { AnimatedTabs } from "../../components/AnimatedTabs";
import { GlassIconButton, Header } from "../../components/Header";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const { width } = Dimensions.get("window");

const SEARCH_SUGGESTIONS = [
  "ui ux design",
  "figma ui ux design",
  "ui ux design complete course",
  "ui ux design beginner",
  "adobe xd ui ux design",
  "mobile app design ui ux",
  "ui ux designer",
];

const COURSE_RESULTS = [
  {
    id: "c1",
    title: "Figma UI UX Design Essentials",
    type: "Course",
    author: "Daniel Walter Scott",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=100",
  },
  {
    id: "c2",
    title: "Figma UI UX Design Advanced",
    type: "Course",
    author: "Daniel Walter Scott",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=100",
  },
];

const INSTRUCTOR_RESULTS = [
  {
    id: "i1",
    title: "Andrei Neagoie",
    type: "Instructor",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100",
  },
];

const FEATURED_COURSES = [
  {
    id: "f1",
    title: "Advanced Figma Design Systems",
    image: require("../../../assets/images/learn_card/learning img 1.png"),
    tags: ["Trending"],
  },
  {
    id: "f2",
    title: "Mastering UX Research Methods",
    image: require("../../../assets/images/learn_card/learning img 2.png"),
    tags: ["Recommended", "Product Design"],
  },
  {
    id: "f3",
    title: "High-Fidelity Prototyping in Framer",
    image: require("../../../assets/images/learn_card/learning img 3.png"),
    tags: ["New Addition"],
  },
];

const RECOMMENDED_COURSES = [
  {
    id: "1",
    title: "Machine Learning - Fundamentals",
    description:
      "A Practical Guide to Machine Learning – Learn ML with Real Life Examples",
    image: require("../../../assets/images/learn_card/learning img 4.png"),
    rating: "4.5",
    provider: "TESDA",
    students: "2.1k+",
    category: "Machine Learning",
    tags: ["Certificate", "Badge"],
  },
  {
    id: "2",
    title: "Advanced Data Structures",
    description:
      "Master algorithms and data structures for technical interviews and production.",
    image: require("../../../assets/images/learn_card/learning img 5.png"),
    rating: "4.9",
    provider: "Stanford",
    students: "8.4k+",
    category: "Computer Science",
    tags: ["Certificate"],
  },
  {
    id: "3",
    title: "React Native Masterclass",
    description:
      "Build fluid, highly animated mobile applications using Expo & Reanimated.",
    image: require("../../../assets/images/learn_card/learning img 6.png"),
    rating: "4.8",
    provider: "Udemy",
    students: "12k+",
    category: "Mobile Dev",
    tags: ["Certificate", "Badge"],
  },
];

const TOP_MENTORS = [
  {
    id: "1",
    name: "Sarah J.",
    role: "Lead Designer",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: "5.0",
  },
  {
    id: "2",
    name: "David M.",
    role: "Senior Eng",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: "4.9",
  },
  {
    id: "3",
    name: "Elena V.",
    role: "Product Head",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: "4.8",
  },
  {
    id: "4",
    name: "Mike T.",
    role: "Data Scientist",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: "4.7",
  },
];

const ContinueLearningDeck = ({ courses, theme, styles }: any) => {
  const deckScrollY = useSharedValue(0);
  const deckData = courses.slice(0, 3);
  const CONTAINER_HEIGHT = 132;

  const onDeckScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      deckScrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.deckContainer}>
      <View style={styles.deckCardsWrapper}>
        {deckData.map((course: any, index: number) => {
          const animatedStyle = useAnimatedStyle(() => {
            const position = deckScrollY.value / CONTAINER_HEIGHT - index;

            // Map the position to a depth level [0, 1, 2] to form a continuous loop:
            // Front (pos=0) -> Back (pos=1) -> Middle (pos=2) -> Front (pos=3)
            const depth = interpolate(
              position,
              [-2, -1, 0, 1, 2],
              [2, 1, 0, 2, 1],
              "clamp",
            );

            // Add a vertical arc ONLY when swiping a card from front to back (0 < position < 1)
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
              // During the swipe, it stays on top until the halfway point, then drops behind
              zIndex = position < 0.5 ? 10 : 1;
            } else {
              // Otherwise, zIndex naturally follows depth (Active = 10, Middle = 9, Back = 1)
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
            <Animated.View style={[animatedStyle]} key={course.id}>
              <View style={styles.compactLearningCard}>
                <Image source={course.image} style={styles.compactCardImage} />
                <View style={styles.compactCardContent}>
                  <Text style={styles.compactCardProvider}>
                    {course.provider || "CAREOPS"}
                  </Text>
                  <Text style={styles.compactCardTitle} numberOfLines={1}>
                    {course.title}
                  </Text>
                  <View style={styles.compactProgressContainer}>
                    <View style={styles.compactProgressBarBg}>
                      <View
                        style={[
                          styles.compactProgressBarFill,
                          { width: `${60 + index * 10}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.compactProgressText}>
                      {60 + index * 10}%
                    </Text>
                  </View>
                </View>
                <Pressable style={styles.compactPlayButton}>
                  <Play
                    size={16}
                    color={theme.mode === "dark" ? "#000" : "#FFF"}
                    fill={theme.mode === "dark" ? "#000" : "#FFF"}
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
        {deckData.map((course: any, i: number) => (
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

export default function Learn() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);

  const scrollY = useSharedValue(0);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const heroScrollRef = useRef<Animated.ScrollView>(null);

  const COURSE_CATEGORIES = [
    { id: "Development", label: "Development", icon: Code2, color: "#4ade80" },
    { id: "Design", label: "Design", icon: Paintbrush, color: "#c084fc" },
    { id: "Business", label: "Business", icon: Briefcase, color: "#60a5fa" },
    { id: "Marketing", label: "Marketing", icon: Megaphone, color: "#f472b6" },
    {
      id: "IT & Software",
      label: "IT & Software",
      icon: Monitor,
      color: "#fb923c",
    },
    {
      id: "Personal Dev",
      label: "Personal Dev",
      icon: Target,
      color: "#facc15",
    },
    { id: "Photography", label: "Photography", icon: Camera, color: "#38bdf8" },
    { id: "Music", label: "Music", icon: Music, color: "#fb7185" },
  ];

  const COURSE_TABS = [
    { id: "Trending", label: "Trending", icon: Flame },
    { id: "Recommended", label: "Recommended", icon: Target },
    { id: "New Addition", label: "New Addition", icon: Sparkles },
    { id: "Bookmarked", label: "Bookmarked", icon: Bookmark },
  ];
  const [activeCourseTab, setActiveCourseTab] = useState(COURSE_TABS[0].id);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleHeroScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (
      index !== activeHeroIndex &&
      index >= 0 &&
      index < FEATURED_COURSES.length
    ) {
      setActiveHeroIndex(index);
    }
  };

  return (
    <View style={commonStyles.container}>
      <Header
        title="Learn"
        showBack={false}
        isTabScreen={true}
        scrollY={scrollY}
        rightComponent={
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <GlassIconButton
              onPress={() => router.push("/course-search")}
              scrollY={scrollY}
            >
              <Search size={22} color={theme.text} />
            </GlassIconButton>
            <GlassIconButton
              onPress={() => router.push("/learn-dashboard")}
              scrollY={scrollY}
            >
              <PieChart size={22} color={theme.text} />
            </GlassIconButton>
          </View>
        }
      />

      <Animated.ScrollView
        contentContainerStyle={[
          commonStyles.scrollContentFullBleed,
          { paddingTop: 80 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        {/* NETFLIX HERO CAROUSEL */}
        <View style={styles.heroCarouselContainer}>
          <FlatList
            ref={heroScrollRef as any}
            data={FEATURED_COURSES}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width}
            snapToAlignment="center"
            decelerationRate="fast"
            disableIntervalMomentum={true}
            onScroll={handleHeroScroll}
            scrollEventThrottle={16}
            style={{
              width: "100%",
              // @ts-ignore
              scrollSnapType: "x mandatory",
            }}
            renderItem={({ item: course, index }) => (
              <View
                style={[
                  styles.heroContainer,
                  {
                    scrollSnapAlign: "center",
                    scrollSnapStop: "always",
                  } as any,
                ]}
              >
                <Image source={course.image} style={styles.heroImage} />
                <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                  <Defs>
                    <LinearGradient
                      id={`hero-grad-${course.id}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <Stop
                        offset="0.3"
                        stopColor={theme.background}
                        stopOpacity="0"
                      />
                      <Stop
                        offset="0.85"
                        stopColor={theme.background}
                        stopOpacity="0.9"
                      />
                      <Stop
                        offset="1"
                        stopColor={theme.background}
                        stopOpacity="1"
                      />
                    </LinearGradient>
                  </Defs>
                  <Rect
                    width="100%"
                    height="100%"
                    fill={`url(#hero-grad-${course.id})`}
                  />
                </Svg>

                <View style={styles.heroContent}>
                  <View style={styles.heroTags}>
                    {course.tags.map((tag, idx) => {
                      let Icon = null;
                      if (tag === "Trending") Icon = Flame;
                      else if (tag === "Recommended") Icon = Target;
                      else if (tag === "New Addition") Icon = Sparkles;

                      return (
                        <View key={tag} style={styles.heroTagPill}>
                          {Icon && (
                            <Icon
                              size={12}
                              color="#000000"
                              style={{ marginRight: 4 }}
                            />
                          )}
                          <Text style={styles.heroTagText}>{tag}</Text>
                        </View>
                      );
                    })}
                  </View>
                  <Text style={styles.heroTitle}>{course.title}</Text>
                  <View style={styles.heroActionRow}>
                    <Button
                      title="View Course"
                      variant="primary"
                      size="small"
                      onPress={() => {}}
                    />
                  </View>
                </View>
              </View>
            )}
          />

          <View style={styles.heroPagination}>
            {FEATURED_COURSES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.heroPaginationDot,
                  activeHeroIndex === i && styles.heroPaginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* CONTINUE LEARNING ROW */}
          <SectionHeader
            title="Continue Learning"
            onSeeAll={() => router.push("/my-courses")}
          />
          <ContinueLearningDeck
            courses={RECOMMENDED_COURSES}
            theme={theme}
            styles={styles}
          />

          <Text style={[styles.compactEncourageMessage]}>
            You're on a roll! Finish this course today to keep moving forward.
          </Text>

          {/* ALL COURSES */}
          <SectionHeader
            title="All Courses"
            onSeeAll={() => router.push("/all-courses")}
          />
          <AnimatedTabs
            tabs={COURSE_TABS}
            activeTab={activeCourseTab}
            onTabChange={setActiveCourseTab}
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
                activeCourseTab === "Recommended"
                  ? RECOMMENDED_COURSES
                  : activeCourseTab === "New Addition"
                    ? [...RECOMMENDED_COURSES].slice(1, 4)
                    : [...RECOMMENDED_COURSES].reverse();

              const displayList = list.slice(0, 3);
              return (
                <>
                  {displayList.map((course) => (
                    <View
                      key={course.id}
                      style={{ width: 300, height: "100%" }}
                    >
                      <CourseCard
                        course={course}
                        layout="vertical"
                        style={{ height: "100%" }}
                      />
                    </View>
                  ))}
                  <Pressable
                    style={styles.viewAllCard}
                    onPress={() => router.push("/all-courses")}
                  >
                    <View style={styles.viewAllIconWrapper}>
                      <AutoContrastIcon
                        Icon={ArrowRight}
                        bgColor={theme.primary}
                        size={24}
                      />
                    </View>
                    <Text style={styles.viewAllText}>
                      View All{"\n"}Courses
                    </Text>
                  </Pressable>
                </>
              );
            })()}
          </Animated.ScrollView>

          {/* EXPLORE TOPICS */}
          <SectionHeader title="Explore Topics" />
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.horizontalScroll]}
          >
            {COURSE_CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Pressable
                  key={cat.id}
                  style={({ pressed }) => [
                    styles.categoryBentoTile,
                    {
                      backgroundColor:
                        theme.mode === "dark"
                          ? `${cat.color}15`
                          : `${cat.color}10`,
                      borderColor:
                        theme.mode === "dark"
                          ? `${cat.color}30`
                          : `${cat.color}20`,
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                    },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/category/[id]",
                      params: { id: cat.id },
                    } as any)
                  }
                >
                  <View
                    style={[
                      styles.categoryBentoIconWrapper,
                      { backgroundColor: `${cat.color}25` },
                    ]}
                  >
                    <Icon
                      size={20}
                      color={theme.mode === "dark" ? cat.color : theme.text}
                    />
                  </View>
                  <Text style={styles.categoryBentoText}>{cat.label}</Text>
                </Pressable>
              );
            })}
          </Animated.ScrollView>

          {/* TOP MENTORS */}
          <SectionHeader title="Top Mentors" onSeeAll={() => {}} />
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {TOP_MENTORS.map((mentor) => (
              <View key={mentor.id} style={styles.mentorCard}>
                <View style={styles.mentorAvatarWrapper}>
                  <Image
                    source={{ uri: mentor.avatar }}
                    style={styles.mentorAvatar}
                  />
                  <View style={styles.mentorOnlineBadge} />
                </View>
                <Text style={styles.mentorName} numberOfLines={1}>
                  {mentor.name}
                </Text>
                <Text style={styles.mentorRole} numberOfLines={1}>
                  {mentor.role}
                </Text>

                <View style={styles.mentorActions}>
                  <View style={styles.mentorRating}>
                    <Star size={12} color="#FFC107" fill="#FFC107" />
                    <Text style={styles.mentorRatingText}>{mentor.rating}</Text>
                  </View>
                  <Pressable style={styles.chatButton}>
                    <MessageCircle size={14} color={theme.background} />
                  </Pressable>
                </View>
              </View>
            ))}
          </Animated.ScrollView>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    heroCarouselContainer: {
      height: 500,
      width: width,
      // marginBottom: 24,
    },
    heroContainer: {
      width: width,
      height: 500,
      justifyContent: "flex-end",
      overflow: "hidden",
    },
    heroImage: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
    },
    heroContent: {
      paddingHorizontal: 20,
      paddingBottom: 48,
      alignItems: "center",
      zIndex: 10,
    },
    heroTags: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 16,
      flexWrap: "wrap",
    },
    heroTagPill: {
      flexDirection: "row",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 100,
      backgroundColor: "rgba(0, 0, 0, 0.15)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.3)",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    heroTagText: {
      color: "#000000",
      fontSize: 12,
      fontFamily: theme.fonts.bold,
    },
    heroTitle: {
      color: theme.text,
      fontSize: 28,
      fontFamily: theme.fonts.black,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 38,
    },
    heroActionRow: {
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
    },
    heroPlayButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.text,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      gap: 8,
    },
    heroPlayText: {
      color: theme.background,
      fontFamily: theme.fonts.bold,
      fontSize: 14,
    },
    heroPagination: {
      position: "absolute",
      bottom: 20,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    heroPaginationDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
    },
    heroPaginationDotActive: {
      width: 20,
      backgroundColor: theme.text,
    },
    horizontalScroll: {
      // paddingHorizontal: 20,
      gap: 16,
    },
    // MENTORS STYLES
    mentorCard: {
      width: 140,
      backgroundColor: theme.backgroundElement,
      borderRadius: 24,
      padding: 16,
      alignItems: "center",
      // @ts-ignore
      borderCurve: "continuous",
    },
    mentorAvatarWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      marginBottom: 12,
    },
    mentorAvatar: {
      width: "100%",
      height: "100%",
      borderRadius: 32,
    },
    mentorOnlineBadge: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: "#28C76F",
      borderWidth: 2,
      borderColor: theme.backgroundElement,
    },
    mentorName: {
      fontSize: 15,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 2,
    },
    mentorRole: {
      fontSize: 12,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      marginBottom: 12,
    },
    mentorActions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    mentorRating: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    mentorRatingText: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    chatButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.text,
      alignItems: "center",
      justifyContent: "center",
    },
    deckContainer: {
      flexDirection: "row",
      // paddingHorizontal: 20,
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
      height: 84, // Center aligned with the front card height
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
      paddingLeft: 2, // optical center for play icon
    },
    compactEncourageMessage: {
      fontFamily: theme.fonts.medium,
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 0,
      // paddingHorizontal: 24,
      lineHeight: 18,
      textAlign: "center",
    },
    resultsContainer: {
      paddingHorizontal: 20,
    },
    suggestionRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
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
    suggestionText: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
    },
    resultCardRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      gap: 16,
    },
    resultImage: {
      width: 44,
      height: 44,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "#E5E5E5",
      borderRadius: 4,
    },
    resultDetails: {
      flex: 1,
      justifyContent: "center",
    },
    resultTitle: {
      fontSize: 15,
      marginBottom: 4,
      fontFamily: theme.fonts.bold,
    },
    resultSubtitle: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
    },
    categoryBentoTile: {
      width: 120,
      height: 120,
      borderRadius: 24,
      padding: 16,
      justifyContent: "space-between",
      borderWidth: 1,
    },
    categoryBentoIconWrapper: {
      width: 44,
      height: 44,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      // @ts-ignore
      borderCurve: "continuous",
    },
    categoryBentoText: {
      fontFamily: theme.fonts.medium,
      fontSize: 13,
      color: theme.text,
      lineHeight: 18,
    },
  });

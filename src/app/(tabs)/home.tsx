import { SectionHeader } from "@/components/SectionHeader";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Bell, Heart, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48; // Leaves 20px padding on each side

const BANNER_DATA = [
  {
    id: 1,
    title: "Not to be dramatic but... doing this could change your life",
    subtitle:
      "Set up your Master Profile to auto-fill all your career documents with one click.",
    buttonText: "Complete Profile",
    bgColor: "#FFEB00", // Premium Neon Lime
    textColor: "#1A1A1A",
  },
  {
    id: 2,
    title: "Better profiles lead to better outcomes",
    subtitle:
      "Set up your Master Profile to unlock accurate recommendations and Personalised guidance",
    buttonText: "Complete Profile",
    bgColor: "#F72798", // Lavender
    textColor: "#FFFFFF",
  },
  {
    id: 3,
    title: "Opportunities don't wait, and neither should you",
    subtitle:
      "Start your job search early to discover roles tailored for you and stay ahead",
    buttonText: "Explore Jobs",
    bgColor: "#793FDF", // Royal Navy
    textColor: "#FFFFFF",
  },
  {
    id: 4,
    title: "Your degree got you started, but skills get you hired",
    subtitle: "Build job-ready skills with curated courses and certifications",
    buttonText: "Explore Learnings",
    bgColor: "#F45B26", // Bright Orange
    textColor: "#FFFFFF",
  },
  {
    id: 5,
    title: "From where you are to where you want to be",
    subtitle:
      "Discover your ideal career path and the skills needed to reach your goals",
    buttonText: "Explore Career Path",
    bgColor: "#08CB00", // Mint Cyan
    textColor: "#FFFFFF",
  },
  {
    id: 6,
    title:
      "In interviews, it's not the smartest who wins - it's the most prepared",
    subtitle: "Practice with AI-powered interviews and boost your confidence",
    buttonText: "Start Interview Prep",
    bgColor: "#18181B", // Pitch Black
    textColor: "#FFFFFF",
  },
];

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface IconButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  badgeCount?: string | number;
}

const GlassIconButton = ({
  children,
  onPress,
  style,
  badgeCount,
}: IconButtonProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(1.15, { damping: 15 }))}
      onPressOut={() =>
        (scale.value = withSpring(1, { damping: 15, stiffness: 200 }))
      }
    >
      <View style={style}>
        <Animated.View style={[styles.glassShadowWrapper, animatedStyle]}>
          <BlurView
            intensity={theme.mode === "dark" ? 40 : 80}
            tint={theme.mode === "dark" ? "dark" : "light"}
            style={styles.glassIconInner}
          >
            {children}
          </BlurView>
        </Animated.View>
        {badgeCount !== undefined && (
          <View
            style={[styles.badgeContainer, { backgroundColor: theme.text }]}
          >
            <Text style={[styles.badgeText, { color: theme.background }]}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const HeaderIconButton = ({
  children,
  onPress,
  style,
  badgeCount,
}: IconButtonProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(1.15, { damping: 15 }))}
      onPressOut={() =>
        (scale.value = withSpring(1, { damping: 15, stiffness: 200 }))
      }
    >
      <View style={style}>
        <Animated.View
          style={[
            {
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            },
            animatedStyle,
          ]}
        >
          {children}
        </Animated.View>
        {badgeCount !== undefined && (
          <View
            style={[styles.badgeContainer, { backgroundColor: theme.text }]}
          >
            <Text style={[styles.badgeText, { color: theme.background }]}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const ScaleButton = ({
  children,
  onPress,
  style,
}: Omit<IconButtonProps, "badgeCount">) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(1.15, { damping: 15 }))}
      onPressOut={() =>
        (scale.value = withSpring(1, { damping: 15, stiffness: 200 }))
      }
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};

// Simple Like button for the feed cards
const FeedLikeButton = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [isLiked, setIsLiked] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });

  const handlePress = () => {
    setIsLiked((prev) => !prev);
    scale.value = withSequence(
      withTiming(1.3, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 }),
    );
  };

  return (
    <GlassIconButton onPress={handlePress} badgeCount={isLiked ? "12" : "11"}>
      <Animated.View style={animatedStyle}>
        <Heart
          size={20}
          color={isLiked ? "#FF3B30" : theme.text}
          fill={isLiked ? "#FF3B30" : "transparent"}
          strokeWidth={2.5}
        />
      </Animated.View>
    </GlassIconButton>
  );
};

interface AnnouncementCardProps {
  category: string;
  title: string;
  description: string;
  dateDay: string;
  dateMonth: string;
  images?: string[];
  showTryFeatureBtn?: boolean;
}

const AnnouncementCard = ({
  category,
  title,
  description,
  dateDay,
  dateMonth,
  images = [],
  showTryFeatureBtn = false,
}: AnnouncementCardProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleImageScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width - 40));
    if (index !== activeImageIndex && index >= 0 && index < images.length) {
      setActiveImageIndex(index);
    }
  };

  const isTextOnly = images.length === 0;

  return (
    <View
      style={[
        styles.imageCardWrapper,
        isTextOnly && {
          backgroundColor: theme.backgroundElement,
          height: 180,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.05)",
        },
      ]}
    >
      {images.length === 1 && (
        <Image source={{ uri: images[0] }} style={styles.imageCardBg} />
      )}
      {images.length > 1 && (
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleImageScroll}
          scrollEventThrottle={16}
          style={StyleSheet.absoluteFill as any}
        >
          {images.map((img: string, idx: number) => (
            <Image
              key={idx}
              source={{ uri: img }}
              style={{ width: width - 40, height: 320 }}
            />
          ))}
        </Animated.ScrollView>
      )}

      <View style={styles.imageCardTopRow}>
        {isTextOnly ? (
          <View
            style={[
              styles.categoryPill,
              { backgroundColor: theme.backgroundElement, borderWidth: 0 },
            ]}
          >
            <Text style={[styles.categoryText, { color: theme.text }]}>
              {category}
            </Text>
          </View>
        ) : (
          <BlurView
            intensity={theme.mode === "dark" ? 40 : 80}
            tint={theme.mode === "dark" ? "dark" : "light"}
            style={[
              styles.categoryPill,
              {
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                borderWidth: 1.5,
                borderColor: "rgba(255, 255, 255, 0.6)",
                overflow: "hidden",
              },
            ]}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </BlurView>
        )}
        <FeedLikeButton />
      </View>

      {images.length > 1 && (
        <View style={styles.paginationDots}>
          {images.map((_: any, i: number) => (
            <View
              key={i}
              style={[styles.dot, activeImageIndex === i && styles.activeDot]}
            />
          ))}
        </View>
      )}

      <View
        style={[
          styles.imageCardBottomPill,
          { backgroundColor: theme.backgroundElement },
          isTextOnly && { borderWidth: 0 },
        ]}
      >
        <View style={[styles.dateCircle, { backgroundColor: theme.text }]}>
          <Text style={[styles.dateDayText, { color: theme.background }]}>
            {dateDay}
          </Text>
          <Text style={styles.dateMonthText}>{dateMonth}</Text>
        </View>
        <View style={styles.announcementTextContent}>
          <Text
            style={[styles.imageCardTitle, { color: theme.text }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={[styles.imageCardDesc, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {description}
          </Text>
        </View>
        {showTryFeatureBtn && (
          <TouchableOpacity style={styles.tryFeatureBtn}>
            <Text style={styles.tryFeatureText}>Try Feature</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const PremiumAuroraBackground = ({ scrollX }: { scrollX: any }) => {
  const theme = useTheme();

  const inputRange = BANNER_DATA.map((_, i) => i * (CARD_WIDTH + 16));
  const colorStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollX.value,
      inputRange,
      BANNER_DATA.map((i) => i.bgColor),
    ),
  }));

  const y1 = useSharedValue(0);
  const x2 = useSharedValue(0);

  useEffect(() => {
    y1.value = withRepeat(
      withTiming(40, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    x2.value = withRepeat(
      withTiming(-50, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: y1.value }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: x2.value }],
  }));

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 520,
        overflow: "hidden",
      }}
    >
      {/* Deep Space Background Tint */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          colorStyle,
          { opacity: theme.mode === "dark" ? 1.15 : 1.08 },
        ]}
      />

      {/* Floating Orb 1 */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: -100,
            left: -50,
            width: width,
            height: width,
            borderRadius: width / 2,
          },
          colorStyle,
          { opacity: theme.mode === "dark" ? 0.3 : 0.25 },
          animatedStyle1,
        ]}
      />

      {/* Floating Orb 2 */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 50,
            right: -150,
            width: width * 1.2,
            height: width * 1.2,
            borderRadius: width * 0.6,
          },
          colorStyle,
          { opacity: theme.mode === "dark" ? 0.2 : 0.15 },
          animatedStyle2,
        ]}
      />

      {/* The Magic: Extreme Blur to synthesize Aurora */}
      <BlurView
        intensity={100}
        tint={theme.mode === "dark" ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />

      {/* Smooth Gradient Fade out */}
      <Svg
        height="100%"
        width="100%"
        style={StyleSheet.absoluteFill as any}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={theme.background} stopOpacity="0" />
            <Stop offset="0.6" stopColor={theme.background} stopOpacity="0.8" />
            <Stop offset="1" stopColor={theme.background} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </View>
  );
};

export default function Home() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerGlassStyle = useAnimatedStyle(() => {
    const webBlur = interpolate(
      scrollY.value,
      [0, 80],
      [0, theme.mode === "dark" ? 8 : 16],
      "clamp",
    );

    return {
      opacity: interpolate(scrollY.value, [0, 15], [0, 1], "clamp"),
      // @ts-ignore - Pure CSS blur for web
      backdropFilter: Platform.OS === "web" ? `blur(${webBlur}px)` : undefined,
      backgroundColor:
        theme.mode === "dark"
          ? `rgba(40, 40, 40, ${interpolate(scrollY.value, [0, 80], [0, 0.4], "clamp")})`
          : `rgba(255, 255, 255, ${interpolate(scrollY.value, [0, 80], [0, 0.4], "clamp")})`,
      borderBottomColor:
        theme.mode === "dark"
          ? `rgba(255, 255, 255, ${interpolate(scrollY.value, [0, 80], [0, 0.15], "clamp")})`
          : `rgba(0, 0, 0, ${interpolate(scrollY.value, [0, 80], [0, 0.05], "clamp")})`,
    };
  });

  const headerBlurProps = useAnimatedProps(() => {
    return {
      intensity: interpolate(
        scrollY.value,
        [0, 80],
        [0, theme.mode === "dark" ? 30 : 80],
        "clamp",
      ),
    };
  }) as any;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + 16));
    if (index !== activeIndex && index >= 0 && index < BANNER_DATA.length) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={commonStyles.container}>
      {/* Inject raw CSS for the experimental corner-shape squircle fallback */}
      {Platform.OS === "web" && (
        <style>
          {`
            [data-class~="squircle-card"] {
              border-radius: 20px !important;
            }
            @supports (corner-shape: squircle) {
              [data-class~="squircle-card"] {
                corner-shape: squircle !important;
                border-radius: 56px !important;
              }
            }
            [data-class~="squircle-icon"] {
              border-radius: 16px !important;
            }
            @supports (corner-shape: squircle) {
              [data-class~="squircle-icon"] {
                corner-shape: squircle !important;
                border-radius: 24px !important;
              }
            }
          `}
        </style>
      )}

      <PremiumAuroraBackground scrollX={scrollX} />

      {/* Transparent Header that turns into Glass on scroll */}
      <View
        style={[
          styles.fixedHeader,
          { backgroundColor: "transparent", borderBottomWidth: 0 },
        ]}
      >
        {Platform.OS === "web" ? (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              headerGlassStyle,
              { borderBottomWidth: 1.5 },
            ]}
          />
        ) : (
          <AnimatedBlurView
            animatedProps={headerBlurProps}
            tint={theme.mode === "dark" ? "dark" : "light"}
            style={[
              StyleSheet.absoluteFill,
              headerGlassStyle,
              { borderBottomWidth: 1.5 },
            ]}
          />
        )}
        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <ScaleButton onPress={() => router.push("/profile")}>
                <View style={[styles.profilePicWrapper, { borderRadius: 24 }]}>
                  <Image
                    source={{ uri: "https://i.pravatar.cc/150?img=11" }}
                    style={styles.profilePic}
                  />
                </View>
              </ScaleButton>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <HeaderIconButton onPress={() => {}}>
                <Search size={22} color={theme.text} strokeWidth={2.5} />
              </HeaderIconButton>
              <HeaderIconButton onPress={() => {}}>
                <Bell size={22} color={theme.text} strokeWidth={2.5} />
                <View style={styles.notificationDot} />
              </HeaderIconButton>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <Animated.ScrollView
        contentContainerStyle={commonStyles.scrollContentFullBleed}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text style={[styles.greetingLargeText, { color: theme.text }]}>
            Hello Hanika!
          </Text>
        </View>

        {/* Simple Carousel Section */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={BANNER_DATA}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 16}
            snapToAlignment="center"
            decelerationRate="fast"
            disableIntervalMomentum={true}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{
              width: "100%",
              // @ts-ignore - explicitly force Web browsers to use hardware CSS snapping
              scrollSnapType: "x mandatory",
            }}
            contentContainerStyle={{
              paddingHorizontal: (width - CARD_WIDTH) / 2,
            }}
            renderItem={({ item }) => {
              const isDarkBanner = item.bgColor === "#1A1A1A";
              const bannerBg = isDarkBanner ? theme.text : item.bgColor;
              const bannerText = isDarkBanner
                ? theme.background
                : item.textColor;

              return (
                <View
                  dataSet={{ class: "squircle-card" }}
                  style={[
                    styles.bannerCard,
                    { backgroundColor: bannerBg, marginRight: 16 },
                    // @ts-ignore
                    { scrollSnapAlign: "center", scrollSnapStop: "always" },
                  ]}
                >
                  {/* Subtle Background Watermarks mimicking the image */}
                  <View style={styles.watermark1} />
                  <View style={styles.watermark2} />

                  <View>
                    <Text style={[styles.bannerTitle, { color: bannerText }]}>
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.bannerSubtitle,
                        { color: bannerText, opacity: 0.85 },
                      ]}
                    >
                      {item.subtitle}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.bannerButton,
                      { backgroundColor: bannerText },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[styles.bannerButtonText, { color: bannerBg }]}
                    >
                      {item.buttonText}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {BANNER_DATA.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.bannerDot,
                  activeIndex === index && styles.activeBannerDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Announcements Section */}
        <SectionHeader
          title="Announcements"
          onSeeAll={() => router.push("/announcements")}
          style={{ marginTop: 0 }}
        />

        {/* Variant 2: Multiple Images */}
        <AnnouncementCard
          category="NEW FEATURE"
          title="Multiple Templates Released"
          description="Swipe to preview the new themes."
          dateDay="14"
          dateMonth="Oct"
          images={[
            "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1586282391129-76a6df230234?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600132806608-231446b2e7af?q=80&w=1974&auto=format&fit=crop",
          ]}
        />
      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    fixedHeader: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    },
    headerSafeArea: {
      backgroundColor: "transparent",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 16,
      paddingTop: 16,
    },
    greetingLargeText: {
      fontSize: 34,
      fontFamily: theme.fonts.regular,
      letterSpacing: -0.5,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    profilePicWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.08)",
    },
    profilePic: {
      width: "100%",
      height: "100%",
    },
    headerTextGroup: {
      justifyContent: "center",
    },
    nameText: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    proText: {
      fontSize: 14,
      letterSpacing: 0.6,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      marginTop: 2,
    },
    glassShadowWrapper: {
      width: 44,
      height: 44,
      borderRadius: 22,
      boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.12)",
    },
    glassIconInner: {
      width: 44,
      height: 44,
      borderRadius: 22,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: "rgba(255, 255, 255, 0.6)",
      backgroundColor: "transparent",
    },
    notificationDot: {
      position: "absolute",
      top: 10,
      right: 12,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#FF3B30",
      borderWidth: 1.5,
      borderColor: theme.background,
    },
    badgeContainer: {
      position: "absolute",
      top: -4,
      right: -4,
      backgroundColor: theme.text,
      paddingHorizontal: 4,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: theme.background,
    },
    badgeText: {
      color: theme.background,
      fontSize: 9,
      fontFamily: theme.fonts.black,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    seeAllText: {
      fontSize: 14,
      fontFamily: theme.fonts.semiBold,
      color: theme.textSecondary,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    categoryPill: {
      backgroundColor: theme.background,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.05)",
    },
    categoryText: {
      fontSize: 11,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      letterSpacing: 0.5,
    },
    dateText: {
      fontSize: 12,
      fontFamily: theme.fonts.semiBold,
      color: theme.textSecondary,
    },
    cardTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 8,
    },
    cardDesc: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      lineHeight: 22,
      marginBottom: 16,
    },
    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      borderTopWidth: 1,
      borderTopColor: theme.backgroundElement,
      paddingTop: 16,
    },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    actionText: {
      fontSize: 14,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    imageCarousel: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    carouselImage: {
      width: 280,
      height: 180,
      borderRadius: 16,
      marginRight: 12,
    },
    glassCardWrapper: {
      marginHorizontal: 20,
      borderRadius: 32,
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(40, 40, 40, 0.4)"
          : "rgba(255, 255, 255, 0.4)",
      overflow: "hidden",
      marginBottom: 20,
      borderWidth: 1.5,
      borderColor:
        theme.mode === "dark"
          ? "rgba(255, 255, 255, 0.15)"
          : "rgba(255, 255, 255, 0.6)",
    },
    imageCardWrapper: {
      marginHorizontal: 20,
      height: 320,
      borderRadius: 32,
      backgroundColor: theme.backgroundElement,
      overflow: "hidden",
      marginBottom: 20,
    },
    imageCardBg: {
      ...(StyleSheet.absoluteFill as any),
      width: "100%",
      height: "100%",
    },
    imageCardTopRow: {
      position: "absolute",
      top: 16,
      left: 16,
      right: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    imageCardBottomPill: {
      position: "absolute",
      bottom: 16,
      left: 16,
      right: 16,
      backgroundColor: theme.background,
      borderRadius: 40,
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
    },
    paginationDots: {
      position: "absolute",
      bottom: 96,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
      marginTop: 16,
      marginBottom: 8,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(255, 255, 255, 0.15)"
          : "rgba(255, 255, 255, 0.4)",
    },
    activeDot: {
      backgroundColor: theme.background,
      width: 16,
    },
    bannerDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(0, 0, 0, 0.15)",
    },
    activeBannerDot: {
      backgroundColor: theme.text,
      width: 16,
      height: 6,
      borderRadius: 3,
    },
    dateCircle: {
      backgroundColor: theme.text,
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
    },
    dateDayText: {
      fontSize: 15,
      fontFamily: theme.fonts.bold,
      color: theme.background,
      marginBottom: -2,
    },
    dateMonthText: {
      fontSize: 11,
      fontFamily: theme.fonts.semiBold,
      color: theme.background,
      opacity: 0.8,
    },
    announcementTextContent: {
      flex: 1,
      marginLeft: 12,
      marginRight: 8,
    },
    imageCardTitle: {
      fontSize: 15,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    imageCardDesc: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      marginTop: 2,
    },
    tryFeatureBtn: {
      backgroundColor: "#FFC107",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 24,
    },
    tryFeatureText: {
      fontSize: 13,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    carouselContainer: {
      marginBottom: 40,
    },
    bannerCard: {
      width: CARD_WIDTH,
      height: 240,
      padding: 24,
      justifyContent: "space-between",
      borderRadius: 20,
      // @ts-ignore - native squircle support for iOS
      borderCurve: "continuous",
      overflow: "hidden", // Important for watermarks
    },
    watermark1: {
      position: "absolute",
      left: -60,
      bottom: -80,
      width: 250,
      height: 250,
      borderRadius: 125,
      borderWidth: 40,
      borderColor: "rgba(255, 255, 255, 0.15)",
    },
    watermark2: {
      position: "absolute",
      right: -100,
      top: -150,
      width: 350,
      height: 350,
      borderRadius: 175,
      borderWidth: 50,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    bannerTitle: {
      fontSize: 22,
      fontFamily: theme.fonts.bold,
      lineHeight: 28,
      marginBottom: 8,
    },
    bannerSubtitle: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      lineHeight: 20,
    },
    bannerButton: {
      alignSelf: "flex-start",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 20,
      // @ts-ignore
      borderCurve: "continuous",
    },
    bannerButtonText: {
      fontFamily: theme.fonts.bold,
      fontSize: 14,
    },
  });

import { AppFonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react-native";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SwipeButton } from "../components/SwipeButton";
import SkiaBlob from "../components/SkiaBlob";
import WebGLDiamond from "../components/WebGLDiamond";
import HeatmapShader from "../components/HeatmapShader";

const WebAwareSkiaBlob = ({ colors }: { colors: [string, string, string] }) => {
  if (Platform.OS === 'web') {
    return <WebGLDiamond colors={colors} />;
  }
  return <SkiaBlob colors={colors} />;
};

const TypewriterText = ({
  text,
  style,
  delay = 0,
  speed = 40,
  isVisible = true,
}: {
  text: string;
  style?: any;
  delay?: number;
  speed?: number;
  isVisible?: boolean;
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText("");
      return;
    }
    let i = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length && intervalId) clearInterval(intervalId);
      }, speed);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, delay, speed, isVisible]);
  
  return (
    <View style={{ position: 'relative', flexDirection: 'row' }}>
      <Text style={[style, { opacity: 0 }]}>{text}</Text>
      <Text style={[style, { position: 'absolute', left: 0, top: 0 }]}>{displayedText}</Text>
    </View>
  );
};

const FloatingBadge = ({
  label,
  bgColor,
  textColor,
  top,
  left,
  right,
  bottom,
  rotate,
  delay,
  isVisible,
}: {
  label: string;
  bgColor: string;
  textColor: string;
  top?: any;
  left?: any;
  right?: any;
  bottom?: any;
  rotate: string;
  delay: number;
  isVisible?: boolean;
}) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const styles = createStyles(width, theme);
  return (
    <MotiView
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.9,
        translateY: isVisible ? 0 : 15,
        rotate: isVisible ? rotate : "0deg",
      }}
      transition={{
        type: "timing",
        duration: 400,
        delay: isVisible ? delay / 2 : 0,
      }}
      style={[
        styles.badgeContainer,
        {
          backgroundColor: bgColor,
          ...(top !== undefined ? { top } : {}),
          ...(left !== undefined ? { left } : {}),
          ...(right !== undefined ? { right } : {}),
          ...(bottom !== undefined ? { bottom } : {}),
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
    </MotiView>
  );
};

export default function Index() {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const styles = createStyles(width, theme);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const lastIndex = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);

  const jumpTo = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, y: 0, animated: true });
  };

  const SLIDE_ACCENTS = ["#00E676", "#FF4081", "#FF7043"] as const;

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / width);
      if (index !== lastIndex.value) {
        lastIndex.value = index;
        runOnJS(setActiveIndex)(index);
      }
    },
  });

  const blob1Style = useAnimatedStyle(() => {
    const rotate = interpolate(
      scrollX.value,
      [-width, 0, width],
      [60, 0, -60],
      "clamp",
    );
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  const blob2Style = useAnimatedStyle(() => {
    const rotate = interpolate(
      scrollX.value,
      [0, width, width * 2],
      [60, 0, -60],
      "clamp",
    );
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  const blob3Style = useAnimatedStyle(() => {
    const rotate = interpolate(
      scrollX.value,
      [width, width * 2, width * 3],
      [60, 0, -60],
      "clamp",
    );
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  return (
    <View style={styles.container}>
      {/* Dynamic Background Transition */}
      <MotiView
        style={StyleSheet.absoluteFillObject}
        animate={{
          backgroundColor: "#0F0F0F",
        }}
        transition={{ type: "timing", duration: 400 }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Persistent Pagination Indicators — tap to jump between slides */}
        <View style={[styles.paginationContainer, { top: 20 }]}>
          {SLIDE_ACCENTS.map((color, i) => (
            <Pressable
              key={i}
              onPress={() => jumpTo(i)}
              hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeIndex === i }}
              accessibilityLabel={`Slide ${i + 1} of ${SLIDE_ACCENTS.length}`}
              style={[
                styles.dot,
                activeIndex === i
                  ? [styles.dotActive, { backgroundColor: color }]
                  : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <Animated.ScrollView
          ref={scrollRef as any}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          snapToInterval={width}
          snapToAlignment="center"
          decelerationRate="fast"
          disableIntervalMomentum={true}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          // @ts-ignore - Web specific scroll snapping
          style={{ flex: 1, scrollSnapType: "x mandatory" }}
        >


          {/* SLIDE 2: Learning (Green/Purple) */}
          {/* @ts-ignore */}
          <View
            style={[
              styles.slideContainer,
              { scrollSnapAlign: "center", scrollSnapStop: "always" },
            ]}
          >
            <View style={styles.newContent}>
              <View style={styles.blobArea}>
                <MotiView
                  from={{ opacity: 0, scale: 0.5, translateY: 20 }}
                  animate={{ opacity: 1, scale: 1, translateY: 0 }}
                  transition={{
                    delay: 100,
                    type: "spring",
                    damping: 20,
                    stiffness: 90,
                  }}
                >
                  <Animated.View style={blob1Style}>
                    <WebAwareSkiaBlob colors={['#00E676', '#1a1a1a', '#D7FE03']} />
                  </Animated.View>
                </MotiView>

                <FloatingBadge
                  label="Upskill"
                  bgColor="#333"
                  textColor="#FFF"
                  top={20}
                  right={40}
                  rotate="10deg"
                  delay={400}
                  isVisible={activeIndex === 0}
                />
                <FloatingBadge
                  label="Grow"
                  bgColor="#E0F2F1"
                  textColor="#000"
                  bottom={20}
                  left={20}
                  rotate="-15deg"
                  delay={500}
                  isVisible={activeIndex === 0}
                />
                <FloatingBadge
                  label="Explore"
                  bgColor="#D7FE03"
                  textColor="#000"
                  top={40}
                  left={-10}
                  rotate="-10deg"
                  delay={600}
                  isVisible={activeIndex === 0}
                />
                <FloatingBadge
                  label="Master"
                  bgColor="#FCE4EC"
                  textColor="#000"
                  bottom={40}
                  right={-10}
                  rotate="15deg"
                  delay={700}
                  isVisible={activeIndex === 0}
                />
                <View style={[styles.starIcon, { top: 10, left: 20 }]}>
                  <Sparkles size={22} color="#FFFFFF" strokeWidth={2} />
                </View>
                <View style={[styles.starIcon, { bottom: 40, right: 10 }]}>
                  <Sparkles size={16} color="#FFFFFF" strokeWidth={2} />
                </View>
              </View>

              <View style={styles.textSection}>
                <TypewriterText text="Build Your" style={styles.newHeading} delay={200} isVisible={activeIndex === 0} />
                <View style={styles.newHeadingRow}>
                  <TypewriterText text="Future " style={[styles.cursiveHeading, { color: "#00E676" }]} delay={600} isVisible={activeIndex === 0} />
                  <TypewriterText text="Skills" style={styles.newHeading} delay={900} isVisible={activeIndex === 0} />
                </View>
                <MotiView
                  animate={{ opacity: activeIndex === 0 ? 1 : 0, translateY: activeIndex === 0 ? 0 : 10 }}
                  transition={{ type: 'timing', duration: 400, delay: activeIndex === 0 ? 1200 : 0 }}
                >
                  <Text style={styles.newSubtitle}>
                    Master in-demand skills with expert-led{"\n"}courses tailored
                    for your career growth.
                  </Text>
                </MotiView>
              </View>
            </View>
          </View>

          {/* SLIDE 3: Mentors (Pink/Blue) */}
          {/* @ts-ignore */}
          <View
            style={[
              styles.slideContainer,
              { scrollSnapAlign: "center", scrollSnapStop: "always" },
            ]}
          >
            <View style={styles.newContent}>
              <View style={styles.blobArea}>
                <MotiView
                  from={{ opacity: 0, scale: 0.5, translateY: 20 }}
                  animate={{ opacity: 1, scale: 1, translateY: 0 }}
                  transition={{
                    delay: 100,
                    type: "spring",
                    damping: 20,
                    stiffness: 90,
                  }}
                >
                  <Animated.View style={blob2Style}>
                    <WebAwareSkiaBlob colors={['#FF4081', '#1a1a1a', '#FCE4EC']} />
                  </Animated.View>
                </MotiView>

                <FloatingBadge
                  label="Guide"
                  bgColor="#333"
                  textColor="#FFF"
                  top={10}
                  right={50}
                  rotate="-10deg"
                  delay={400}
                  isVisible={activeIndex === 1}
                />
                <FloatingBadge
                  label="Connect"
                  bgColor="#FCE4EC"
                  textColor="#000"
                  bottom={50}
                  left={0}
                  rotate="15deg"
                  delay={500}
                  isVisible={activeIndex === 1}
                />
                <FloatingBadge
                  label="Network"
                  bgColor="#D7FE03"
                  textColor="#000"
                  top={60}
                  left={10}
                  rotate="10deg"
                  delay={600}
                  isVisible={activeIndex === 1}
                />
                <FloatingBadge
                  label="Inspire"
                  bgColor="#E0F2F1"
                  textColor="#000"
                  bottom={10}
                  right={10}
                  rotate="-5deg"
                  delay={700}
                  isVisible={activeIndex === 1}
                />
                <View style={[styles.starIcon, { top: 0, left: 10 }]}>
                  <Sparkles size={32} color="#FFFFFF" strokeWidth={2} />
                </View>
                <View style={[styles.starIcon, { bottom: 10, right: 30 }]}>
                  <Sparkles size={22} color="#FFFFFF" strokeWidth={2} />
                </View>
              </View>

              <View style={styles.textSection}>
                <TypewriterText text="Learn And" style={styles.newHeading} delay={200} isVisible={activeIndex === 1} />
                <View style={styles.newHeadingRow}>
                  <TypewriterText text="Empower " style={[styles.cursiveHeading, { color: "#FF4081" }]} delay={600} isVisible={activeIndex === 1} />
                  <TypewriterText text="Yourself" style={styles.newHeading} delay={950} isVisible={activeIndex === 1} />
                </View>
                <MotiView
                  animate={{ opacity: activeIndex === 1 ? 1 : 0, translateY: activeIndex === 1 ? 0 : 10 }}
                  transition={{ type: 'timing', duration: 400, delay: activeIndex === 1 ? 1300 : 0 }}
                >
                  <Text style={styles.newSubtitle}>
                    Get 1-on-1 guidance from industry leaders{"\n"}and accelerate
                    your professional journey.
                  </Text>
                </MotiView>
              </View>
            </View>
          </View>

          {/* SLIDE 4: Jobs (Orange/Lime) */}
          {/* @ts-ignore */}
          <View
            style={[
              styles.slideContainer,
              { scrollSnapAlign: "center", scrollSnapStop: "always" },
            ]}
          >
            <View style={styles.newContent}>
              <View style={styles.blobArea}>
                <MotiView
                  from={{ opacity: 0, scale: 0.5, translateY: 20 }}
                  animate={{ opacity: 1, scale: 1, translateY: 0 }}
                  transition={{
                    delay: 100,
                    type: "spring",
                    damping: 20,
                    stiffness: 90,
                  }}
                >
                  <Animated.View style={blob3Style}>
                    <WebAwareSkiaBlob colors={['#FF7043', '#1a1a1a', '#FFCCBC']} />
                  </Animated.View>
                </MotiView>

                <FloatingBadge
                  label="Apply"
                  bgColor="#333"
                  textColor="#FFF"
                  top={40}
                  right={20}
                  rotate="20deg"
                  delay={400}
                  isVisible={activeIndex === 2}
                />
                <FloatingBadge
                  label="Hired"
                  bgColor="#FFCCBC"
                  textColor="#000"
                  bottom={60}
                  left={-10}
                  rotate="-20deg"
                  delay={500}
                  isVisible={activeIndex === 2}
                />
                <FloatingBadge
                  label="Interview"
                  bgColor="#E0F2F1"
                  textColor="#000"
                  top={10}
                  left={30}
                  rotate="-10deg"
                  delay={600}
                  isVisible={activeIndex === 2}
                />
                <FloatingBadge
                  label="Offer"
                  bgColor="#D7FE03"
                  textColor="#000"
                  bottom={20}
                  right={40}
                  rotate="15deg"
                  delay={700}
                  isVisible={activeIndex === 2}
                />
                <View style={[styles.starIcon, { top: -20, left: 80 }]}>
                  <Sparkles size={32} color="#FFFFFF" strokeWidth={2} />
                </View>
                <View style={[styles.starIcon, { bottom: -20, right: 60 }]}>
                  <Sparkles size={22} color="#FFFFFF" strokeWidth={2} />
                </View>
              </View>

              <View style={styles.textSection}>
                <TypewriterText text="Stay" style={styles.newHeading} delay={200} isVisible={activeIndex === 2} />
                <View style={styles.newHeadingRow}>
                  <TypewriterText text="Motivated " style={[styles.cursiveHeading, { color: "#FF7043" }]} delay={400} isVisible={activeIndex === 2} />
                </View>
                <MotiView
                  animate={{ opacity: activeIndex === 2 ? 1 : 0, translateY: activeIndex === 2 ? 0 : 10 }}
                  transition={{ type: 'timing', duration: 400, delay: activeIndex === 2 ? 900 : 0 }}
                >
                  <Text style={styles.newSubtitle}>
                    Discover exclusive opportunities and get{"\n"}matched with top
                    companies worldwide.
                  </Text>
                </MotiView>
              </View>
            </View>
          </View>
        </Animated.ScrollView>

        {/* FIXED BOTTOM CONTROLS */}
        <View style={styles.fixedBottomContainer}>
          <View style={styles.bottomContentWrapper}>
            <SwipeButton
              title="Swipe to Start"
              onComplete={() => router.push("/login")}
            />
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: "#FFF" }]}>
                New to the platform?{" "}
                <Text
                  style={[styles.signupLink, { color: "#FFF" }]}
                  onPress={() => router.push("/signup")}
                  accessibilityRole="link"
                  accessibilityLabel="Create a new account"
                >
                  Create an account
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (width: number, theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
    },
    slideContainer: {
      width: width,
      flex: 1,
      backgroundColor: "transparent",
    },
    content: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingTop: 60,
    },
    textStack: {
      position: "relative",
      width: "100%",
      maxWidth: 420, // Constrains brutalist typography block to maintain its shape
      alignSelf: "center",
    },
    hugeText: {
      fontSize: 84,
      fontFamily: theme.fonts.black,
      color: "#FFFFFF",
      lineHeight: 78,
      letterSpacing: 1,
    },
    darkText: {
      color: "#0F0F0F",
    },
    highlightWrapper: {
      position: "relative",
      alignSelf: "flex-start",
      marginTop: 4,
      marginBottom: 4,
    },
    highlightBackground: {
      position: "absolute",
      top: 8,
      bottom: 2,
      left: -8,
      right: -16,
      backgroundColor: "#D7FE03", // Neon lime highlighter
      transform: [{ rotate: "-2deg" }],
    },
    badgeContainer: {
      position: "absolute",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      zIndex: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    badgeText: {
      fontFamily: theme.fonts.bold,
      fontSize: 14,
    },
    decoration: {
      position: "absolute",
      zIndex: 1,
    },
    fixedBottomContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 24, // extra padding for safe area
      paddingTop: 20,
    },
    bottomContentWrapper: {
      width: "100%",
      maxWidth: 400,
    },
    signupContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    signupText: {
      fontSize: 15,
      fontFamily: theme.fonts.medium,
      color: "#FFFFFF",
    },
    signupLink: {
      fontFamily: theme.fonts.bold,
      textDecorationLine: "underline",
    },
    paginationContainer: {
      position: "absolute",
      left: 24,
      flexDirection: "row",
      gap: 8,
      zIndex: 100,
    },
    dot: {
      height: 8,
      borderRadius: 4,
    },
    dotActive: {
      width: 24,
    },
    dotInactive: {
      width: 8,
      backgroundColor: "rgba(255,255,255,0.3)",
    },
    newContent: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 80,
      paddingBottom: 160,
      width: "100%",
      maxWidth: 500,
      alignSelf: "center",
    },
    blobArea: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    starIcon: {
      position: "absolute",
      color: "#FFFFFF",
      fontSize: 24,
      fontFamily: theme.fonts.black,
    },
    textSection: {
      alignItems: "center",
      marginTop: 40,
    },
    newHeading: {
      fontSize: 36,
      fontFamily: theme.fonts.bold,
      color: "#FFFFFF",
    },
    newHeadingRow: {
      flexDirection: "row",
      alignItems: "baseline",
      marginBottom: 16,
    },
    cursiveHeading: {
      fontSize: 48,
      fontFamily:
        Platform.OS === "ios" ? "Snell Roundhand" : "sans-serif-medium",
      fontStyle: "italic",
    },
    newSubtitle: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: "#C4C4C4",
      textAlign: "center",
      lineHeight: 22,
    },
  });

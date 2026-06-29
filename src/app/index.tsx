import { AppFonts } from "@/constants/theme";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, runOnJS } from "react-native-reanimated";
import { SwipeButton } from "../components/SwipeButton";

const { width } = Dimensions.get("window");

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
  const styles = createStyles();
  return (
    <MotiView
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.9, 
        translateY: isVisible ? 0 : 15,
        rotate: isVisible ? rotate : "0deg" 
      }}
      transition={{ type: "timing", duration: 400, delay: isVisible ? delay / 2 : 0 }}
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
  const styles = createStyles();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const lastIndex = useSharedValue(0);

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
    const rotate = interpolate(scrollX.value, [0, width, width * 2], [60, 0, -60], "clamp");
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  const blob2Style = useAnimatedStyle(() => {
    const rotate = interpolate(scrollX.value, [width, width * 2, width * 3], [60, 0, -60], "clamp");
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  const blob3Style = useAnimatedStyle(() => {
    const rotate = interpolate(scrollX.value, [width * 2, width * 3, width * 4], [60, 0, -60], "clamp");
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  return (
    <View style={styles.container}>
      {/* Dynamic Background Transition */}
      <MotiView
        style={StyleSheet.absoluteFillObject}
        animate={{
          backgroundColor: activeIndex === 0 ? "#7C5DF9" : "#000000",
        }}
        transition={{ type: "timing", duration: 400 }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Persistent Pagination Indicators Overlay - Top Left */}
        <View style={[styles.paginationContainer, { top: 20 }]}>
          <View
            style={[
              styles.dot,
              activeIndex === 0
                ? [styles.dotActive, { backgroundColor: "#FFFFFF" }]
                : styles.dotInactive,
            ]}
          />
          <View
            style={[
              styles.dot,
              activeIndex === 1
                ? [styles.dotActive, { backgroundColor: "#00E676" }]
                : styles.dotInactive,
            ]}
          />
          <View
            style={[
              styles.dot,
              activeIndex === 2
                ? [styles.dotActive, { backgroundColor: "#FF4081" }]
                : styles.dotInactive,
            ]}
          />
          <View
            style={[
              styles.dot,
              activeIndex === 3
                ? [styles.dotActive, { backgroundColor: "#FF7043" }]
                : styles.dotInactive,
            ]}
          />
        </View>

        <Animated.ScrollView
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
          {/* SLIDE 1 */}
          {/* @ts-ignore */}
          <View
            style={[
              styles.slideContainer,
              { scrollSnapAlign: "center", scrollSnapStop: "always" },
            ]}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                overflow: "hidden",
                paddingBottom: 120,
              }}
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.content}>
                <View style={styles.textStack}>
                  <FloatingBadge
                    label="Learning"
                    bgColor="#D7FE03"
                    textColor="#1A1A1A"
                    top={-30}
                    right={20}
                    rotate="15deg"
                    delay={200}
                    isVisible={activeIndex === 0}
                  />
                  <MotiView
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: 100 }}
                  >
                    <Text style={styles.hugeText}>Build,</Text>
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: 200 }}
                    style={{ position: "relative" }}
                  >
                    <Text style={styles.hugeText}>prep,</Text>
                    <MotiView
                      from={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 600 }}
                      style={[
                        styles.decoration,
                        {
                          top: -20,
                          right: -40,
                          transform: [{ rotate: "15deg" }],
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 90,
                          color: "#F785C0",
                          fontWeight: "100",
                        }}
                      >
                        ✿
                      </Text>
                    </MotiView>
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 300 }}
                    style={styles.highlightWrapper}
                  >
                    <View style={styles.highlightBackground} />
                    <Text style={[styles.hugeText, styles.darkText]}>
                      succeed.
                    </Text>
                    <FloatingBadge
                      label="Jobs"
                      bgColor="#3544D1"
                      textColor="#FFFFFF"
                      top={40}
                      right={-30}
                      rotate="-15deg"
                      delay={300}
                      isVisible={activeIndex === 0}
                    />
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: 400 }}
                    style={{ position: "relative" }}
                  >
                    <Text style={[styles.hugeText, { marginLeft: 100 }]}>
                      Own
                    </Text>
                    <MotiView
                      from={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 700 }}
                      style={[styles.decoration, { top: -10, left: 10 }]}
                    >
                      <Text
                        style={{
                          fontSize: 80,
                          color: "#D7FE03",
                          fontWeight: "200",
                        }}
                      >
                        ✴
                      </Text>
                    </MotiView>
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: 500 }}
                    style={{ position: "relative" }}
                  >
                    <Text style={styles.hugeText}>your</Text>
                    <FloatingBadge
                      label="Career Path"
                      bgColor="#1A1A1A"
                      textColor="#FFFFFF"
                      top={10}
                      right={-10}
                      rotate="-5deg"
                      delay={400}
                      isVisible={activeIndex === 0}
                    />
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: 600 }}
                    style={{ position: "relative" }}
                  >
                    <Text style={styles.hugeText}>career</Text>
                    <FloatingBadge
                      label="Master Profile"
                      bgColor="#D7FE03"
                      textColor="#1A1A1A"
                      top={30}
                      right={0}
                      rotate="-15deg"
                      delay={500}
                      isVisible={activeIndex === 0}
                    />
                  </MotiView>
                  <MotiView
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: 700 }}
                    style={{ position: "relative" }}
                  >
                    <Text style={styles.hugeText}>journey.</Text>
                    <MotiView
                      from={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 800 }}
                      style={[styles.decoration, { bottom: -40, right: 20 }]}
                    >
                      <Svg width="56" height="56" viewBox="0 0 32 32">
                        <Path
                          fill="#FFFFFF"
                          d="m29.707 24.293c-.391-.391-1.023-.391-1.414 0l-2.293 2.293v-1.586c0-6.182-2.22-13.214-8.141-15.341-2.377-4.431-8.217-7.659-14.859-7.659-.552 0-1 .447-1 1s.448 1 1 1c4.983 0 9.545 2.091 12.032 5.064-4.049-.328-6.032 2.34-6.032 4.936 0 2.757 2.243 5 5 5 2.673 0 5.655-2.228 4.831-6.607 3.73 2.473 5.169 7.832 5.169 12.607v1.586l-2.293-2.293c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l4 4c.391.391 1.023.391 1.414 0l4-4c.391-.391.391-1.023 0-1.414zm-15.707-7.293c-1.654 0-3-1.346-3-3 0-1.639 1.292-3.788 5.428-2.688 1.483 3.518-.208 5.688-2.428 5.688z"
                        />
                      </Svg>
                    </MotiView>
                  </MotiView>
                </View>
              </View>
            </ScrollView>
          </View>

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
                  transition={{ delay: 100, type: "spring", damping: 20, stiffness: 90 }}
                >
                  <Animated.View style={blob1Style}>
                    <Image
                      source={require("../../assets/images/learning_3d_blob.png")}
                      style={{ width: 280, height: 280, borderRadius: 140 }}
                      resizeMode="cover"
                    />
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
                  isVisible={activeIndex === 1}
                />
                <FloatingBadge
                  label="Grow"
                  bgColor="#E0F2F1"
                  textColor="#000"
                  bottom={20}
                  left={20}
                  rotate="-15deg"
                  delay={500}
                  isVisible={activeIndex === 1}
                />
                <Text style={[styles.starIcon, { top: 10, left: 20 }]}>✦</Text>
                <Text
                  style={[
                    styles.starIcon,
                    { bottom: 40, right: 10, fontSize: 16 },
                  ]}
                >
                  ✦
                </Text>
              </View>

              <View style={styles.textSection}>
                <Text style={styles.newHeading}>Build Your</Text>
                <Text style={styles.newHeadingRow}>
                  <Text style={[styles.cursiveHeading, { color: "#00E676" }]}>
                    Future{" "}
                  </Text>
                  <Text style={styles.newHeading}>Skills</Text>
                </Text>
                <Text style={styles.newSubtitle}>
                  Master in-demand skills with expert-led{"\n"}courses tailored
                  for your career growth.
                </Text>
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
                  transition={{ delay: 100, type: "spring", damping: 20, stiffness: 90 }}
                >
                  <Animated.View style={blob2Style}>
                    <Image
                      source={require("../../assets/images/mentor_3d_blob.png")}
                      style={{ width: 280, height: 280, borderRadius: 140 }}
                      resizeMode="cover"
                    />
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
                  isVisible={activeIndex === 2}
                />
                <FloatingBadge
                  label="Connect"
                  bgColor="#FCE4EC"
                  textColor="#000"
                  bottom={50}
                  left={0}
                  rotate="15deg"
                  delay={500}
                  isVisible={activeIndex === 2}
                />
                <Text
                  style={[styles.starIcon, { top: 0, left: 10, fontSize: 32 }]}
                >
                  ✦
                </Text>
                <Text style={[styles.starIcon, { bottom: 10, right: 30 }]}>
                  ✦
                </Text>
              </View>

              <View style={styles.textSection}>
                <Text style={styles.newHeading}>Learn And</Text>
                <Text style={styles.newHeadingRow}>
                  <Text style={[styles.cursiveHeading, { color: "#FF4081" }]}>
                    Empower{" "}
                  </Text>
                  <Text style={styles.newHeading}>Yourself</Text>
                </Text>
                <Text style={styles.newSubtitle}>
                  Get 1-on-1 guidance from industry leaders{"\n"}and accelerate
                  your professional journey.
                </Text>
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
                  transition={{ delay: 100, type: "spring", damping: 20, stiffness: 90 }}
                >
                  <Animated.View style={blob3Style}>
                    <Image
                      source={require("../../assets/images/jobs_3d_blob.png")}
                      style={{ width: 280, height: 280, borderRadius: 140 }}
                      resizeMode="cover"
                    />
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
                  isVisible={activeIndex === 3}
                />
                <FloatingBadge
                  label="Hired"
                  bgColor="#FFCCBC"
                  textColor="#000"
                  bottom={60}
                  left={-10}
                  rotate="-20deg"
                  delay={500}
                  isVisible={activeIndex === 3}
                />
                <Text
                  style={[
                    styles.starIcon,
                    { top: -20, left: 80, fontSize: 32 },
                  ]}
                >
                  ✦
                </Text>
                <Text style={[styles.starIcon, { bottom: -20, right: 60 }]}>
                  ✦
                </Text>
              </View>

              <View style={styles.textSection}>
                <Text style={styles.newHeading}>Stay</Text>
                <Text style={styles.newHeadingRow}>
                  <Text style={[styles.cursiveHeading, { color: "#FF7043" }]}>
                    Motivated{" "}
                  </Text>
                </Text>
                <Text style={styles.newSubtitle}>
                  Discover exclusive opportunities and get{"\n"}matched with top
                  companies worldwide.
                </Text>
              </View>
            </View>
          </View>
        </Animated.ScrollView>

        {/* FIXED BOTTOM CONTROLS */}
        <View style={styles.fixedBottomContainer}>
          <SwipeButton
            title="Swipe to Start"
            onComplete={() => router.push("/login")}
          />
          <View style={styles.signupContainer}>
            <Text
              style={[
                styles.signupText,
                { color: activeIndex === 0 ? "#FFFFFF" : "#FFF" },
              ]}
            >
              New to the platform?{" "}
              <Text
                style={[
                  styles.signupLink,
                  { color: activeIndex === 0 ? "#FFFFFF" : "#FFF" },
                ]}
                onPress={() => router.push("/signup")}
              >
                Create an account
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const createStyles = () =>
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
    },
    hugeText: {
      fontSize: 84,
      fontFamily: AppFonts.urbanist.black,
      color: "#FFFFFF",
      lineHeight: 78,
      letterSpacing: 1,
    },
    darkText: {
      color: "#000000",
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
      fontFamily: AppFonts.urbanist.bold,
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
      paddingHorizontal: 16,
      paddingBottom: 24, // extra padding for safe area
      paddingTop: 20,
    },
    signupContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    signupText: {
      fontSize: 15,
      fontFamily: AppFonts.urbanist.medium,
      color: "#FFFFFF",
    },
    signupLink: {
      fontFamily: AppFonts.urbanist.bold,
      textDecorationLine: "underline",
    },
    paginationContainer: {
      position: "absolute",
      left: 24,
      flexDirection: "row",
      gap: 8,
      zIndex: 100,
      pointerEvents: "none",
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
      fontFamily: AppFonts.urbanist.black,
    },
    textSection: {
      alignItems: "center",
      marginTop: 40,
    },
    newHeading: {
      fontSize: 36,
      fontFamily: AppFonts.urbanist.bold,
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
      fontFamily: AppFonts.urbanist.regular,
      color: "#A0A0A0",
      textAlign: "center",
      lineHeight: 22,
    },
  });

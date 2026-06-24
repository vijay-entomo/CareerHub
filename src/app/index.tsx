import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { AppFonts } from "@/constants/theme";
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
}) => {
  const styles = createStyles();
  return (
    <MotiView
      from={{ opacity: 0, scale: 0, rotate: "0deg" }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ type: "spring", delay, damping: 15 }}
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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      {/* Dynamic Background Transition */}
      <MotiView
        style={StyleSheet.absoluteFillObject}
        animate={{ backgroundColor: activeIndex === 0 ? "#7C5DF9" : "#FAF8F5" }}
        transition={{ type: "timing", duration: 400 }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Persistent Pagination Indicators Overlay - Top Left */}
        <View style={[styles.paginationContainer, { top: 20 }]}>
          <View style={[styles.dot, activeIndex === 0 ? styles.dotActive : styles.dotInactive]} />
          <View style={[styles.dot, activeIndex === 1 ? styles.dotActive : styles.dotInactive]} />
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {/* SLIDE 1 */}
          <View style={styles.slideContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, overflow: "hidden", paddingBottom: 120 }} bounces={false} showsVerticalScrollIndicator={false}>
              <View style={styles.content}>
                <View style={styles.textStack}>
                  <FloatingBadge label="Learning" bgColor="#D7FE03" textColor="#1A1A1A" top={-30} right={20} rotate="15deg" delay={200} />
                  <MotiView from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 100 }}>
                    <Text style={styles.hugeText}>Build,</Text>
                  </MotiView>
                  <MotiView from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 200 }} style={{ position: "relative" }}>
                    <Text style={styles.hugeText}>prep,</Text>
                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 600 }} style={[styles.decoration, { top: -20, right: -40, transform: [{ rotate: "15deg" }] }]}>
                      <Text style={{ fontSize: 90, color: "#F785C0", fontWeight: "100" }}>✿</Text>
                    </MotiView>
                  </MotiView>
                  <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 300 }} style={styles.highlightWrapper}>
                    <View style={styles.highlightBackground} />
                    <Text style={[styles.hugeText, styles.darkText]}>succeed.</Text>
                    <FloatingBadge label="Jobs" bgColor="#3544D1" textColor="#FFFFFF" top={40} right={-30} rotate="-15deg" delay={300} />
                  </MotiView>
                  <MotiView from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 400 }} style={{ position: "relative" }}>
                    <Text style={[styles.hugeText, { marginLeft: 100 }]}>Own</Text>
                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 700 }} style={[styles.decoration, { top: -10, left: 10 }]}>
                      <Text style={{ fontSize: 80, color: "#D7FE03", fontWeight: "200" }}>✴</Text>
                    </MotiView>
                  </MotiView>
                  <MotiView from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 500 }} style={{ position: "relative" }}>
                    <Text style={styles.hugeText}>your</Text>
                    <FloatingBadge label="Career Path" bgColor="#1A1A1A" textColor="#FFFFFF" top={10} right={-10} rotate="-5deg" delay={400} />
                  </MotiView>
                  <MotiView from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 600 }} style={{ position: "relative" }}>
                    <Text style={styles.hugeText}>career</Text>
                    <FloatingBadge label="Master Profile" bgColor="#D7FE03" textColor="#1A1A1A" top={30} right={0} rotate="-15deg" delay={500} />
                  </MotiView>
                  <MotiView from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 700 }} style={{ position: "relative" }}>
                    <Text style={styles.hugeText}>journey.</Text>
                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 800 }} style={[styles.decoration, { bottom: -40, right: 20 }]}>
                      <Svg width="56" height="56" viewBox="0 0 32 32">
                        <Path fill="#FFFFFF" d="m29.707 24.293c-.391-.391-1.023-.391-1.414 0l-2.293 2.293v-1.586c0-6.182-2.22-13.214-8.141-15.341-2.377-4.431-8.217-7.659-14.859-7.659-.552 0-1 .447-1 1s.448 1 1 1c4.983 0 9.545 2.091 12.032 5.064-4.049-.328-6.032 2.34-6.032 4.936 0 2.757 2.243 5 5 5 2.673 0 5.655-2.228 4.831-6.607 3.73 2.473 5.169 7.832 5.169 12.607v1.586l-2.293-2.293c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l4 4c.391.391 1.023.391 1.414 0l4-4c.391-.391.391-1.023 0-1.414zm-15.707-7.293c-1.654 0-3-1.346-3-3 0-1.639 1.292-3.788 5.428-2.688 1.483 3.518-.208 5.688-2.428 5.688z" />
                      </Svg>
                    </MotiView>
                  </MotiView>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* SLIDE 2: Immersion Collage */}
          <View style={styles.slideContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }} bounces={false} showsVerticalScrollIndicator={false}>
              <View style={[styles.content, { justifyContent: "flex-start", paddingTop: 60, paddingHorizontal: 20 }]}>
                <Text style={{ fontSize: 56, fontFamily: AppFonts.urbanist.black, color: "#0A2B1D", lineHeight: 56, letterSpacing: -1 }}>
                  Immersion{"\n"}en <Text style={{ color: "#FFB8D2" }}>3</Text> langues
                </Text>

                <View style={{ height: 600, width: "100%", position: "relative", marginTop: 20 }}>
                  {/* Maternelle Circle */}
                  <MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 200, type: "spring" }} style={{ position: "absolute", top: 40, left: 0, width: 150, height: 150, borderRadius: 75, backgroundColor: "#FFD6E8", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontFamily: AppFonts.urbanist.bold, color: "#0A2B1D", fontSize: 16, transform: [{ rotate: "-15deg" }] }}>Maternelle</Text>
                  </MotiView>

                  {/* Photo 1 */}
                  <MotiView from={{ opacity: 0, rotate: "0deg" }} animate={{ opacity: 1, rotate: "15deg" }} transition={{ delay: 300, type: "spring" }} style={{ position: "absolute", top: 0, left: 160, width: 140, height: 140, borderRadius: 16, overflow: "hidden", backgroundColor: "#E5E5E5" }}>
                    <Image source={{ uri: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop" }} style={{ width: "100%", height: "100%" }} />
                  </MotiView>

                  {/* Peach Cross */}
                  <MotiView from={{ scale: 0, rotate: "-45deg" }} animate={{ scale: 1, rotate: "15deg" }} transition={{ delay: 400, type: "spring" }} style={{ position: "absolute", top: 40, right: 0, width: 80, height: 80 }}>
                    <View style={{ position: "absolute", top: 25, left: 0, width: 80, height: 30, backgroundColor: "#FFB28B" }} />
                    <View style={{ position: "absolute", top: 0, left: 25, width: 30, height: 80, backgroundColor: "#FFB28B" }} />
                  </MotiView>

                  {/* Photo 2 */}
                  <MotiView from={{ opacity: 0, rotate: "0deg" }} animate={{ opacity: 1, rotate: "-5deg" }} transition={{ delay: 500, type: "spring" }} style={{ position: "absolute", top: 180, right: 10, width: 140, height: 170, borderRadius: 16, overflow: "hidden", backgroundColor: "#E5E5E5" }}>
                    <Image source={{ uri: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=500&auto=format&fit=crop" }} style={{ width: "100%", height: "100%" }} />
                  </MotiView>

                  {/* Primaire Starburst */}
                  <MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 600, type: "spring" }} style={{ position: "absolute", top: 240, left: -10, width: 160, height: 160, justifyContent: "center", alignItems: "center" }}>
                     <Svg width="160" height="160" viewBox="0 0 100 100">
                       <Path d="M50 5 L58 38 L95 25 L68 50 L95 75 L58 62 L50 95 L42 62 L5 75 L32 50 L5 25 L42 38 Z" fill="#FFB28B" />
                     </Svg>
                     <Text style={{ position: "absolute", fontFamily: AppFonts.urbanist.bold, color: "#0A2B1D", fontSize: 16 }}>Primaire</Text>
                  </MotiView>

                  {/* Photo 3 */}
                  <MotiView from={{ opacity: 0, rotate: "0deg" }} animate={{ opacity: 1, rotate: "20deg" }} transition={{ delay: 700, type: "spring" }} style={{ position: "absolute", bottom: 40, left: 80, width: 150, height: 140, borderRadius: 16, overflow: "hidden", backgroundColor: "#E5E5E5" }}>
                    <Image source={{ uri: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=500&auto=format&fit=crop" }} style={{ width: "100%", height: "100%" }} />
                  </MotiView>

                  {/* Garderie Cloud Blob */}
                  <MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 800, type: "spring" }} style={{ position: "absolute", bottom: 180, right: -10, width: 140, height: 140, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ position: "absolute", backgroundColor: "#FFD6E8", width: 80, height: 80, borderRadius: 40, top: 10, left: 30 }} />
                    <View style={{ position: "absolute", backgroundColor: "#FFD6E8", width: 80, height: 80, borderRadius: 40, bottom: 10, left: 30 }} />
                    <View style={{ position: "absolute", backgroundColor: "#FFD6E8", width: 80, height: 80, borderRadius: 40, top: 30, left: 10 }} />
                    <View style={{ position: "absolute", backgroundColor: "#FFD6E8", width: 80, height: 80, borderRadius: 40, top: 30, right: 10 }} />
                    <View style={{ position: "absolute", backgroundColor: "#FFD6E8", width: 80, height: 80, top: 30, left: 30 }} />
                    <Text style={{ fontFamily: AppFonts.urbanist.bold, color: "#0A2B1D", fontSize: 16, zIndex: 10, transform: [{ rotate: "-15deg" }] }}>Garderie</Text>
                  </MotiView>
                  
                  {/* Bottom Right Decoration Pill */}
                  <MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 900, type: "spring" }} style={{ position: "absolute", bottom: 0, right: -20, width: 100, height: 60, borderRadius: 30, backgroundColor: "#FFD6E8" }} />
                </View>
              </View>
            </ScrollView>
          </View>
        </ScrollView>

        {/* FIXED BOTTOM CONTROLS */}
        <View style={styles.fixedBottomContainer}>
          <SwipeButton title="Swipe to Start" onComplete={() => router.push("/login")} />
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: activeIndex === 0 ? "#FFFFFF" : "#0A2B1D" }]}>
              New to the platform?{" "}
              <Text style={[styles.signupLink, { color: activeIndex === 0 ? "#FFFFFF" : "#0A2B1D" }]} onPress={() => router.push("/signup")}>
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
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    dotInactive: {
      width: 8,
      backgroundColor: "rgba(0,0,0,0.2)",
    },
  });

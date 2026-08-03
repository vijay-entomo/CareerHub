import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Tabs } from "expo-router";
import { Home, Compass, BookOpen, Menu } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView, AnimatePresence } from "moti";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/use-theme";
import { AutoContrastText, AutoContrastIcon } from "@/components/AutoContrast";

const PILL_SPRING = { damping: 20, stiffness: 220, mass: 0.85 };

function CustomTabBar({ state, descriptors, navigation }: any) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const [layouts, setLayouts] = useState<
    Record<number, { x: number; width: number }>
  >({});
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);
  const indicatorStretch = useSharedValue(1);
  const prevIndexRef = useRef(state.index);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const s = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const h = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    let onFocusIn: ((e: any) => void) | undefined;
    let onFocusOut: (() => void) | undefined;
    if (Platform.OS === "web" && typeof window !== "undefined") {
      onFocusIn = (e: any) => {
        const tag = e.target?.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea") setKeyboardVisible(true);
      };
      onFocusOut = () => setKeyboardVisible(false);
      window.addEventListener("focusin", onFocusIn);
      window.addEventListener("focusout", onFocusOut);
    }

    return () => {
      s.remove();
      h.remove();
      if (Platform.OS === "web" && typeof window !== "undefined") {
        if (onFocusIn) window.removeEventListener("focusin", onFocusIn);
        if (onFocusOut) window.removeEventListener("focusout", onFocusOut);
      }
    };
  }, []);

  useEffect(() => {
    const layout = layouts[state.index];
    if (!layout || layout.width <= 0) return;

    const prev = prevIndexRef.current;
    prevIndexRef.current = state.index;

    const distance = Math.abs(state.index - prev);
    if (distance > 0) {
      const stretch = 1 + Math.min(0.16, distance * 0.07);
      indicatorStretch.value = withSequence(
        withTiming(stretch, { duration: 130 }),
        withSpring(1, PILL_SPRING),
      );
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.selectionAsync().catch(() => {});
      }
    }

    indicatorX.value = withSpring(layout.x, PILL_SPRING);
    indicatorW.value = withSpring(layout.width, PILL_SPRING);
  }, [state.index, layouts]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    left: indicatorX.value,
    width: indicatorW.value,
    transform: [{ scaleX: indicatorStretch.value }],
  }));

  const rimColor =
    theme.mode === "dark" ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.9)";
  const rimInnerColor =
    theme.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.6)";

  return (
    <MotiView
      style={styles.tabBarContainer}
      animate={{
        translateY: isKeyboardVisible ? 120 : 0,
        opacity: isKeyboardVisible ? 0 : 1,
      }}
      transition={{ type: "timing", duration: 250 }}
      pointerEvents={isKeyboardVisible ? "none" : "auto"}
    >
      <View
        style={[
          styles.shadowWrapper,
          { paddingBottom: Platform.OS === "ios" ? insets.bottom : 20 },
        ]}
      >
        {/* Outer bright rim (the "glass edge") */}
        <View style={[styles.outerRim, { borderColor: rimColor }]}>
          <BlurView
            intensity={theme.mode === "dark" ? 60 : 95}
            tint={theme.mode === "dark" ? "dark" : "light"}
            experimentalBlurMethod={
              Platform.OS === "android" ? "dimezisBlurView" : undefined
            }
            style={styles.tabBarWrapper}
          >
            {/* Inner 1px rim for double-edge glass look */}
            <View
              style={[styles.innerRim, { borderColor: rimInnerColor }]}
              pointerEvents="none"
            />

            {/* Specular top highlight */}
            <LinearGradient
              colors={
                theme.mode === "dark"
                  ? ["rgba(255,255,255,0.15)", "rgba(255,255,255,0)"]
                  : ["rgba(255,255,255,0.55)", "rgba(255,255,255,0)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.specularHighlight}
              pointerEvents="none"
            />

            <View style={styles.tabBar}>
              {/* Sliding pill (solid accent, with squash/stretch) */}
              <Animated.View style={[styles.slidingPill, animatedIndicatorStyle]}>
                {/* Inner sheen on the pill for depth */}
                <LinearGradient
                  colors={["rgba(255,255,255,0.35)", "rgba(255,255,255,0)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                />
              </Animated.View>

              {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const label =
                  options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                      ? options.title
                      : route.name;

                const isFocused = state.index === index;

                let Icon = Home;
                if (route.name === "career") Icon = Compass;
                if (route.name === "learn") Icon = BookOpen;
                if (route.name === "more") Icon = Menu;

                const onPress = () => {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                };

                const onLongPress = () => {
                  navigation.emit({ type: "tabLongPress", target: route.key });
                };

                return (
                  <Pressable
                    key={route.key}
                    accessibilityRole="button"
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel ?? String(label)}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    hitSlop={6}
                    onLayout={(e) => {
                      const { x, width } = e.nativeEvent.layout;
                      setLayouts((prev) => {
                        if (prev[index]?.x === x && prev[index]?.width === width)
                          return prev;
                        return { ...prev, [index]: { x, width } };
                      });
                    }}
                    style={{ zIndex: 1 }}
                  >
                    <MotiView
                      animate={{ paddingHorizontal: isFocused ? 18 : 14 }}
                      transition={{ type: "timing", duration: 220 }}
                      style={styles.tabItem}
                    >
                      {isFocused ? (
                        <AutoContrastIcon
                          Icon={Icon}
                          bgColor={theme.primary}
                          size={22}
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Icon
                          size={22}
                          color={theme.textSecondary}
                          strokeWidth={2}
                        />
                      )}

                      <AnimatePresence>
                        {isFocused && (
                          <MotiView
                            key="label"
                            from={{ opacity: 0, width: 0, marginLeft: 0 }}
                            animate={{
                              opacity: 1,
                              width: String(label).length * 8 + 6,
                              marginLeft: 8,
                            }}
                            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                            transition={{ type: "timing", duration: 220 }}
                            style={{ overflow: "hidden" }}
                          >
                            <AutoContrastText
                              bgColor={theme.primary}
                              style={styles.activeTabText}
                              numberOfLines={1}
                            >
                              {label}
                            </AutoContrastText>
                          </MotiView>
                        )}
                      </AnimatePresence>
                    </MotiView>
                  </Pressable>
                );
              })}
            </View>
          </BlurView>
        </View>
      </View>
    </MotiView>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="career" options={{ title: "Career Pathways" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="more" options={{ title: "More" }} />
    </Tabs>
  );
}

const BAR_RADIUS = 40;

const createStyles = (theme: any) =>
  StyleSheet.create({
    tabBarContainer: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    shadowWrapper: {
      width: "90%",
      borderRadius: BAR_RADIUS,
    },
    outerRim: {
      borderRadius: BAR_RADIUS,
      borderWidth: 1.5,
      overflow: "hidden",
    },
    tabBarWrapper: {
      width: "100%",
      borderRadius: BAR_RADIUS - 1.5,
      overflow: "hidden",
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(28, 28, 32, 0.5)"
          : "rgba(240, 240, 240, 0.55)",
    },
    innerRim: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: BAR_RADIUS - 1.5,
      borderWidth: 1,
    },
    specularHighlight: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 22,
    },
    tabBar: {
      flexDirection: "row",
      borderRadius: BAR_RADIUS,
      paddingHorizontal: 8,
      paddingVertical: 8,
      justifyContent: "space-between",
      alignItems: "center",
      overflow: "hidden",
    },
    slidingPill: {
      position: "absolute",
      height: 46,
      borderRadius: 30,
      backgroundColor: theme.primary,
      top: 8,
      zIndex: 0,
      overflow: "hidden",
    },
    tabItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 46,
      borderRadius: 30,
      overflow: "hidden",
    },
    activeTabText: {
      fontFamily: theme.fonts.bold,
      fontSize: 14,
    },
  });

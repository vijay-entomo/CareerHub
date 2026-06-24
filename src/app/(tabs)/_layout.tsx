import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PanResponder,
  Dimensions,
  Keyboard,
} from "react-native";
import { Tabs } from "expo-router";
import { Home, Compass, BookOpen, Menu } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView, AnimatePresence } from "moti";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/use-theme";
import { AutoContrastText, AutoContrastIcon } from "@/components/AutoContrast";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const [layouts, setLayouts] = useState<
    Record<number, { x: number; width: number }>
  >({});

  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const { width: screenWidth } = Dimensions.get("window");

  const layoutsRef = React.useRef(layouts);
  const stateRef = React.useRef(state);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardDidShowListener = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    let handleFocusIn: any;
    let handleFocusOut: any;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      handleFocusIn = (e: any) => {
        const tag = e.target?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') {
          setKeyboardVisible(true);
        }
      };
      handleFocusOut = () => {
        setKeyboardVisible(false);
      };
      window.addEventListener('focusin', handleFocusIn);
      window.addEventListener('focusout', handleFocusOut);
    }

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.removeEventListener('focusin', handleFocusIn);
        window.removeEventListener('focusout', handleFocusOut);
      }
    };
  }, []);

  useEffect(() => {
    layoutsRef.current = layouts;
    stateRef.current = state;
  }, [layouts, state]);

  const activeDragIndex = React.useRef(state.index);

  const handleTouch = (pageX: number, isRelease: boolean = false) => {
    const relativeX = pageX - screenWidth * 0.05;
    let closestIndex = stateRef.current.index;
    let minDistance = Infinity;

    for (let i = 0; i < stateRef.current.routes.length; i++) {
      const layout = layoutsRef.current[i];
      if (!layout) continue;
      const tabCenter = layout.x + layout.width / 2;
      const distance = Math.abs(relativeX - tabCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    if (closestIndex !== activeDragIndex.current) {
      activeDragIndex.current = closestIndex;
      // Pre-emptively move the visual pill for instant feedback
      const layout = layoutsRef.current[closestIndex];
      if (layout) {
        indicatorPosition.value = withSpring(layout.x, { damping: 18, stiffness: 200 });
        indicatorWidth.value = withSpring(layout.width, { damping: 18, stiffness: 200 });
      }
    }

    // ONLY perform the heavy navigation operation when the user lifts their finger
    if (isRelease) {
      if (closestIndex !== stateRef.current.index) {
        const route = stateRef.current.routes[closestIndex];
        navigation.navigate(route.name, route.params);
      }
    }
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleTouch(evt.nativeEvent.pageX, false),
      onPanResponderMove: (evt) => handleTouch(evt.nativeEvent.pageX, false),
      onPanResponderRelease: (evt) => handleTouch(evt.nativeEvent.pageX, true),
      onPanResponderTerminate: (evt) => handleTouch(evt.nativeEvent.pageX, true),
    }),
  ).current;

  useEffect(() => {
    activeDragIndex.current = state.index;
    const layout = layouts[state.index];
    if (layout && layout.width > 0) {
      indicatorPosition.value = withSpring(layout.x, {
        damping: 18,
        stiffness: 200,
      });
      indicatorWidth.value = withSpring(layout.width, {
        damping: 18,
        stiffness: 200,
      });
    }
  }, [state.index, layouts]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      left: indicatorPosition.value,
      width: indicatorWidth.value,
    };
  });

  return (
    <View
      style={[
        styles.tabBarContainer,
        { 
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 20,
          display: isKeyboardVisible ? "none" : "flex"
        },
      ]}
    >
      <View style={styles.shadowWrapper}>
        <BlurView intensity={theme.mode === 'dark' ? 30 : 80} tint={theme.mode === 'dark' ? 'dark' : 'light'} style={styles.tabBarWrapper}>
          <View style={styles.tabBar} {...panResponder.panHandlers}>
            {/* True Sliding Pill Indicator */}
            <Animated.View
              style={[styles.slidingPill, animatedIndicatorStyle]}
            />

            {state.routes.map((route: any, index: number) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                    ? options.title
                    : route.name;

              const isFocused = state.index === index;

              // Determine which icon to show based on the route name
              let Icon = Home;
              if (route.name === "career") Icon = Compass;
              if (route.name === "learn") Icon = BookOpen;
              if (route.name === "more") Icon = Menu;

              // Estimate width for smooth text expansion
              const textWidth =
                label === "Career Pathways"
                  ? 110
                  : label === "Learn"
                    ? 42
                    : label === "More"
                      ? 38
                      : 42;

              return (
                <View
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
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
                    animate={{
                      paddingHorizontal: isFocused ? 18 : 14,
                    }}
                    transition={{
                      type: "timing",
                      duration: 250,
                    }}
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
                          from={{ opacity: 0, width: 0, marginLeft: 0 }}
                          animate={{
                            opacity: 1,
                            width: textWidth,
                            marginLeft: 8,
                          }}
                          exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                          transition={{ type: "timing", duration: 250 }}
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
                </View>
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const theme = useTheme();
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

const createStyles = (theme: any) => StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  shadowWrapper: {
    width: "90%",
    borderRadius: 40,
    boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.12)',
  },
  tabBarWrapper: {
    width: "100%",
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: theme.mode === 'dark' ? "rgba(40, 40, 40, 0.4)" : "rgba(255, 255, 255, 0.4)",
    borderWidth: 1.5,
    borderColor: theme.mode === 'dark' ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.8)",
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden", // Clips the bouncing pill so it never causes scrollbars!
  },
  slidingPill: {
    position: "absolute",
    height: 46, // Matches the height of the tabItem below
    borderRadius: 30,
    backgroundColor: theme.primary, // Accent 01
    top: 8, // Matches paddingVertical of tabBar
    zIndex: 0,
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

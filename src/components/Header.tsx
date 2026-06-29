import { useTheme } from "@/hooks/use-theme";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const GlassIconButton = ({ children, onPress, style, scrollY }: any) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme, commonStyles);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    const size = scrollY
      ? interpolate(scrollY.value, [0, 100], [44, 36], "clamp")
      : 44;
    return {
      width: size,
      height: size,
      opacity: opacity.value,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (opacity.value = 0.4)} // Instant dim on press
      onPressOut={() => (opacity.value = withTiming(1, { duration: 150 }))} // Smooth fade back
    >
      <Animated.View style={[styles.glassIconBase, style, animatedStyle]}>
        {Platform.OS === "web" ? (
          <View style={styles.glassIconInner}>{children}</View>
        ) : (
          <BlurView
            intensity={50}
            tint={theme.mode === "dark" ? "dark" : "light"}
            style={styles.glassIconInner}
          >
            {children}
          </BlurView>
        )}
      </Animated.View>
    </Pressable>
  );
};

export const Header = ({
  title,
  showBack = true,
  isTabScreen = false,
  rightComponent,
  scrollY,
  customTitleComponent,
  onBack,
  solidBackgroundColor,
}: {
  title: string;
  showBack?: boolean;
  isTabScreen?: boolean;
  rightComponent?: React.ReactNode;
  scrollY?: SharedValue<number>;
  customTitleComponent?: React.ReactNode;
  onBack?: () => void;
  solidBackgroundColor?: string;
}) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme, commonStyles);
  const router = useRouter();

  const defaultScrollY = useSharedValue(0);
  const activeScrollY = scrollY || defaultScrollY;

  // Animate the physical height of the header from 80 -> 60
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    height: interpolate(activeScrollY.value, [0, 100], [80, 60], "clamp"),
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    fontSize: isTabScreen
      ? interpolate(activeScrollY.value, [0, 100], [32, 20], "clamp")
      : interpolate(activeScrollY.value, [0, 100], [24, 18], "clamp"),
  }));

  // The icon scales itself using scrollY. We pass it down.

  // Animate the glass background properties
  const animatedBlurProps = useAnimatedProps(() => {
    return {
      intensity: interpolate(
        activeScrollY.value,
        [0, 80],
        [0, theme.mode === "dark" ? 30 : 80],
        "clamp",
      ),
    };
  }) as any;

  const headerGlassStyle = useAnimatedStyle(() => {
    const webBlur = interpolate(
      activeScrollY.value,
      [0, 80],
      [0, theme.mode === "dark" ? 8 : 16],
      "clamp",
    );

    return {
      // Hide completely at rest
      opacity: interpolate(activeScrollY.value, [0, 15], [0, 1], "clamp"),
      // @ts-ignore - Pure CSS blur for web
      backdropFilter: Platform.OS === "web" ? `blur(${webBlur}px)` : undefined,
      backgroundColor: solidBackgroundColor
        ? interpolateColor(activeScrollY.value, [0, 80], ["transparent", solidBackgroundColor])
        : theme.mode === "dark"
          ? `rgba(40, 40, 40, ${interpolate(activeScrollY.value, [0, 80], [0, 0.4], "clamp")})`
          : `rgba(255, 255, 255, ${interpolate(activeScrollY.value, [0, 80], [0, 0.4], "clamp")})`,
      borderBottomWidth: solidBackgroundColor ? 0 : 1,
      borderBottomColor: solidBackgroundColor 
        ? "transparent"
        : theme.mode === "dark"
          ? `rgba(255, 255, 255, ${interpolate(activeScrollY.value, [0, 80], [0, 0.15], "clamp")})`
          : `rgba(255, 255, 255, ${interpolate(activeScrollY.value, [0, 80], [0, 0.7], "clamp")})`,
    };
  });

  return (
    <View
      style={[
        styles.fixedHeader,
        { backgroundColor: "transparent", borderBottomWidth: 0 },
      ]}
    >
      {Platform.OS === "web" ? (
        <Animated.View style={[StyleSheet.absoluteFill, headerGlassStyle]} />
      ) : (
        <AnimatedBlurView
          animatedProps={animatedBlurProps}
          tint={theme.mode === "dark" ? "dark" : "light"}
          style={[StyleSheet.absoluteFill, headerGlassStyle]}
        />
      )}
      <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
        <Animated.View style={[styles.headerContent, animatedHeaderStyle]}>
          {/* Left Section: Back Button + Title */}
          <View style={styles.leftSection}>
            {showBack && (
              <GlassIconButton
                onPress={() => {
                  if (onBack) {
                    onBack();
                  } else if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace('/home');
                  }
                }}
                scrollY={activeScrollY}
              >
                <ChevronLeft size={24} color={theme.text} />
              </GlassIconButton>
            )}
            {customTitleComponent ? (
              customTitleComponent
            ) : (
              <Animated.Text
                style={[styles.headerTitle, animatedTitleStyle]}
                numberOfLines={1}
              >
                {title}
              </Animated.Text>
            )}
          </View>

          {/* Right Section: Custom Component or Empty Spacer */}
          <View style={styles.rightSection}>
            {rightComponent || <View style={{ width: 44 }} />}
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const createStyles = (theme: any, commonStyles: any) =>
  StyleSheet.create({
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
    headerContent: {
      flexDirection: "row",
      alignItems: "center", // Guarantees mathematically perfect symmetrical padding top/bottom
      justifyContent: "space-between",
      paddingHorizontal: 20,
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: 12, // Clean spacing between button and title
    },
    rightSection: {
      alignItems: "flex-end",
      justifyContent: "center",
    },
    headerTitle: {
      fontFamily: theme.fonts.medium,
      color: theme.text,
      flexShrink: 1,
    },
    glassIconBase: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 999,
      backgroundColor: "transparent",
    },
    glassIconInner: {
      flex: 1,
      width: "100%",
      height: "100%",
      borderRadius: 999, // Full pill/circle
      alignItems: "center",
      justifyContent: "center",
      
      // 3D Glass Highlight Border (Brighter on top/left, subtle on bottom/right)
      ...commonStyles.liquidGlassBorder,
      
      backgroundColor:
        theme.mode === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.25)",
      overflow: "hidden",
    },
  });

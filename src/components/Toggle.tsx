import React, { useEffect } from "react";
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from "@/hooks/use-theme";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
}

export const Toggle = ({
  value,
  onValueChange,
  activeColor,
  inactiveColor,
}: ToggleProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // Use theme colors if not explicitly overridden
  const resolvedActiveColor = activeColor || theme.primary;
  const resolvedInactiveColor = inactiveColor || theme.backgroundSelected;
  // 1 if active, 0 if inactive
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 120,
      overshootClamping: false,
    });
  }, [value, progress]);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [resolvedInactiveColor, resolvedActiveColor]
    );
    return {
      backgroundColor,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    // Width is 51, padding is 2. Thumb is 27. Total travel = 51 - 27 - 4 = 20
    const translateX = progress.value * 20;
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Pressable 
      onPress={() => onValueChange(!value)} 
      accessible 
      role="switch"
      style={styles.touchTarget}
    >
      <Animated.View style={[styles.track, trackAnimatedStyle]}>
        <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  touchTarget: {
    minHeight: 44, // Pro-Max: Apple HIG minimum touch target
    minWidth: 44,
    justifyContent: "center",
  },
  track: {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    padding: 2,
    justifyContent: "center",
  },
  thumb: {
    width: 27,
    height: 27,
    backgroundColor: theme.background,
    borderRadius: 13.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4, // For Android shadow
  },
});

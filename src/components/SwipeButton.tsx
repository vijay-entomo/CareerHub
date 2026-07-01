import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { AppFonts } from '@/constants/theme';
import { useTheme } from "@/hooks/use-theme";
import { ChevronsRight, Check } from "lucide-react-native";

const BUTTON_HEIGHT = 70;
const THUMB_SIZE = 58;

interface SwipeButtonProps {
  onComplete: () => void;
  title: string;
}

export const SwipeButton = ({ onComplete, title }: SwipeButtonProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const translateX = useSharedValue(0);
  const maxTranslateX = useSharedValue(
    Dimensions.get("window").width - 32 - THUMB_SIZE - 12,
  );
  const [completed, setCompleted] = useState(false);

  const onLayout = (event: any) => {
    maxTranslateX.value = event.nativeEvent.layout.width - THUMB_SIZE - 12;
  };

  const handleComplete = () => {
    if (!completed) {
      setCompleted(true);
      onComplete();

      // Reset the slider after a delay so it's ready if the user navigates back
      setTimeout(() => {
        setCompleted(false);
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      }, 500);
    }
  };

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (completed) return;
      // Constrain translation between 0 and maxTranslateX
      translateX.value = Math.max(
        0,
        Math.min(event.translationX, maxTranslateX.value),
      );
    })
    .onEnd(() => {
      if (completed) return;
      // If pulled more than 80% of the way, snap to end and trigger action
      if (translateX.value > maxTranslateX.value * 0.8) {
        translateX.value = withSpring(maxTranslateX.value, {
          damping: 20,
          stiffness: 200,
        });
        runOnJS(handleComplete)();
      } else {
        // Snap back to start
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => {
    // Avoid division by zero initially
    const maxVal = maxTranslateX.value || 1;
    return {
      opacity: Math.max(0, 1 - (translateX.value / maxVal) * 2),
    };
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.Text style={[styles.text, animatedTextStyle]}>
        {title}
      </Animated.Text>

      <View style={styles.checkContainer}>
        <Check
          size={28}
          color={theme.text}
          strokeWidth={2.5}
        />
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.thumb, animatedThumbStyle]}>
          <ChevronsRight size={28} color={theme.primaryForeground} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: BUTTON_HEIGHT,
      backgroundColor: theme.backgroundElement,
      borderRadius: 999, // Pill shape
      justifyContent: "center",
      paddingHorizontal: 6,
      overflow: "hidden",
    },
    text: {
      fontFamily: theme.fonts.bold,
      fontSize: 18,
      color: theme.text,
      position: "absolute",
      alignSelf: "center",
      zIndex: 1,
    },
    checkContainer: {
      position: "absolute",
      right: 6,
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 2,
      backgroundColor: theme.backgroundElement,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 0,
    },
    thumb: {
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      backgroundColor: theme.primary,
      borderRadius: THUMB_SIZE / 2,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  });

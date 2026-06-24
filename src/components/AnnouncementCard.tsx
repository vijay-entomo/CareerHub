import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Heart } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/use-theme";

export type AnnouncementType = {
  id: string;
  category: string;
  date: { day: string; month: string };
  title: string;
  desc: string;
  images: string[];
  likes: number;
  actionText: string;
};

const Sparkle = ({ angle, active }: { angle: number; active: boolean }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (active) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progress.value = 0;
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    const distance = 24 * progress.value;
    const opacity =
      progress.value > 0 && progress.value < 1 ? 1 - progress.value : 0;

    const rad = (angle * Math.PI) / 180;
    const tx = Math.cos(rad) * distance;
    const ty = Math.sin(rad) * distance;

    return {
      opacity,
      transform: [{ translateX: tx }, { translateY: ty }, { scale: opacity }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 8,
          left: 8,
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: "#FF3B30",
        },
        animatedStyle,
      ]}
    />
  );
};

export const AnnouncementCard = ({ item }: { item: AnnouncementType }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [isLiked, setIsLiked] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });

  const handlePress = () => {
    const newValue = !isLiked;
    setIsLiked(newValue);
    if (newValue) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 12, stiffness: 300 }),
        withSpring(1, { damping: 10, stiffness: 300 }),
      );
    } else {
      scale.value = withSequence(
        withSpring(0.9, { damping: 12, stiffness: 300 }),
        withSpring(1, { damping: 10, stiffness: 300 }),
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Background Image / Carousel / Solid */}
      {item.images && item.images.length > 0 ? (
        item.images.length === 1 ? (
          <Image source={{ uri: item.images[0] }} style={styles.imageBg} />
        ) : (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={StyleSheet.absoluteFill}
          >
            {item.images.map((img: string, idx: number) => (
              <Image
                key={idx}
                source={{ uri: img }}
                style={{
                  width: Dimensions.get("window").width - 40,
                  height: 320,
                }}
              />
            ))}
          </ScrollView>
        )
      ) : (
        <View style={[styles.imageBg, { backgroundColor: theme.text }]} />
      )}

      {/* Top Overlay Badges */}
      <View style={styles.topRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <TouchableOpacity
          style={[styles.likeButton, { overflow: "visible" }]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <View
            style={{
              width: 20,
              height: 20,
              overflow: "visible",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {[0, 60, 120, 180, 240, 300].map((angle, index) => (
              <Sparkle key={index} angle={angle} active={isLiked} />
            ))}
            <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
              <Heart
                size={20}
                color={isLiked ? "#FF3B30" : theme.text}
                fill={isLiked ? "#FF3B30" : "transparent"}
                strokeWidth={2.5}
              />
            </Animated.View>
          </View>
          <Text style={styles.likeCountText}>
            {isLiked ? item.likes + 1 : item.likes}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Floating Info Pill */}
      <View style={styles.bottomPill}>
        <View style={styles.dateCircle}>
          <Text style={styles.dateDayText}>{item.date.day}</Text>
          <Text style={styles.dateMonthText}>{item.date.month}</Text>
        </View>
        <View style={styles.textContent}>
          <Text style={styles.titleText} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.descText} numberOfLines={1}>
            {item.desc}
          </Text>
        </View>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>{item.actionText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    wrapper: {
      marginHorizontal: 20,
      height: 320,
      borderRadius: 32,
      backgroundColor: theme.backgroundElement,
      overflow: "hidden",
      marginBottom: 20,
    },
    imageBg: {
      ...(StyleSheet.absoluteFill as any),
      width: "100%",
      height: "100%",
    },
    topRow: {
      position: "absolute",
      top: 16,
      left: 16,
      right: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    categoryPill: {
      backgroundColor: theme.background,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 24,
    },
    categoryText: {
      fontSize: 11,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      letterSpacing: 0.5,
    },
    likeButton: {
      backgroundColor: theme.background,
      height: 44,
      paddingHorizontal: 14,
      borderRadius: 22,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    likeCountText: {
      fontSize: 14,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    bottomPill: {
      position: "absolute",
      bottom: 16,
      left: 16,
      right: 16,
      backgroundColor: theme.background,
      borderRadius: 40,
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.08)",
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
    textContent: {
      flex: 1,
      marginLeft: 12,
      marginRight: 8,
    },
    titleText: {
      fontSize: 15,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    descText: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      marginTop: 2,
    },
    actionBtn: {
      backgroundColor: "#FFC107",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 24,
    },
    actionText: {
      fontSize: 13,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
  });

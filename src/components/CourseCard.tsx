import { useTheme } from "@/hooks/use-theme";
import { Award, CheckCircle2, Heart, Star, User } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type CourseData = {
  id: string | number;
  title: string;
  provider: string;
  image: any;
  rating?: number | string;
  description?: string;
  students?: string;
  category?: string;
  progress?: number;
  tags?: string[];
  isFavourite?: boolean;
};

type CourseCardProps = {
  course: CourseData;
  layout?: "vertical" | "horizontal";
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export const CourseCard = ({
  course,
  layout = "vertical",
  style,
  onPress,
}: CourseCardProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [isFav, setIsFav] = useState(course.isFavourite || false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });

  const toggleFavourite = () => {
    setIsFav(!isFav);
    scale.value = withSequence(
      withTiming(1.3, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 }),
    );
  };

  if (layout === "horizontal") {
    return (
      <Pressable onPress={onPress} style={[styles.horizontalCard, style]}>
        <View style={styles.horizontalImageWrapper}>
          <Image source={course.image} style={styles.image} />
          <Pressable
            style={styles.favouriteButtonSmall}
            onPress={toggleFavourite}
          >
            <View
              style={[
                styles.favouriteBlurSmall,
                {
                  backgroundColor: theme.backgroundElement + 'E6', // 90% opacity hex
                },
              ]}
            >
              <Animated.View style={animatedStyle}>
                <Heart
                  size={14}
                  color={isFav ? theme.danger : theme.text}
                  fill={isFav ? theme.danger : "transparent"}
                  strokeWidth={2.5}
                />
              </Animated.View>
            </View>
          </Pressable>
        </View>
        <View style={styles.horizontalContent}>
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>
          <Text style={styles.provider}>{course.provider}</Text>

          {course.progress !== undefined && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${course.progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{course.progress}%</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.verticalCard, style]}>
      <View style={styles.verticalImageWrapper}>
        <Image source={course.image} style={styles.image} />
        {course.tags && course.tags.length > 0 && (
          <View style={styles.imageTagsContainer}>
            {course.tags.map((tag, i) => (
              <View key={i} style={styles.imageTagPill}>
                {tag === "Certificate" && (
                  <Award size={14} color={theme.text} />
                )}
                {tag === "Badge" && (
                  <CheckCircle2 size={14} color={theme.text} />
                )}
                <Text style={styles.imageTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        <Pressable style={styles.favouriteButton} onPress={toggleFavourite}>
          <View
            style={[
              styles.favouriteBlur,
              {
                backgroundColor: theme.backgroundElement + 'E6',
              },
            ]}
          >
            <Animated.View style={animatedStyle}>
              <Heart
                size={18}
                color={isFav ? theme.danger : theme.text}
                fill={isFav ? theme.danger : "transparent"}
                strokeWidth={2.5}
              />
            </Animated.View>
          </View>
        </Pressable>
      </View>
      <View style={styles.verticalContent}>
        <View style={styles.headerRow}>
          {course.rating && (
            <View
              style={[
                styles.ratingBadge,
                { backgroundColor: theme.warning + '20' },
              ]}
            >
              <Star size={14} color={theme.warning} fill={theme.warning} />
              <Text style={[styles.ratingText, { color: theme.warning }]}>
                {course.rating}
              </Text>
            </View>
          )}
          <Text style={styles.provider}>{course.provider}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>

        {course.description && (
          <Text style={styles.description} numberOfLines={2}>
            {course.description}
          </Text>
        )}

        {(course.students || course.category) && (
          <View style={styles.metaRow}>
            <User size={14} color={theme.textSecondary} />
            <Text style={styles.metaText}>
              {course.students ? `${course.students} Professionals` : ""}
              {course.students && course.category ? " • " : ""}
              {course.category}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    horizontalCard: {
      backgroundColor: theme.backgroundElement,
      borderRadius: 16, // Better to use a standard number here instead of 20
      padding: 12,
      flexDirection: "row",
      gap: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    horizontalImageWrapper: {
      width: 80,
      height: 80,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: theme.backgroundSelected,
    },
    horizontalContent: {
      flex: 1,
      justifyContent: "center",
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
      gap: 12,
    },
    progressBarBg: {
      flex: 1,
      height: 6,
      backgroundColor: theme.backgroundSelected,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.primary,
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      width: 35,
    },
    verticalCard: {
      backgroundColor: theme.backgroundElement,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: "hidden",
    },
    verticalImageWrapper: {
      width: "100%",
      height: 120,
    },
    verticalContent: {
      padding: 20,
      flex: 1, // Allows content to stretch
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    ratingBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    ratingText: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
    },
    provider: {
      fontSize: 11,
      fontFamily: theme.fonts.bold,
      color: theme.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 4, // Ensures title doesn't hug provider
    },
    title: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 6,
    },
    description: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: "auto",
    },
    metaText: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    imageTagsContainer: {
      position: "absolute",
      bottom: 12,
      left: 12,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    imageTagPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.backgroundElement,
    },
    imageTagText: {
      fontSize: 11,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    favouriteButton: {
      position: "absolute",
      top: 12,
      right: 12,
      borderRadius: 20,
      overflow: "hidden",
    },
    favouriteBlur: {
      padding: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    favouriteButtonSmall: {
      position: "absolute",
      top: 6,
      right: 6,
      borderRadius: 14,
      overflow: "hidden",
    },
    favouriteBlurSmall: {
      padding: 6,
      justifyContent: "center",
      alignItems: "center",
    },
  });

import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useTheme } from "@/hooks/use-theme";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { Header } from "../../components/Header";
import { CourseCard } from "../../components/CourseCard";

const MOCK_COURSES = [
  {
    id: "c1",
    title: "Complete React Native Bootcamp 2024",
    provider: "CAREOPS",
    rating: 4.8,
    students: "12k",
    category: "Development",
    description: "Master the fundamentals and advanced topics in mobile development.",
    image: require("../../../assets/images/learn_card/learning img 1.png"),
  },
  {
    id: "c2",
    title: "Advanced Figma Masterclass",
    provider: "CAREOPS",
    rating: 4.9,
    students: "8k",
    category: "Design",
    description: "Deep dive into advanced topics and industry UX practices.",
    image: require("../../../assets/images/learn_card/learning img 2.png"),
  },
  {
    id: "c3",
    title: "Business Fundamentals for Beginners",
    provider: "CAREOPS",
    rating: 4.7,
    students: "20k",
    category: "Business",
    description: "Start from scratch and build a solid foundation.",
    image: require("../../../assets/images/learn_card/learning img 3.png"),
  }
];

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const scrollY = useSharedValue(0);

  const categoryName = typeof id === "string" ? id : "Category";
  
  // We'll just show the mock courses to demonstrate the UI layout
  const displayCourses = MOCK_COURSES;

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title={categoryName} showBack={true} scrollY={scrollY} />

      <Animated.ScrollView 
        contentContainerStyle={commonStyles.scrollContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>Showing top courses for {categoryName}</Text>
        </View>

        {displayCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            layout="vertical"
            style={{ marginBottom: 20 }}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  resultsInfo: {
    marginBottom: 20,
  },
  resultsText: {
    fontSize: 15,
    fontFamily: theme.fonts.medium,
    color: theme.textSecondary,
  },
});

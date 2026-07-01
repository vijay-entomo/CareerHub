import { AppFonts } from "@/constants/theme";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedTabs } from "../components/AnimatedTabs";
import { CourseCard } from "../components/CourseCard";
import { Header } from "../components/Header";
import { useTheme } from "../hooks/use-theme";

const TABS = [
  { id: "all", label: "All" },
  { id: "not_started", label: "Not Started" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "favourite", label: "Favourite" },
];

const MY_COURSES = [
  {
    id: "1",
    title: "Machine Learning - Fundamentals",
    description:
      "A Practical Guide to Machine Learning – Learn ML with Real Life Examples",
    image: require("../../assets/images/learn_card/learning img 4.png"),
    rating: "4.5",
    provider: "TESDA",
    status: "in_progress",
    progress: 45,
  },
  {
    id: "2",
    title: "Advanced Data Structures",
    description:
      "Master algorithms and data structures for technical interviews and production.",
    image: require("../../assets/images/learn_card/learning img 5.png"),
    rating: "4.9",
    provider: "Stanford",
    status: "not_started",
    progress: 0,
    isFavourite: true,
  },
  {
    id: "3",
    title: "React Native Masterclass",
    description:
      "Build fluid, highly animated mobile applications using Expo & Reanimated.",
    image: require("../../assets/images/learn_card/learning img 6.png"),
    rating: "4.8",
    provider: "Udemy",
    status: "completed",
    progress: 100,
    isFavourite: true,
  },
];

export default function MyCourses() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const [activeTab, setActiveTab] = useState("all");

  const filteredCourses = MY_COURSES.filter(
    (course) =>
      activeTab === "all" ||
      (activeTab === "favourite"
        ? course.isFavourite
        : course.status === activeTab),
  );

  const tabsWithCounts = TABS.map((tab) => ({
    ...tab,
    count:
      tab.id === "all"
        ? MY_COURSES.length
        : tab.id === "favourite"
          ? MY_COURSES.filter((c) => c.isFavourite).length
          : MY_COURSES.filter((c) => c.status === tab.id).length,
  }));

  return (
    <View style={commonStyles.container}>
      <Header title="My Courses" />

      <ScrollView
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TABS */}
        <AnimatedTabs
          tabs={tabsWithCounts}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* COURSES LIST */}
        <View style={styles.listContainer}>
          {filteredCourses.length === 0 ? (
            <Text style={styles.emptyText}>
              {activeTab === "favourite"
                ? "You haven't saved any courses yet. Tap the bookmark icon on a course to save it here."
                : activeTab === "completed"
                ? "You haven't completed any courses yet. Keep learning to see your achievements here."
                : activeTab === "in_progress"
                ? "No courses in progress. Start a new course to begin learning."
                : "No courses found. Explore our catalog to find something new."}
            </Text>
          ) : (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} layout="horizontal" />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    listContainer: {
      gap: 16,
    },
    emptyText: {
      fontFamily: theme.fonts.medium,
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 40,
    },
    courseCard: {
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.03)" : "#FFFFFF",
      borderRadius: 20,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      ...(theme.mode === "light"
        ? {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 2,
          }
        : {}),
    },
    courseCardImageWrapper: {
      width: 80,
      height: 80,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "#F0F0F0",
    },
    courseCardImage: {
      width: "100%",
      height: "100%",
    },
    courseCardContent: {
      flex: 1,
      marginLeft: 16,
      justifyContent: "center",
    },
    courseCardTitle: {
      fontFamily: theme.fonts.bold,
      fontSize: 16,
      color: theme.text,
      marginBottom: 4,
    },
    courseCardProvider: {
      fontFamily: theme.fonts.medium,
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: 12,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    progressBarBg: {
      flex: 1,
      height: 6,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "#E5E5E5",
      borderRadius: 3,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.primary,
      borderRadius: 3,
    },
    progressText: {
      fontFamily: theme.fonts.bold,
      fontSize: 13,
      color: theme.text,
      width: 36,
      textAlign: "right",
    },
  });


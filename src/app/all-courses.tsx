import { useCommonStyles } from "@/hooks/use-common-styles";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedTabs } from "../components/AnimatedTabs";
import { CourseCard } from "../components/CourseCard";
import { Header } from "../components/Header";
import { BottomSheetModal } from "../components/BottomSheetModal";
import { Button } from "../components/Button";
import { useTheme } from "../hooks/use-theme";

import {
  Bookmark,
  Flame,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
  CheckCircle2,
} from "lucide-react-native";
import { router } from "expo-router";
import Animated, { FadeInDown, useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

const SORT_BY = ["Most Relevant", "Newest", "Highest Rated"];
const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const FORMATS = ["All", "Video Course", "Interactive Project", "Reading"];

const TABS = [
  { id: "Trending", label: "Trending", icon: Flame },
  { id: "Recommended", label: "Recommended", icon: Target },
  { id: "New Addition", label: "New Addition", icon: Sparkles },
  { id: "Bookmarked", label: "Bookmarked", icon: Bookmark },
];

const ALL_COURSES = [
  {
    id: "1",
    title: "Machine Learning - Fundamentals",
    description:
      "A Practical Guide to Machine Learning – Learn ML with Real Life Examples",
    image: require("../../assets/images/learn_card/learning img 4.png"),
    rating: "4.5",
    provider: "TESDA",
    category: "Trending",
  },
  {
    id: "2",
    title: "Advanced Data Structures",
    description:
      "Master algorithms and data structures for technical interviews and production.",
    image: require("../../assets/images/learn_card/learning img 5.png"),
    rating: "4.9",
    provider: "Stanford",
    category: "Trending",
  },
  {
    id: "3",
    title: "React Native Masterclass",
    description:
      "Build fluid, highly animated mobile applications using Expo & Reanimated.",
    image: require("../../assets/images/learn_card/learning img 6.png"),
    rating: "4.8",
    provider: "Udemy",
    category: "Recommended",
  },
  {
    id: "4",
    title: "Figma UI UX Design Essentials",
    description:
      "Use Figma to get a job in UI Design, User Interface, User Experience design.",
    image: require("../../assets/images/learn_card/learning img 7.png"),
    rating: "4.7",
    provider: "Daniel Walter",
    category: "New Addition",
  },
  {
    id: "5",
    title: "The Complete Digital Marketing Course",
    description:
      "Master Digital Marketing Strategy, Social Media Marketing, SEO, YouTube, Email, Facebook Marketing.",
    image: require("../../assets/images/learn_card/learning img 1.png"),
    rating: "4.6",
    provider: "Rob Sutcliffe",
    category: "New Addition",
  },
];

export default function AllCourses() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState(SORT_BY[0]);
  const [selectedLevel, setSelectedLevel] = useState(LEVELS[0]);
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0]);

  const scrollY = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const renderFilterPill = (
    label: string,
    activeValue: string,
    onSelect: (v: string) => void,
  ) => {
    const isActive = activeValue === label;
    return (
      <Button
        key={label}
        title={label}
        variant={isActive ? "primary" : "outline"}
        shape="pill"
        size="small"
        onPress={() => onSelect(label)}
        icon={
          isActive ? (
            <CheckCircle2
              size={14}
              color={theme.primaryForeground || "#000"}
            />
          ) : undefined
        }
      />
    );
  };

  const filteredCourses = ALL_COURSES.filter(
    (course) => course.category === activeTab,
  );

  return (
    <View style={commonStyles.container}>
      <Header
        title="All Courses"
        showBack={true}
        scrollY={scrollY}
        rightComponent={
          <Pressable
            onPress={() => router.push("/course-search")}
            style={{ padding: 8, marginRight: -8 }}
          >
            <Search size={22} color={theme.text} />
          </Pressable>
        }
      />

      <Animated.ScrollView
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* TABS & FILTER */}
        <View style={styles.tabsRow}>
          <View style={{ flex: 1 }}>
            <AnimatedTabs
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </View>
          <Pressable
            style={styles.filterButton}
            onPress={() => setIsFilterVisible(true)}
          >
            <SlidersHorizontal size={20} color={theme.text} />
          </Pressable>
        </View>

        {/* COURSES LIST */}
        <View style={styles.listContainer}>
          {filteredCourses.length === 0 ? (
            <Animated.View
              entering={FadeInDown.springify().damping(18).stiffness(150)}
              style={styles.emptyStateContainer}
            >
              <View
                style={[
                  styles.emptyStateIconContainer,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                {activeTab === "Bookmarked" ? (
                  <Bookmark size={44} color={theme.textSecondary} strokeWidth={1.5} />
                ) : (
                  <Search size={44} color={theme.textSecondary} strokeWidth={1.5} />
                )}
              </View>
              <Text style={[styles.emptyStateTitle, { color: theme.text }]}>
                {activeTab === "Bookmarked"
                  ? "No Saved Courses"
                  : "No Courses Found"}
              </Text>
              <Text
                style={[styles.emptyStateDesc, { color: theme.textSecondary }]}
              >
                {activeTab === "Bookmarked"
                  ? "Courses you bookmark will appear here. Start exploring and save your favorites to view them later!"
                  : "We couldn't find any courses matching this category. Try exploring other topics or check back later!"}
              </Text>
            </Animated.View>
          ) : (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} layout="vertical" />
            ))
          )}
        </View>
      </Animated.ScrollView>

      {/* FILTER MODAL */}
      <BottomSheetModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
      >
        {/* Filter Sections */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 0, paddingBottom: 24, paddingHorizontal: 0 }}
        >
          <Text style={[styles.modalTitle, { color: theme.text, marginBottom: 16 }]}>
            Filter Options
          </Text>

              <Text style={[styles.filterSectionTitle, { color: theme.text }]}>
                Sort By
              </Text>
              <View style={styles.filterPillsContainer}>
                {SORT_BY.map((label) =>
                  renderFilterPill(label, selectedSort, setSelectedSort),
                )}
              </View>

              <Text style={[styles.filterSectionTitle, { color: theme.text }]}>
                Difficulty Level
              </Text>
              <View style={styles.filterPillsContainer}>
                {LEVELS.map((label) =>
                  renderFilterPill(label, selectedLevel, setSelectedLevel),
                )}
              </View>

              <Text style={[styles.filterSectionTitle, { color: theme.text }]}>
                Format
              </Text>
              <View style={styles.filterPillsContainer}>
                {FORMATS.map((label) =>
                  renderFilterPill(label, selectedFormat, setSelectedFormat),
                )}
              </View>
            </ScrollView>

        {/* Sticky Action Footer */}
        <View
          style={[
            styles.modalFooter,
            { borderTopColor: theme.border, backgroundColor: theme.background },
          ]}
        >
          <Button
            variant="ghost"
            title="Reset"
            style={{ flex: 1 }}
            onPress={() => {
              setSelectedSort(SORT_BY[0]);
              setSelectedLevel(LEVELS[0]);
              setSelectedFormat(FORMATS[0]);
            }}
          />
          <Button
            title="Apply Filters"
            style={{ flex: 2 }}
            onPress={() => setIsFilterVisible(false)}
          />
        </View>
      </BottomSheetModal>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    tabsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    filterButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F0F0F0",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24, // to align with AnimatedTabs wrapper bottom margin
    },
    listContainer: {
      gap: 24,
      marginTop: 8,
    },
    emptyStateContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 60,
      paddingHorizontal: 32,
      paddingBottom: 40,
    },
    emptyStateIconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    emptyStateTitle: {
      fontSize: 22,
      fontFamily: theme.fonts.bold,
      marginBottom: 12,
      textAlign: "center",
    },
    emptyStateDesc: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      textAlign: "center",
      lineHeight: 24,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingBottom: 8,
    },
    modalTitle: {
      fontFamily: theme.fonts.bold,
      fontSize: 20,
    },
    filterSectionTitle: {
      fontFamily: theme.fonts.bold,
      fontSize: 16,
      marginBottom: 16,
      marginTop: 8,
    },
    filterPillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 32,
    },
    filterPill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 100,
      borderWidth: 1,
    },
    filterPillText: {
      fontFamily: theme.fonts.medium,
      fontSize: 15,
    },
    modalFooter: {
      flexDirection: "row",
      paddingVertical: 24,
      paddingHorizontal: 0,
      paddingBottom: 40, // extra padding for safe area
      borderTopWidth: 1,
      gap: 16,
    },
    resetButton: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 16,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: "transparent",
    },
    resetButtonText: {
      fontFamily: theme.fonts.bold,
      fontSize: 16,
    },
    applyButton: {
      flex: 2,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 16,
      borderRadius: 100,
    },
    applyButtonText: {
      fontFamily: theme.fonts.bold,
      fontSize: 16,
    },
  });

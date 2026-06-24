import { useCommonStyles } from "@/hooks/use-common-styles";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedTabs } from "../components/AnimatedTabs";
import { CourseCard } from "../components/CourseCard";
import { Header } from "../components/Header";
import { useTheme } from "../hooks/use-theme";

import {
  Flame,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  X,
  Check,
} from "lucide-react-native";
import { router } from "expo-router";

const SORT_BY = ["Most Relevant", "Newest", "Highest Rated"];
const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const FORMATS = ["All", "Video Course", "Interactive Project", "Reading"];

const TABS = [
  { id: "Trending", label: "Trending", icon: Flame },
  { id: "Recommended", label: "Recommended", icon: Target },
  { id: "New Addition", label: "New Addition", icon: Sparkles },
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

  const renderFilterPill = (
    label: string,
    activeValue: string,
    onSelect: (v: string) => void,
  ) => {
    const isActive = activeValue === label;
    return (
      <Pressable
        key={label}
        onPress={() => onSelect(label)}
        style={[
          styles.filterPill,
          isActive
            ? { backgroundColor: theme.primary, borderColor: theme.primary }
            : {
                backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F8F8F8",
                borderColor: theme.mode === "dark" ? "rgba(255,255,255,0.1)" : theme.border,
              },
        ]}
      >
        {isActive && (
          <Check
            size={14}
            color={theme.primaryForeground}
            style={{ marginRight: 6 }}
          />
        )}
        <Text
          style={[
            styles.filterPillText,
            isActive
              ? { color: theme.primaryForeground, fontFamily: theme.fonts.bold }
              : { color: theme.textSecondary },
          ]}
        >
          {label}
        </Text>
      </Pressable>
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
        rightComponent={
          <Pressable
            onPress={() => router.push("/course-search")}
            style={{ padding: 8, marginRight: -8 }}
          >
            <Search size={22} color={theme.text} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
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
            <Text style={styles.emptyText}>
              No courses found in this category.
            </Text>
          ) : (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} layout="vertical" />
            ))
          )}
        </View>
      </ScrollView>

      {/* FILTER MODAL */}
      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setIsFilterVisible(false)}
          />
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.background },
            ]}
          >
            {/* Drag Handle */}
            <View style={styles.dragHandleContainer}>
              <View
                style={[
                  styles.dragHandle,
                  {
                    backgroundColor:
                      theme.mode === "dark" ? "rgba(255,255,255,0.2)" : "#E5E5E5",
                  },
                ]}
              />
            </View>

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Filter Options
              </Text>
              <Pressable
                onPress={() => setIsFilterVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={20} color={theme.textSecondary} />
              </Pressable>
            </View>

            {/* Filter Sections */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
            >
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
                { borderTopColor: theme.border },
                { backgroundColor: theme.background },
              ]}
            >
              <Pressable
                style={styles.resetButton}
                onPress={() => {
                  setSelectedSort(SORT_BY[0]);
                  setSelectedLevel(LEVELS[0]);
                  setSelectedFormat(FORMATS[0]);
                }}
              >
                <Text style={[styles.resetButtonText, { color: theme.text }]}>
                  Reset
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.applyButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() => setIsFilterVisible(false)}
              >
                <Text style={[styles.applyButtonText, { color: theme.primaryForeground }]}>
                  Apply Filters
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    emptyText: {
      fontFamily: theme.fonts.medium,
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 40,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    modalBackdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      maxHeight: "90%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 10,
    },
    dragHandleContainer: {
      alignItems: "center",
      paddingTop: 16,
      paddingBottom: 8,
    },
    dragHandle: {
      width: 48,
      height: 5,
      borderRadius: 2.5,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingBottom: 16,
    },
    modalTitle: {
      fontFamily: theme.fonts.bold,
      fontSize: 20,
    },
    modalCloseButton: {
      padding: 8,
      marginRight: -8,
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
      padding: 24,
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

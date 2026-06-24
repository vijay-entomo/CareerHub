import { CourseCard } from "@/components/CourseCard";
import { Header } from "@/components/Header";
import { SectionHeader } from "@/components/SectionHeader";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Briefcase,
  Camera,
  Code2,
  Megaphone,
  Monitor,
  Music,
  Paintbrush,
  Search,
  SearchX,
  Target,
  TrendingUp,
  X,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const RECENT_SEARCHES = [
  "design systems",
  "advanced figma",
  "user research",
  "micro-interactions",
  "accessibility in design",
  "framer prototyping",
];

const COURSE_CATEGORIES = [
  { id: "Development", label: "Development", icon: Code2, color: "#4ade80" },
  { id: "Design", label: "Design", icon: Paintbrush, color: "#c084fc" },
  { id: "Business", label: "Business", icon: Briefcase, color: "#60a5fa" },
  { id: "Marketing", label: "Marketing", icon: Megaphone, color: "#f472b6" },
  {
    id: "IT & Software",
    label: "IT & Software",
    icon: Monitor,
    color: "#fb923c",
  },
  { id: "Personal Dev", label: "Personal Dev", icon: Target, color: "#facc15" },
  { id: "Photography", label: "Photography", icon: Camera, color: "#38bdf8" },
  { id: "Music", label: "Music", icon: Music, color: "#fb7185" },
];

const TRENDING_SEARCHES = [
  "AI in UI/UX",
  "Spatial Design (visionOS)",
  "Figma Variables",
  "Framer Motion",
  "Design Tokens",
];

const EXPLORE_SKILLS = [
  "Wireframing",
  "Usability Testing",
  "Information Arch",
  "Design Systems",
  "Auto-Layout",
  "Micro-interactions",
  "UX Writing",
  "Prototyping",
];

const COURSE_RESULTS = [
  {
    id: "c1",
    title: "Figma UI UX Design Essentials",
    provider: "Daniel Walter Scott",
    image: {
      uri: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=100",
    },
  },
  {
    id: "c2",
    title: "Figma UI UX Design Advanced",
    provider: "Daniel Walter Scott",
    image: {
      uri: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=100",
    },
  },
  {
    id: "c3",
    title: "Master Digital Product Design",
    provider: "Rob Sutcliffe",
    image: {
      uri: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=100",
    },
  },
];

const RECOMMENDED_COURSES = [
  {
    id: "r1",
    title: "Figma Variables & Prototyping",
    provider: "CareOps Design",
    image: {
      uri: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=400",
    },
    rating: 4.9,
    students: "12.4k",
  },
  {
    id: "r2",
    title: "Design Systems in React Native",
    provider: "CareOps Engineering",
    image: {
      uri: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400",
    },
    rating: 4.8,
    students: "8.2k",
  },
  {
    id: "r3",
    title: "Spatial UI for VisionOS",
    provider: "Apple Design Labs",
    image: {
      uri: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400",
    },
    rating: 4.9,
    students: "4.1k",
  },
];

const SUGGESTIONS = {
  topMatches: ["Design Systems", "Design Thinking", "UI Design"],
  courses: ["Design Systems for Beginners", "Advanced Figma Components"],
  skills: ["UX Design", "Visual Design", "Prototyping"],
};

export default function CourseSearchScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const [query, setQuery] = useState((q as string) || "");
  const [submittedQuery, setSubmittedQuery] = useState((q as string) || "");
  const inputRef = useRef<TextInput>(null);

  const scrollY = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const animatedSearchBarStyle = useAnimatedStyle(() => {
    const size = interpolate(scrollY.value, [0, 100], [44, 36], "clamp");
    return {
      height: size,
      borderRadius: size / 2,
    };
  });

  const animatedSearchBtnStyle = useAnimatedStyle(() => {
    const size = interpolate(scrollY.value, [0, 100], [36, 28], "clamp");
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
    };
  });

  useEffect(() => {
    if (!q) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [q]);

  const handleSearch = (q: string) => {
    Keyboard.dismiss();
    setQuery(q);
    setSubmittedQuery(q);
  };

  const renderItem = (item: any) => (
    <CourseCard
      key={item.id}
      course={item}
      layout="horizontal"
      onPress={() => handleSearch(item.title)}
    />
  );

  return (
    <View style={commonStyles.container}>
      <Header
        title=""
        showBack={true}
        scrollY={scrollY}
        customTitleComponent={
          <Animated.View
            style={[
              styles.searchBarContainer,
              {
                borderColor: theme.border,
                backgroundColor: theme.backgroundElement,
              },
              animatedSearchBarStyle,
            ]}
          >
            <TextInput
              ref={inputRef}
              style={[
                styles.searchInput,
                { color: theme.text, fontFamily: theme.fonts.medium },
              ]}
              placeholder="Search..."
              placeholderTextColor={theme.textSecondary}
              value={query}
              onChangeText={(t) => {
                setQuery(t);
                if (t === "") setSubmittedQuery("");
              }}
              onSubmitEditing={(e) => handleSearch(e.nativeEvent.text)}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable
                onPress={() => {
                  setQuery("");
                  setSubmittedQuery("");
                  inputRef.current?.focus();
                }}
                style={{ padding: 6 }}
              >
                <X size={16} color={theme.textSecondary} />
              </Pressable>
            )}
            <Pressable onPress={() => handleSearch(query)}>
              <Animated.View
                style={[styles.searchButton, animatedSearchBtnStyle]}
              >
                <Search size={16} color="#000000" />
              </Animated.View>
            </Pressable>
          </Animated.View>
        }
        rightComponent={<View />}
      />

      <View style={commonStyles.container}>
        <Animated.ScrollView
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {query.length > 0 && submittedQuery === query ? (
            <View>
              {(() => {
                const filteredResults = COURSE_RESULTS.filter(
                  (c) =>
                    c.title
                      .toLowerCase()
                      .includes(submittedQuery.toLowerCase()) ||
                    c.provider
                      .toLowerCase()
                      .includes(submittedQuery.toLowerCase()),
                );

                if (filteredResults.length === 0) {
                  return (
                    <View style={styles.emptyStateContainer}>
                      <SearchX
                        size={48}
                        color={theme.textSecondary}
                        style={{ marginBottom: 16 }}
                      />
                      <Text
                        style={[styles.emptyStateTitle, { color: theme.text }]}
                      >
                        No results found for "{submittedQuery}"
                      </Text>
                      <Text
                        style={[
                          styles.emptyStateSubtitle,
                          { color: theme.textSecondary },
                        ]}
                      >
                        Try searching for:
                      </Text>
                      <View style={styles.emptyStateTags}>
                        {[
                          "Design",
                          "Communication",
                          "Data Analytics",
                          "Leadership",
                        ].map((tag, i) => (
                          <Pressable
                            key={i}
                            style={[
                              styles.skillChip,
                              { backgroundColor: theme.backgroundElement },
                            ]}
                            onPress={() => handleSearch(tag)}
                          >
                            <Text
                              style={[
                                styles.skillText,
                                { color: theme.textSecondary },
                              ]}
                            >
                              {tag}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  );
                }

                return (
                  <>
                    <SectionHeader
                      title="Search result"
                      style={{
                        paddingHorizontal: 0,
                        marginTop: 0,
                      }}
                      size="small"
                    />
                    <View style={styles.courseCardsContainer}>
                      {filteredResults.map((item) => renderItem(item))}
                    </View>
                  </>
                );
              })()}
            </View>
          ) : query.length > 0 && submittedQuery !== query ? (
            <View style={{ gap: 32 }}>
              <View>
                <SectionHeader
                  title="Top Matches"
                  style={{ paddingHorizontal: 0, marginTop: 0 }}
                  size="small"
                />
                {SUGGESTIONS.topMatches.map((match, i) => (
                  <Pressable
                    key={i}
                    style={styles.suggestionRow}
                    onPress={() => handleSearch(match)}
                  >
                    <Search size={18} color={theme.textSecondary} />
                    <Text
                      style={[styles.suggestionText, { color: theme.text }]}
                    >
                      {match}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View>
                <SectionHeader
                  title="Courses"
                  style={{ paddingHorizontal: 0, marginTop: 0 }}
                  size="small"
                />
                {SUGGESTIONS.courses.map((course, i) => (
                  <Pressable
                    key={i}
                    style={styles.suggestionRow}
                    onPress={() => handleSearch(course)}
                  >
                    <Monitor size={18} color={theme.textSecondary} />
                    <Text
                      style={[styles.suggestionText, { color: theme.text }]}
                    >
                      {course}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View>
                <SectionHeader
                  title="Skills"
                  style={{ paddingHorizontal: 0, marginTop: 0 }}
                  size="small"
                />
                {SUGGESTIONS.skills.map((skill, i) => (
                  <Pressable
                    key={i}
                    style={styles.suggestionRow}
                    onPress={() => handleSearch(skill)}
                  >
                    <Target size={18} color={theme.textSecondary} />
                    <Text
                      style={[styles.suggestionText, { color: theme.text }]}
                    >
                      {skill}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View>
              {/* Recent searches */}
              <SectionHeader
                title="Recent Search"
                style={{ paddingHorizontal: 0, marginTop: 0 }}
                size="small"
              />
              <View style={{ marginBottom: 32 }}>
                <Animated.ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.pillContainer}
                >
                  {RECENT_SEARCHES.map((search, i) => (
                    <Pressable
                      key={i}
                      style={[
                        styles.pill,
                        {
                          backgroundColor: theme.backgroundElement,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => handleSearch(search)}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {search}
                      </Text>
                      <X size={14} color={theme.textSecondary} />
                    </Pressable>
                  ))}
                </Animated.ScrollView>
              </View>

              {/* Trending Searches */}
              <SectionHeader
                title="Trending Searches"
                style={{ paddingHorizontal: 0, marginTop: 0 }}
                size="small"
              />
              <View style={{ marginBottom: 32 }}>
                <Animated.ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.pillContainer}
                >
                  {TRENDING_SEARCHES.map((search, i) => (
                    <Pressable
                      key={i}
                      style={[
                        styles.pill,
                        {
                          backgroundColor: theme.backgroundElement,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => handleSearch(search)}
                    >
                      <TrendingUp size={14} color={theme.textSecondary} />
                      <Text
                        style={[
                          styles.pillText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {search}
                      </Text>
                    </Pressable>
                  ))}
                </Animated.ScrollView>
              </View>

              {/* Skills to Explore */}
              <SectionHeader
                title="Skills to Explore"
                style={{ paddingHorizontal: 0, marginTop: 0 }}
                size="small"
              />
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                style={{ marginBottom: 32 }}
              >
                <View style={{ gap: 10 }}>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    {EXPLORE_SKILLS.slice(
                      0,
                      Math.ceil(EXPLORE_SKILLS.length / 2),
                    ).map((skill, i) => (
                      <Pressable
                        key={i}
                        style={[
                          styles.skillChip,
                          { backgroundColor: theme.backgroundElement },
                        ]}
                        onPress={() => handleSearch(skill)}
                      >
                        <Text
                          style={[
                            styles.skillText,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {skill}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    {EXPLORE_SKILLS.slice(
                      Math.ceil(EXPLORE_SKILLS.length / 2),
                    ).map((skill, i) => (
                      <Pressable
                        key={i}
                        style={[
                          styles.skillChip,
                          { backgroundColor: theme.backgroundElement },
                        ]}
                        onPress={() => handleSearch(skill)}
                      >
                        <Text
                          style={[
                            styles.skillText,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {skill}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </Animated.ScrollView>

              {/* Recommended for You */}
              <SectionHeader
                title="Recommended for You"
                style={{ paddingHorizontal: 0, marginTop: 8 }}
                size="small"
              />
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16, alignItems: "stretch" }}
                style={{ marginBottom: 32 }}
              >
                {RECOMMENDED_COURSES.map((course) => (
                  <View key={course.id} style={{ width: 240, height: "100%" }}>
                    <CourseCard
                      course={course}
                      layout="vertical"
                      style={{ height: "100%" }}
                      onPress={() => handleSearch(course.title)}
                    />
                  </View>
                ))}
              </Animated.ScrollView>

              {/* Explore Topics */}
              <SectionHeader
                title="Explore Topics"
                style={{
                  paddingHorizontal: 0,
                  marginTop: 0,
                }}
                size="small"
              />
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {COURSE_CATEGORIES.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <Pressable
                      key={cat.id}
                      style={({ pressed }) => [
                        styles.categoryBentoTile,
                        {
                          backgroundColor:
                            theme.mode === "dark"
                              ? `${cat.color}15`
                              : `${cat.color}10`,
                          borderColor:
                            theme.mode === "dark"
                              ? `${cat.color}30`
                              : `${cat.color}20`,
                          transform: [{ scale: pressed ? 0.96 : 1 }],
                        },
                      ]}
                      onPress={() => handleSearch(cat.label)}
                    >
                      <View
                        style={[
                          styles.categoryBentoIconWrapper,
                          { backgroundColor: `${cat.color}25` },
                        ]}
                      >
                        <Icon
                          size={20}
                          color={theme.mode === "dark" ? cat.color : theme.text}
                        />
                      </View>
                      <Text
                        style={[
                          styles.categoryBentoText,
                          { color: theme.text },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </Animated.ScrollView>
            </View>
          )}
        </Animated.ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 4,
    overflow: "hidden",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: "100%",
    // Web only property to remove default focus ring
    outlineStyle: "none" as any,
  },
  searchButton: {
    backgroundColor: "#A3E635",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    position: "relative",
  },
  pillContainer: {
    flexDirection: "row",
    gap: 8,
  },
  horizontalScroll: {
    gap: 16,
  },
  categoryBentoTile: {
    width: 120,
    height: 120,
    borderRadius: 24,
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
  },
  categoryBentoIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBentoText: {
    fontFamily: "System",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "500",
  },
  courseCardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  resultCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  resultImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E5E5E5",
  },
  resultDetails: {
    flex: 1,
    justifyContent: "center",
  },
  resultTitle: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "bold",
  },
  resultSubtitle: {
    fontSize: 14,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 32,
  },
  skillChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  skillText: {
    fontSize: 14,
    fontWeight: "500",
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
});

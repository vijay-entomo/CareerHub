import { AnimatedSearchBar } from "@/components/AnimatedSearchBar";
import { Header } from "@/components/Header";
import { SectionHeader } from "@/components/SectionHeader";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Briefcase, Search, SearchX, TrendingUp, X } from "lucide-react-native";
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
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

const RECENT_SEARCHES = [
  "Senior Product Designer",
  "Design Lead",
  "UX Researcher",
  "Frontend Engineer",
];

const TOP_ROLES = [
  "Chief Design Officer",
  "Principal Engineer",
  "Product Manager",
  "Head of UX",
];

const ROLE_RESULTS = [
  { id: "r1", title: "Senior Product Designer", department: "Design" },
  { id: "r2", title: "Design Lead", department: "Design" },
  { id: "r3", title: "Chief Design Officer", department: "Leadership" },
  { id: "r4", title: "UX Researcher", department: "Research" },
];

export default function CareerSearchScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const [query, setQuery] = useState((q as string) || "");
  const [submittedQuery, setSubmittedQuery] = useState((q as string) || "");
  const inputRef = useRef<TextInput>(null);

  const scrollY = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
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

  return (
    <View style={commonStyles.container}>
      <Header
        title=""
        showBack={true}
        scrollY={scrollY}
        customTitleComponent={
          <AnimatedSearchBar
            ref={inputRef}
            value={query}
            onChangeText={(t) => {
              setQuery(t);
              if (t === "") setSubmittedQuery("");
            }}
            onSubmit={handleSearch}
            onClear={() => {
              setQuery("");
              setSubmittedQuery("");
              inputRef.current?.focus();
            }}
            scrollY={scrollY}
          />
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
                const filteredResults = ROLE_RESULTS.filter(
                  (c) =>
                    c.title.toLowerCase().includes(submittedQuery.toLowerCase()) ||
                    c.department.toLowerCase().includes(submittedQuery.toLowerCase())
                );

                if (filteredResults.length === 0) {
                  return (
                    <View style={styles.emptyStateContainer}>
                      <SearchX
                        size={48}
                        color={theme.textSecondary}
                        style={{ marginBottom: 16 }}
                      />
                      <Text style={[styles.emptyStateTitle, { color: theme.text }]}>
                        No results for "{submittedQuery}"
                      </Text>
                      <Text style={[styles.emptyStateSubtitle, { color: theme.textSecondary }]}>
                        Try different keywords or check your spelling.
                      </Text>
                    </View>
                  );
                }

                return (
                  <>
                    <SectionHeader
                      title="Search result"
                      style={{ paddingHorizontal: 0, marginTop: 0 }}
                      size="small"
                    />
                    <View style={styles.resultsContainer}>
                      {filteredResults.map((item) => (
                        <Pressable key={item.id} style={styles.suggestionRow} onPress={() => {}}>
                          <Briefcase size={18} color={theme.textSecondary} />
                          <View>
                            <Text style={[styles.suggestionText, { color: theme.text }]}>
                              {item.title}
                            </Text>
                            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                              {item.department}
                            </Text>
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  </>
                );
              })()}
            </View>
          ) : query.length > 0 && submittedQuery !== query ? (
            <View style={{ gap: 32 }}>
              <View>
                <SectionHeader
                  title="Suggestions"
                  style={{ paddingHorizontal: 0, marginTop: 0 }}
                  size="small"
                />
                {ROLE_RESULTS.slice(0, 3).map((role, i) => (
                  <Pressable
                    key={i}
                    style={styles.suggestionRow}
                    onPress={() => handleSearch(role.title)}
                  >
                    <Search size={18} color={theme.textSecondary} />
                    <Text style={[styles.suggestionText, { color: theme.text }]}>
                      {role.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View>
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
                      <Text style={[styles.pillText, { color: theme.textSecondary }]}>
                        {search}
                      </Text>
                      <X size={14} color={theme.textSecondary} />
                    </Pressable>
                  ))}
                </Animated.ScrollView>
              </View>

              <SectionHeader
                title="Top Roles"
                style={{ paddingHorizontal: 0, marginTop: 0 }}
                size="small"
              />
              <View style={{ marginBottom: 32 }}>
                <Animated.ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.pillContainer}
                >
                  {TOP_ROLES.map((search, i) => (
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
                      <Text style={[styles.pillText, { color: theme.textSecondary }]}>
                        {search}
                      </Text>
                    </Pressable>
                  ))}
                </Animated.ScrollView>
              </View>
            </View>
          )}
        </Animated.ScrollView>
      </View>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    pillContainer: {
      flexDirection: "row",
      gap: 8,
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
      fontFamily: theme.fonts.medium,
    },
    suggestionRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      gap: 12,
    },
    suggestionText: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
    },
    emptyStateContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 48,
      paddingHorizontal: 16,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.semiBold,
      textAlign: "center",
      marginBottom: 8,
    },
    emptyStateSubtitle: {
      fontSize: 15,
      textAlign: "center",
      marginBottom: 24,
    },
    resultsContainer: {
      gap: 16,
      marginBottom: 24,
    },
  });

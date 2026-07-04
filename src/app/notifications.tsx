import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Sparkles,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { AnimatedTabs } from "../components/AnimatedTabs";
import { Header } from "../components/Header";

const NOTIFICATION_DATA = [
  {
    id: "1",
    title: "New Job Match: Senior UI/UX Designer",
    message:
      "Google just posted a role that matches your Master Profile perfectly. Apply early!",
    time: "2m ago",
    read: false,
    icon: Sparkles,
  },
  {
    id: "2",
    title: "Resume Analyzed Successfully",
    message:
      "Your resume ATS score has improved by 24%. Check out the gap analysis for further improvements.",
    time: "1h ago",
    read: false,
    icon: FileText,
  },
  {
    id: "3",
    title: "Application Viewed: Apple",
    message:
      "Your application for Product Designer was just reviewed by the hiring team.",
    time: "3h ago",
    read: true,
    icon: Eye,
  },
  {
    id: "4",
    title: "Interview Prep Reminder",
    message: "You have a mock interview scheduled tomorrow. Review your notes.",
    time: "1d ago",
    read: true,
    icon: Clock,
  },
  {
    id: "5",
    title: "Course Completed: Advanced Figma",
    message:
      "Congratulations! You've unlocked the UI Mastery badge. Add it to your profile.",
    time: "2d ago",
    read: true,
    icon: CheckCircle2,
  },
];

const FILTERS = [
  { id: "All", label: "All" },
  { id: "Unread", label: "Unread" },
  { id: "Jobs", label: "Jobs" },
  { id: "Updates", label: "Updates" },
];

export default function Notifications() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const scrollY = useSharedValue(0);
  const [activeFilter, setActiveFilter] = useState("All");

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const filteredData = NOTIFICATION_DATA.filter((n) => {
    if (activeFilter === "Unread") return !n.read;
    if (activeFilter === "Jobs")
      return n.icon === Sparkles || n.icon === Briefcase;
    if (activeFilter === "Updates")
      return n.icon === Eye || n.icon === FileText;
    return true;
  });

  return (
    <View style={commonStyles.container}>
      <Header title="Notifications" scrollY={scrollY} />

      <Animated.ScrollView
        contentContainerStyle={[commonStyles.scrollContent]}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        {/* Filters */}
        <View>
          <AnimatedTabs
            tabs={FILTERS}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />
        </View>

        {filteredData.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No notifications here!
            </Text>
          </View>
        ) : (
          filteredData.map((item, index) => {
            const Icon = item.icon;

            return (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(index * 50).springify()}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.card,
                    {
                      backgroundColor: item.read
                        ? "transparent"
                        : theme.mode === "dark"
                          ? "rgba(255, 255, 255, 0.03)"
                          : "rgba(0, 0, 0, 0.02)",
                      borderColor: item.read
                        ? theme.border
                        : theme.mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.08)",
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  {/* Unread Dot Indicator */}
                  {!item.read && (
                    <View
                      style={[
                        styles.unreadDot,
                        { backgroundColor: theme.primary },
                      ]}
                    />
                  )}

                  <View
                    style={[
                      styles.iconWrapper,
                      {
                        backgroundColor: theme.backgroundElement,
                        borderColor: theme.border,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Icon size={22} color={theme.text} />
                  </View>

                  <View style={styles.content}>
                    <View style={styles.headerRow}>
                      <Text
                        style={[
                          styles.title,
                          {
                            color: item.read ? theme.textSecondary : theme.text,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.message,
                        {
                          color: item.read
                            ? theme.textSecondary + "80"
                            : theme.textSecondary,
                        },
                      ]}
                    >
                      {item.message}
                    </Text>
                    <Text
                      style={[
                        styles.time,
                        {
                          color: item.read
                            ? theme.textSecondary + "60"
                            : theme.textSecondary,
                        },
                      ]}
                    >
                      {item.time}
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })
        )}
      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      padding: 20,
      marginBottom: 16,
      borderRadius: 24,
      borderWidth: 1,
      // @ts-ignore
      borderCurve: "continuous",
    },
    unreadDot: {
      position: "absolute",
      top: 24,
      right: 20,
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    iconWrapper: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    content: {
      flex: 1,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 6,
      paddingRight: 16, // Space for unread dot
    },
    title: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      lineHeight: 22,
    },
    message: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      lineHeight: 20,
      marginBottom: 10,
    },
    time: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
    },
    emptyState: {
      padding: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
    },
  });

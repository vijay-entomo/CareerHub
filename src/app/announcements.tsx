import { useCommonStyles } from "@/hooks/use-common-styles";
import { Gift, Heart, MessageCircle } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ScrollView as GHScrollView } from "react-native-gesture-handler";
import { AutoContrastText } from "../components/AutoContrast";

const AnimatedGHScrollView = Animated.createAnimatedComponent(GHScrollView);
import { Header } from "../components/Header";
import { useTheme } from "../hooks/use-theme";
import { AnimatedTabs } from "../components/AnimatedTabs";

// Simple Like button for the feed
const FeedLikeButton = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [isLiked, setIsLiked] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });

  const handlePress = () => {
    setIsLiked((prev) => !prev);
    scale.value = withSequence(
      withTiming(1.3, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 }),
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.actionBtn}
      activeOpacity={0.7}
    >
      <Animated.View style={animatedStyle}>
        <Heart
          size={20}
          color={isLiked ? "#FF3B30" : theme.textSecondary}
          fill={isLiked ? "#FF3B30" : "transparent"}
          strokeWidth={2.5}
        />
      </Animated.View>
      <Text style={[styles.actionText, isLiked && { color: "#FF3B30" }]}>
        {isLiked ? "13" : "12"}
      </Text>
    </TouchableOpacity>
  );
};

const TABS_CONFIG = [
  { id: "all", label: "All" },
  { id: "learning", label: "Learning Opportunities" },
  { id: "career", label: "Career Opportunities" },
  { id: "offers", label: "Offers" },
  { id: "product", label: "Product Updates" },
];

const ANNOUNCEMENTS = [
  {
    id: "1",
    categoryId: "learning",
    categoryText: "Learning Opportunities",
    categoryBg: "#E8F4FF",
    categoryColor: "#0066CC",
    date: "Today, 9:41 AM",
    title: "Scheduled Maintenance",
    desc: "The platform will undergo scheduled maintenance this Sunday from 2 AM to 4 AM EST. During this time, the resume builder will be unavailable.",
    type: "text",
  },
  {
    id: "2",
    categoryId: "product",
    categoryText: "Product Updates",
    categoryBg: "#FFF8D6",
    categoryColor: "#B38600",
    date: "Yesterday",
    title: "Multiple Templates Released",
    desc: "We've added 5 new professional templates to the resume builder. Swipe to see a preview of the 'Modern Minimalist' and 'Creative Professional' themes.",
    type: "carousel",
    images: [
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586282391129-76a6df230234?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600132806608-231446b2e7af?q=80&w=1974&auto=format&fit=crop",
    ],
  },
  {
    id: "3",
    categoryId: "career",
    categoryText: "Career Opportunities",
    categoryBg: "#F5F5F8",
    categoryColor: "#5C5C70",
    date: "Oct 15",
    title: "New Resume Builder",
    desc: "We've updated our AI tools with a brand new resume builder that automatically structures your experiences.",
    type: "image",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function AnnouncementsFeed() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  const scrollY = useSharedValue(0);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => { scrollY.value = event.contentOffset.y; });

  const filteredAnnouncements = ANNOUNCEMENTS.filter(
    (item) => activeTab === "all" || item.categoryId === activeTab,
  );

  const INNER_CARD_WIDTH = Dimensions.get("window").width - 80; // Screen width (minus 40px outer padding, minus 40px inner card padding)

  const handleImageScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / INNER_CARD_WIDTH);
    if (index !== activeImageIndex && index >= 0 && index < 3) {
      setActiveImageIndex(index);
    }
  };

  const tabsWithCounts = TABS_CONFIG.map(tab => ({
    ...tab,
    count: tab.id === "all" ? ANNOUNCEMENTS.length : ANNOUNCEMENTS.filter((a) => a.categoryId === tab.id).length
  }));

  return (
    <View style={commonStyles.container}>
      <Header title="All Announcements" scrollY={scrollY} />

      <AnimatedGHScrollView
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        <AnimatedTabs
          tabs={tabsWithCounts}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Feed Content */}
        {filteredAnnouncements.map((item) => (
          <Animated.View
            key={item.id}
            style={[
              commonStyles.card,
              {
                padding: 20,
                marginBottom: 20,
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
                borderWidth: 1,
              },
            ]}
            layout={LinearTransition.springify().damping(18).stiffness(150)}
            entering={FadeInDown.springify().damping(18).stiffness(150)}
            exiting={FadeOutUp.duration(200)}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.categoryPill,
                  { backgroundColor: item.categoryBg },
                ]}
              >
                <Text
                  style={[styles.categoryText, { color: item.categoryColor }]}
                >
                  {item.categoryText.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                {item.date}
              </Text>
            </View>

            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
              {item.desc}
            </Text>

            {item.type === "carousel" && item.images && (
              <>
                <AnimatedGHScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={INNER_CARD_WIDTH}
                  snapToAlignment="start"
                  decelerationRate="fast"
                  disableIntervalMomentum={true}
                  onScroll={handleImageScroll}
                  scrollEventThrottle={16}
                  style={[
                    styles.imageCarousel,
                    // @ts-ignore
                    { scrollSnapType: "x mandatory" },
                  ]}
                >
                  {item.images.map((imgUri, index) => (
                    <Image
                      key={index}
                      source={{ uri: imgUri }}
                      style={[
                        styles.carouselImage,
                        // @ts-ignore
                        { scrollSnapAlign: "start", scrollSnapStop: "always" }
                      ]}
                    />
                  ))}
                </AnimatedGHScrollView>
                <View style={styles.paginationDots}>
                  {item.images.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        activeImageIndex === i && styles.activeDot,
                      ]}
                    />
                  ))}
                </View>
              </>
            )}

            {item.type === "image" && item.image && (
              <Image
                source={{ uri: item.image }}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 16,
                  marginTop: 4,
                  marginBottom: 16,
                }}
              />
            )}

            <View
              style={[
                styles.cardFooter,
                { borderTopColor: theme.backgroundSelected },
              ]}
            >
              <FeedLikeButton />
              {item.type === "image" && (
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                  <MessageCircle
                    size={20}
                    color={theme.textSecondary}
                    strokeWidth={2.5}
                  />
                  <Text
                    style={[styles.actionText, { color: theme.textSecondary }]}
                  >
                    1
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        ))}

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
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
              <Gift size={44} color={theme.textSecondary} strokeWidth={1.5} />
            </View>
            <Text style={[styles.emptyStateTitle, { color: theme.text }]}>
              No Offers Right Now
            </Text>
            <Text
              style={[styles.emptyStateDesc, { color: theme.textSecondary }]}
            >
              We're currently brewing up some exclusive perks and premium deals
              just for you. Keep an eye on this space so you don't miss out!
            </Text>
          </Animated.View>
        )}

        {/* End of Feed Indicator */}
        {filteredAnnouncements.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(200)
              .springify()
              .damping(18)
              .stiffness(150)}
            style={styles.endOfFeedContainer}
          >
            <View
              style={[
                styles.endOfFeedLine,
                { backgroundColor: theme.backgroundSelected },
              ]}
            />
            <Text
              style={[styles.endOfFeedText, { color: theme.textSecondary }]}
            >
              You're all caught up!
            </Text>
            <View
              style={[
                styles.endOfFeedLine,
                { backgroundColor: theme.backgroundSelected },
              ]}
            />
          </Animated.View>
        )}
      </AnimatedGHScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    tabsWrapper: {
      marginBottom: 20,
      marginHorizontal: -16, // Bleed out to screen edges for scroll
    },
    tabsContainer: {
      paddingHorizontal: 16,
      alignItems: "center",
    },
    tabsRelative: {
      position: "relative",
    },
    tabsLayoutRow: {
      flexDirection: "row",
    },
    tabItemContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: 18,
      paddingVertical: 12,
      marginRight: 12,
      justifyContent: "center",
    },
    tabBg: {
      backgroundColor: theme.primary,
      borderRadius: 20,
    },
    activeTabIndicator: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      backgroundColor: theme.primary,
      borderRadius: 20,
    },
    tabText: {
      fontSize: 15,
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
    },
    activeTabText: {
      color: theme.text,
    },
    tabCount: {
      fontSize: 10,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginLeft: 2,
      transform: [{ translateY: -2 }],
    },
    activeTabCount: {
      color: theme.text,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    categoryPill: {
      backgroundColor: theme.background,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.05)",
    },
    categoryText: {
      fontSize: 11,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      letterSpacing: 0.5,
    },
    dateText: {
      fontSize: 12,
      fontFamily: theme.fonts.semiBold,
      color: theme.textSecondary,
    },
    cardTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 8,
    },
    cardDesc: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      lineHeight: 22,
      marginBottom: 16,
    },
    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      borderTopWidth: 1,
      borderTopColor: theme.backgroundElement,
      paddingTop: 16,
    },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    actionText: {
      fontSize: 14,
      fontFamily: theme.fonts.bold,
      color: theme.textSecondary,
    },
    imageCarousel: {
      width: Dimensions.get("window").width - 80,
      marginBottom: 16,
      borderRadius: 16,
    },
    carouselImage: {
      width: Dimensions.get("window").width - 80,
      height: 250, // Slightly reduced to fit padded container proportionally
    },
    paginationDots: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
      marginBottom: 16,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.backgroundSelected,
    },
    activeDot: {
      width: 20,
      backgroundColor: theme.text,
    },

    // Image Card Variant
    imageCardWrapper: {
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
    imageCardTopRow: {
      position: "absolute",
      top: 16,
      left: 16,
      right: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    imageCardBottomPill: {
      position: "absolute",
      bottom: 16,
      left: 16,
      right: 16,
      backgroundColor: theme.background,
      borderRadius: 40,
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
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
    announcementTextContent: {
      flex: 1,
      marginLeft: 12,
      marginRight: 8,
    },
    imageCardTitle: {
      fontSize: 15,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    imageCardDesc: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      marginTop: 2,
    },
    tryFeatureBtn: {
      backgroundColor: "#FFC107",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 24,
    },
    tryFeatureText: {
      fontSize: 13,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    emptyStateContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80,
      paddingHorizontal: 32,
    },
    emptyStateIconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.backgroundElement,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    emptyStateTitle: {
      fontSize: 22,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 12,
      textAlign: "center",
    },
    emptyStateDesc: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 24,
    },
    endOfFeedContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 32,
      paddingHorizontal: 16,
    },
    endOfFeedLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.backgroundSelected,
    },
    endOfFeedText: {
      fontSize: 14,
      fontFamily: theme.fonts.semiBold,
      color: theme.textSecondary,
      paddingHorizontal: 16,
    },
  });




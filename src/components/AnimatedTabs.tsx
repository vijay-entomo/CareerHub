import { AppFonts } from "@/constants/theme";
import { useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../hooks/use-theme";

interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: any;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const AnimatedTabItem = ({ tab, isActive, count, onPress, onLayout }: any) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const activeOpacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive ? 1 : 0, { duration: 200 }),
    };
  });

  const inactiveOpacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive ? 0 : 1, { duration: 200 }),
    };
  });

  const Icon = tab.icon;

  return (
    <Pressable
      onLayout={onLayout}
      onPress={onPress}
      style={styles.tabItemContainer}
    >
      {/* Inactive Background */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill as any,
          styles.tabBg,
          { backgroundColor: theme.backgroundElement },
          inactiveOpacity,
        ]}
        pointerEvents="none"
      />

      {/* Active Background */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill as any,
          styles.tabBg,
          { backgroundColor: theme.primary },
          activeOpacity,
        ]}
        pointerEvents="none"
      />

      {isActive ? (
        <>
          {Icon && (
            <Icon
              size={14}
              color={theme.primaryForeground}
              style={{ marginRight: 6 }}
            />
          )}
          <Text
            style={[
              styles.tabText,
              styles.activeTabText,
              { color: theme.primaryForeground },
            ]}
          >
            {tab.label}
          </Text>
        </>
      ) : (
        <>
          {Icon && (
            <Icon
              size={14}
              color={theme.textSecondary}
              style={{ marginRight: 6 }}
            />
          )}
          <Text style={[styles.tabText, { color: theme.textSecondary }]}>
            {tab.label}
          </Text>
        </>
      )}

      {count !== undefined &&
        count > 0 &&
        (isActive ? (
          <Text
            style={[
              styles.tabCount,
              styles.activeTabCount,
              { color: theme.primaryForeground },
            ]}
          >
            {count}
          </Text>
        ) : (
          <Text style={[styles.tabCount, { color: theme.textSecondary }]}>
            {count}
          </Text>
        ))}
    </Pressable>
  );
};

export function AnimatedTabs({
  tabs,
  activeTab,
  onTabChange,
}: AnimatedTabsProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [tabMeasurements, setTabMeasurements] = useState<
    Record<string, { x: number; width: number }>
  >({});
  const tabScrollRef = useRef<ScrollView>(null);

  const handleTabPress = (tabId: string) => {
    onTabChange(tabId);

    const measurement = tabMeasurements[tabId];
    if (measurement && tabScrollRef.current) {
      const screenWidth = Dimensions.get("window").width;
      const scrollX = measurement.x - screenWidth / 2 + measurement.width / 2;
      tabScrollRef.current.scrollTo({
        x: Math.max(0, scrollX),
        animated: true,
      });
    }
  };

  return (
    <ScrollView
      ref={tabScrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsContainer}
      style={styles.tabsWrapper}
    >
      <View style={styles.tabsRelative}>
        {/* The individual tabs */}
        <View style={styles.tabsLayoutRow}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <AnimatedTabItem
                key={tab.id}
                tab={tab}
                isActive={isActive}
                count={tab.count}
                onLayout={(e: any) => {
                  const { x, width } = e.nativeEvent.layout;
                  setTabMeasurements((prev) => ({
                    ...prev,
                    [tab.id]: { x, width },
                  }));
                }}
                onPress={() => handleTabPress(tab.id)}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    tabsWrapper: {
      flexGrow: 0,
      marginBottom: 24,
    },
    tabsContainer: {
      paddingVertical: 4,
    },
    tabsRelative: {
      position: "relative",
    },
    tabsLayoutRow: {
      flexDirection: "row",
      gap: 12,
      zIndex: 2,
    },
    tabItemContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 0,
      position: "relative",
      minWidth: 60,
      justifyContent: "center",
      zIndex: 2,
    },
    tabBg: {
      borderRadius: 100,
      zIndex: -1,
    },

    tabText: {
      fontFamily: theme.fonts.medium,
      fontSize: 15,
      zIndex: 10,
    },
    activeTabText: {
      fontFamily: theme.fonts.bold,
    },

    tabCount: {
      fontFamily: theme.fonts.bold,
      fontSize: 12,
      marginLeft: 4,
      transform: [{ translateY: -2 }],
      zIndex: 10,
    },
    activeTabCount: {
      // styles handled by AutoContrastText
    },
  });

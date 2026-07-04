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
  withSpring,
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

const AnimatedTabItem = ({ tab, isActive, isFirst, isLast, count, onPress, onLayout }: any) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const radiusStyle = {
    borderTopLeftRadius: isFirst ? 24 : 12,
    borderBottomLeftRadius: isFirst ? 24 : 12,
    borderTopRightRadius: isLast ? 24 : 12,
    borderBottomRightRadius: isLast ? 24 : 12,
  };

  const Icon = tab.icon;

  return (
    <Pressable
      onLayout={onLayout}
      onPress={onPress}
      style={[styles.tabItemContainer, { zIndex: 2 }]}
    >

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

  const activeMeasurement = tabMeasurements[activeTab];
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  const indicatorStyle = useAnimatedStyle(() => {
    if (!activeMeasurement) return { opacity: 0 };
    
    // Bouncy spring for a playful, premium feel (user preferred)
    const springConfig = { damping: 20, stiffness: 200, mass: 1 };
    
    return {
      opacity: withTiming(1, { duration: 200 }),
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
      backgroundColor: theme.primary,
      width: withSpring(activeMeasurement.width, springConfig),
      transform: [
        { translateX: withSpring(activeMeasurement.x, springConfig) },
      ],
      borderTopLeftRadius: withSpring(activeIndex === 0 ? 24 : 12, springConfig),
      borderBottomLeftRadius: withSpring(activeIndex === 0 ? 24 : 12, springConfig),
      borderTopRightRadius: withSpring(activeIndex === tabs.length - 1 ? 24 : 12, springConfig),
      borderBottomRightRadius: withSpring(activeIndex === tabs.length - 1 ? 24 : 12, springConfig),
    };
  });

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
          {/* Static Inactive Backgrounds */}
          {tabs.map((tab, index) => {
            const m = tabMeasurements[tab.id];
            if (!m) return null;
            return (
              <View
                key={`bg-${tab.id}`}
                style={[
                  {
                    position: "absolute",
                    left: m.x,
                    top: 0,
                    bottom: 0,
                    width: m.width,
                    backgroundColor: theme.backgroundElement,
                    zIndex: 0,
                  },
                  {
                    borderTopLeftRadius: index === 0 ? 24 : 12,
                    borderBottomLeftRadius: index === 0 ? 24 : 12,
                    borderTopRightRadius: index === tabs.length - 1 ? 24 : 12,
                    borderBottomRightRadius: index === tabs.length - 1 ? 24 : 12,
                  }
                ]}
              />
            );
          })}

          {/* Sliding Indicator */}
          <Animated.View style={indicatorStyle} pointerEvents="none" />
          
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            const isFirst = index === 0;
            const isLast = index === tabs.length - 1;
            return (
              <AnimatedTabItem
                key={tab.id}
                tab={tab}
                isActive={isActive}
                isFirst={isFirst}
                isLast={isLast}
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

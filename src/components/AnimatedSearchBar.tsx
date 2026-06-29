import { useTheme } from "@/hooks/use-theme";
import { Search, X } from "lucide-react-native";
import React, { forwardRef } from "react";
import { Pressable, StyleSheet, TextInput, TextInputProps } from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  Extrapolation,
} from "react-native-reanimated";

interface AnimatedSearchBarProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: (text: string) => void;
  onClear: () => void;
  scrollY?: SharedValue<number>;
}

export const AnimatedSearchBar = forwardRef<TextInput, AnimatedSearchBarProps>(
  ({ value, onChangeText, onSubmit, onClear, scrollY, ...props }, ref) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    // Provide a fallback shared value if not tied to a scroll view
    const defaultScrollY = useSharedValue(0);
    const activeScrollY = scrollY || defaultScrollY;

    const animatedSearchBarStyle = useAnimatedStyle(() => {
      const size = interpolate(activeScrollY.value, [0, 100], [44, 36], Extrapolation.CLAMP);
      return {
        height: size,
        borderRadius: size / 2,
      };
    });

    const animatedSearchBtnStyle = useAnimatedStyle(() => {
      const size = interpolate(activeScrollY.value, [0, 100], [36, 28], Extrapolation.CLAMP);
      return {
        width: size,
        height: size,
        borderRadius: size / 2,
      };
    });

    return (
      <Animated.View
        style={[
          styles.searchBarContainer,
          animatedSearchBarStyle,
        ]}
      >
        <TextInput
          ref={ref}
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={theme.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={(e) => onSubmit(e.nativeEvent.text)}
          returnKeyType="search"
          {...props}
        />
        
        {value.length > 0 && (
          <Pressable
            onPress={onClear}
            style={styles.clearButton}
            hitSlop={10}
          >
            <X size={16} color={theme.textSecondary} />
          </Pressable>
        )}
        
        <Pressable 
          onPress={() => onSubmit(value)}
          style={styles.searchButtonWrapper}
        >
          <Animated.View style={[styles.searchButton, animatedSearchBtnStyle]}>
            <Search size={16} color={theme.primaryForeground} />
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  }
);

const createStyles = (theme: any) =>
  StyleSheet.create({
    searchBarContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.backgroundElement,
      paddingLeft: 16,
      paddingRight: 4,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.text,
      // @ts-ignore
      outlineStyle: "none" as any,
      paddingVertical: 0,
    },
    clearButton: {
      padding: 6,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 32, // Better touch target area
      minHeight: 32,
    },
    searchButtonWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchButton: {
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 4,
    },
  });

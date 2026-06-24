import { useTheme } from "@/hooks/use-theme";
import { ArrowUpRight } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  buttonIcon?: React.ReactNode;
  size?: "default" | "small";
}

export function SectionHeader({
  title,
  onSeeAll,
  style,
  titleStyle,
  buttonIcon,
  size = "default",
}: SectionHeaderProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.sectionHeader, style]}>
      <Text
        style={[
          styles.sectionTitle,
          size === "small" && styles.sectionTitleSmall,
          titleStyle,
        ]}
      >
        {title}
      </Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} style={styles.seeAllButton}>
          {buttonIcon ? (
            buttonIcon
          ) : (
            <ArrowUpRight size={18} color={theme.text} />
          )}
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 16,
      marginTop: 32,
    },
    sectionTitle: {
      fontSize: 22,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    sectionTitleSmall: {
      fontSize: 12,
      fontFamily: theme.fonts.semiBold,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    seeAllButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.backgroundElement,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor:
        theme.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.05)",
    },
  });

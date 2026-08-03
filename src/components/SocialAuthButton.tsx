import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BorderRadius } from "../constants/theme";
import { FacebookIcon, GoogleIcon } from "./SocialIcons";

interface SocialAuthButtonProps {
  provider: "facebook" | "google";
  onPress?: () => void;
}

export const SocialAuthButton = ({ provider, onPress }: SocialAuthButtonProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const Icon = provider === "facebook" ? FacebookIcon : GoogleIcon;
  const label = provider === "facebook" ? "Facebook" : "Google";

  return (
    <TouchableOpacity
      style={styles.socialButton}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Sign in with ${label}`}
    >
      <View style={styles.socialIconContainer}>
        <Icon size={20} />
      </View>
      <Text style={styles.socialButtonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    socialButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.backgroundElement,
      borderRadius: BorderRadius.button, // Standard Apple HIG radius
      paddingVertical: 14,
      minHeight: 44, // Pro-Max Touch Target minimum
      borderWidth: 1,
      borderColor: theme.backgroundSelected,
      marginHorizontal: 8, // Apple standard 8pt grid spacing
    },
    socialIconContainer: {
      marginRight: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    socialButtonText: {
      fontSize: 14,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
  });

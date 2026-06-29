import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  TextStyle,
  StyleProp,
} from "react-native";
import { BorderRadius } from "../constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "text" | "icon";
  loading?: boolean;
  textStyle?: StyleProp<TextStyle>;
}

export const Button = ({
  title,
  variant = "primary",
  loading,
  style,
  textStyle,
  ...props
}: ButtonProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return [styles.primaryButton, style];
      case "secondary":
        return [styles.secondaryButton, style];
      case "text":
        return [styles.textButton, style];
      case "icon":
        return [styles.iconButton, style];
    }
  };

  const getVariantTextStyles = () => {
    switch (variant) {
      case "primary":
        return styles.primaryText;
      case "secondary":
        return styles.secondaryText;
      case "text":
        return styles.textText;
      case "icon":
        return styles.iconText;
    }
  };

  return (
    <TouchableOpacity
      style={getVariantStyles()}
      activeOpacity={0.8}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? theme.background : theme.text}
        />
      ) : (
        <Text style={[styles.text, getVariantTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  primaryButton: {
    backgroundColor: theme.text, // Dark charcoal/black from the design
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.button, // Apple HIG standard button radius
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 8,
  },
  secondaryButton: {
    backgroundColor: theme.background, // White pill
    paddingVertical: 17, // Offset 1px border to match primary height exactly
    paddingHorizontal: 23, // Offset 1px border
    borderRadius: BorderRadius.button, // Apple HIG standard button radius
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: theme.backgroundSelected,
  },
  textButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    backgroundColor: theme.background,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
  },
  text: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    letterSpacing: 0.3,
  },
  primaryText: {
    color: theme.background,
  },
  secondaryText: {
    color: theme.text,
  },
  textText: {
    color: theme.text,
    fontFamily: theme.fonts.medium,
  },
  iconText: {
    color: theme.text,
  },
});

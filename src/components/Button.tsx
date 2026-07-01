import { getContrastColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "contrast";
export type ButtonSize = "small" | "default" | "large";
export type ButtonShape = "pill" | "rounded" | "square";

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  shape?: ButtonShape;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "default",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  style,
  textStyle,
  fullWidth = false,
  shape = "pill",
}: ButtonProps) {
  const theme = useTheme();

  const getBackgroundColor = (pressed: boolean) => {
    if (disabled)
      return theme.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.1)";
    switch (variant) {
      // case "primary":
      //   return pressed ? theme.primary + "E6" : theme.primary;
      case "primary":
        return pressed ? "#00d5ff" : "#00d5ff";
      case "secondary":
        return pressed
          ? theme.mode === "dark"
            ? "#333333"
            : "#E5E5E5"
          : theme.mode === "dark"
            ? "#2A2A2A"
            : "#F2F2F2";
      case "outline":
        return pressed
          ? theme.mode === "dark"
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)"
          : "transparent";
      case "contrast":
        return pressed ? theme.text + "E6" : theme.text;
      case "ghost":
        return pressed
          ? theme.mode === "dark"
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)"
          : "transparent";
      default:
        return theme.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.textSecondary;
    switch (variant) {
      case "primary":
        return getContrastColor(theme.primary);
      case "secondary":
        return theme.text;
      case "outline":
        return theme.text;
      case "ghost":
        return theme.text;
      case "contrast":
        return theme.background;
      default:
        return getContrastColor(theme.primary);
    }
  };

  const getBorderColor = () => {
    if (disabled && variant === "outline") return theme.border;
    if (variant === "outline") return theme.border;
    if (variant === "secondary") return theme.text;
    return "transparent";
  };

  const getHeight = () => {
    switch (size) {
      case "small":
        return 40;
      case "large":
        return 64;
      case "default":
      default:
        return 56;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "small":
        return 14;
      case "large":
        return 18;
      case "default":
      default:
        return 16;
    }
  };

  const getBorderRadius = () => {
    switch (shape) {
      case "square":
        return 0;
      case "rounded":
        return 12;
      case "pill":
      default:
        return 999;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          height: getHeight(),
          backgroundColor: getBackgroundColor(pressed),
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor: getBorderColor(),
          borderRadius: getBorderRadius(),
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          paddingHorizontal: size === "small" ? 16 : 24,
          opacity:
            pressed && variant !== "primary" && variant !== "secondary"
              ? 0.7
              : 1,
          width: fullWidth ? "100%" : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <React.Fragment>{icon}</React.Fragment>
          )}
          {title && (
            <Text
              style={[
                {
                  color: getTextColor(),
                  fontFamily: theme.fonts.semiBold,
                  fontSize: getFontSize(),
                  marginLeft: icon && iconPosition === "left" ? 8 : 0,
                  marginRight: icon && iconPosition === "right" ? 8 : 0,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
          {icon && iconPosition === "right" && (
            <React.Fragment>{icon}</React.Fragment>
          )}
        </>
      )}
    </Pressable>
  );
}

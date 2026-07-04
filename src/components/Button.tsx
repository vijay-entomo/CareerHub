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
    if (disabled) {
      return theme.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.1)";
    }

    switch (variant) {
      case "primary":
        // return pressed ? theme.primary + "E6" : theme.primary;
        return pressed ? "#ff0000" : "#ff0000";
      case "secondary":
        return pressed
          ? theme.mode === "dark"
            ? "#333333"
            : "#E5E5E5"
          : theme.mode === "dark"
            ? "#2A2A2A"
            : "#F2F2F2";
      case "outline":
      case "ghost":
        return pressed
          ? theme.mode === "dark"
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)"
          : "transparent";
      case "contrast":
        return pressed ? theme.text + "E6" : theme.text;
      default:
        return theme.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.textSecondary;
    switch (variant) {
      case "primary":
      case "secondary":
      case "contrast":
        return getContrastColor(getBackgroundColor(false));
      case "outline":
      case "ghost":
        return theme.text;
      default:
        return getContrastColor(getBackgroundColor(false));
    }
  };

  const height = size === "small" ? 40 : size === "large" ? 64 : 56;
  const fontSize = size === "small" ? 14 : size === "large" ? 18 : 16;
  const borderRadius = shape === "square" ? 0 : shape === "rounded" ? 12 : 999;
  const textColor = getTextColor();
  const borderColor = variant === "outline" ? theme.border : "transparent";
  const borderWidth = variant === "outline" ? 1 : 0;
  const horizontalPadding = size === "small" ? 16 : 24;

  const renderIcon = () => {
    if (!icon) return null;
    return React.isValidElement(icon) ? (
      React.cloneElement(icon as React.ReactElement<any>, { color: textColor })
    ) : (
      <React.Fragment>{icon}</React.Fragment>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          height,
          backgroundColor: getBackgroundColor(pressed),
          borderWidth,
          borderColor,
          borderRadius,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          paddingHorizontal: horizontalPadding,
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
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {iconPosition === "left" && renderIcon()}

          {title && (
            <Text
              style={[
                {
                  color: textColor,
                  fontFamily: theme.fonts.semiBold,
                  fontSize,
                  marginLeft: icon && iconPosition === "left" ? 8 : 0,
                  marginRight: icon && iconPosition === "right" ? 8 : 0,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}

          {iconPosition === "right" && renderIcon()}
        </>
      )}
    </Pressable>
  );
}

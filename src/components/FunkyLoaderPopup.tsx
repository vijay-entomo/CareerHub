import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MotiView } from "moti";
import { useTheme } from "@/hooks/use-theme";
import { AILoader } from "./AILoader";

interface FunkyLoaderPopupProps {
  isVisible: boolean;
  title: string;
  subtitle: string;
}

export function FunkyLoaderPopup({
  isVisible,
  title,
  subtitle,
}: FunkyLoaderPopupProps) {
  const theme = useTheme();

  if (!isVisible) return null;

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <MotiView
        from={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        style={{
          width: "85%",
          backgroundColor: theme.backgroundElement,
          borderRadius: 32,
          padding: 40,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
          elevation: 10,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        <View
          style={{
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            marginTop: 16,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AILoader />
          </View>
        </View>

        <Text
          style={{
            fontFamily: theme.fonts.bold,
            fontSize: 20,
            color: theme.text,
            textAlign: "center",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: theme.fonts.medium,
            fontSize: 15,
            color: theme.textSecondary,
            textAlign: "center",
            marginTop: 8,
            lineHeight: 22,
          }}
        >
          {subtitle}
        </Text>
      </MotiView>
    </MotiView>
  );
}

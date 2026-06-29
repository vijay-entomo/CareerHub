import { useTheme } from "@/hooks/use-theme";
import { Check } from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Checkbox = ({ checked, onChange, label }: CheckboxProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(!checked)}
      activeOpacity={0.8}
      accessible
      role="checkbox"
      aria-checked={checked}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        <AnimatePresence>
          {checked && (
            <MotiView
              from={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Check size={14} color={theme.primaryForeground} strokeWidth={3} />
            </MotiView>
          )}
        </AnimatePresence>
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 44, // Pro-Max standard: minimum touch target height
    },
    checkbox: {
      width: 22, // Slightly larger for better Pro-Max balance
      height: 22,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: theme.text,
      marginRight: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.background,
    },
    checkboxChecked: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    label: {
      fontSize: 15,
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
    },
  });

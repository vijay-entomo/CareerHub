import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius } from '@/constants/theme';
import { Plus } from 'lucide-react-native';
import { Button } from './Button';

interface EmptyStateProps {
  icon: any;
  title: string;
  subtitle: string;
  buttonText: string;
  onAdd: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({ icon: Icon, title, subtitle, buttonText, onAdd, style }: EmptyStateProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrapper}>
        <Icon size={32} color={theme.textSecondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <Button
        title={buttonText}
        icon={<Plus size={20} color={theme.primaryForeground} />}
        onPress={onAdd}
      />
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: "center",
    padding: 32,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: theme.border,
    borderRadius: BorderRadius.card,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
  },
  title: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 100,
    backgroundColor: theme.primary,
  },
  addButtonText: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.primaryForeground,
  },
});

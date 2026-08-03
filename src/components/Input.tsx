import React, { forwardRef, useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { useTheme } from "@/hooks/use-theme";
import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import { BorderRadius } from '../constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  Icon?: LucideIcon;
}

export const Input = forwardRef<TextInput, InputProps>(({ label, error, secureTextEntry, Icon, ...props }, ref) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [isSecureVisible, setIsSecureVisible] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={[
        styles.inputContainer,
        isFocused ? styles.inputFocused : null,
        error ? styles.inputError : null
      ]}>

        {Icon && (
          <Icon
            size={20}
            color={theme.textSecondary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={isSecureVisible}
          accessibilityLabel={label}
          accessibilityInvalid={!!error}
          accessibilityErrorMessage={error || undefined}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecureVisible(!isSecureVisible)}
            style={styles.rightAction}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={isSecureVisible ? "Show password" : "Hide password"}
          >
            {isSecureVisible ? (
              <EyeOff size={20} color={theme.textSecondary} />
            ) : (
              <Eye size={20} color={theme.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      <View
        style={styles.errorContainer}
        accessibilityLiveRegion="polite"
      >
        <AnimatePresence>
          {error ? (
            <MotiView
              from={{ opacity: 0, translateY: -4 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -4 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <Text style={styles.errorText}>{error}</Text>
            </MotiView>
          ) : null}
        </AnimatePresence>
      </View>
    </View>
  );
});
Input.displayName = 'Input';

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8, // Reduced since errorContainer now holds the bottom padding
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundElement,
    borderRadius: BorderRadius.input, // Standard Apple radius
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: theme.backgroundSelected,
  },
  leftIcon: {
    marginRight: 10,
  },
  inputFocused: {
    borderColor: theme.primaryBorder, // 40% transparency of primary
    boxShadow: `0px 0px 6px ${theme.primaryGlow}`, // For Android glow
  },
  inputError: {
    borderColor: theme.danger,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.text,
    padding: 0,
    margin: 0,
    minHeight: 20,
    // @ts-ignore - Valid React Native Web property to remove focus ring
    outlineStyle: 'none' as any,
  },
  rightAction: {
    paddingLeft: 12,
    paddingRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    minHeight: 22,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: theme.danger,
    marginTop: 4,
  },
});

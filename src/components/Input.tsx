import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { useTheme } from "@/hooks/use-theme";
import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import { BorderRadius } from '../constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  Icon?: LucideIcon;
}

export const Input = ({ label, error, secureTextEntry, Icon, ...props }: InputProps) => {
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
          style={styles.input}
          placeholderTextColor="#A0A0A5"
          secureTextEntry={isSecureVisible}
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
          <TouchableOpacity onPress={() => setIsSecureVisible(!isSecureVisible)} style={styles.rightAction}>
            {isSecureVisible ? (
              <EyeOff size={20} color={theme.textSecondary} />
            ) : (
              <Eye size={20} color={theme.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
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
    backgroundColor: '#FFFFFF',
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
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    fontSize: 15,
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
  },
  errorText: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: '#FF3B30',
    marginTop: 6,
  },
});

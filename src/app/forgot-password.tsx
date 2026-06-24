import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from "@/hooks/use-theme";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail } from 'lucide-react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { BorderRadius } from '../constants/theme';

export default function ForgotPassword() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleReset = () => {
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
      alert('Password reset link sent!');
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
            
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/");
                }
              }}
              style={styles.backButton}
            >
              <ChevronLeft size={28} color={theme.text} strokeWidth={2.5} />
            </TouchableOpacity>

            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600 }}
              style={styles.heroSection}
            >
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>Enter your email to receive a link</Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 150 }}
              style={styles.formContainer}
            >
              <Input
                label="Email ID"
                placeholder="Enter Email ID"
                value={email}
                onChangeText={(text) => { setEmail(text); setEmailError(''); }}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                Icon={Mail}
              />

              <Button 
                title="Send Reset Link" 
                onPress={handleReset} 
                style={styles.resetButton} 
                textStyle={{ fontSize: 16 }}
              />

            </MotiView>

            <View style={{ flex: 1 }} />

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Remember your password?{' '}
                <Text style={styles.footerLink} onPress={() => router.push('/login')}>
                  Sign In
                </Text>
              </Text>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginBottom: 20,
    marginLeft: -8, // Offset the padding of the icon to visually align
  },
  heroSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: theme.fonts.bold,
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.text,
  },
  formContainer: {
    width: '100%',
  },
  resetButton: {
    backgroundColor: theme.text,
    borderRadius: BorderRadius.button,
    marginTop: 16,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 15,
    fontFamily: theme.fonts.medium,
    color: theme.textSecondary,
  },
  footerLink: {
    fontFamily: theme.fonts.bold,
    color: theme.text,
    textDecorationLine: 'underline',
  },
});


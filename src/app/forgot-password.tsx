import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from "@/hooks/use-theme";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail } from 'lucide-react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goBackOrHome = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const handleReset = () => {
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setIsSubmitting(true);
    // Simulate an API call, then hand off to the OTP step.
    setTimeout(() => {
      setIsSubmitting(false);
      router.push({ pathname: '/otp', params: { mode: 'reset', email: trimmed } });
    }, 400);
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
              onPress={goBackOrHome}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={10}
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
              <Text style={styles.subtitle}>
                Enter your email and we'll send you a verification code to reset your password.
              </Text>
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
                autoCorrect={false}
                textContentType="username"
                autoComplete="email"
                returnKeyType="go"
                onSubmitEditing={handleReset}
                Icon={Mail}
              />

              <Button
                title={isSubmitting ? 'Sending…' : 'Send Verification Code'}
                onPress={handleReset}
                variant="contrast"
                shape="square"
                style={{ marginTop: 16 }}
              />

            </MotiView>

            <View style={{ flex: 1 }} />

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Remember your password?{' '}
                <Text
                  style={styles.footerLink}
                  onPress={() => router.push('/login')}
                  accessibilityRole="link"
                  accessibilityLabel="Sign in to existing account"
                >
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
  resetButton: {},
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


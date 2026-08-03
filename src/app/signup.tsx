import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { useRouter } from "expo-router";
import { Mail, Lock, ChevronLeft } from "lucide-react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Checkbox } from "../components/Checkbox";
import { SocialAuthButton } from "../components/SocialAuthButton";
import { useTheme } from "@/hooks/use-theme";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [agreeError, setAgreeError] = useState("");
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const handleSignUp = () => {
    let isValid = true;
    let firstInvalid: React.RefObject<TextInput | null> | null = null;

    if (!EMAIL_RE.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      isValid = false;
      firstInvalid = firstInvalid ?? emailRef;
    }

    if (!password.trim() || password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
      firstInvalid = firstInvalid ?? passwordRef;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
      firstInvalid = firstInvalid ?? confirmRef;
    }

    if (!agree) {
      setAgreeError("You must agree to the terms");
      isValid = false;
    } else {
      setAgreeError("");
    }

    if (isValid) {
      router.replace("/otp");
    } else if (firstInvalid) {
      setTimeout(() => firstInvalid?.current?.focus(), 50);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/login");
                }
              }}
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
              transition={{ type: "timing", duration: 600 }}
              style={styles.heroSection}
            >
              <Text style={styles.title}>Sign Up</Text>
              <Text style={styles.subtitle}>
                Just a few quick things to get started
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 600, delay: 150 }}
              style={styles.formContainer}
            >
              <Input
                ref={emailRef}
                label="Email ID"
                placeholder="Enter Email ID"
                value={email}
                onChangeText={(text) => { setEmail(text); setEmailError(""); }}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
                Icon={Mail}
              />
              <Input
                ref={passwordRef}
                label="New Password"
                placeholder="At least 6 characters"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                  if (confirmPassword && text === confirmPassword) setConfirmPasswordError("");
                }}
                error={passwordError}
                secureTextEntry
                textContentType="newPassword"
                autoComplete="password-new"
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                blurOnSubmit={false}
                Icon={Lock}
              />
              <Input
                ref={confirmRef}
                label="Confirm Password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (!password || text === password) setConfirmPasswordError("");
                }}
                error={confirmPasswordError}
                secureTextEntry
                textContentType="newPassword"
                autoComplete="password-new"
                returnKeyType="go"
                onSubmitEditing={handleSignUp}
                Icon={Lock}
              />

              <View style={styles.actionsRow}>
                <View style={{ flex: 1 }}>
                  <Checkbox 
                    checked={agree} 
                    onChange={(val) => { setAgree(val); setAgreeError(""); }} 
                    label="I Agree With The Terms And Conditions" 
                  />
                  {agreeError ? (
                    <Text
                      style={styles.errorText}
                      accessibilityRole="alert"
                      accessibilityLiveRegion="polite"
                    >
                      {agreeError}
                    </Text>
                  ) : null}
                </View>
              </View>

              <Button
                title="Sign Up"
                onPress={handleSignUp}
                variant="contrast"
                shape="square"
              />

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <SocialAuthButton provider="facebook" />
                <SocialAuthButton provider="google" />
              </View>
            </MotiView>

            <View style={{ flex: 1 }} />

            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 600, delay: 300 }}
              style={styles.footerContainer}
            >
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => router.replace("/login")}
                  accessibilityRole="link"
                  accessibilityLabel="Sign in to existing account"
                >
                  Sign In
                </Text>
              </Text>
            </MotiView>
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
    paddingTop: 20, // Reduced from 60 to accommodate back button naturally
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
    width: "100%",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -4,
    marginBottom: 32,
  },
  errorText: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: "#FF3B30",
    marginTop: 4,
  },
  signUpButton: {},
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.backgroundSelected,
  },
  dividerText: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.text,
    paddingHorizontal: 16,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerContainer: {
    alignItems: "center",
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
    textDecorationLine: "underline",
  },
});


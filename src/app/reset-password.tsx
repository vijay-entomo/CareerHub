import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView, AnimatePresence } from "moti";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, Lock, CheckCircle2 } from "lucide-react-native";
import { useTheme } from "@/hooks/use-theme";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function ResetPassword() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const confirmRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    let ok = true;
    if (!password.trim() || password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      ok = false;
    }
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      ok = false;
    }
    if (!ok) return;

    setPasswordError("");
    setConfirmError("");
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 500);
  };

  useEffect(() => {
    if (!isSuccess) return;
    const t = setTimeout(() => router.replace("/login"), 1400);
    return () => clearTimeout(t);
  }, [isSuccess, router]);

  return (
    <View style={styles.container}>
      <AnimatePresence>
        {isSuccess && (
          <MotiView
            key="success-gradient"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "timing", duration: 800 }}
            style={[StyleSheet.absoluteFillObject, { backgroundColor: "#FFFFFF" }]}
          >
            <LinearGradient
              colors={["rgba(46, 204, 113, 0.3)", "#FFFFFF"]}
              style={StyleSheet.absoluteFillObject}
            />
          </MotiView>
        )}
      </AnimatePresence>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
            <TouchableOpacity
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/login"))}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={10}
            >
              <ChevronLeft size={28} color={theme.text} strokeWidth={2.5} />
            </TouchableOpacity>

            <AnimatePresence exitBeforeEnter>
              {!isSuccess ? (
                <MotiView
                  key="form"
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -10 }}
                  transition={{ type: "timing", duration: 400 }}
                >
                  <View style={styles.heroSection}>
                    <Text style={styles.title}>Create New Password</Text>
                    <Text style={styles.subtitle}>
                      {email
                        ? `Set a new password for ${email}.`
                        : "Set a new password for your account."}
                    </Text>
                  </View>

                  <View style={styles.formContainer}>
                    <Input
                      label="New Password"
                      placeholder="At least 6 characters"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setPasswordError("");
                        if (confirmPassword && text === confirmPassword) setConfirmError("");
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
                      label="Confirm New Password"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (!password || text === password) setConfirmError("");
                      }}
                      error={confirmError}
                      secureTextEntry
                      textContentType="newPassword"
                      autoComplete="password-new"
                      returnKeyType="go"
                      onSubmitEditing={handleSubmit}
                      Icon={Lock}
                    />

                    <Button
                      title={isSubmitting ? "Saving…" : "Reset Password"}
                      onPress={handleSubmit}
                      variant="contrast"
                      shape="square"
                      style={{ marginTop: 16 }}
                    />
                  </View>
                </MotiView>
              ) : (
                <MotiView
                  key="success"
                  from={{ opacity: 0, scale: 0.85, translateY: 20 }}
                  animate={{ opacity: 1, scale: 1, translateY: 0 }}
                  transition={{ type: "spring", damping: 18, stiffness: 200 }}
                  style={styles.successCard}
                >
                  <MotiView
                    from={{ scale: 0, rotate: "-45deg" }}
                    animate={{ scale: 1, rotate: "0deg" }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 200 }}
                    style={{ marginBottom: 24 }}
                  >
                    <CheckCircle2 size={72} color="#2ECC71" strokeWidth={2.5} />
                  </MotiView>
                  <Text style={styles.successTitle}>Password Reset</Text>
                  <Text style={styles.successSubtitle}>
                    You can now sign in with your new password.
                  </Text>
                </MotiView>
              )}
            </AnimatePresence>

            <View style={{ flex: 1 }} />

            {!isSuccess && (
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                  Remember your password?{" "}
                  <Text style={styles.footerLink} onPress={() => router.replace("/login")}>
                    Sign In
                  </Text>
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 40,
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: "center",
      marginBottom: 20,
      marginLeft: -8,
    },
    heroSection: { marginBottom: 40 },
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
    formContainer: { width: "100%" },
    footerContainer: { alignItems: "center", marginTop: 40 },
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
    successCard: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 48,
      paddingHorizontal: 24,
      marginTop: 40,
    },
    successTitle: {
      fontSize: 26,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 12,
      textAlign: "center",
    },
    successSubtitle: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      textAlign: "center",
    },
  });

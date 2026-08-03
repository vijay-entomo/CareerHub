import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { ChevronLeft, Lock, Mail } from "lucide-react-native";
import { MotiView } from "moti";
import { useRef, useState } from "react";
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
import { Button } from "../components/Button";
import { Checkbox } from "../components/Checkbox";
import { Input } from "../components/Input";
import { SocialAuthButton } from "../components/SocialAuthButton";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = () => {
    let isValid = true;
    if (!EMAIL_RE.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError("Please enter your password");
      isValid = false;
    }

    if (isValid) {
      router.replace("/(tabs)/home");
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
                  router.replace("/");
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
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>
                Welcome back! You've been missed.
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 600, delay: 150 }}
              style={styles.formContainer}
            >
              <Input
                label="Email ID"
                placeholder="Enter Email ID"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
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
                label="Password"
                placeholder="Enter Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
                error={passwordError}
                secureTextEntry
                textContentType="password"
                autoComplete="password"
                returnKeyType="go"
                onSubmitEditing={handleLogin}
                Icon={Lock}
              />

              <View style={styles.actionsRow}>
                <Checkbox
                  checked={rememberMe}
                  onChange={setRememberMe}
                  label="Remember Me"
                />

                <TouchableOpacity
                  onPress={() => router.push("/forgot-password")}
                  accessibilityRole="button"
                  accessibilityLabel="Forgot password"
                  hitSlop={10}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <Button
                title="Sign In"
                onPress={handleLogin}
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

            {/* Spacer */}
            <View style={{ flex: 1 }} />

            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 600, delay: 300 }}
              style={styles.footerContainer}
            >
              <Text style={styles.footerText}>
                Don't have an account?{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => router.push("/signup")}
                  accessibilityRole="link"
                  accessibilityLabel="Sign up for a new account"
                >
                  Sign Up
                </Text>
              </Text>
            </MotiView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
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
      justifyContent: "center",
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
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: -4,
      marginBottom: 32,
    },
    forgotText: {
      fontSize: 14,
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
    },
    signInButton: {},
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

import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { ChevronLeft, Lock, Mail } from "lucide-react-native";
import { MotiView } from "moti";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { Checkbox } from "../components/Checkbox";
import { Input } from "../components/Input";
import { SocialAuthButton } from "../components/SocialAuthButton";
import { BorderRadius } from "../constants/theme";

export default function Login() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = () => {
    let isValid = true;
    if (!email.trim() || !email.includes("@")) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError("Please enter your password");
      isValid = false;
    }

    if (isValid) {
      router.push("/(tabs)/home");
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

            <View style={styles.formContainer}>
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
                Icon={Mail}
              />
              <Input
                label="Password"
                placeholder="Enter Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
                error={passwordError}
                secureTextEntry
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
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <Button
                title="Sign In"
                onPress={handleLogin}
                style={styles.signInButton}
                textStyle={{ fontSize: 16 }}
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
            </View>

            {/* Spacer */}
            <View style={{ flex: 1 }} />

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Don't have an account?{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => router.push("/signup")}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
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
    signInButton: {
      backgroundColor: theme.text,
      borderRadius: BorderRadius.button, // Standard Apple button radius
    },
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

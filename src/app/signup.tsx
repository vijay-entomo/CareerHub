import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { useRouter } from "expo-router";
import { Check, Mail, Lock, ChevronLeft } from "lucide-react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { FacebookIcon, GoogleIcon } from "../components/SocialIcons";
import { BorderRadius } from "../constants/theme";
import { useTheme } from "@/hooks/use-theme";

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

  const handleSignUp = () => {
    let isValid = true;
    
    if (!email.trim() || !email.includes("@")) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    
    if (!password.trim() || password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }
    
    if (!agree) {
      setAgreeError("You must agree to the terms");
      isValid = false;
    } else {
      setAgreeError("");
    }

    if (isValid) {
      router.push("/otp");
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
                label="Email ID"
                placeholder="Enter Email ID"
                value={email}
                onChangeText={(text) => { setEmail(text); setEmailError(""); }}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                Icon={Mail}
              />
              <Input
                label="New Password"
                placeholder="Enter New Password"
                value={password}
                onChangeText={(text) => { setPassword(text); setPasswordError(""); }}
                error={passwordError}
                secureTextEntry
                Icon={Lock}
              />
              <Input
                label="Confirm Password"
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => { setConfirmPassword(text); setConfirmPasswordError(""); }}
                error={confirmPasswordError}
                secureTextEntry
                Icon={Lock}
              />

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.rememberButton}
                  onPress={() => { setAgree(!agree); setAgreeError(""); }}
                >
                  <View
                    style={[styles.checkbox, agree && styles.checkboxChecked]}
                  >
                    {agree && (
                      <View style={{ width: 14, height: 14, position: 'relative' }}>
                        <Check size={14} color={theme.primaryForeground} strokeWidth={3} />
                        <MotiView
                          from={{ width: 14 }}
                          animate={{ width: agree ? 0 : 14 }}
                          transition={{ type: "timing", duration: 250 }}
                          style={{
                            position: 'absolute',
                            right: -1,
                            top: -1,
                            bottom: -1,
                            backgroundColor: theme.primary, // Mask matches background
                          }}
                        />
                      </View>
                    )}
                  </View>
                  <View>
                    <Text style={styles.rememberText}>
                      I Agree With The Terms And Conditions
                    </Text>
                    {agreeError ? <Text style={styles.errorText}>{agreeError}</Text> : null}
                  </View>
                </TouchableOpacity>
              </View>

              <Button
                title="Sign Up"
                onPress={handleSignUp}
                style={styles.signUpButton}
                textStyle={{ fontSize: 16 }}
              />

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton}>
                  <View style={styles.socialIconContainer}>
                    <FacebookIcon size={20} />
                  </View>
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <View style={styles.socialIconContainer}>
                    <GoogleIcon size={20} />
                  </View>
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
              </View>
            </MotiView>

            <View style={{ flex: 1 }} />

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text
                  style={styles.footerLink}
                  onPress={() => router.push("/login")}
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
  rememberButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.text, // Sharp border
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.background,
  },
  checkboxChecked: {
    backgroundColor: theme.primary, 
    borderColor: theme.primary,
  },
  rememberText: {
    fontSize: 13,
    fontFamily: theme.fonts.semiBold,
    color: theme.text,
  },
  errorText: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: "#FF3B30",
    marginTop: 4,
  },
  signUpButton: {
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
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.button, // Standard Apple button radius
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: theme.backgroundSelected,
    marginHorizontal: 8, // Apple standard 8pt grid spacing
  },
  socialIconContainer: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  socialButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.text,
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


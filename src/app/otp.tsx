import { useTheme } from "@/hooks/use-theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, CheckCircle2 } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
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
import { BorderRadius } from "../constants/theme";

export default function OTP() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const { mode, email } = useLocalSearchParams<{ mode?: string; email?: string }>();
  const isResetMode = mode === "reset";
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isVerified, setIsVerified] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isVerified) return;
    const t = setTimeout(() => {
      if (isResetMode) {
        router.replace({ pathname: "/reset-password", params: email ? { email } : {} });
      } else {
        router.replace("/(tabs)/home");
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [isVerified, isResetMode, email, router]);

  const handleResend = () => {
    if (timeLeft === 0) {
      setTimeLeft(30);
      setOtp(["", "", "", ""]);
      setError("");
      inputs.current[0]?.focus();
    }
  };

  const verify = (code: string) => {
    Keyboard.dismiss();
    if (code === "1111") {
      setTimeout(() => setIsVerified(true), 300);
    } else {
      setError("Invalid OTP code. Please try again.");
      setOtp(["", "", "", ""]);
      setTimeout(() => inputs.current[0]?.focus(), 50);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    // Handle paste of full/partial code into any cell
    const digits = value.replace(/\D/g, "");
    if (digits.length > 1) {
      const next = ["", "", "", ""];
      for (let i = 0; i < 4; i++) next[i] = digits[i] ?? "";
      setOtp(next);
      setError("");
      const filled = next.join("");
      if (filled.length === 4) {
        verify(filled);
      } else {
        inputs.current[Math.min(digits.length, 3)]?.focus();
      }
      return;
    }

    setError("");
    const newOtp = [...otp];
    newOtp[index] = digits;
    setOtp(newOtp);

    if (digits && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    const currentOtpString = newOtp.join("");
    if (currentOtpString.length === 4) {
      verify(currentOtpString);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <AnimatePresence>
        {isVerified && (
          <MotiView
            key="success-gradient"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "timing", duration: 800 }}
            style={[StyleSheet.absoluteFillObject, { backgroundColor: '#FFFFFF' }]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={["rgba(46, 204, 113, 0.3)", "#FFFFFF"]}
              style={StyleSheet.absoluteFillObject}
            />
          </MotiView>
        )}
        {!!error && !isVerified && (
          <MotiView
            key="error-gradient"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "timing", duration: 400 }}
            style={[StyleSheet.absoluteFillObject, { backgroundColor: '#FFFFFF' }]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={["rgba(255, 59, 48, 0.2)", "#FFFFFF"]}
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
          <ScrollView
            contentContainerStyle={[styles.scrollContent, isVerified && styles.scrollContentCentered]}
            bounces={false}
          >
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
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
              <ChevronLeft size={28} color={(isVerified || !!error) ? '#000000' : theme.text} strokeWidth={2.5} />
            </TouchableOpacity>

            <AnimatePresence>
              {!isVerified && (
                <MotiView
                  key="hero-section"
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -20, scale: 0.95 }}
                  transition={{ type: "timing", duration: 400 }}
                  style={styles.heroSection}
                >
                  <Text style={[styles.title, !!error && { color: '#000000' }]}>
                    {isResetMode
                      ? `Verify Your Email\nto Reset Password`
                      : `Enter OTP to Verify\nYour Identity`}
                  </Text>
                  <Text style={[styles.subtitle, !!error && { color: '#000000' }]}>
                    {isResetMode && email
                      ? `We sent a 4-digit code to ${email}. Enter it below to continue.`
                      : "A one-time password (OTP) has been sent to your registered email."}
                  </Text>
                </MotiView>
              )}
            </AnimatePresence>

            <View style={styles.mainContentArea}>
              <AnimatePresence exitBeforeEnter>
                {!isVerified ? (
                  <MotiView
                    key="input-form"
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, translateY: 20 }}
                    transition={{ type: "timing", duration: 300 }}
                    style={styles.formContainer}
                  >
                    <View style={styles.otpContainer}>
                      {otp.map((digit, index) => (
                        <TextInput
                          key={index}
                          ref={(ref) => {
                            inputs.current[index] = ref;
                          }}
                          style={[
                            styles.otpBox,
                            focusedIndex === index ? styles.otpBoxFocused : null,
                            digit ? styles.otpBoxFilled : null,
                            error ? styles.otpBoxError : null,
                          ]}
                          value={digit}
                          onFocus={() => setFocusedIndex(index)}
                          onBlur={() => setFocusedIndex(null)}
                          onChangeText={(val) => handleOtpChange(val, index)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                          keyboardType="number-pad"
                          maxLength={index === 0 ? 4 : 1}
                          textContentType={index === 0 ? "oneTimeCode" : "none"}
                          autoComplete={index === 0 ? "sms-otp" : "off"}
                          accessibilityLabel={`OTP digit ${index + 1}`}
                        />
                      ))}
                    </View>

                    <TouchableOpacity
                      onPress={handleResend}
                      disabled={timeLeft > 0}
                      style={styles.resendContainer}
                      accessibilityRole="button"
                      accessibilityLabel={
                        timeLeft > 0
                          ? `Resend available in ${timeLeft} seconds`
                          : "Resend code"
                      }
                      accessibilityState={{ disabled: timeLeft > 0 }}
                      hitSlop={10}
                    >
                      <Text
                        style={[
                          styles.resendText,
                          timeLeft === 0 && styles.resendActive,
                          !!error && { color: '#000000' }
                        ]}
                      >
                        {timeLeft > 0
                          ? `Resend code in 0:${timeLeft.toString().padStart(2, "0")}`
                          : "Resend code"}
                      </Text>
                    </TouchableOpacity>

                    <AnimatePresence>
                      {error ? (
                        <MotiView
                          from={{ opacity: 0, translateY: -8 }}
                          animate={{ opacity: 1, translateY: 0 }}
                          exit={{ opacity: 0, translateY: -8 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Text
                            style={[styles.errorText, { color: '#000000', marginTop: 16 }]}
                            accessibilityRole="alert"
                            accessibilityLiveRegion="assertive"
                          >
                            {error}
                          </Text>
                        </MotiView>
                      ) : null}
                    </AnimatePresence>
                  </MotiView>
                ) : (
                  <MotiView
                    key="success-view"
                    from={{ opacity: 0, scale: 0.8, translateY: 40 }}
                    animate={{ opacity: 1, scale: 1, translateY: 0 }}
                    transition={{ type: "spring", damping: 18, stiffness: 200, delay: 100 }}
                    style={styles.glassySuccessCard}
                  >
                    <MotiView
                      from={{ scale: 0, rotate: "-45deg" }}
                      animate={{ scale: 1, rotate: "0deg" }}
                      transition={{ type: "spring", damping: 12, stiffness: 200, delay: 400 }}
                      style={styles.successIconWrapper}
                    >
                      <CheckCircle2 size={64} color="#2ECC71" strokeWidth={2.5} />
                    </MotiView>
                    <Text style={[styles.successTitle, { color: '#000000' }]}>Verified Successfully!</Text>
                    <Text style={[styles.successSubtitle, { color: '#4A4A4A' }]}>
                      {isResetMode ? "Now let's set your new password." : "Your identity has been verified."}
                    </Text>
                  </MotiView>
                )}
              </AnimatePresence>
            </View>
            
            <AnimatePresence>
              {!isVerified && <View style={{ flex: 1 }} />}
            </AnimatePresence>
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
      paddingTop: 20,
      paddingBottom: 40,
    },
    scrollContentCentered: {
      justifyContent: "center",
      paddingTop: 0,
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: "center",
      marginBottom: 20,
      marginLeft: -8,
      position: 'absolute', // To keep it at top when centered
      top: 20,
      zIndex: 10,
    },
    heroSection: {
      marginBottom: 40,
      marginTop: 64, // Space for the absolute back button
    },
    title: {
      fontSize: 32,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 16,
      textAlign: "center",
      lineHeight: 40,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.text,
      textAlign: "center",
      lineHeight: 24,
    },
    mainContentArea: {
      flex: 1,
      width: "100%",
      justifyContent: "center", // This will center the success card perfectly
    },
    formContainer: {
      width: "100%",
    },
    otpContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 24,
      marginBottom: 8,
    },
    otpBox: {
      width: 56,
      height: 56,
      backgroundColor: "#FFFFFF",
      borderRadius: BorderRadius.input,
      borderWidth: 1,
      borderColor: theme.backgroundSelected,
      fontSize: 24,
      fontFamily: theme.fonts.bold,
      textAlign: "center",
      color: theme.text,
      // @ts-ignore - Valid React Native Web property to remove focus ring
      outlineStyle: "none" as any,
    },
    otpBoxFocused: {
      borderColor: theme.primary,
      boxShadow: "0px 0px 6px rgba(215, 254, 3, 0.3)",
    },
    otpBoxFilled: {
      borderColor: theme.primary,
    },
    otpBoxError: {
      borderColor: "#FF3B30",
    },
    errorText: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: "#FF3B30",
      marginBottom: 16,
      textAlign: "center",
    },
    resendContainer: {
      alignItems: "center",
      marginBottom: 24,
      marginTop: 16,
    },
    resendText: {
      fontSize: 15,
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
    },
    resendActive: {
      color: "#0066CC",
      textDecorationLine: "underline",
    },
    glassySuccessCard: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 48,
      paddingHorizontal: 24,
      width: "100%",
    },
    successIconWrapper: {
      marginBottom: 24,
    },
    successTitle: {
      fontSize: 24,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 12,
      textAlign: "center",
    },
    successSubtitle: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.text,
      opacity: 0.7,
      textAlign: "center",
    },
  });

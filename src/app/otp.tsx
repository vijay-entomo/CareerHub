import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Button } from "../components/Button";
import { BorderRadius } from "../constants/theme";
import { useTheme } from "@/hooks/use-theme";


export default function OTP() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleResend = () => {
    if (timeLeft === 0) {
      setTimeLeft(30);
      // Logic to resend OTP goes here
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    setError("");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join("").length < 4) {
      setError("Please enter the complete 4-digit OTP");
    } else {
      setError("");
      Keyboard.dismiss();
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
                Keyboard.dismiss();
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
              <Text style={styles.title}>
                Enter OTP to Verify{"\n"}Your Identity
              </Text>
              <Text style={styles.subtitle}>
                A one-time password (OTP) has been sent to your registered email
                or phone number.
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 600, delay: 150 }}
              style={styles.formContainer}
            >
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => { inputs.current[index] = ref; }}
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
                    maxLength={1}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleResend}
                disabled={timeLeft > 0}
                style={styles.resendContainer}
              >
                <Text
                  style={[
                    styles.resendText,
                    timeLeft === 0 && styles.resendActive,
                  ]}
                >
                  {timeLeft > 0
                    ? `Resend code in 00.${timeLeft.toString().padStart(2, "0")}`
                    : "Resend code"}
                </Text>
              </TouchableOpacity>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Button
                title="Verify"
                onPress={handleVerify}
                style={styles.verifyButton}
                textStyle={{ fontSize: 16 }}
              />
            </MotiView>

            <View style={{ flex: 1 }} />
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
    justifyContent: "center",
    marginBottom: 20,
    marginLeft: -8,
  },
  heroSection: {
    marginBottom: 40,
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
    backgroundColor: '#FFFFFF',
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
    borderColor: theme.primary, // Accent 01
    boxShadow: "0px 0px 6px rgba(215, 254, 3, 0.3)", // Same glow as login
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
  verifyButton: {
    backgroundColor: theme.text,
    borderRadius: BorderRadius.button,
    marginTop: 16,
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
});


import { Button } from "@/components/Button";
import { FunkyLoaderPopup } from "@/components/FunkyLoaderPopup";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  FileText,
  UploadCloud,
  XCircle,
} from "lucide-react-native";
import { MotiView } from "moti";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Header } from "../../components/Header";

const MOCK_RESUMES = [
  { id: "r1", title: "Senior Frontend Engineer", date: "Updated 2h ago" },
  { id: "r2", title: "UX/UI Designer", date: "Updated 1w ago" },
];

export default function ScoreCheck() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const router = useRouter();

  const [selectedResumeId, setSelectedResumeId] = useState<string>(MOCK_RESUMES[0].id);
  const [jobDescription, setJobDescription] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing ATS Scanner...");
  const scrollY = useSharedValue(0);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleScan = () => {
    if (!jobDescription.trim()) return;
    setIsScanning(true);
    setLoadingText("Parsing resume structure...");

    setTimeout(() => setLoadingText("Extracting keywords from Job Description..."), 1200);
    setTimeout(() => setLoadingText("Cross-referencing skills and experience..."), 2500);
    setTimeout(() => setLoadingText("Calculating final ATS match score..."), 3800);

    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 5000);
  };

  return (
    <View style={commonStyles.container}>
      <Header
        title="Check ATS Score"
        showBack
        onBack={() => router.back()}
        scrollY={scrollY}
        rightComponent={
          hasScanned ? (
            <Pressable onPress={() => setHasScanned(false)}>
              <Text style={{ fontFamily: theme.fonts.bold, color: theme.text, fontSize: 16 }}>
                New Scan
              </Text>
            </Pressable>
          ) : undefined
        }
      />

      <Animated.ScrollView
        contentContainerStyle={[
          commonStyles.scrollContent,
          { paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        {!hasScanned ? (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400 }}
          >
            <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>Select Resume</Text>
              <View style={styles.resumesList}>
                {MOCK_RESUMES.map((resume) => {
                  const isSelected = selectedResumeId === resume.id;
                  return (
                    <Pressable
                      key={resume.id}
                      style={[
                        styles.resumeCard,
                        isSelected && { borderColor: theme.primary, backgroundColor: theme.primary + "10" },
                      ]}
                      onPress={() => setSelectedResumeId(resume.id)}
                    >
                      <View style={styles.resumeIconWrapper}>
                        <FileText size={20} color={isSelected ? theme.primary : theme.textSecondary} />
                      </View>
                      <View style={styles.resumeInfo}>
                        <Text style={[styles.resumeTitle, isSelected && { color: theme.primary }]}>
                          {resume.title}
                        </Text>
                        <Text style={styles.resumeDate}>{resume.date}</Text>
                      </View>
                      {isSelected && (
                        <CheckCircle2 size={20} color={theme.primary} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>Paste Job Description</Text>
              <Text style={styles.sectionHint}>
                We'll match your resume against the requirements found in this job description.
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  { backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F5F5F5" }
                ]}
                placeholder="Paste the full job description here..."
                placeholderTextColor={theme.textSecondary}
                multiline
                textAlignVertical="top"
                value={jobDescription}
                onChangeText={setJobDescription}
              />
            </View>

            <View style={{ marginTop: 24 }}>
              <Button
                title="Scan Resume"
                fullWidth
                onPress={handleScan}
                disabled={!jobDescription.trim()}
              />
            </View>
          </MotiView>
        ) : (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            {/* Score Banner */}
            <View style={[styles.scoreBanner, commonStyles.liquidGlassBorder]}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>86</Text>
                <Text style={styles.scoreOutOf}>/100</Text>
              </View>
              <View style={styles.scoreTextContent}>
                <Text style={styles.scoreTitle}>Great Match!</Text>
                <Text style={styles.scoreDesc}>
                  Your resume covers most of the core requirements, but a few tweaks could guarantee an interview.
                </Text>
              </View>
            </View>

            {/* Missing Keywords */}
            <View style={styles.feedbackSection}>
              <View style={styles.feedbackHeader}>
                <AlertCircle size={20} color="#FF9F43" />
                <Text style={styles.feedbackTitle}>Missing Keywords</Text>
              </View>
              <Text style={styles.feedbackHint}>
                The job description mentions these skills often, but they are missing or underrepresented in your resume:
              </Text>
              <View style={styles.keywordsGrid}>
                {["GraphQL", "CI/CD", "Agile Methodology", "Jest"].map((kw, i) => (
                  <View key={i} style={styles.keywordBadge}>
                    <Text style={styles.keywordText}>{kw}</Text>
                    <Pressable style={styles.addKeywordBtn}>
                      <Text style={styles.addKeywordText}>+ Add</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>

            {/* Actionable Insights */}
            <View style={styles.feedbackSection}>
              <View style={styles.feedbackHeader}>
                <Briefcase size={20} color={theme.primary} />
                <Text style={styles.feedbackTitle}>Actionable Insights</Text>
              </View>
              
              <View style={styles.insightCard}>
                <View style={styles.insightIconWrapper}>
                  <CheckCircle2 size={16} color="#28C76F" />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Strong Impact Metrics</Text>
                  <Text style={styles.insightDesc}>You used numbers to describe your achievements in 3 out of 4 roles.</Text>
                </View>
              </View>

              <View style={styles.insightCard}>
                <View style={[styles.insightIconWrapper, { backgroundColor: "rgba(234, 84, 85, 0.1)" }]}>
                  <XCircle size={16} color="#EA5455" />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Education Date Missing</Text>
                  <Text style={styles.insightDesc}>Some ATS systems require a graduation date to verify experience levels.</Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 24, gap: 12 }}>
              <Button
                title="Optimize with AI"
                fullWidth
                onPress={() => router.push("/resume/optimizer")}
              />
            </View>
          </MotiView>
        )}
      </Animated.ScrollView>

      {/* Loading Overlay */}
      {isScanning && (
        <FunkyLoaderPopup
          visible={isScanning}
          onClose={() => setIsScanning(false)}
          text={loadingText}
          type="analyze"
        />
      )}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    inputSection: {
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 8,
    },
    sectionHint: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      marginBottom: 16,
    },
    resumesList: {
      gap: 12,
    },
    resumeCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.02)" : "#FFF",
    },
    resumeIconWrapper: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F5F5F5",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    resumeInfo: {
      flex: 1,
    },
    resumeTitle: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 4,
    },
    resumeDate: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    textArea: {
      height: 200,
      borderRadius: 24,
      padding: 20,
      paddingTop: 20,
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    // RESULTS STYLES
    scoreBanner: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.backgroundElement,
      padding: 24,
      borderRadius: 32,
      marginBottom: 32,
    },
    scoreCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary + "15",
      borderWidth: 2,
      borderColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      marginRight: 20,
    },
    scoreValue: {
      fontSize: 32,
      fontFamily: theme.fonts.bold,
      color: theme.primary,
    },
    scoreOutOf: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.primary,
      marginTop: 10,
    },
    scoreTextContent: {
      flex: 1,
    },
    scoreTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 6,
    },
    scoreDesc: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    feedbackSection: {
      marginBottom: 32,
    },
    feedbackHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },
    feedbackTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    feedbackHint: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    keywordsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    keywordBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F5F5F5",
      borderRadius: 100,
      paddingLeft: 16,
      paddingRight: 6,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    keywordText: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.text,
      marginRight: 12,
    },
    addKeywordBtn: {
      backgroundColor: theme.primary + "20",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 100,
    },
    addKeywordText: {
      fontSize: 12,
      fontFamily: theme.fonts.bold,
      color: theme.primary,
    },
    insightCard: {
      flexDirection: "row",
      backgroundColor: theme.backgroundElement,
      padding: 16,
      borderRadius: 20,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    insightIconWrapper: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(40, 199, 111, 0.1)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      marginTop: 2,
    },
    insightContent: {
      flex: 1,
    },
    insightTitle: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 4,
    },
    insightDesc: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      lineHeight: 20,
    },
  });

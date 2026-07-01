import { Button } from "@/components/Button";
import { FunkyLoaderPopup } from "@/components/FunkyLoaderPopup";
import { JobCard } from "@/components/JobCard";
import { getContrastColor } from "@/constants/theme";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  LayoutGrid,
  Link as LinkIcon,
  MessageCircle,
  Monitor,
  Search,
  Shield,
  Smile,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react-native";
import { MotiView } from "moti";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { GlassIconButton, Header } from "../../components/Header";

const INDUSTRIES = [
  { id: "i1", label: "Software & Engineering", icon: Monitor },
  { id: "i2", label: "Data & Analytics", icon: Briefcase },
  { id: "i3", label: "Design & Creative", icon: Sparkles },
  { id: "i4", label: "Product Management", icon: Briefcase },
  { id: "i5", label: "Marketing & PR", icon: MessageCircle },
  { id: "i6", label: "Sales & BizDev", icon: Briefcase },
  { id: "i7", label: "Customer Success", icon: Smile },
  { id: "i8", label: "Finance & Accounting", icon: Briefcase },
  { id: "i9", label: "Human Resources", icon: Smile },
  { id: "i10", label: "Operations & Logistics", icon: Briefcase },
  { id: "i11", label: "Legal & Compliance", icon: Briefcase },
];

const INDUSTRY_SKILLS: Record<
  string,
  { id: string; label: string; icon: any }[]
> = {
  i1: [
    // Software & Engineering
    { id: "s1", label: "React", icon: Monitor },
    { id: "s2", label: "Python", icon: Monitor },
    { id: "s3", label: "AWS", icon: Monitor },
    { id: "s4", label: "SQL", icon: Monitor },
    { id: "s5", label: "Git", icon: Monitor },
    { id: "s6", label: "System Design", icon: Monitor },
    { id: "s7", label: "REST APIs", icon: Monitor },
    { id: "s8", label: "TypeScript", icon: Monitor },
  ],
  i2: [
    // Data & Analytics
    { id: "s9", label: "Data Science", icon: Briefcase },
    { id: "s10", label: "Machine Learning", icon: Briefcase },
    { id: "s11", label: "Data Engineering", icon: Briefcase },
    { id: "s12", label: "Tableau", icon: Briefcase },
  ],
  i3: [
    // Design & Creative
    { id: "s13", label: "Figma", icon: Sparkles },
    { id: "s14", label: "UI Prototyping", icon: Sparkles },
    { id: "s15", label: "Wireframing", icon: Sparkles },
    { id: "s16", label: "User Research", icon: Sparkles },
    { id: "s17", label: "Motion Design", icon: Sparkles },
    { id: "s18", label: "Design Systems", icon: Sparkles },
  ],
  i4: [
    // Product Management
    { id: "s19", label: "Agile", icon: Briefcase },
    { id: "s20", label: "Roadmapping", icon: Briefcase },
    { id: "s21", label: "User Stories", icon: Briefcase },
    { id: "s22", label: "Jira", icon: Briefcase },
  ],
  i5: [
    // Marketing & PR
    { id: "s23", label: "SEO", icon: MessageCircle },
    { id: "s24", label: "Content Strategy", icon: MessageCircle },
    { id: "s25", label: "Social Media", icon: MessageCircle },
    { id: "s26", label: "Growth Hacking", icon: MessageCircle },
  ],
  i6: [
    // Sales & BizDev
    { id: "s27", label: "B2B Sales", icon: Briefcase },
    { id: "s28", label: "Cold Calling", icon: Briefcase },
    { id: "s29", label: "Salesforce", icon: Briefcase },
    { id: "s30", label: "Negotiation", icon: Briefcase },
  ],
  i7: [
    { id: "s31", label: "Account Management", icon: Smile },
    { id: "s32", label: "Technical Support", icon: Smile },
  ],
  i8: [
    { id: "s33", label: "FP&A", icon: Briefcase },
    { id: "s34", label: "Bookkeeping", icon: Briefcase },
  ],
  i9: [
    { id: "s35", label: "Recruiting", icon: Smile },
    { id: "s36", label: "People Ops", icon: Smile },
  ],
  i10: [
    { id: "s37", label: "Supply Chain", icon: Briefcase },
    { id: "s38", label: "Logistics", icon: Briefcase },
  ],
  i11: [
    { id: "s39", label: "Corporate Counsel", icon: Briefcase },
    { id: "s40", label: "Risk Management", icon: Briefcase },
  ],
};

const EXPERIENCES = [
  { id: "e1", label: "Entry-Level / Junior (0-2 Yrs)", icon: Sparkles },
  { id: "e2", label: "Mid-Level (3-5 Yrs)", icon: Briefcase },
  { id: "e3", label: "Senior (5-8 Yrs)", icon: Monitor },
  { id: "e4", label: "Lead / Manager (8+ Yrs)", icon: Smile },
  { id: "e5", label: "Director & Above", icon: Briefcase },
];

const WORKPLACES = [
  { id: "w1", label: "100% Remote", icon: CheckCircle2 },
  { id: "w2", label: "Hybrid", icon: CheckCircle2 },
  { id: "w3", label: "On-site", icon: CheckCircle2 },
];

const SAVED_RESUMES = [
  { id: "r1", name: "vijay_software_resume.pdf", date: "Updated 2 days ago" },
  { id: "r2", name: "vijay_design_portfolio.pdf", date: "Updated last month" },
  { id: "r3", name: "vijay_marketing_2026.docx", date: "Updated 3 months ago" },
  { id: "r4", name: "vijay_product_manager.pdf", date: "Updated 6 months ago" },
  { id: "r5", name: "vijay_old_resume_2024.pdf", date: "Updated 2 years ago" },
];

const AI_MATCHED_JOBS = [
  {
    id: "j1",
    companyName: "Google",
    matchLevel: "HIGH" as const,
    postedDate: "3/27/2026",
    title: "Machine Learning Engineer - Entry Level",
    isAssessmentRequired: true,
    employmentType: "Full-Time",
    salary: "₱1.2M - ₱1.6M",
    experience: "0-2 Years",
    location: "Mountain View, CA (Remote)",
    applicantCount: "342 Applicants",
  },
  {
    id: "j2",
    companyName: "OpenAI",
    matchLevel: "HIGH" as const,
    postedDate: "3/28/2026",
    title: "Prompt Engineer",
    isAssessmentRequired: false,
    employmentType: "Contract",
    salary: "₱800K - ₱1.0M",
    experience: "1-3 Years",
    location: "San Francisco, CA (Hybrid)",
    applicantCount: "128 Applicants",
  },
  {
    id: "j3",
    companyName: "Stripe",
    matchLevel: "MEDIUM" as const,
    postedDate: "3/25/2026",
    title: "Frontend Developer - Design Systems",
    isAssessmentRequired: true,
    employmentType: "Full-Time",
    salary: "₱1.0M - ₱1.3M",
    experience: "2-4 Years",
    location: "Remote",
    applicantCount: "512 Applicants",
  },
];

export default function AIWizard() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const router = useRouter();
  const { t } = useTranslation();

  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<
    { id: string; label: string; icon: any }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<string>("");
  const [exactYears, setExactYears] = useState(0);
  const [isExactYearsActive, setIsExactYearsActive] = useState(false);
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [isBubbleView, setIsBubbleView] = useState(false);
  const [usedAI, setUsedAI] = useState(false);
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [isCuratingJobs, setIsCuratingJobs] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyzing your profile...");
  const scrollY = useSharedValue(0);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const maxX = 80;
      const minX = -350;
      const maxY = 80;
      const minY = -200;

      let nextX = savedTranslateX.value + e.translationX;
      let nextY = savedTranslateY.value + e.translationY;

      // Apply friction (rubber-banding) if pulled outside bounds
      if (nextX > maxX) {
        nextX = maxX + (nextX - maxX) * 0.2;
      } else if (nextX < minX) {
        nextX = minX + (nextX - minX) * 0.2;
      }

      if (nextY > maxY) {
        nextY = maxY + (nextY - maxY) * 0.2;
      } else if (nextY < minY) {
        nextY = minY + (nextY - minY) * 0.2;
      }

      translateX.value = nextX;
      translateY.value = nextY;
    })
    .onEnd(() => {
      const maxX = 80;
      const minX = -350;
      const maxY = 80;
      const minY = -200;

      let snapX = translateX.value;
      let snapY = translateY.value;

      if (translateX.value > maxX) snapX = maxX;
      else if (translateX.value < minX) snapX = minX;

      if (translateY.value > maxY) snapY = maxY;
      else if (translateY.value < minY) snapY = minY;

      // Stiff spring with overshootClamping so it returns immediately without oscillating
      translateX.value = withSpring(snapX, {
        damping: 25,
        stiffness: 200,
        overshootClamping: true,
      });
      translateY.value = withSpring(snapY, {
        damping: 25,
        stiffness: 200,
        overshootClamping: true,
      });

      savedTranslateX.value = snapX;
      savedTranslateY.value = snapY;
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedBubbleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const toggleIndustry = (id: string) => {
    setSelectedIndustries((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 10) return prev;
      return [...prev, id];
    });
  };

  const addCustomSkill = () => {
    if (!searchQuery.trim()) return;
    const newId = `custom-${Date.now()}`;
    setCustomSkills((prev) => [
      ...prev,
      { id: newId, label: searchQuery.trim(), icon: Sparkles },
    ]);
    setSelectedSkills((prev) => (prev.length < 10 ? [...prev, newId] : prev));
    setSearchQuery("");
  };

  // Derive available skills based on industries + custom + search
  const availableSkills = (() => {
    let base = selectedIndustries.flatMap((ind) => INDUSTRY_SKILLS[ind] || []);
    // Deduplicate
    base = Array.from(new Map(base.map((item) => [item.id, item])).values());
    base = [...base, ...customSkills];
    if (searchQuery.trim().length > 0) {
      return base.filter((s) =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return base;
  })();

  const handleNext = () => {
    if (activeStep === 0) {
      if (linkedinUrl || selectedResumeId) {
        setIsProcessingResume(true);
        setLoadingText("Reading resume...");
        setTimeout(() => setLoadingText("Extracting key skills..."), 700);
        setTimeout(() => setLoadingText("Detecting core industries..."), 1400);
        setTimeout(() => setLoadingText("Calculating seniority..."), 2100);
        setTimeout(() => {
          setSelectedIndustries(["i1"]); // Software & Engineering
          setSelectedSkills(["s1", "s4", "s8"]); // React, SQL, TypeScript
          setSelectedExp("e2"); // Mid-level
          setExactYears(4);
          setUsedAI(true);
          setIsProcessingResume(false);
          setActiveStep(1);
        }, 2800);
      } else {
        setUsedAI(false);
        setActiveStep(1);
      }
      return;
    }

    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    } else if (activeStep === 4) {
      setIsCuratingJobs(true);
      setLoadingText("Matching your skills to the market...");
      setTimeout(
        () => setLoadingText("Cross-referencing 5,000+ open roles..."),
        1200,
      );
      setTimeout(
        () => setLoadingText("Filtering by your workplace preferences..."),
        2500,
      );
      setTimeout(
        () => setLoadingText("Curating your perfect matches..."),
        3800,
      );
      setTimeout(() => {
        setIsCuratingJobs(false);
        setActiveStep(6);
        setLoadingText("Analyzing your profile...");
      }, 5000);
    }
  };

  const isNextDisabled = () => {
    if (activeStep === 1) return selectedIndustries.length === 0;
    if (activeStep === 2) return selectedSkills.length < 2;
    if (activeStep === 3) return selectedExp === "" && !isExactYearsActive;
    if (activeStep === 4) return selectedWorkplace === "";
    return false;
  };

  const handleExactYearsChange = (newYears: number) => {
    setExactYears(newYears);
    setSelectedExp("");
    setIsExactYearsActive(true);
  };

  return (
    <View style={commonStyles.container}>
      {activeStep === 6 && (
        <Header
          key="header-results"
          title="AI-Matched Roles"
          showBack
          rightComponent={
            <Pressable onPress={() => setActiveStep(0)}>
              <Text
                style={{
                  fontFamily: theme.fonts.bold,
                  color: theme.text,
                  fontSize: 16,
                }}
              >
                Recalibrate
              </Text>
            </Pressable>
          }
          scrollY={scrollY}
        />
      )}
      <View style={{ flex: 1, paddingTop: activeStep === 6 ? 0 : 16 }}>
        {activeStep < 6 && (
          <View style={styles.wizardTopBar}>
            {activeStep === 1 && (
              <View style={{ marginRight: 12 }}>
                <GlassIconButton
                  onPress={() => setIsBubbleView(!isBubbleView)}
                  scrollY={scrollY}
                >
                  <LayoutGrid size={22} color={theme.text} />
                </GlassIconButton>
              </View>
            )}
            <GlassIconButton onPress={() => router.back()} scrollY={scrollY}>
              <X size={24} color={theme.text} />
            </GlassIconButton>
          </View>
        )}
        <Animated.ScrollView
          contentContainerStyle={[
            commonStyles.scrollContent,
            activeStep < 6 ? { paddingTop: 0 } : {},
            // { paddingBottom: 0 }
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={handleVerticalScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.flowContent}>
            {/* Heading */}
            {activeStep < 5 && (
              <MotiView
                key={`heading-${activeStep}`}
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 400 }}
                style={styles.headingContainer}
              >
                <Text style={styles.mainHeading}>
                  {activeStep === 0 && t("aiWizard.title")}
                  {activeStep === 1 &&
                    (usedAI
                      ? "Target Industries"
                      : "Where do you want to make an impact?")}
                  {activeStep === 2 &&
                    (usedAI
                      ? "Your Superpowers"
                      : "What are your core strengths?")}
                  {activeStep === 3 &&
                    (usedAI
                      ? "Career Trajectory"
                      : "Where are you in your journey?")}
                  {activeStep === 4 && "Define your ideal setup."}
                </Text>
                <Text style={styles.subHeading}>
                  {activeStep === 0 && t("aiWizard.subtitle")}
                  {activeStep === 1 &&
                    (usedAI
                      ? "We've detected these core industries based on your background. Does this look accurate?"
                      : "Select up to 3 fields so we can curate the perfect opportunities for you.")}
                  {activeStep === 2 &&
                    (usedAI
                      ? "We pulled these skills from your profile. Feel free to tweak or add niche tools."
                      : "Pick the tools and skills you command daily. (Choose up to 10)")}
                  {activeStep === 3 &&
                    (usedAI
                      ? "We've estimated your seniority level. Adjust the dial if we missed the mark."
                      : "Help us understand your seniority so we can filter out the noise.")}
                  {activeStep === 4 &&
                    "Remote, hybrid, or in-office? We'll only match you with roles that fit your lifestyle."}
                </Text>
                {activeStep === 0 && (
                  <View style={styles.disclaimerContainer}>
                    <Shield size={14} color={theme.textSecondary} />
                    <Text style={styles.disclaimerText}>
                      Your data is secure. We process it temporarily to analyze
                      your skills and will never share it without your consent.
                    </Text>
                  </View>
                )}
              </MotiView>
            )}

            {/* Search Bar for Skills */}
            {activeStep === 2 && (
              <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 200, type: "timing", duration: 300 }}
                style={styles.searchContainer}
              >
                <Search
                  size={20}
                  color={theme.textSecondary}
                  style={{ marginLeft: 16 }}
                />
                <TextInput
                  style={[styles.searchInput, { color: theme.text }]}
                  placeholder="Search or add a niche skill..."
                  placeholderTextColor={theme.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={addCustomSkill}
                  returnKeyType="done"
                />
              </MotiView>
            )}

            {/* Selectable Pills */}
            {(activeStep === 1 ||
              activeStep === 2 ||
              activeStep === 3 ||
              activeStep === 4) && (
              <MotiView
                key={`pills-${activeStep}`}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  delay: activeStep === 2 ? 300 : 100,
                  type: "timing",
                  duration: 300,
                }}
                style={styles.pillsContainer}
              >
                {activeStep === 1 && isBubbleView ? (
                  <View
                    style={{
                      width: "100%",
                      height: 450,
                      overflow: "hidden",
                      borderRadius: 24,
                      backgroundColor:
                        theme.mode === "dark"
                          ? "rgba(0,0,0,0.2)"
                          : "rgba(0,0,0,0.02)",
                      borderWidth: 1,
                      borderColor: theme.border,
                    }}
                  >
                    <GestureDetector gesture={composed}>
                      <Animated.View
                        style={[styles.bubbleContainer, animatedBubbleStyle]}
                      >
                        {INDUSTRIES.map((item, index) => {
                          const isSelected = selectedIndustries.includes(
                            item.id,
                          );
                          const Icon = item.icon;
                          const sizes = [
                            120, 95, 130, 100, 110, 85, 135, 95, 115, 80, 100,
                          ];

                          // Widely spaced coordinates to eliminate bad overlapping
                          const positions = [
                            { top: 50, left: 50 },
                            { top: 80, left: 200 },
                            { top: 40, left: 350 },
                            { top: 200, left: 30 },
                            { top: 220, left: 180 },
                            { top: 180, left: 340 },
                            { top: 120, left: 500 },
                            { top: 350, left: 80 },
                            { top: 360, left: 240 },
                            { top: 320, left: 420 },
                            { top: 280, left: 580 },
                          ];

                          const INDUSTRY_COLORS = [
                            "#60B9E5",
                            "#A375FF",
                            "#FF9D7E",
                            "#FFB46E",
                            "#95D08C",
                            "#FFC371",
                          ];
                          const bubbleColor =
                            INDUSTRY_COLORS[index % INDUSTRY_COLORS.length];

                          const size = sizes[index % sizes.length];
                          const pos = positions[index % positions.length];

                          return (
                            <Pressable
                              key={item.id}
                              onPress={() => toggleIndustry(item.id)}
                            >
                              <MotiView
                                animate={{
                                  backgroundColor: isSelected
                                    ? bubbleColor
                                    : theme.mode === "dark"
                                      ? "#2A2A35"
                                      : "#FFFFFF",
                                  opacity: 1,
                                  borderWidth: isSelected ? 0 : 1,
                                  borderColor: isSelected
                                    ? bubbleColor
                                    : theme.border,
                                  scale: isSelected ? 1.05 : 1,
                                }}
                                transition={{ type: "timing", duration: 300 }}
                                style={[
                                  styles.bubbleItem,
                                  {
                                    width: size,
                                    height: size,
                                    borderRadius: size / 2,
                                    top: pos.top,
                                    left: pos.left,
                                  },
                                ]}
                              >
                                <Icon
                                  size={size > 110 ? 24 : 18}
                                  color={
                                    isSelected ? "#FFF" : theme.textSecondary
                                  }
                                />
                                <Text
                                  style={[
                                    styles.bubbleText,
                                    {
                                      color: isSelected ? "#FFF" : theme.text,
                                      fontSize: size > 110 ? 13 : 11,
                                    },
                                  ]}
                                  numberOfLines={2}
                                >
                                  {item.label}
                                </Text>
                              </MotiView>
                            </Pressable>
                          );
                        })}
                      </Animated.View>
                    </GestureDetector>
                  </View>
                ) : (
                  (activeStep === 1
                    ? INDUSTRIES
                    : activeStep === 2
                      ? availableSkills
                      : activeStep === 3
                        ? EXPERIENCES
                        : WORKPLACES
                  ).map((item) => {
                    const isSelected =
                      activeStep === 1
                        ? selectedIndustries.includes(item.id)
                        : activeStep === 2
                          ? selectedSkills.includes(item.id)
                          : activeStep === 3
                            ? selectedExp === item.id
                            : selectedWorkplace === item.id;
                    const Icon = item.icon;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => {
                          if (activeStep === 1) toggleIndustry(item.id);
                          if (activeStep === 2) toggleSkill(item.id);
                          if (activeStep === 3) {
                            setSelectedExp(item.id);
                            setIsExactYearsActive(false);
                          }
                          if (activeStep === 4) setSelectedWorkplace(item.id);
                        }}
                      >
                        <MotiView
                          animate={{
                            backgroundColor: isSelected
                              ? theme.primary
                              : theme.mode === "dark"
                                ? "rgba(255,255,255,0.05)"
                                : theme.backgroundElement,
                            borderColor: isSelected
                              ? theme.primary
                              : theme.mode === "dark"
                                ? "rgba(255,255,255,0.1)"
                                : theme.border,
                            scale: isSelected ? 1.05 : 1,
                          }}
                          transition={{ type: "timing", duration: 250 }}
                          style={styles.pill}
                        >
                          {isSelected ? (
                            <CheckCircle2
                              size={16}
                              color={theme.primaryForeground}
                              strokeWidth={2.5}
                            />
                          ) : (
                            <Icon
                              size={16}
                              color={theme.mode === "dark" ? "#FFF" : "#333"}
                            />
                          )}
                          <Text
                            style={[
                              styles.pillText,
                              {
                                color: isSelected
                                  ? theme.primaryForeground
                                  : theme.mode === "dark"
                                    ? "#FFF"
                                    : "#333",
                              },
                            ]}
                          >
                            {item.label}
                          </Text>
                        </MotiView>
                      </Pressable>
                    );
                  })
                )}
                {activeStep === 2 &&
                  searchQuery.trim().length > 0 &&
                  availableSkills.length === 0 && (
                    <Pressable
                      onPress={addCustomSkill}
                      style={styles.addCustomBtn}
                    >
                      <Text
                        style={{
                          color: theme.text,
                          fontFamily: theme.fonts.medium,
                        }}
                      >
                        + Add "{searchQuery}"
                      </Text>
                    </Pressable>
                  )}
              </MotiView>
            )}

            {/* Exact Years Counter */}
            {activeStep === 3 && (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 200, type: "timing", duration: 300 }}
                style={styles.counterContainer}
              >
                <Text style={styles.counterLabel}>
                  Pinpoint your exact years of experience
                </Text>
                <View
                  style={[
                    styles.counterControl,
                    !isExactYearsActive &&
                      selectedExp !== "" && { opacity: 0.4 },
                  ]}
                >
                  <Pressable
                    style={styles.counterBtn}
                    onPress={() =>
                      handleExactYearsChange(Math.max(0, exactYears - 1))
                    }
                  >
                    <Text style={styles.counterBtnText}>-</Text>
                  </Pressable>
                  <View style={styles.counterValueContainer}>
                    <Text style={styles.counterValue}>{exactYears}</Text>
                    <Text style={styles.counterSuffix}>
                      {exactYears === 1 ? "Year" : "Years"}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.counterBtn}
                    onPress={() => handleExactYearsChange(exactYears + 1)}
                  >
                    <Text style={styles.counterBtnText}>+</Text>
                  </Pressable>
                </View>
              </MotiView>
            )}

            {/* Resume / LinkedIn Selection (Step 0) */}
            {activeStep === 0 && (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 200, type: "timing", duration: 300 }}
                style={styles.resumeContainer}
              >
                <View style={{ marginBottom: 24 }}>
                  <Text style={styles.sectionLabel}>Saved Resumes</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 12 }}
                  >
                    {SAVED_RESUMES.map((resume) => {
                      const isSelected = selectedResumeId === resume.id;
                      return (
                        <Pressable
                          key={resume.id}
                          style={[
                            styles.resumeMiniCard,
                            isSelected && styles.resumeCardActive,
                          ]}
                          onPress={() => {
                            setSelectedResumeId(isSelected ? null : resume.id);
                            setLinkedinUrl("");
                          }}
                        >
                          <View
                            style={[
                              styles.resumeCardIconWrapper,
                              {
                                marginBottom: 12,
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                              },
                            ]}
                          >
                            <FileText
                              size={20}
                              color={
                                isSelected
                                  ? theme.primaryForeground
                                  : theme.textSecondary
                              }
                            />
                          </View>
                          <Text
                            style={[
                              styles.resumeCardTitle,
                              isSelected && { color: theme.primaryForeground },
                            ]}
                            numberOfLines={1}
                          >
                            {resume.name}
                          </Text>
                          <Text
                            style={[
                              styles.resumeCardSub,
                              isSelected && {
                                color: theme.primaryForeground,
                                opacity: 0.8,
                              },
                            ]}
                          >
                            {resume.date}
                          </Text>
                          {isSelected && (
                            <View
                              style={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                              }}
                            >
                              <CheckCircle2
                                size={18}
                                color={theme.primaryForeground}
                              />
                            </View>
                          )}
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={styles.resumeOptionsContainer}>
                  <Pressable style={styles.resumeCard}>
                    <View style={styles.resumeCardIconWrapper}>
                      <UploadCloud size={24} color={theme.textSecondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resumeCardTitle}>
                        Upload New Resume
                      </Text>
                      <Text style={styles.resumeCardSub}>
                        PDF, DOCX up to 5MB
                      </Text>
                    </View>
                  </Pressable>
                </View>

                <View style={styles.linkedInContainer}>
                  <Text style={styles.linkedInLabel}>
                    Or drop your LinkedIn URL
                  </Text>
                  <View style={styles.linkedInInputWrapper}>
                    <LinkIcon
                      size={20}
                      color={theme.textSecondary}
                      style={{ marginLeft: 16 }}
                    />
                    <TextInput
                      style={[styles.searchInput, { color: theme.text }]}
                      placeholder="https://linkedin.com/in/..."
                      placeholderTextColor={theme.textSecondary}
                      value={linkedinUrl}
                      onChangeText={(t) => {
                        setLinkedinUrl(t);
                        if (t) setSelectedResumeId(null);
                      }}
                      autoCapitalize="none"
                      keyboardType="url"
                    />
                  </View>
                </View>
              </MotiView>
            )}

            {activeStep === 6 && (
              <MotiView
                key="step-6-results"
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 400 }}
                style={{ gap: 16 }}
              >
                {AI_MATCHED_JOBS.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))}
              </MotiView>
            )}
          </View>
        </Animated.ScrollView>

        {/* Fixed Footer Controls */}
        {activeStep < 5 && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300, type: "timing" }}
            style={styles.flowFooter}
          >
            <View style={styles.footerLeft}>
              <MotiView
                animate={{
                  width: activeStep > 0 ? 40 : 0,
                  opacity: activeStep > 0 ? 1 : 0,
                  marginRight: activeStep > 0 ? 16 : 0,
                }}
                transition={{ type: "timing", duration: 300 }}
                style={{ overflow: "hidden" }}
              >
                <Button
                  variant="outline"
                  onPress={() => setActiveStep(activeStep - 1)}
                  disabled={isProcessingResume || activeStep === 0}
                  icon={<ArrowLeft size={20} color={theme.text} />}
                  style={{
                    width: 56,
                    height: 56,
                    paddingHorizontal: 0,
                    borderRadius: 28,
                  }}
                />
              </MotiView>

              <View style={styles.pagination}>
                {[0, 1, 2, 3, 4].map((step) => (
                  <View
                    key={step}
                    style={[
                      styles.dot,
                      activeStep === step ? styles.dotActive : null,
                    ]}
                  />
                ))}
              </View>
            </View>

            <Button
              onPress={handleNext}
              disabled={isNextDisabled() || isProcessingResume}
              style={[isNextDisabled() && { opacity: 0.5 }]}
              iconPosition="right"
              icon={
                <ArrowRight size={20} color={getContrastColor(theme.primary)} />
              }
              title={
                activeStep === 0
                  ? isProcessingResume
                    ? "Analyzing..."
                    : linkedinUrl || selectedResumeId
                      ? "Analyze Profile"
                      : "Skip"
                  : activeStep === 4
                    ? "Finish"
                    : "Next"
              }
            />
          </MotiView>
        )}
      </View>

      <FunkyLoaderPopup
        isVisible={isProcessingResume || isCuratingJobs}
        title={loadingText}
        subtitle={
          isCuratingJobs
            ? "Please hold on while our AI builds your highly personalized career graph."
            : "Please hold on while our AI analyzes your background..."
        }
      />
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    content: {
      flex: 1,
    },
    aiBanner: {
      width: "100%",
      borderRadius: 24,
      overflow: "hidden",
      position: "relative",
      backgroundColor: theme.mode === "dark" ? "#1A1A24" : "#FFFFFF",
      borderWidth: 1.5,
      borderColor:
        theme.mode === "dark"
          ? "rgba(157, 78, 221, 0.4)"
          : "rgba(157, 78, 221, 0.3)",
      ...Platform.select({
        ios: {
          shadowColor: "#9D4EDD",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
        },
        android: { elevation: 8 },
      }),
      // @ts-ignore
      borderCurve: "continuous",
      marginBottom: 24,
    },
    aiBannerBg: {
      ...StyleSheet.absoluteFillObject,
      overflow: "hidden",
    },
    auroraBlob: {
      position: "absolute",
      width: 180,
      height: 180,
      borderRadius: 90,
      opacity: theme.mode === "dark" ? 0.6 : 0.3,
      filter: "blur(40px)",
    },
    glassOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(26, 26, 36, 0.75)"
          : "rgba(255, 255, 255, 0.6)",
    },
    aiBannerContent: {
      flexDirection: "row",
      padding: 16,
      alignItems: "center",
      gap: 16,
    },
    aiIconWrapper: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      justifyContent: "center",
      alignItems: "center",
    },
    aiBannerTextContainer: {
      flex: 1,
    },
    aiBannerTitle: {
      fontSize: 17,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 3,
    },
    aiBannerSubtitle: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    aiBannerBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.backgroundElement,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    },
    skipText: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      color: theme.textSecondary,
    },
    flowContent: {
      flex: 1,
    },
    wizardTopBar: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    closeBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
      justifyContent: "center",
      alignItems: "center",
    },
    headingContainer: {
      alignItems: "center",
    },
    mainHeading: {
      fontSize: 28,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      textAlign: "center",
      marginBottom: 12,
    },
    mainHeadingRow: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "center",
      marginBottom: 16,
    },
    cursiveHeading: {
      fontSize: 32,
      fontFamily: theme.fonts.cursive,
      color: theme.text,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
      borderRadius: 16,
      marginBottom: 24,
      height: 52,
      borderWidth: 1,
      borderColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    searchInput: {
      flex: 1,
      height: "100%",
      paddingHorizontal: 16,
      fontSize: 16,
      fontFamily: theme.fonts.medium,
    },
    addCustomBtn: {
      width: "100%",
      padding: 16,
      borderRadius: 12,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
      alignItems: "center",
      marginTop: 12,
    },
    counterContainer: {
      marginTop: 32,
      alignItems: "center",
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
      padding: 24,
      borderRadius: 20,
      borderWidth: 1,
      borderColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    },
    counterLabel: {
      fontSize: 15,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      marginBottom: 16,
    },
    counterControl: {
      flexDirection: "row",
      alignItems: "center",
      gap: 32,
    },
    counterBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      justifyContent: "center",
      alignItems: "center",
    },
    counterBtnText: {
      fontSize: 24,
      fontFamily: theme.fonts.medium,
      color: theme.text,
      lineHeight: 28,
    },
    counterValueContainer: {
      alignItems: "center",
      width: 70,
    },
    counterValue: {
      fontSize: 32,
      fontFamily: theme.fonts.bold,
      color: theme.text,
    },
    counterSuffix: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    resumeContainer: {
      marginTop: 16,
    },
    resumeOptionsContainer: {
      gap: 16,
      marginBottom: 32,
    },
    sectionLabel: {
      fontSize: 13,
      fontFamily: theme.fonts.bold,
      color: theme.textSecondary,
      marginBottom: 12,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    resumeMiniCard: {
      width: 160,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(255,255,255,0.02)"
          : theme.backgroundElement,
      position: "relative",
    },
    resumeCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(255,255,255,0.02)"
          : theme.backgroundElement,
    },
    resumeCardActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    resumeCardIconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    resumeCardTitle: {
      fontSize: 16,
      fontFamily: theme.fonts.bold,
      color: theme.text,
      marginBottom: 4,
    },
    resumeCardSub: {
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
    },
    linkedInContainer: {
      marginBottom: 40,
    },
    linkedInLabel: {
      fontSize: 15,
      fontFamily: theme.fonts.semiBold,
      color: theme.text,
      marginBottom: 12,
      textAlign: "center",
    },
    linkedInInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
      borderRadius: 16,
      height: 52,
      borderWidth: 1,
      borderColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    subHeading: {
      fontSize: 15,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 32,
    },
    disclaimerContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
      padding: 12,
      borderRadius: 12,
      marginTop: 16,
      marginBottom: 16,
      gap: 10,
    },
    disclaimerText: {
      flex: 1,
      fontSize: 13,
      fontFamily: theme.fonts.medium,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    pillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      justifyContent: "center",
      paddingBottom: 40,
    },
    bubbleContainer: {
      width: 800,
      height: 800,
      position: "relative",
    },
    bubbleItem: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      padding: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    bubbleText: {
      fontFamily: theme.fonts.bold,
      textAlign: "center",
      marginTop: 6,
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 100,
      borderWidth: 1,
      gap: 6,
    },
    pillText: {
      fontSize: 14,
      fontFamily: theme.fonts.semiBold,
    },
    flowFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    pagination: {
      flexDirection: "row",
      gap: 6,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.textSecondary,
      opacity: 0.3,
    },
    dotActive: {
      backgroundColor: theme.text,
      width: 16,
      opacity: 1,
    },
    nextBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.text,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 100,
      gap: 8,
    },
    nextText: {
      fontSize: 15,
      fontFamily: theme.fonts.bold,
      color: theme.background,
    },
    footerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    footerBackBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
      justifyContent: "center",
      alignItems: "center",
    },
  });

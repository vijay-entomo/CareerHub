import { AnimatedTabs } from "@/components/AnimatedTabs";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import {
  Award,
  Briefcase,
  Code,
  Folder,
  GraduationCap,
  Trophy,
  Users,
} from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView as GHScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import Education from "./education";

const AnimatedGHScrollView = Animated.createAnimatedComponent(GHScrollView);

const PROFILE_SECTIONS = [
  { id: "education", label: "Education", icon: GraduationCap, count: 0 },
  { id: "experience", label: "Experience", icon: Briefcase, count: 0 },
  { id: "certifications", label: "Certifications", icon: Award, count: 0 },
  { id: "projects", label: "Projects", icon: Folder, count: 0 },
  { id: "cocurricular", label: "Co-Curricular", icon: Users, count: 0 },
  { id: "skills", label: "Skills", icon: Code, count: 0 },
  { id: "achievements", label: "Achievements", icon: Trophy, count: 0 },
];

export default function MasterProfileHub() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const router = useRouter();

  const scrollY = useSharedValue(0);
  const [activeTab, setActiveTab] = useState(PROFILE_SECTIONS[0].id);

  const [counts, setCounts] = useState<Record<string, number>>({
    education: 1, // Start with 1 because of our mock data
    experience: 0,
    certifications: 0,
    projects: 0,
    cocurricular: 0,
    skills: 0,
    achievements: 0,
  });

  const activeSection = PROFILE_SECTIONS.find((s) => s.id === activeTab);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleEducationCountChange = useCallback((count: number) => {
    setCounts((prev) => {
      if (prev.education === count) return prev;
      return { ...prev, education: count };
    });
  }, []);

  const renderActiveSection = () => {
    if (!activeSection) return null;

    const ActiveIcon = activeSection.icon;

    if (activeSection.id === "education") {
      return (
        <MotiView
          key="education"
          from={{ opacity: 0, translateY: 15, scale: 0.98 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          exit={{ opacity: 0, translateY: -15, scale: 0.98 }}
          transition={{ type: "timing", duration: 300 }}
        >
          <Education onCountChange={handleEducationCountChange} />
        </MotiView>
      );
    }

    return (
      <MotiView
        key={activeSection.id}
        from={{ opacity: 0, translateY: 15, scale: 0.98 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        exit={{ opacity: 0, translateY: -15, scale: 0.98 }}
        transition={{ type: "timing", duration: 300 }}
      >
        <EmptyState
          icon={ActiveIcon}
          title={`No ${activeSection.label} Added`}
          subtitle={`Add your ${activeSection.label.toLowerCase()} to strengthen your profile.`}
          buttonText={`Add ${activeSection.label}`}
          onAdd={() => console.log(`Adding ${activeSection.id}`)}
        />
      </MotiView>
    );
  };

  return (
    <View style={commonStyles.container}>
      <Header title="Master Profile" showBack={true} scrollY={scrollY} />

      <AnimatedGHScrollView
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky Tab Bar Wrapper */}
        <View style={[styles.stickyTabsWrapper]}>
          <AnimatedTabs
            tabs={PROFILE_SECTIONS.map((s) => ({
              ...s,
              count: counts[s.id] || 0,
            }))}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </View>

        <View style={styles.contentArea}>
          <AnimatePresence exitBeforeEnter={false} mode="wait">
            {renderActiveSection()}
          </AnimatePresence>
        </View>
      </AnimatedGHScrollView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    stickyTabsWrapper: {
      paddingVertical: 8,
      backgroundColor: theme.background, // crucial for sticking without bleeding
      zIndex: 10,
    },
  });

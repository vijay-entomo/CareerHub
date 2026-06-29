import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { ArrowRight, Sparkles } from "lucide-react-native";
import { MotiView } from "moti";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Header } from "../../components/Header";
import { JobCard } from "../../components/JobCard";

export default function JobsMain() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme, commonStyles);
  const router = useRouter();

  const scrollY = useSharedValue(0);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={commonStyles.container}>
      <View style={{ flex: 1 }}>
        <Header
          title="Explore Jobs"
          showBack
          onBack={() => router.back()}
          scrollY={scrollY}
        />
        <Animated.ScrollView
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleVerticalScroll}
          scrollEventThrottle={16}
        >
          {/* AI Prominent Banner */}
          <Pressable onPress={() => router.push("/jobs/ai-wizard")}>
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 800 }}
              style={styles.aiBanner}
            >
              <View style={styles.aiBannerBg}>
                <MotiView
                  from={{ scale: 1.1, rotate: "-5deg" }}
                  animate={{ scale: 1.3, rotate: "5deg" }}
                  transition={{
                    type: "timing",
                    duration: 12000,
                    loop: true,
                    repeatReverse: true,
                  }}
                  style={[StyleSheet.absoluteFillObject, { width: "100%", height: "100%" }]}
                >
                  <Image
                    source={require("../../../assets/images/ai-banner-bg.png")}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </MotiView>
                {Platform.OS === "web" ? (
                  <View
                    style={[
                      StyleSheet.absoluteFillObject,
                      { backgroundColor: theme.mode === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)" },
                      // @ts-ignore
                      { backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }
                    ]}
                  />
                ) : (
                  <BlurView
                    intensity={30}
                    tint={theme.mode === "dark" ? "dark" : "light"}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <View style={styles.glassOverlay} />
              </View>
              <View style={styles.aiBannerContent}>
                <View style={styles.aiIconWrapper}>
                  <Sparkles size={22} color="#111111" />
                </View>
                <View style={styles.aiBannerTextContainer}>
                  <Text style={styles.aiBannerTitle}>Career AI Match</Text>
                  <Text style={styles.aiBannerSubtitle}>
                    Let AI find your perfect job
                  </Text>
                </View>
                <View style={styles.aiBannerBtn}>
                  <ArrowRight size={18} color="#111111" />
                </View>
              </View>
            </MotiView>
          </Pressable>

          <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
            <JobCard
              companyName="Google"
              companyLogoUri="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              matchLevel="HIGH"
              postedDate="2 days ago"
              title="Lead UX Designer"
              isAssessmentRequired={true}
              employmentType="Full Time"
              salary="$125K"
              experience="Min 2 Yrs"
              location="New York"
              applicantCount="45 Applicants"
            />
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
}

const createStyles = (theme: any, commonStyles: any) =>
  StyleSheet.create({
    aiBanner: {
      borderRadius: 16,
      position: "relative",
      backgroundColor: "transparent",

      // Glass Drop Shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    aiBannerBg: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 16,
      overflow: "hidden",

      // 3D Glass Highlight Border
      ...commonStyles.liquidGlassBorder,
    },
    glassOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.1)",
    },
    aiBannerContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: 24,
      gap: 16,
    },
    aiIconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.6)",
      justifyContent: "center",
      alignItems: "center",
      ...commonStyles.liquidGlassBorder,
    },
    aiBannerTextContainer: {
      flex: 1,
    },
    aiBannerTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: "#111111", // Dark text for light background
      marginBottom: 4,
    },
    aiBannerSubtitle: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: "rgba(0,0,0,0.6)",
    },
    aiBannerBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.6)",
      justifyContent: "center",
      alignItems: "center",
      ...commonStyles.liquidGlassBorder,
    },
  });

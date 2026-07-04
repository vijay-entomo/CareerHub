import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { BlurView } from "expo-blur";
import { ArrowRight, Compass, Lock, Sparkles, Target, Check, Award, ChevronRight } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View, Modal } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path, G, Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useAnimatedProps
} from "react-native-reanimated";

import { Header } from "../../components/Header";
import { Button } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedDashedLine = ({ theme }: { theme: any }) => {
  const dashOffset = useSharedValue(0);
  
  useEffect(() => {
    dashOffset.value = withRepeat(
      withTiming(-28, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: dashOffset.value,
    };
  });

  return (
    <View style={{ flex: 1, height: 2, marginHorizontal: 8, overflow: "hidden", opacity: theme.mode === "dark" ? 0.6 : 0.4, marginTop: -20 }}>
      <Svg width="100%" height="2" style={{ overflow: "visible" }}>
        <AnimatedPath 
          d="M 0 1 L 1000 1" 
          stroke={theme.mode === "dark" ? "#818CF8" : "#6366F1"} 
          strokeWidth="2.5" 
          strokeDasharray="6,8" 
          strokeLinecap="round" 
          animatedProps={animatedProps} 
        />
      </Svg>
    </View>
  );
};

const LockedRoadmapCard = ({ theme, commonStyles }: { theme: any, commonStyles: any }) => {
  return (
    <View
      style={{
        marginTop: 32,
        borderRadius: 40,
        backgroundColor: theme.mode === "dark" ? "#1E1E2D" : "#FFFFFF", 
        overflow: "hidden",
        borderWidth: 1.5,
        borderColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(99, 102, 241, 0.15)", // Premium colored border instead of sad gray
        // Pop-out shadow
        shadowColor: theme.mode === "dark" ? "#000" : "rgba(99, 102, 241, 0.4)", // Tinted shadow
        shadowOffset: { width: 0, height: 24 },
        shadowOpacity: theme.mode === "dark" ? 0.5 : 0.2, 
        shadowRadius: 32,
        elevation: 12,
        padding: 32,
      }}
    >
      {/* Vibrant Aurora Background layer via SVG */}
      <View style={StyleSheet.absoluteFillObject}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.mode === "dark" ? "transparent" : "#FAFAFF" }]} />
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="grad1" cx="0%" cy="0%" rx="100%" ry="100%">
              <Stop offset="0" stopColor={theme.mode === "dark" ? "rgba(99, 102, 241, 0.25)" : "rgba(99, 102, 241, 0.18)"} />
              <Stop offset="1" stopColor="transparent" />
            </RadialGradient>
            <RadialGradient id="grad2" cx="100%" cy="100%" rx="100%" ry="100%">
              <Stop offset="0" stopColor={theme.mode === "dark" ? "rgba(236, 72, 153, 0.25)" : "rgba(250, 204, 21, 0.2)"} />
              <Stop offset="1" stopColor="transparent" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad1)" />
          <Rect width="100%" height="100%" fill="url(#grad2)" />
        </Svg>
      </View>



      {/* Huge Bold Title */}
      <Text 
        style={{ 
          fontFamily: theme.fonts.black, 
          fontSize: 32, 
          color: theme.text, 
          lineHeight: 36, 
          letterSpacing: -1, 
          marginBottom: 16 
        }}
      >
        Unlock Your{"\n"}True Potential.
      </Text>
      
      {/* Subtitle */}
      <Text 
        style={{ 
          fontFamily: theme.fonts.medium, 
          fontSize: 15, 
          color: theme.textSecondary, 
          lineHeight: 22, 
          marginBottom: 48, 
          paddingRight: 10 
        }}
      >
        Discover the precise skills and steps needed to transition from your current position to your ultimate dream role.
      </Text>

      {/* Visual Journey Map (Flex Layout to prevent overflow) */}
      <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 48 }}>
        
        {/* NOW Node */}
        <View style={{ alignItems: "center", width: 48 }}>
          <View 
            style={{ 
              width: 16, height: 16, borderRadius: 8, backgroundColor: "#3B82F6", 
              borderWidth: 4, borderColor: theme.mode === "dark" ? "#1E1E2D" : "#FFFFFF", 
              shadowColor: "#3B82F6", shadowOffset: { width: 0, height: 4 }, 
              shadowOpacity: 0.6, shadowRadius: 8, elevation: 5 
            }} 
          />
          <Text style={{ fontFamily: theme.fonts.bold, fontSize: 10, color: theme.text, marginTop: 8, letterSpacing: 0.5 }}>NOW</Text>
        </View>

        {/* The Dashed Path (Animated Left) */}
        <AnimatedDashedLine theme={theme} />

        {/* THE LOCK (Center Blockade) */}
        <View 
          style={{ 
            width: 56, height: 56, borderRadius: 28, backgroundColor: theme.mode === "dark" ? "#2D2D3D" : "#FFFFFF", 
            justifyContent: "center", alignItems: "center", marginTop: -20,
            shadowColor: theme.mode === "dark" ? "#000" : "rgba(148, 163, 184, 0.4)", shadowOffset: { width: 0, height: 8 }, 
            shadowOpacity: 0.3, shadowRadius: 16, elevation: 10,
            borderWidth: 1.5, borderColor: theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "#E2E8F0"
          }}
        >
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F1F5F9", justifyContent: "center", alignItems: "center" }}>
            <Lock size={18} color={theme.mode === "dark" ? theme.text : "#475569"} strokeWidth={2.5} />
          </View>
        </View>

        {/* The Dashed Path (Animated Right) */}
        <AnimatedDashedLine theme={theme} />

        {/* DREAM ROLE Node */}
        <View style={{ alignItems: "center", width: 56 }}>
          <View 
            style={{ 
              width: 28, height: 28, borderRadius: 14, backgroundColor: "#F59E0B", 
              borderWidth: 4, borderColor: theme.mode === "dark" ? "#1E1E2D" : "#FFFFFF", 
              shadowColor: "#F59E0B", shadowOffset: { width: 0, height: 4 }, 
              shadowOpacity: 0.6, shadowRadius: 10, elevation: 5, 
              justifyContent: "center", alignItems: "center" 
            }}
          >
            <Sparkles size={12} color="#FFF" />
          </View>
          <Text style={{ fontFamily: theme.fonts.bold, fontSize: 10, color: theme.text, marginTop: 8, letterSpacing: 0.5, textAlign: "center" }}>DREAM</Text>
        </View>
      </View>

      {/* Call to Action Button */}
      <View style={{ shadowColor: theme.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10, width: "100%" }}>
        <Button
          title="Complete Profile to Unlock"
          variant="primary"
          style={{ width: "100%" }}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

const PathTimelineCard = ({ theme, commonStyles }: { theme: any, commonStyles: any }) => {
  const router = useRouter();
  const steps = [
    { title: "Junior Product Designer", status: "completed" },
    { title: "Product Designer", status: "pending" },
    { title: "Senior Product Designer", status: "pending" },
    { title: "Design Lead", status: "pending" },
    { title: "Chief Design Officer", status: "goal" }
  ];

  return (
    <View style={{ marginTop: 24, marginBottom: 40 }}>
      <SectionHeader title="Path from Your Current Role" />
      
      <View style={[commonStyles.card, { padding: 24, paddingVertical: 32 }]}>
        
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isCompleted = step.status === "completed";
          const isGoal = step.status === "goal";
          
          return (
            <View key={index} style={{ flexDirection: "row", marginBottom: isLast ? 0 : 36 }}>
              {/* Timeline Column */}
              <View style={{ alignItems: "center", width: 40, marginRight: 20 }}>
                {/* Connecting Line (drawn first so it goes under the node) */}
                {!isLast && (
                  <View style={{
                    position: "absolute",
                    top: 16,
                    bottom: -36,
                    width: 3,
                    backgroundColor: isCompleted ? "#FACC15" : (theme.mode === "dark" ? "#334155" : "#E2E8F0"),
                    zIndex: 0
                  }} />
                )}

                {/* Node */}
                <View style={{
                  width: 36, height: 36, borderRadius: 18, 
                  backgroundColor: isCompleted ? "#FACC15" : (theme.mode === "dark" ? "#111827" : "#0F172A"),
                  justifyContent: "center", alignItems: "center",
                  shadowColor: isCompleted ? "#FACC15" : "transparent",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isCompleted ? 0.6 : 0,
                  shadowRadius: 12,
                  elevation: isCompleted ? 4 : 0,
                  borderWidth: isCompleted ? 0 : 4,
                  borderColor: isCompleted ? "transparent" : (theme.mode === "dark" ? "#1E293B" : "#334155"),
                  zIndex: 1
                }}>
                  {isCompleted && <Check size={18} color="#111827" strokeWidth={3} />}
                  {isGoal && <Award size={18} color="#FACC15" strokeWidth={2.5} />}
                  {!isCompleted && !isGoal && (
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.mode === "dark" ? "#475569" : "#94A3B8" }} />
                  )}
                </View>
              </View>
              
              {/* Content Column */}
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={{ 
                  fontFamily: isCompleted || isGoal ? theme.fonts.bold : theme.fonts.medium, 
                  fontWeight: isCompleted || isGoal ? "bold" : "500",
                  fontSize: 16, 
                  color: isCompleted || isGoal ? theme.text : theme.textSecondary 
                }}>
                  {step.title}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={{ marginTop: 32, alignItems: "center" }}>
          <Button
            title="View Details"
            variant="primary"
            onPress={() => router.push("/career-pathways/path-details")}
            style={{ width: "100%" }}
          />
        </View>
      </View>
    </View>
  );
};

export default function CareerPathwaysMain() {
  const commonStyles = useCommonStyles();
  const theme = useTheme();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const [isCopilotModalVisible, setIsCopilotModalVisible] = useState(false);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={commonStyles.container}>
      <Header
        title="Career Pathways"
        showBack={false}
        isTabScreen={true}
        scrollY={scrollY}
      />

      <Animated.ScrollView
        contentContainerStyle={[
          commonStyles.scrollContentFullBleed,
          { paddingHorizontal: 20 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        <Pressable onPress={() => setIsCopilotModalVisible(true)}>
          {Platform.OS === "web" && (
            <style>{`
              [data-class~="ai-copilot-card"] {
                border-radius: 48px !important;
              }
              [data-class~="ai-copilot-card-inner"] {
                border-radius: 42px !important;
              }
              @supports (corner-shape: squircle) {
                [data-class~="ai-copilot-card"], [data-class~="ai-copilot-card-inner"] {
                  corner-shape: squircle !important;
                }
              }
            `}</style>
          )}
          <View
            // @ts-ignore
            dataSet={{ class: "ai-copilot-card" }}
            style={{
              width: "100%",
              padding: 6,
              borderRadius: 48,
              // @ts-ignore
              cornerCurve: "continuous",
              backgroundColor:
                theme.mode === "dark"
                  ? "rgba(255, 175, 140, 0.15)"
                  : "rgba(255, 175, 140, 0.2)",
              borderWidth: 1.5,
              borderColor:
                theme.mode === "dark"
                  ? "rgba(255, 175, 140, 0.3)"
                  : "rgba(255, 175, 140, 0.5)",
            }}
          >
            <View
              // @ts-ignore
              dataSet={{ class: "ai-copilot-card-inner" }}
              style={[
                {
                  width: "100%",
                  padding: 20,
                  borderRadius: 42,
                  // @ts-ignore
                  cornerCurve: "continuous",
                  backgroundColor: "#FFF0E5",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                // @ts-ignore
                {
                  backgroundImage: `radial-gradient(at 15% 50%, rgba(255, 175, 140, 0.9) 0px, transparent 50%), radial-gradient(at 45% 10%, rgba(255, 145, 215, 0.8) 0px, transparent 60%), radial-gradient(at 90% 40%, rgba(255, 180, 150, 0.9) 0px, transparent 60%), radial-gradient(at 50% 90%, rgba(255, 230, 200, 0.8) 0px, transparent 50%)`,
                },
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    opacity: 0.9,
                    marginRight: 14,
                  }}
                >
                  <Svg viewBox="0 0 89.776 89.776" width="100%" height="100%">
                    <G fill="#111111">
                      <Path d="m24.291 19.8c-2.5 3.4-6.9 5.7-11 7-1.3.2-2.5.6-3.5 1.1-1.6.7-.8 3.3.9 3.3 5-.1 10.4-1 13.3 4 1.3 2.3 1.4 5.1 1.8 7.6.5 4.1 1.7 14 1.8 14.1.4 3.2 5.7 3.1 5.6-1.3-.2-6.1.7-12.8 3.5-18.2 1.2-2.4 3.1-4.5 5.4-5.9 1-.6 2.1-1 3.2-1.3 1.4.2 2.8.1 4.1-.2 2.5-.6 2.1-3.8 0-4.6-2.9-1-5.9-1-8.8-2.5-2.5-1.3-4.5-3.2-6.1-5.6-1.7-2.6-2.2-5.2-2.5-7.9 0-2.4-.1-4.8-.2-7-.1-3.2-5.1-3.2-5 0 .1 1.9.2 4.1.3 6.4v1.2c-.3 3.7-.9 7.2-2.8 9.8zm3.6 3.3c.8-.9 1.4-1.9 1.9-3 .2.3.3.5.5.8 1.8 2.8 4.8 5.5 8.2 7.4-2.2 1.4-4.1 3.2-5.2 4.7-1.3 1.7-2.3 3.7-3.1 5.8-.7-3.8-2.1-7.1-5.2-9.6-.7-.6-1.6-1-2.4-1.4 1.9-1.5 3.8-3 5.3-4.7z" />
                      <Path d="m57.491 44c-.8.1-1.5.4-2.3.7-1 .5-.5 2 .6 2 3.7 0 7.7-.5 8.9 4 .3 1.2.4 2.6.5 3.8.3 2.4.6 4.8.9 7.2v.3c0 .2 0 .4.1.6v.2c.3 2.1 2.8 2 3.2.3.2-.3.3-.6.3-1.1-.1-3.8.4-8.3 2.3-11.7 1.5-2.6 3.5-3.3 5.8-4.2h1.6c1.6-.2 2.1-2.5.4-2.9-3.6-1-6.9-1.5-9.2-4.9-1-1.5-1.5-3.1-1.7-4.8 0-1.6-.1-3.2-.1-4.7-.1-2-3.2-2-3.1 0 0 1 .3 7.8-1.2 10.5-1.4 2.4-4.4 3.8-7 4.7zm9.1-2.5c.4-.5.8-1.1 1.1-1.7 1.4 2.1 3.4 3.8 5.5 5-1.2.7-2.3 1.7-3 2.5-1 1.2-1.8 2.6-2.4 4.1-.6-3.2-2.5-5.7-5-6.8 1.6-.8 2.8-1.8 3.8-3.1z" />
                      <Path d="m47.391 63.8c-1.8-2.5-1.8-8-1.8-9.5-.1-2-3.2-2-3.1 0 0 1 .1 7.6-1.2 10.5-1.1 2.5-4.4 3.8-7 4.6-.8.1-1.5.4-2.3.7-1 .5-.5 2 .6 2 3.7 0 7.7-.5 8.9 4 .3 1.2.4 2.6.5 3.8.3 2.4.6 4.8.9 7.2v.3c0 .2 0 .4.1.6v.2c.3 2.1 2.8 2 3.2.3.2-.3.3-.6.3-1.1-.1-3.8.4-8.3 2.3-11.7 1.5-2.6 3.5-3.3 5.8-4.2h1.6c1.6-.2 2.1-2.5.4-2.9-3.6-.9-6.8-1.5-9.2-4.8zm-.3 9c-1 1.2-1.8 2.6-2.4 4.1-.6-3.2-2.5-5.7-5-6.8 1.4-.8 2.7-1.8 3.7-3.1.4-.5.8-1.1 1.1-1.7 1.4 2.1 3.4 3.8 5.5 5-1.2.7-2.2 1.6-2.9 2.5z" />
                    </G>
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: theme.fonts.bold,
                      fontSize: 16,
                      color: "#111111",
                    }}
                  >
                    Career Exploration
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.fonts.medium,
                      fontSize: 13,
                      color: "rgba(17, 17, 17, 0.75)",
                      marginTop: 2,
                    }}
                  >
                    Discover tailored domains and the full career spectrum
                  </Text>
                </View>
              </View>
              <View
                style={[
                  {
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  },
                  commonStyles.liquidGlassBorder,
                ]}
              >
                {Platform.OS === "web" ? (
                  <View
                    style={[
                      StyleSheet.absoluteFillObject,
                      {
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                      } as any,
                    ]}
                  />
                ) : (
                  <BlurView
                    intensity={30}
                    tint="light"
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <View style={{ zIndex: 1, elevation: 1 }}>
                  <ArrowRight size={16} color="#111111" strokeWidth={3} />
                </View>
              </View>
            </View>
          </View>
        </Pressable>

        <LockedRoadmapCard theme={theme} commonStyles={commonStyles} />
        <PathTimelineCard theme={theme} commonStyles={commonStyles} />
      </Animated.ScrollView>

      <Modal
        visible={isCopilotModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCopilotModalVisible(false)}
      >
        <Pressable 
          style={{ 
            flex: 1, 
            backgroundColor: theme.mode === "dark" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)", 
            justifyContent: "center", 
            alignItems: "center", 
            padding: 24 
          }}
          onPress={() => setIsCopilotModalVisible(false)}
        >
          {/* Modal Container */}
          <Pressable 
            style={{ 
              width: "100%", 
              backgroundColor: theme.mode === "dark" ? "#1E1E2D" : "#FFFFFF", 
              borderRadius: 32, 
              padding: 24, 
              shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 20,
              borderWidth: 1,
              borderColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={{ marginBottom: 24, alignItems: "center" }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.mode === "dark" ? "#2D2D3D" : "#FAFAFA", justifyContent: "center", alignItems: "center", marginBottom: 16, borderWidth: 1, borderColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F1F5F9" }}>
                <Sparkles size={24} color={theme.text} />
              </View>
              <Text style={{ fontFamily: theme.fonts.black, fontSize: 24, color: theme.text, marginBottom: 8, textAlign: "center" }}>
                Career Discovery
              </Text>
              <Text style={{ fontFamily: theme.fonts.medium, fontSize: 14, color: theme.textSecondary, textAlign: "center", paddingHorizontal: 10 }}>
                Choose your exploration path to unlock tailored opportunities.
              </Text>
            </View>

            <View style={{ gap: 16 }}>
              {/* Option 1: Amber/Gold Design */}
              <Pressable 
                style={[
                  commonStyles.card, 
                  { 
                    flexDirection: "row", alignItems: "center", padding: 20, 
                    backgroundColor: theme.mode === "dark" ? "#2D2D3D" : "#FFFFFF", 
                    borderWidth: 1, borderColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F1F5F9",
                    shadowColor: "#F59E0B", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
                  }
                ]}
              >
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(245, 158, 11, 0.15)", justifyContent: "center", alignItems: "center", marginRight: 16 }}>
                  <Target size={24} color="#F59E0B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: theme.fonts.bold, fontSize: 16, color: theme.text, marginBottom: 4 }}>
                    Recommended Domains
                  </Text>
                  <Text style={{ fontFamily: theme.fonts.medium, fontSize: 13, color: theme.textSecondary, lineHeight: 18 }}>
                    Explore tailored domains and see the precise path to reach them.
                  </Text>
                </View>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(245, 158, 11, 0.1)", justifyContent: "center", alignItems: "center", marginLeft: 12 }}>
                  <ArrowRight size={16} color="#F59E0B" strokeWidth={2.5} />
                </View>
              </Pressable>

              {/* Option 2: Cyan/Teal Design */}
              <Pressable 
                onPress={() => {
                  setIsCopilotModalVisible(false);
                  router.push("/career-pathways/career-spectrum");
                }}
                style={[
                  commonStyles.card, 
                  { 
                    flexDirection: "row", alignItems: "center", padding: 20, 
                    backgroundColor: theme.mode === "dark" ? "#2D2D3D" : "#FFFFFF", 
                    borderWidth: 1, borderColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#F1F5F9",
                    shadowColor: "#06B6D4", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
                  }
                ]}
              >
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(6, 182, 212, 0.15)", justifyContent: "center", alignItems: "center", marginRight: 16 }}>
                  <Compass size={24} color="#06B6D4" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: theme.fonts.bold, fontSize: 16, color: theme.text, marginBottom: 4 }}>
                    Full Career Spectrum
                  </Text>
                  <Text style={{ fontFamily: theme.fonts.medium, fontSize: 13, color: theme.textSecondary, lineHeight: 18 }}>
                    Go beyond tailored picks and explore entirely new untouched roles.
                  </Text>
                </View>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(6, 182, 212, 0.1)", justifyContent: "center", alignItems: "center", marginLeft: 12 }}>
                  <ArrowRight size={16} color="#06B6D4" strokeWidth={2.5} />
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

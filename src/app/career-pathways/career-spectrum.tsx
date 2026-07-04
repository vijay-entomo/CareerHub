import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import React, { useMemo, useEffect, useRef } from "react";
import { View, Text, Pressable, ScrollView, Dimensions, StyleSheet } from "react-native";
import Animated, { FadeIn, withRepeat, withSequence, withTiming, useAnimatedStyle, useSharedValue, Easing, useAnimatedScrollHandler, interpolate, withSpring } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ArrowRight } from "lucide-react-native";
import { Header } from "../../components/Header";

const CAREER_AREAS = [
  "Agriculture, Horticulture, & the Outdoors",
  "Business Management and Operations",
  "Clerical and Administrative",
  "Community and Social Services",
  "Construction, Extraction, and Architecture",
  "Customer and Client Support",
  "Design, Media, and Writing",
  "Education and Training",
  "Engineering",
  "Finance",
  "Healthcare",
  "Hospitality, Food, and Tourism",
  "Human Resources",
  "Information Technology and Computer Science",
  "Law, Compliance, and Public Safety",
  "Maintenance, Repair, and Installation",
  "Manufacturing and Production",
  "Marketing and Public Relations",
  "Military",
  "Performing Arts",
  "Personal Services",
  "Sales",
  "Science and Research",
  "Social Analysis and Planning",
  "Students",
  "Transportation"
];

const CANVAS_SIZE = 3000; // Massive 2D canvas to allow scrolling past edges
const CENTER = CANVAS_SIZE / 2;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Generate a beautiful, perfectly spaced concentric ring distribution
const getPerfectRingPositions = (count: number) => {
  const positions = [];
  
  const rings = [
    { count: 6, radius: 240 },
    { count: 10, radius: 460 },
    { count: 10, radius: 680 }
  ];
  
  let currentIdx = 0;
  
  for (let ringIndex = 0; ringIndex < rings.length; ringIndex++) {
    const ring = rings[ringIndex];
    const itemsInRing = Math.min(ring.count, count - currentIdx);
    
    // Stagger odd rings for an interlocked look
    const angleOffset = ringIndex % 2 !== 0 ? (Math.PI / itemsInRing) : 0;
    
    for (let i = 0; i < itemsInRing; i++) {
      const angle = (i / itemsInRing) * Math.PI * 2 + angleOffset;
      const x = CENTER + Math.cos(angle) * ring.radius;
      const y = CENTER + Math.sin(angle) * ring.radius;
      positions.push({ x, y });
      currentIdx++;
    }
    
    if (currentIdx >= count) break;
  }
  
  // Fallback for any extra items
  let fallbackRadius = 900;
  while (currentIdx < count) {
    const remaining = count - currentIdx;
    const itemsInRing = Math.min(12, remaining);
    for (let i = 0; i < itemsInRing; i++) {
      const angle = (i / itemsInRing) * Math.PI * 2;
      const x = CENTER + Math.cos(angle) * fallbackRadius;
      const y = CENTER + Math.sin(angle) * fallbackRadius;
      positions.push({ x, y });
      currentIdx++;
    }
    fallbackRadius += 220;
  }
  
  return positions;
};

const FloatingPill = ({ area, position, index, theme, scrollX, scrollY }: any) => {
  const floatY = useSharedValue(0);
  
  useEffect(() => {
    // Random duration between 2s and 4s for an organic, disconnected feel
    const duration = 2000 + Math.random() * 2000;
    
    setTimeout(() => {
      floatY.value = withRepeat(
        withSequence(
          withTiming(-12, { duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(12, { duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, Math.random() * 1000); // Random stagger start
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    // Viewport center in absolute canvas coordinates
    const viewCenterX = scrollX.value + (SCREEN_WIDTH / 2);
    // Rough estimation of header offset for vertical center
    const viewCenterY = scrollY.value + (SCREEN_HEIGHT / 2) - 80;
    
    // Distance from the center of this specific pill to the center of the viewport
    const dx = position.x - viewCenterX;
    const dy = position.y - viewCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Proximity scale: larger in the center, dramatically shrinking out towards edges
    const proximityScale = interpolate(
      distance, 
      [0, 150, 400], 
      [1.3, 1.0, 0.5], 
      "clamp"
    );

    return {
      transform: [
        // withSpring fills in any dropped frames to ensure absolute silky smoothness
        { scale: withSpring(proximityScale, { damping: 20, stiffness: 150 }) },
        { translateY: floatY.value }
      ]
    };
  });

  return (
    <Animated.View 
      entering={FadeIn.delay(index * 60).duration(800)}
      style={[
        {
          position: "absolute",
          left: position.x - 150, // 300/2
          top: position.y - 50,  // 100/2
          width: 300,
          height: 100,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10
        },
        animatedStyle
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.mode === "dark" ? "#2D2D3D" : "#FFFFFF",
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 100,
            borderWidth: 1.5,
            borderColor: theme.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
          }
        ]}
      >
        <View 
          style={{ 
            width: 8, height: 8, borderRadius: 4, backgroundColor: "#F59E0B", 
            marginRight: 10, shadowColor: "#F59E0B", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.6, shadowRadius: 4, elevation: 2
          }} 
        />
        <Text style={{ fontFamily: theme.fonts.bold, fontSize: 12, color: theme.text, letterSpacing: 0.5 }}>
          {area}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default function CareerSpectrum() {
  const commonStyles = useCommonStyles();
  const theme = useTheme();
  
  const horizontalScrollRef = useRef<any>(null);
  const verticalScrollRef = useRef<any>(null);
  
  const headerScrollY = useSharedValue(100);
  const scrollX = useSharedValue(CENTER - SCREEN_WIDTH / 2); // Start roughly centered
  const scrollY = useSharedValue(CENTER - SCREEN_HEIGHT / 2); // Start roughly centered
  
  const zoomScale = useSharedValue(1);
  const savedZoomScale = useSharedValue(1);
  
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      zoomScale.value = Math.max(0.3, Math.min(savedZoomScale.value * e.scale, 3));
    })
    .onEnd(() => {
      savedZoomScale.value = zoomScale.value;
    });

  const animatedCanvasStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: zoomScale.value }]
    };
  });
  
  const handleScrollX = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });
  
  const handleScrollY = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  
  const handleRecenter = () => {
    horizontalScrollRef.current?.scrollTo({ x: CENTER - SCREEN_WIDTH / 2, animated: true });
    verticalScrollRef.current?.scrollTo({ y: CENTER - SCREEN_HEIGHT / 2 + 80, animated: true });
  };

  // Force scroll on mount to bypass any platform-specific contentOffset bugs
  useEffect(() => {
    setTimeout(() => {
      horizontalScrollRef.current?.scrollTo({ x: CENTER - SCREEN_WIDTH / 2, animated: false });
      verticalScrollRef.current?.scrollTo({ y: CENTER - SCREEN_HEIGHT / 2 + 80, animated: false });
    }, 10);
  }, []);
  
  // Memoize positions so they don't jump around on re-renders
  const positions = useMemo(() => getPerfectRingPositions(CAREER_AREAS.length), []);

  return (
    <View style={commonStyles.container}>
      <Header title="Career Spectrum" showBack={true} scrollY={headerScrollY} />

      {/* 2D Scrollable Canvas */}
      <GestureDetector gesture={pinchGesture}>
        <Animated.View style={{ flex: 1 }}>
          <Animated.ScrollView 
            ref={horizontalScrollRef}
            horizontal 
            onScroll={handleScrollX}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            bounces={true}
            contentOffset={{ x: CENTER - SCREEN_WIDTH / 2, y: 0 }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Animated.ScrollView 
              ref={verticalScrollRef}
              onScroll={handleScrollY}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              bounces={true}
              contentOffset={{ x: 0, y: CENTER - SCREEN_HEIGHT / 2 }}
              contentContainerStyle={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
            >
              <Animated.View style={[{ width: CANVAS_SIZE, height: CANVAS_SIZE }, animatedCanvasStyle]}>
                {/* Funky Canvas Background Pattern (Optional dots) */}
                <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: theme.mode === "dark" ? "#1A1A2E" : "#F8FAFC", opacity: 0.5 }} />

                {/* Center Target Circle */}
                <View style={{
                  position: 'absolute',
                  left: CENTER - 100,
                  top: CENTER - 100,
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  backgroundColor: theme.mode === 'dark' ? '#2D2D3D' : '#FFFFFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.1,
                  shadowRadius: 20,
                  elevation: 10,
                  borderWidth: 2,
                  borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  zIndex: 5
                }}>
                  <Text style={{ fontFamily: theme.fonts.bold, fontSize: 18, color: '#F59E0B', marginBottom: 4 }}>
                    Career Areas
                  </Text>
                  <Text style={{ fontFamily: theme.fonts.medium, fontSize: 12, color: theme.textSecondary, textAlign: 'center', paddingHorizontal: 20 }}>
                    Choose a career area to view the domains.
                  </Text>
                </View>

                {/* Orbiting Career Pills */}
                {CAREER_AREAS.map((area, index) => (
                  <FloatingPill 
                    key={area}
                    area={area}
                    position={positions[index]}
                    index={index}
                    theme={theme}
                    scrollX={scrollX}
                    scrollY={scrollY}
                  />
                ))}
              </Animated.View>
            </Animated.ScrollView>
          </Animated.ScrollView>
        </Animated.View>
      </GestureDetector>

      {/* Floating Center Compass Arrow */}
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 40,
            right: 24,
            zIndex: 100,
          },
          useAnimatedStyle(() => {
            const viewCenterX = scrollX.value + SCREEN_WIDTH / 2;
            const viewCenterY = scrollY.value + SCREEN_HEIGHT / 2 - 80;
            
            const dx = CENTER - viewCenterX;
            const dy = CENTER - viewCenterY;
            
            // Calculate pointing angle towards center
            const angle = Math.atan2(dy, dx);
            
            // Fade out the compass when we are perfectly in the center (within 200px)
            const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
            const opacity = withTiming(distanceToCenter > 200 ? 1 : 0);

            return {
              opacity,
              transform: [{ rotate: `${angle}rad` }]
            };
          })
        ]}
        pointerEvents="box-none"
      >
        <Pressable 
          onPress={handleRecenter}
          style={({ pressed }) => [
            { 
              width: 56, height: 56, borderRadius: 28, backgroundColor: theme.mode === "dark" ? "#FFFFFF" : "#000000", 
              justifyContent: "center", alignItems: "center", 
              shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
              transform: [{ scale: pressed ? 0.9 : 1 }]
            }
          ]}
        >
          <ArrowRight size={24} color={theme.mode === "dark" ? "#000000" : "#FFFFFF"} strokeWidth={3} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

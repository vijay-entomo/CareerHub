import { AppFonts } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { BlurView } from "expo-blur";
import {
  Code,
  DollarSign,
  MapPin,
  PieChart,
  Star,
  TrendingUp,
  SlidersHorizontal,
  X,
  CheckCircle2,
  Search,
} from "lucide-react-native";
import { Dimensions, Platform, StyleSheet, Text, View, Modal, Pressable, TextInput, ScrollView } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import { SectionHeader } from "./SectionHeader";
import { AILoader } from "./AILoader";
import React, { useState, useEffect } from "react";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 80; // Large visual card
const OVERLAP = 80; // Tucking background cards in deeper natively
const SNAP_INTERVAL = CARD_WIDTH - OVERLAP; // The physical distance the user actually has to swipe
const ITEM_SPACING = (width - SNAP_INTERVAL) / 2; // Exact math for perfect center snapping

const CARDS_DATA = [
  {
    id: "1",
    title: "RISING ROLE",
    icon: Star,
    color: "#EEF2FF", // Premium Indigo Light
    accent: "#4F46E5", // Indigo
    bgIllustration: (theme: any, item: any) => (
      <View
        style={[
          StyleSheet.absoluteFill,
          { overflow: "hidden", borderRadius: 56 },
        ]}
      >
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ opacity: theme.mode === "dark" ? 0.4 : 0.15 }}
        >
          <Defs>
            <LinearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={item.accent} stopOpacity="1" />
              <Stop offset="1" stopColor={item.accent} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path
            d="M0 100 L0 85 Q 25 80, 40 50 T 80 25 T 100 5 L100 100 Z"
            fill="url(#grad1)"
          />
          <Path
            d="M0 85 Q 25 80, 40 50 T 80 25 T 100 5"
            fill="none"
            stroke={item.accent}
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
        </Svg>
      </View>
    ),
    content: (theme: any, item: any) => (
      <>
        <View
          style={{
            backgroundColor:
              theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "#FFFFFF",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 24,
            alignSelf: "flex-start",
            marginBottom: 24,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Text
            style={{
              fontFamily: theme.fonts.bold,
              color: item.accent,
              fontSize: 13,
              letterSpacing: 0.5,
            }}
          >
            Machine Learning Engineer
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontFamily: theme.fonts.black,
              fontSize: 64,
              color: theme.text,
              letterSpacing: -2,
            }}
          >
            35
          </Text>
          <Text
            style={{
              fontFamily: theme.fonts.bold,
              fontSize: 32,
              color: item.accent,
            }}
          >
            %
          </Text>
        </View>
        <Text
          style={{
            fontFamily: theme.fonts.bold,
            fontSize: 15,
            color: theme.text,
            marginBottom: 12,
            letterSpacing: 1.5,
          }}
        >
          GROWTH
        </Text>
        <Text
          style={{
            fontFamily: theme.fonts.medium,
            fontSize: 15,
            color: theme.textSecondary,
            lineHeight: 24,
          }}
        >
          Strong demand driven by regional AI adoption, GenAI integration in IT-BPM, and production ML projects in the Philippines.
        </Text>
      </>
    ),
  },
  {
    id: "2",
    title: "ROLE DEMAND",
    icon: Code,
    color: "#FDF2F8", // Premium Pink Light
    accent: "#DB2777", // Pink
    bgIllustration: (theme: any, item: any) => (
      <View
        style={[
          StyleSheet.absoluteFill,
          { overflow: "hidden", borderRadius: 56 },
        ]}
      >
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient
              id="radarFade"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor={item.accent}
                stopOpacity={theme.mode === "dark" ? "0.6" : "0.3"}
              />
              <Stop offset="0.8" stopColor={item.accent} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          {/* Concentric rings expanding from the top left */}
          <Circle
            cx="0"
            cy="0"
            r="80"
            stroke="url(#radarFade)"
            strokeWidth="1.5"
            fill="none"
          />
          <Circle
            cx="0"
            cy="0"
            r="160"
            stroke="url(#radarFade)"
            strokeWidth="1.5"
            fill="none"
          />
          <Circle
            cx="0"
            cy="0"
            r="240"
            stroke="url(#radarFade)"
            strokeWidth="1.5"
            fill="none"
          />
          <Circle
            cx="0"
            cy="0"
            r="320"
            stroke="url(#radarFade)"
            strokeWidth="1.5"
            fill="none"
          />
          <Circle
            cx="0"
            cy="0"
            r="400"
            stroke="url(#radarFade)"
            strokeWidth="1.5"
            fill="none"
          />
          <Circle
            cx="0"
            cy="0"
            r="480"
            stroke="url(#radarFade)"
            strokeWidth="1.5"
            fill="none"
          />
        </Svg>
      </View>
    ),
    content: (theme: any, item: any) => (
      <>
        <Text
          style={{
            fontFamily: theme.fonts.bold,
            fontSize: 17,
            color: theme.text,
            marginBottom: 24,
          }}
        >
          Top in-demand skills
        </Text>
        {[
          { name: "Python", val: 82, opacity: 1 },
          { name: "SQL/Analytics", val: 75, opacity: 0.8 },
          { name: "Cloud ML", val: 72, opacity: 0.6 },
          { name: "Deep Learning", val: 68, opacity: 0.4 },
        ].map((skill, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <Text
              style={{
                width: 100,
                fontFamily: theme.fonts.semiBold,
                fontSize: 14,
                color: theme.text,
              }}
            >
              {skill.name}
            </Text>
            <View
              style={{
                flex: 1,
                height: 8,
                backgroundColor:
                  theme.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                borderRadius: 4,
                marginHorizontal: 12,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${skill.val}%`,
                  height: "100%",
                  backgroundColor: item.accent,
                  opacity: skill.opacity,
                  borderRadius: 4,
                }}
              />
            </View>
            <Text
              style={{
                width: 36,
                fontFamily: theme.fonts.bold,
                fontSize: 14,
                color: theme.text,
                textAlign: "right",
              }}
            >
              {skill.val}%
            </Text>
          </View>
        ))}
      </>
    ),
  },
  {
    id: "3",
    title: "SALARY SNAPSHOT",
    icon: DollarSign,
    color: "#F0FDF4", // Premium Emerald Light
    accent: "#059669", // Emerald
    bgIllustration: (theme: any, item: any) => (
      <View
        style={[
          StyleSheet.absoluteFill,
          { overflow: "hidden", borderRadius: 56 },
        ]}
      >
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient
              id="waveFade"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor={item.accent}
                stopOpacity={theme.mode === "dark" ? "0.5" : "0.3"}
              />
              <Stop offset="1" stopColor={item.accent} stopOpacity="0" />
            </LinearGradient>
            <LinearGradient
              id="waveFill"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor={item.accent}
                stopOpacity={theme.mode === "dark" ? "0.2" : "0.1"}
              />
              <Stop offset="1" stopColor={item.accent} stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Abstract Layered Fluid Waves originating from top right */}
          <Path
            d="M 100,0 L 100,80 Q 60,80 40,30 Q 20,-10 -20,0 L -20,-10 Z"
            fill="url(#waveFill)"
          />
          <Path
            d="M 100,80 Q 60,80 40,30 Q 20,-10 -20,0"
            fill="none"
            stroke="url(#waveFade)"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
          <Path
            d="M 100,60 Q 65,60 45,20 Q 30,-15 -10,0"
            fill="none"
            stroke="url(#waveFade)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <Path
            d="M 100,40 Q 70,40 50,10 Q 40,-20 0,0"
            fill="none"
            stroke="url(#waveFade)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </Svg>
      </View>
    ),
    content: (theme: any, item: any) => (
      <>
        <Text
          style={{
            fontFamily: theme.fonts.bold,
            fontSize: 17,
            color: theme.text,
            marginBottom: 16,
          }}
        >
          Average Base Compensation
        </Text>
        <Text
          style={{
            fontFamily: theme.fonts.black,
            fontSize: 42, // slightly smaller to fit PHP symbol and bigger numbers
            color: theme.text,
            marginBottom: 4,
            letterSpacing: -1,
          }}
        >
          ₱1.5M{" "}
          <Text
            style={{
              fontSize: 20,
              color: theme.textSecondary,
              fontFamily: theme.fonts.bold,
              letterSpacing: 0,
            }}
          >
            / yr
          </Text>
        </Text>
        <Text
          style={{
            fontFamily: theme.fonts.medium,
            fontSize: 14,
            color: theme.textSecondary,
            marginBottom: 20,
          }}
        >
          Excludes equity and performance bonuses.
        </Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              backgroundColor:
                theme.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontFamily: theme.fonts.semiBold,
                fontSize: 12,
                color: theme.textSecondary,
                marginBottom: 2,
              }}
            >
              Min Avg
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.bold,
                fontSize: 16,
                color: theme.text,
              }}
            >
              ₱800k
            </Text>
          </View>
          <View
            style={{
              backgroundColor:
                theme.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontFamily: theme.fonts.semiBold,
                fontSize: 12,
                color: theme.textSecondary,
                marginBottom: 2,
              }}
            >
              Max Avg
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.bold,
                fontSize: 16,
                color: theme.text,
              }}
            >
              ₱2.5M
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            height: 50,
            marginTop: "auto",
          }}
        >
          {[30, 45, 60, 85, 100, 75, 40].map((h, i) => (
            <View
              key={i}
              style={{
                width: "12%",
                height: `${h}%`,
                backgroundColor:
                  i === 4
                    ? item.accent
                    : theme.mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                borderRadius: 8,
              }}
            />
          ))}
        </View>
      </>
    ),
  },
  {
    id: "4",
    title: "HOT MARKETS",
    icon: MapPin,
    color: "#F0F9FF", // Premium Sky Blue Light
    accent: "#0284C7", // Sky
    bgIllustration: (theme: any, item: any) => (
      <View
        style={[
          StyleSheet.absoluteFill,
          { overflow: "hidden", borderRadius: 56 },
        ]}
      >
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient
              id="globeFade"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor={item.accent}
                stopOpacity={theme.mode === "dark" ? "0.4" : "0.15"}
              />
              <Stop offset="1" stopColor={item.accent} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          {/* Wireframe Globe centered slightly off-screen to the right */}
          <Circle
            cx="85"
            cy="40"
            r="50"
            stroke="url(#globeFade)"
            strokeWidth="1"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <Ellipse
            cx="85"
            cy="40"
            rx="25"
            ry="50"
            stroke="url(#globeFade)"
            strokeWidth="1"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <Ellipse
            cx="85"
            cy="40"
            rx="10"
            ry="50"
            stroke="url(#globeFade)"
            strokeWidth="1"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <Ellipse
            cx="85"
            cy="40"
            rx="50"
            ry="20"
            stroke="url(#globeFade)"
            strokeWidth="1"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <Ellipse
            cx="85"
            cy="40"
            rx="50"
            ry="8"
            stroke="url(#globeFade)"
            strokeWidth="1"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <Path
            d="M35,40 L135,40"
            stroke="url(#globeFade)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <Path
            d="M85,-10 L85,90"
            stroke="url(#globeFade)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </Svg>
      </View>
    ),
    content: (theme: any, item: any) => (
      <>
        {/* Featured Market */}
        <View
          style={{
            backgroundColor:
              theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "#FFFFFF",
            padding: 20,
            borderRadius: 24,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.05)",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: theme.fonts.black,
                  fontSize: 24,
                  color: theme.text,
                }}
              >
                Metro Manila
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.medium,
                  fontSize: 13,
                  color: theme.textSecondary,
                }}
              >
                NCR / BGC Tech Hubs
              </Text>
            </View>
            <View
              style={{
                backgroundColor: `${item.accent}20`,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: theme.fonts.bold,
                  fontSize: 14,
                  color: item.accent,
                }}
              >
                +22%
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View
              style={{
                backgroundColor:
                  theme.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: theme.textSecondary,
                  fontFamily: theme.fonts.semiBold,
                }}
              >
                IT-BPM
              </Text>
            </View>
            <View
              style={{
                backgroundColor:
                  theme.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: theme.textSecondary,
                  fontFamily: theme.fonts.semiBold,
                }}
              >
                FinTech
              </Text>
            </View>
          </View>
        </View>

        {/* Secondary Markets Grid */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {[
            { city: "Cebu City", growth: "+18%", role: "IT Parks" },
            { city: "Clark", growth: "+15%", role: "Enterprise" },
            { city: "Davao", growth: "+12%", role: "Tech Hubs" },
            { city: "Iloilo", growth: "+10%", role: "Innovation" },
          ].map((market, idx) => (
            <View
              key={idx}
              style={{
                width: "47%",
                backgroundColor:
                  theme.mode === "dark"
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)",
                padding: 12,
                borderRadius: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    fontSize: 15,
                    color: theme.text,
                  }}
                >
                  {market.city}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    fontSize: 13,
                    color: item.accent,
                  }}
                >
                  {market.growth}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: theme.fonts.medium,
                  fontSize: 12,
                  color: theme.textSecondary,
                }}
              >
                {market.role}
              </Text>
            </View>
          ))}
        </View>
      </>
    ),
  },
  {
    id: "5",
    title: "INDUSTRY INSIGHTS",
    icon: PieChart,
    color: "#FFF7ED", // Premium Orange Light
    accent: "#EA580C", // Orange
    bgIllustration: (theme: any, item: any) => (
      <View
        style={[
          StyleSheet.absoluteFill,
          { overflow: "hidden", borderRadius: 56 },
        ]}
      >
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient
              id="pieFade"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor={item.accent}
                stopOpacity={theme.mode === "dark" ? "0.4" : "0.2"}
              />
              <Stop offset="1" stopColor={item.accent} stopOpacity="0" />
            </LinearGradient>
            <LinearGradient
              id="pieSolid"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop
                offset="0"
                stopColor={item.accent}
                stopOpacity={theme.mode === "dark" ? "0.15" : "0.08"}
              />
              <Stop offset="1" stopColor={item.accent} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          {/* Huge abstract geometric pie chart radiating from top-right */}
          <Path d="M100,0 L100,80 A80,80 0 0,0 20,0 Z" fill="url(#pieSolid)" />
          <Path
            d="M100,0 L40,0 A60,60 0 0,0 100,60 Z"
            fill="none"
            stroke="url(#pieFade)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <Path
            d="M100,0 L100,40 A40,40 0 0,0 60,0 Z"
            fill="none"
            stroke="url(#pieFade)"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
          <Path d="M100,0 L85,0 A15,15 0 0,0 100,15 Z" fill="url(#pieSolid)" />
        </Svg>
      </View>
    ),
    content: (theme: any, item: any) => (
      <>
        <Text
          style={{
            fontFamily: theme.fonts.bold,
            fontSize: 17,
            color: theme.text,
            marginBottom: 16,
          }}
        >
          Top Hiring Sectors
        </Text>

        {/* All Sectors Breakdown */}
        <View
          style={{
            backgroundColor:
              theme.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            borderRadius: 20,
            padding: 20,
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {[
            { name: "IT-BPM & Tech Services", val: 35 },
            { name: "BFSI & FinTech", val: 24 },
            { name: "E-Commerce & Retail", val: 16 },
            { name: "Healthcare", val: 13 },
            { name: "Gov & Education", val: 12 },
          ].map((sector, idx) => (
            <View key={idx}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fonts.semiBold,
                    fontSize: 13,
                    color: theme.textSecondary,
                  }}
                >
                  {sector.name}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    fontSize: 13,
                    color: theme.text,
                  }}
                >
                  {sector.val}%
                </Text>
              </View>
              <View
                style={{
                  height: 6,
                  backgroundColor:
                    theme.mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${sector.val}%`,
                    height: "100%",
                    backgroundColor: item.accent,
                    borderRadius: 3,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </>
    ),
  },
  {
    id: "6",
    title: "CAREER OUTLOOK",
    icon: TrendingUp,
    color: "#F8FAFC", // Premium Slate Light
    accent: "#475569", // Slate
    bgIllustration: (theme: any, item: any) => (
      <View
        style={[
          StyleSheet.absoluteFill,
          { overflow: "hidden", borderRadius: 56 },
        ]}
      >
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient
              id="trendFade"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor={item.accent} stopOpacity="0" />
              <Stop
                offset="0.5"
                stopColor={item.accent}
                stopOpacity={theme.mode === "dark" ? "0.2" : "0.08"}
              />
              <Stop
                offset="1"
                stopColor={item.accent}
                stopOpacity={theme.mode === "dark" ? "0.4" : "0.15"}
              />
            </LinearGradient>
            <LinearGradient
              id="trendFill"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor={item.accent} stopOpacity="0" />
              <Stop
                offset="1"
                stopColor={item.accent}
                stopOpacity={theme.mode === "dark" ? "0.15" : "0.05"}
              />
            </LinearGradient>
          </Defs>
          {/* Layered upward trend charts originating from bottom-left going to top-right */}
          <Path
            d="M-10,110 L10,80 L30,85 L50,60 L70,70 L110,20 L110,110 Z"
            fill="url(#trendFill)"
          />
          <Path
            d="M-10,110 L10,80 L30,85 L50,60 L70,70 L110,20"
            fill="none"
            stroke="url(#trendFade)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          <Path
            d="M-10,110 L20,95 L40,100 L60,80 L80,85 L110,40 L110,110 Z"
            fill="url(#trendFill)"
          />
          <Path
            d="M-10,110 L20,95 L40,100 L60,80 L80,85 L110,40"
            fill="none"
            stroke="url(#trendFade)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />

          <Path
            d="M-10,110 L15,105 L35,108 L55,95 L75,98 L110,60 L110,110 Z"
            fill="url(#trendFill)"
          />
          <Path
            d="M-10,110 L15,105 L35,108 L55,95 L75,98 L110,60"
            fill="none"
            stroke="url(#trendFade)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </Svg>
      </View>
    ),
    content: (theme: any, item: any) => (
      <>
        <Text
          style={{
            fontFamily: theme.fonts.bold,
            fontSize: 17,
            color: theme.text,
            marginBottom: 20,
          }}
        >
          Future Trajectory
        </Text>

        {/* Milestone Timeline */}
        <View
          style={{
            backgroundColor:
              theme.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            borderRadius: 20,
            padding: 20,
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {[
            {
              year: "2024",
              title: "Adoption Phase",
              desc: "Local enterprise AI initiatives surge.",
            },
            {
              year: "2026",
              title: "Integration",
              desc: "IT-BPM integrates GenAI at scale.",
            },
            {
              year: "2028",
              title: "Maturity",
              desc: "+25% median ML salary bump in PH.",
            },
          ].map((milestone, idx) => (
            <View key={idx} style={{ flexDirection: "row" }}>
              {/* Timeline Graphic */}
              <View style={{ alignItems: "center", marginRight: 16 }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor:
                      idx === 0
                        ? item.accent
                        : theme.mode === "dark"
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.1)",
                    zIndex: 2,
                  }}
                />
                {idx !== 2 && (
                  <View
                    style={{
                      width: 2,
                      flex: 1,
                      backgroundColor:
                        theme.mode === "dark"
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.05)",
                      marginTop: 4,
                      marginBottom: -8,
                    }}
                  />
                )}
              </View>
              {/* Timeline Content */}
              <View style={{ flex: 1, marginTop: -4 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: theme.fonts.bold,
                      fontSize: 14,
                      color: idx === 0 ? item.accent : theme.text,
                    }}
                  >
                    {milestone.year}
                  </Text>
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: theme.textSecondary,
                      marginHorizontal: 8,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: theme.fonts.bold,
                      fontSize: 15,
                      color: theme.text,
                    }}
                  >
                    {milestone.title}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: theme.fonts.medium,
                    fontSize: 13,
                    color: theme.textSecondary,
                    lineHeight: 18,
                  }}
                >
                  {milestone.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </>
    ),
  },
];

const AnimatedCard = ({
  item,
  index,
  scrollX,
}: {
  item: any;
  index: number;
  scrollX: any;
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const animatedStyle = useAnimatedStyle(() => {
    // 1:1 mapping with the highly sensitive snap intervals
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP,
    );

    const rotateZ = interpolate(
      scrollX.value,
      inputRange,
      [8, 0, -8],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    );

    const zIndex = interpolate(
      scrollX.value,
      inputRange,
      [1, 10, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }, { rotateZ: `${rotateZ}deg` }],
      opacity,
      zIndex: Math.round(zIndex),
      elevation: Math.round(zIndex),
    };
  });

  const IconComponent = item.icon;

  return (
    <Animated.View
      style={[
        {
          width: SNAP_INTERVAL,
          alignItems: "center",
          justifyContent: "center",
        },
        // @ts-ignore - Force Web hardware CSS snapping
        Platform.OS === "web"
          ? { scrollSnapAlign: "center", scrollSnapStop: "always" }
          : {},
        animatedStyle,
      ]}
    >
      <View
        dataSet={{ class: "whats-growing-outer-frame" }}
        style={{
          width: CARD_WIDTH,
          padding: 8, // Thick glass inset
          borderRadius: 64, // Outer radius (larger than inner)
          // @ts-ignore - Native iOS Squircle
          cornerCurve: "continuous",
          backgroundColor:
            theme.mode === "dark" ? `${item.accent}15` : `${item.accent}10`, // Translucent tinted frame
          borderWidth: 1.5,
          borderColor:
            theme.mode === "dark"
              ? `${item.accent}40`
              : "rgba(255,255,255,0.8)",
          shadowColor: item.accent,
          shadowOpacity: theme.mode === "dark" ? 0.3 : 0.15,
          shadowOffset: { width: 0, height: 16 },
          shadowRadius: 32,
        }}
      >
        <View
          dataSet={{ class: "whats-growing-card" }}
          style={[
            styles.card,
            {
              width: "100%", // Fill the outer frame padding
              backgroundColor: theme.mode === "dark" ? "#1A1A1A" : item.color,
              overflow: "hidden", // Ensures background graphics never bleed
            },
          ]}
        >
          {item.bgIllustration && item.bgIllustration(theme, item)}
          <View style={styles.cardHeader}>
            {Platform.OS === "web" ? (
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor:
                      theme.mode === "dark"
                        ? "rgba(0, 0, 0, 0.2)"
                        : "rgba(255, 255, 255, 0.4)",
                  },
                ]}
              >
                <IconComponent
                  size={24}
                  color={item.accent}
                  strokeWidth={2.5}
                />
              </View>
            ) : (
              <View
                style={[styles.iconBox, { backgroundColor: "transparent" }]}
              >
                <BlurView
                  intensity={50}
                  tint={theme.mode === "dark" ? "dark" : "light"}
                  style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      theme.mode === "dark"
                        ? "rgba(0, 0, 0, 0.2)"
                        : "rgba(255, 255, 255, 0.25)",
                  }}
                >
                  <IconComponent
                    size={24}
                    color={item.accent}
                    strokeWidth={2.5}
                  />
                </BlurView>
              </View>
            )}
            <View
              style={{
                backgroundColor:
                  theme.mode === "dark"
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.8)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text
                style={[
                  styles.cardTitle,
                  { color: theme.mode === "dark" ? "#FFF" : item.accent },
                ]}
              >
                {item.title}
              </Text>
            </View>
          </View>
          {item.content(theme, item)}
        </View>
      </View>
    </Animated.View>
  );
};

export const WhatsGrowingSection = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Machine Learning Engineer");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const ALL_ROLES = [
    "Machine Learning Engineer",
    "Frontend Developer",
    "Data Scientist",
    "Product Manager",
    "Backend Engineer",
    "Full Stack Developer",
    "DevOps Engineer",
    "UI/UX Designer"
  ];

  const filteredRoles = ALL_ROLES.filter(role => 
    role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const theme = useTheme();
  const styles = createStyles(theme);
  const scrollX = useSharedValue(0);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setIsLoading(true);
    // Simulate AI data fetching
    setTimeout(() => {
      setIsLoading(false);
      setModalVisible(false);
    }, 2500);
  };

  const smoothScrollX = useDerivedValue(() => {
    return withSpring(scrollX.value, {
      damping: 14,
      stiffness: 120,
      mass: 0.8,
    });
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      {/* Inject raw CSS for the experimental corner-shape squircle fallback on Web */}
      {Platform.OS === "web" && (
        <style>
          {`
            [data-class~="whats-growing-card"] {
              border-radius: 56px !important;
            }
            [data-class~="whats-growing-outer-frame"] {
              border-radius: 64px !important;
            }
            @supports (corner-shape: squircle) {
              [data-class~="whats-growing-card"] {
                corner-shape: squircle !important;
              }
              [data-class~="whats-growing-outer-frame"] {
                corner-shape: squircle !important;
              }
            }
          `}
        </style>
      )}

      <SectionHeader
        title="What's Growing Around You"
        style={{ paddingHorizontal: 20, marginBottom: 16 }}
        buttonIcon={<SlidersHorizontal size={20} color={theme.text} />}
        onSeeAll={() => setModalVisible(true)}
      />
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="center"
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        // @ts-ignore - Force Web hardware CSS snapping
        style={Platform.OS === "web" ? { scrollSnapType: "x mandatory" } : {}}
        contentContainerStyle={{
          paddingHorizontal: ITEM_SPACING,
          paddingBottom: 20,
        }}
      >
        {CARDS_DATA.map((item, index) => (
          <AnimatedCard
            key={item.id}
            item={item}
            index={index}
            scrollX={smoothScrollX}
          />
        ))}
      </Animated.ScrollView>

      <View
        style={{ alignItems: "center", marginTop: 4, paddingHorizontal: 20 }}
      >
        <Text
          style={{
            fontFamily: theme.fonts.medium,
            fontSize: 12,
            color: theme.textSecondary,
            textAlign: "center",
          }}
        >
          Generated by AI. Validate important facts independently.
        </Text>
      </View>

      {/* Role Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !isLoading && setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Glass background fallback */}
          {Platform.OS !== "web" && (
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          )}
          
          <View
            style={{
              width: "85%",
              backgroundColor: theme.mode === "dark" ? "#1A1A1A" : "#FFFFFF",
              borderRadius: 32,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 10,
              borderWidth: 1,
              borderColor: theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              // @ts-ignore
              cornerCurve: "continuous",
            }}
          >
            {isLoading ? (
              <View style={{ alignItems: "center", justifyContent: "center", minHeight: 300 }}>
                <View style={{ marginBottom: 32, marginTop: 16 }}>
                  <AILoader />
                </View>
                <Text
                  style={{
                    fontFamily: theme.fonts.bold,
                    fontSize: 20,
                    color: theme.text,
                    textAlign: "center",
                  }}
                >
                  Analyzing Market Data
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fonts.medium,
                    fontSize: 15,
                    color: theme.textSecondary,
                    textAlign: "center",
                    marginTop: 8,
                    lineHeight: 22,
                  }}
                >
                  Compiling localized insights for{'\n'}{selectedRole}...
                </Text>
              </View>
            ) : (
              <>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <Text style={{ fontFamily: theme.fonts.bold, fontSize: 24, color: theme.text }}>
                    Target Role
                  </Text>
                  <Pressable 
                    onPress={() => setModalVisible(false)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <X size={20} color={theme.text} />
                  </Pressable>
                </View>

                {/* Search Input */}
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  height: 48,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: theme.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                }}>
                  <Search size={18} color={theme.textSecondary} style={{ marginRight: 12 }} />
                  <TextInput
                    placeholder="Search roles..."
                    placeholderTextColor={theme.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={{
                      flex: 1,
                      fontFamily: theme.fonts.medium,
                      fontSize: 15,
                      color: theme.text,
                      outlineStyle: "none",
                    } as any}
                  />
                </View>

                <Text style={{
                  fontFamily: theme.fonts.bold,
                  fontSize: 13,
                  color: theme.textSecondary,
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: 1
                }}>
                  {searchQuery ? "Search Results" : "Trending Roles"}
                </Text>

                <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => {
                      const isSelected = selectedRole === role;
                      return (
                        <Pressable
                          key={role}
                          onPress={() => handleRoleSelect(role)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 16,
                            borderRadius: 16,
                            marginBottom: 12,
                            backgroundColor: isSelected 
                              ? (theme.mode === "dark" ? "rgba(79, 70, 229, 0.2)" : "rgba(79, 70, 229, 0.1)")
                              : (theme.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"),
                            borderWidth: 1,
                            borderColor: isSelected 
                              ? "#4F46E5" 
                              : "transparent",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: isSelected ? theme.fonts.bold : theme.fonts.semiBold,
                              fontSize: 15,
                              color: isSelected ? (theme.mode === "dark" ? "#818CF8" : "#4F46E5") : theme.text,
                            }}
                          >
                            {role}
                          </Text>
                          {isSelected && <CheckCircle2 size={20} color={theme.mode === "dark" ? "#818CF8" : "#4F46E5"} />}
                        </Pressable>
                      );
                    })
                  ) : (
                    <View style={{ padding: 20, alignItems: "center" }}>
                      <Text style={{ fontFamily: theme.fonts.medium, fontSize: 14, color: theme.textSecondary }}>
                        No roles found.
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginVertical: 0,
  },
  card: {
    borderRadius: 56,
    // @ts-ignore - Native iOS Squircle
    cornerCurve: "continuous",
    padding: 24,
    height: 400, // Slightly taller for the larger border radius
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden", // Required for BlurView to respect border radius
  },
  cardTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    letterSpacing: 1,
  },
});

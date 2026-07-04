import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Header } from "../../components/Header";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export default function CreateResume() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const router = useRouter();
  const scrollY = useSharedValue(0);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={commonStyles.container}>
      <Header
        title="Create Resume"
        showBack
        onBack={() => router.back()}
        scrollY={scrollY}
      />
      <Animated.ScrollView
        contentContainerStyle={[
          commonStyles.scrollContent,
          { flex: 1, alignItems: "center", justifyContent: "center" },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        <Text style={{ fontFamily: theme.fonts.bold, fontSize: 24, color: theme.text, marginBottom: 8 }}>
          AI Wizard Coming Soon
        </Text>
        <Text style={{ fontFamily: theme.fonts.medium, fontSize: 14, color: theme.textSecondary, textAlign: 'center', maxWidth: 300 }}>
          This will be a step-by-step wizard to build your resume using your Master Profile data.
        </Text>
      </Animated.ScrollView>
    </View>
  );
}

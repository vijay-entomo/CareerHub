import { useCommonStyles } from "@/hooks/use-common-styles";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { Header } from "../../components/Header";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export default function InterviewMain() {
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
        title="Interview Prep"
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
        <Text
          style={{
            fontFamily: theme.fonts.medium,
            color: theme.textSecondary,
          }}
        >
          Interview Content Coming Soon
        </Text>
      </Animated.ScrollView>
    </View>
  );
}

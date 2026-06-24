import { useCommonStyles } from "@/hooks/use-common-styles";
import { View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Header } from "../../components/Header";

export default function Career() {
  const commonStyles = useCommonStyles();
  const scrollY = useSharedValue(0);

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
        contentContainerStyle={commonStyles.scrollContentFullBleed}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        {/* Future Career Pathways content goes here */}
      </Animated.ScrollView>
    </View>
  );
}

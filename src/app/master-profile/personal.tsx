import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { useCommonStyles } from '@/hooks/use-common-styles';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

export default function PersonalInfo() {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const styles = createStyles(theme);
  const router = useRouter();

  const scrollY = useSharedValue(0);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={commonStyles.container}>
      <Header title="Personal Info" showBack={true} scrollY={scrollY} />

      <Animated.ScrollView 
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
          <Text style={styles.title}>Personal Information</Text>
          <Text style={styles.subtitle}>Let's start with the basics.</Text>
          {/* Form Content Will Go Here */}
      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  title: { fontSize: 28, fontFamily: theme.fonts.bold, color: theme.text, marginBottom: 8 },
  subtitle: { fontSize: 16, fontFamily: theme.fonts.medium, color: theme.textSecondary },
});

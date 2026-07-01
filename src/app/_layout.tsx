import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/hooks/use-theme';
import { useFonts, Urbanist_400Regular, Urbanist_500Medium, Urbanist_600SemiBold, Urbanist_700Bold, Urbanist_900Black } from '@expo-google-fonts/urbanist';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text, TextInput, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { AppFonts } from '@/constants/theme';
import '@/i18n'; // Initialize i18n

// Ignore specific deprecation warnings originating from animation libraries
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  'Use style.pointerEvents'
]);

// Optional: Override default props to catch any un-styled text components
// @ts-ignore
const TextAny = Text as any;
const TextInputAny = TextInput as any;

if (TextAny.defaultProps) {
  TextAny.defaultProps.style = { fontFamily: AppFonts.urbanist.regular };
} else {
  TextAny.defaultProps = { style: { fontFamily: AppFonts.urbanist.regular } };
}
if (TextInputAny.defaultProps) {
  TextInputAny.defaultProps.style = { fontFamily: AppFonts.urbanist.regular };
} else {
  TextInputAny.defaultProps = { style: { fontFamily: AppFonts.urbanist.regular } };
}

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const theme = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: theme.background }
        }}
      />
    </View>
  );
}

export default function Layout() {
  const [loaded, error] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_900Black,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigator />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

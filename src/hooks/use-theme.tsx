import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, AppFonts, getContrastColor, getGlowColor, getBorderColor } from '@/constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  setFontFamily: (font: keyof typeof AppFonts) => void;
  setPrimaryColor: (color: string) => void;
  activeColors: Record<keyof typeof Colors.light, string>;
  activeFonts: typeof AppFonts[keyof typeof AppFonts];
  activeFontFamily: keyof typeof AppFonts;
  activePrimaryColor: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceTheme = useDeviceColorScheme() === 'dark' ? 'dark' : 'light';
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [fontFamily, setFontFamilyState] = useState<keyof typeof AppFonts>('urbanist');
  const [primaryColor, setPrimaryColorState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved preferences on startup
    const loadPreferences = async () => {
      try {
        const [savedTheme, savedFont, savedColor] = await Promise.all([
          AsyncStorage.getItem('@theme_mode'),
          AsyncStorage.getItem('@font_family'),
          AsyncStorage.getItem('@primary_color'),
        ]);

        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setModeState(savedTheme);
        }
        if (savedFont && Object.keys(AppFonts).includes(savedFont)) {
          setFontFamilyState(savedFont as keyof typeof AppFonts);
        }
        if (savedColor) {
          setPrimaryColorState(savedColor);
        }
      } catch (e) {
        console.error('Failed to load preferences', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadPreferences();
  }, []);

  const setTheme = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try { await AsyncStorage.setItem('@theme_mode', newMode); } catch (e) {}
  };

  const setFontFamily = async (newFont: keyof typeof AppFonts) => {
    setFontFamilyState(newFont);
    try { await AsyncStorage.setItem('@font_family', newFont); } catch (e) {}
  };

  const setPrimaryColor = async (newColor: string) => {
    setPrimaryColorState(newColor);
    try { await AsyncStorage.setItem('@primary_color', newColor); } catch (e) {}
  };

  const currentTheme = mode === 'system' ? deviceTheme : mode;
  const activeColors = { ...Colors[currentTheme] };
  
  if (primaryColor) {
    (activeColors as any).primary = primaryColor;
    (activeColors as any).primaryForeground = getContrastColor(primaryColor);
    (activeColors as any).primaryGlow = getGlowColor(primaryColor);
    (activeColors as any).primaryBorder = getBorderColor(primaryColor);
  }

  const activeFonts = AppFonts[fontFamily];

  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={{ 
      mode, setTheme, 
      activeColors, activeFonts, 
      setFontFamily, setPrimaryColor,
      activeFontFamily: fontFamily,
      activePrimaryColor: primaryColor
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if not wrapped in provider
    const deviceTheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
    return { 
      ...Colors[deviceTheme], 
      fonts: AppFonts.urbanist, 
      mode: 'system' as ThemeMode, 
      setTheme: () => {},
      setFontFamily: () => {},
      setPrimaryColor: () => {},
      activeFontFamily: 'urbanist' as const,
      activePrimaryColor: null
    };
  }
  
  // Return the active colors directly, but attach mode and setTheme 
  // so components don't have to be refactored
  return {
    ...context.activeColors,
    fonts: context.activeFonts,
    mode: context.mode,
    setTheme: context.setTheme,
    setFontFamily: context.setFontFamily,
    setPrimaryColor: context.setPrimaryColor,
    activeFontFamily: context.activeFontFamily,
    activePrimaryColor: context.activePrimaryColor,
  } as Record<keyof typeof Colors.light, string> & {
    fonts: typeof AppFonts[keyof typeof AppFonts];
    mode: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
    setFontFamily: (font: keyof typeof AppFonts) => void;
    setPrimaryColor: (color: string) => void;
    activeFontFamily: keyof typeof AppFonts;
    activePrimaryColor: string | null;
  };
}

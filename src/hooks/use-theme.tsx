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
  setCtaColor: (color: string) => void;
  activeColors: Record<keyof typeof Colors.light, string> & { ctaColor: string };
  activeFonts: typeof AppFonts[keyof typeof AppFonts];
  activeFontFamily: keyof typeof AppFonts;
  activePrimaryColor: string | null;
  activeCtaColor: string | null;
}

const DEFAULT_CTA_COLOR = "#000000";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceTheme = useDeviceColorScheme() === 'dark' ? 'dark' : 'light';
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [fontFamily, setFontFamilyState] = useState<keyof typeof AppFonts>('urbanist');
  const [primaryColor, setPrimaryColorState] = useState<string | null>(null);
  const [ctaColor, setCtaColorState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved preferences on startup
    const loadPreferences = async () => {
      try {
        const [savedTheme, savedFont, savedColor, savedCta] = await Promise.all([
          AsyncStorage.getItem('@theme_mode'),
          AsyncStorage.getItem('@font_family'),
          AsyncStorage.getItem('@primary_color'),
          AsyncStorage.getItem('@cta_color'),
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
        if (savedCta) {
          setCtaColorState(savedCta);
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

  const setCtaColor = async (newColor: string) => {
    setCtaColorState(newColor);
    try { await AsyncStorage.setItem('@cta_color', newColor); } catch (e) {}
  };

  const currentTheme = mode === 'system' ? deviceTheme : mode;
  const activeColors = { ...Colors[currentTheme], ctaColor: ctaColor ?? DEFAULT_CTA_COLOR };

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
      setFontFamily, setPrimaryColor, setCtaColor,
      activeFontFamily: fontFamily,
      activePrimaryColor: primaryColor,
      activeCtaColor: ctaColor,
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
      ctaColor: DEFAULT_CTA_COLOR,
      fonts: AppFonts.urbanist,
      mode: 'system' as ThemeMode,
      setTheme: () => {},
      setFontFamily: () => {},
      setPrimaryColor: () => {},
      setCtaColor: () => {},
      activeFontFamily: 'urbanist' as const,
      activePrimaryColor: null,
      activeCtaColor: null,
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
    setCtaColor: context.setCtaColor,
    activeFontFamily: context.activeFontFamily,
    activePrimaryColor: context.activePrimaryColor,
    activeCtaColor: context.activeCtaColor,
  } as Record<keyof typeof Colors.light, string> & {
    ctaColor: string;
    fonts: typeof AppFonts[keyof typeof AppFonts];
    mode: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
    setFontFamily: (font: keyof typeof AppFonts) => void;
    setPrimaryColor: (color: string) => void;
    setCtaColor: (color: string) => void;
    activeFontFamily: keyof typeof AppFonts;
    activePrimaryColor: string | null;
    activeCtaColor: string | null;
  };
}

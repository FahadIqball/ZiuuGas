import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '../utils/storage';
import { lightColors, darkColors, ThemeColors } from '../enums/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'user-theme-mode';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();

  // Load initial theme mode synchronously from MMKV storage
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const savedMode = storage.getString(THEME_STORAGE_KEY);
    return (savedMode as ThemeMode) || 'system';
  });

  // Calculate if dark mode is active
  const isDarkMode =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  // Resolve current color palette
  const colors = isDarkMode ? darkColors : lightColors;

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    storage.set(THEME_STORAGE_KEY, mode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, isDarkMode, colors, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

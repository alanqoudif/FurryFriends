import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkColors, LightColors } from '../constants/Colors';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Force light mode only
  const [theme, setTheme] = useState<ThemeMode>('light');

  // Remove theme loading and saving functionality
  // const loadTheme = async () => {
  //   // Disabled - always use light mode
  // };

  // const saveTheme = async (newTheme: ThemeMode) => {
  //   // Disabled - always use light mode
  // };

  const toggleTheme = () => {
    // Disabled - no theme switching allowed
    console.log('Theme switching is disabled - app is set to light mode only');
  };

  const value: ThemeContextType = {
    theme: 'light', // Always light mode
    toggleTheme,
    isDark: false, // Always false for light mode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeColors = () => {
  const { isDark } = useTheme();
  return isDark ? DarkColors : LightColors;
};

export default ThemeContext;

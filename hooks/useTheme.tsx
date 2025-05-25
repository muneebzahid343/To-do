
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeMode } from '../types';
import { THEMES, LOCAL_STORAGE_KEYS } from '../constants';

interface ThemeContextType {
  themeMode: ThemeMode;
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    return (storedTheme as ThemeMode) || ThemeMode.LIGHT;
  });

  const setThemeMode = (mode: ThemeMode) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, mode);
    setThemeModeState(mode);
  };

  // Removed useEffect that was listening to themeMode changes to re-read from localStorage.
  // Initial state is set from localStorage, and setThemeMode updates both.
  // For cross-tab sync, a 'storage' event listener would be more appropriate.

  const theme = THEMES[themeMode];

  return (
    <ThemeContext.Provider value={{ themeMode, theme, setThemeMode }}>
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
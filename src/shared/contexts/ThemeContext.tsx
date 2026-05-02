import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "system" | "light" | "dark";
export type ActiveColorScheme = "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  activeColorScheme: ActiveColorScheme;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useSystemColorScheme() || "light";
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("app_theme_mode");
        if (
          savedTheme === "light" ||
          savedTheme === "dark" ||
          savedTheme === "system"
        ) {
          setThemeModeState(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme from storage", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem("app_theme_mode", mode);
    } catch (error) {
      console.error("Failed to save theme to storage", error);
    }
  };

  const activeColorScheme: ActiveColorScheme =
    themeMode === "system" ? systemColorScheme : themeMode;

  return (
    <ThemeContext.Provider
      value={{ themeMode, activeColorScheme, setThemeMode, isLoading }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
};

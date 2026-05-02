import { Platform } from "react-native";

export const AppColors = {
  primary: "#10B981",
  primaryLight: "#34D399",
  primaryDark: "#059669",
  accent: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",

  dark: {
    background: "#0F0F1A",
    surface: "#1A1A2E",
    surfaceVariant: "#252541",
    card: "#1E1E35",
    textPrimary: "#F1F1FF",
    textSecondary: "#9B9BC0",
    textHint: "#5C5C80",
    border: "#2A2A45",
  },

  light: {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceVariant: "#F1F5F9",
    card: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    textHint: "#94A3B8",
    border: "#E2E8F0",
  },
};

export const Colors = {
  light: {
    text: AppColors.light.textPrimary,
    background: AppColors.light.background,
    tint: AppColors.primary,
    icon: AppColors.light.textSecondary,
    tabIconDefault: AppColors.light.textSecondary,
    tabIconSelected: AppColors.primary,
  },
  dark: {
    text: AppColors.dark.textPrimary,
    background: AppColors.dark.background,
    tint: AppColors.primaryLight,
    icon: AppColors.dark.textSecondary,
    tabIconDefault: AppColors.dark.textSecondary,
    tabIconSelected: AppColors.primaryLight,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});

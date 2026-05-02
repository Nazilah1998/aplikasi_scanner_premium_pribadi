import { useAppTheme } from "@/src/shared/contexts/ThemeContext";

export function useColorScheme() {
  try {
    const { activeColorScheme } = useAppTheme();
    return activeColorScheme;
  } catch (error) {
    // Fallback if used outside provider during initial render
    return "light";
  }
}

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { View, StyleSheet } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AppThemeProvider } from "@/src/shared/contexts/ThemeContext";
import { useAppUpdate } from "@/src/shared/hooks/useAppUpdate";
import { UpdateBanner } from "@/src/shared/components/UpdateBanner";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { status, downloadAndRestart, dismiss } = useAppUpdate();

  return (
    <NavigationThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <View style={styles.root}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen
            name="settings"
            options={{ presentation: "card", title: "Pengaturan Lainnya" }}
          />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        {/* Banner notifikasi update — muncul otomatis jika ada pembaruan */}
        <UpdateBanner
          status={status}
          onConfirm={downloadAndRestart}
          onDismiss={dismiss}
        />
      </View>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutNav />
    </AppThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

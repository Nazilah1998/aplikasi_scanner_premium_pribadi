import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import {
  Check,
  Monitor,
  Moon,
  Sun,
  ChevronRight,
  RefreshCw,
} from "lucide-react-native";

import { ThemedText } from "@/components/themed-text";
import { useAppTheme, ThemeMode } from "@/src/shared/contexts/ThemeContext";
import { AppColors } from "@/src/shared/constants/theme";
import { useAppUpdate } from "@/src/shared/hooks/useAppUpdate";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { themeMode, setThemeMode, activeColorScheme } = useAppTheme();
  const { status, checkForUpdate } = useAppUpdate();

  const isDark = activeColorScheme === "dark";
  const bgColor = isDark ? "#05070a" : "#f8fafc";
  const cardBgColor = isDark ? "#111827" : "#ffffff";
  const borderColor = isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0";

  const themeOptions: {
    id: ThemeMode;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "system", label: "Sistem Default", icon: Monitor },
    { id: "light", label: "Terang", icon: Sun },
    { id: "dark", label: "Gelap", icon: Moon },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Pengaturan Lainnya",
          headerStyle: { backgroundColor: bgColor },
          headerTintColor: isDark ? "#ffffff" : "#0f172a",
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <ThemedText style={styles.sectionTitle}>Tampilan</ThemedText>

        <View
          style={[styles.card, { backgroundColor: cardBgColor, borderColor }]}
        >
          {themeOptions.map((option, index) => {
            const isSelected = themeMode === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionRow,
                  index < themeOptions.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                  },
                ]}
                onPress={() => setThemeMode(option.id)}
              >
                <View style={styles.optionLeft}>
                  <option.icon
                    color={isDark ? "#94a3b8" : "#64748b"}
                    size={22}
                  />
                  <ThemedText style={styles.optionLabel}>
                    {option.label}
                  </ThemedText>
                </View>
                {isSelected && <Check color={AppColors.primary} size={20} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <ThemedText style={styles.hint}>
          Aplikasi akan menyesuaikan warnanya secara otomatis jika memilih
          Sistem Default.
        </ThemedText>

        <ThemedText style={[styles.sectionTitle, { marginTop: 24 }]}>
          Pembaruan
        </ThemedText>
        <View
          style={[styles.card, { backgroundColor: cardBgColor, borderColor }]}
        >
          <TouchableOpacity
            style={styles.optionRow}
            onPress={checkForUpdate}
            disabled={status === "checking" || status === "downloading"}
          >
            <View style={styles.optionLeft}>
              <RefreshCw
                color={isDark ? "#94a3b8" : "#64748b"}
                size={22}
              />
              <View>
                <ThemedText style={styles.optionLabel}>Cek Pembaruan</ThemedText>
                {status === "checking" && (
                  <ThemedText style={styles.subLabel}>Mengecek...</ThemedText>
                )}
                {status === "idle" && (
                  <ThemedText style={styles.subLabel}>Versi 1.0.0 (Terbaru)</ThemedText>
                )}
              </View>
            </View>
            {status === "checking" ? (
              <ActivityIndicator size="small" color={AppColors.primary} />
            ) : (
              <ChevronRight color={isDark ? "#94a3b8" : "#94a3b8"} size={18} />
            )}
          </TouchableOpacity>
        </View>

        <ThemedText style={[styles.sectionTitle, { marginTop: 24 }]}>
          Lainnya
        </ThemedText>
        <View
          style={[styles.card, { backgroundColor: cardBgColor, borderColor }]}
        >
          {[
            { id: "export", label: "Ekspor Dokumen" },
            { id: "security", label: "Keamanan" },
            { id: "storage", label: "Bersihkan Ruang" },
            { id: "ocr", label: "Ekstrak Teks" },
            { id: "notif", label: "Pengaturan Pemberitahuan" },
            { id: "permissions", label: "Manajemen Perizinan" },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.optionRow,
                index < arr.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: borderColor,
                },
              ]}
              onPress={() => {}}
            >
              <ThemedText style={styles.optionLabel}>{item.label}</ThemedText>
              <ChevronRight color={isDark ? "#94a3b8" : "#94a3b8"} size={18} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#64748b",
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  subLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  hint: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 12,
    marginLeft: 4,
    lineHeight: 20,
  },
});

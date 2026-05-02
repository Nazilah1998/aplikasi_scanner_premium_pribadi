import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";

export default function ScanSettingsScreen() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    autoCrop: true,
    adjustAfterScan: true,
    startWithCamera: false,
    useCamera: false,
    importFromGallery: false,
    saveToGallery: false,
    dualFocus: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingItem = ({
    label,
    subLabel,
    value,
    onToggle,
  }: {
    label: string;
    subLabel?: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingText}>
        <ThemedText style={styles.settingLabel}>{label}</ThemedText>
        {subLabel && (
          <ThemedText style={styles.settingSubLabel}>{subLabel}</ThemedText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#333", true: "#10b981" }}
        thumbColor="white"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="white" size={28} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Scan</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        <SettingItem
          label="Otomatis Potong Gambar"
          subLabel="Otomatis memotong gambar untuk fitur scan banyak halaman"
          value={settings.autoCrop}
          onToggle={() => toggleSetting("autoCrop")}
        />
        <SettingItem
          label="Sesuaikan setelah setiap pemindaian"
          subLabel="Sesuaikan pemangkasan area yang di scan"
          value={settings.adjustAfterScan}
          onToggle={() => toggleSetting("adjustAfterScan")}
        />
        <SettingItem
          label="Mulai dengan Kamera"
          value={settings.startWithCamera}
          onToggle={() => toggleSetting("startWithCamera")}
        />
        <SettingItem
          label="Gunakan Kamera"
          subLabel="Anda hanya dapat menggunakan pemindaian mode tunggal jika fitur tersebut diaktifkan"
          value={settings.useCamera}
          onToggle={() => toggleSetting("useCamera")}
        />
        <SettingItem
          label="Impor dari Galeri"
          subLabel="Setelan tersebut akan diterapkan ketika Anda menggunakan pemindaian mode tunggal."
          value={settings.importFromGallery}
          onToggle={() => toggleSetting("importFromGallery")}
        />
        <SettingItem
          label="Simpan Pindaian ke Galeri Setelah Pemindaian"
          value={settings.saveToGallery}
          onToggle={() => toggleSetting("saveToGallery")}
        />
        <SettingItem
          label="Fokus Ganda"
          subLabel="Fokuskan ulang gambar sebelum mengambilnya. Hal ini dapat mengurangi kecepatan pengambilan gambar"
          value={settings.dualFocus}
          onToggle={() => toggleSetting("dualFocus")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  backBtn: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  settingText: {
    flex: 1,
    marginRight: 20,
  },
  settingLabel: {
    fontSize: 15,
    color: "white",
    fontWeight: "500",
    marginBottom: 4,
  },
  settingSubLabel: {
    fontSize: 12,
    color: "#9ca3af",
    lineHeight: 18,
  },
});

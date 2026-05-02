import { LinearGradient } from "expo-linear-gradient";
import {
  ExternalLink,
  Globe,
  Info,
  Mail,
  ShieldCheck,
} from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppColors } from "@/src/shared/constants/theme";

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[AppColors.primary, AppColors.primaryDark]}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
            />
            <ThemedText style={styles.versionText}>
              Versi 1.0.0 (Premium)
            </ThemedText>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={20} color={AppColors.primary} />
              <ThemedText style={styles.sectionTitle}>
                Tentang DocScanner
              </ThemedText>
            </View>
            <ThemedText style={styles.description}>
              DocScanner adalah aplikasi scanner dokumen pintar yang dirancang
              untuk produktivitas maksimal. Ubah dokumen fisik Anda menjadi file
              PDF berkualitas tinggi hanya dengan beberapa ketukan.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ShieldCheck size={20} color={AppColors.success} />
              <ThemedText style={styles.sectionTitle}>
                Keamanan & Privasi
              </ThemedText>
            </View>
            <ThemedText style={styles.description}>
              Seluruh dokumen Anda diproses secara lokal di perangkat Anda. Kami
              tidak pernah mengunggah data sensitif Anda ke server manapun.
            </ThemedText>
          </View>

          <ThemedText style={styles.footerLabel}>Hubungi Kami</ThemedText>

          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn}>
              <Mail color="white" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <Globe color="white" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <ExternalLink color="white" size={20} />
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.copyright}>
            © 2026 DocScanner Team. All rights reserved.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  versionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.8,
  },
  content: {
    padding: 24,
    marginTop: -20,
  },
  section: {
    backgroundColor: AppColors.dark.surface,
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AppColors.dark.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.7,
  },
  footerLabel: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.5,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 40,
  },
  contactBtn: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: AppColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  copyright: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.4,
    marginBottom: 20,
  },
});

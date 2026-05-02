import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import {
  ChevronLeft,
  Send,
  MessageSquare,
  Bug,
  Lightbulb,
  HelpCircle,
} from "lucide-react-native";

import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/src/shared/contexts/ThemeContext";
import { AppColors } from "@/src/shared/constants/theme";

const CATEGORIES = [
  { id: "saran", name: "Saran", icon: Lightbulb, color: "#fbbf24" },
  { id: "bug", name: "Lapor Bug", icon: Bug, color: "#ef4444" },
  { id: "pertanyaan", name: "Pertanyaan", icon: HelpCircle, color: "#3b82f6" },
];

export default function SupportScreen() {
  const router = useRouter();
  const { activeColorScheme } = useAppTheme();
  const isDark = activeColorScheme === "dark";

  const [selectedCat, setSelectedCat] = useState("saran");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) {
      Alert.alert("Error", "Mohon isi kritik atau saran Anda.");
      return;
    }

    setIsSending(true);
    // Simulasi pengiriman ke server
    setTimeout(() => {
      setIsSending(false);
      Alert.alert(
        "Terima Kasih!",
        "Masukan Anda telah kami terima dan akan segera kami tinjau.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    }, 2000);
  };

  const bgColor = isDark ? "#05070a" : "#f8fafc";
  const cardBgColor = isDark ? "#111827" : "#ffffff";
  const borderColor = isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0";
  const inputBg = isDark ? "#1f2937" : "#f1f5f9";

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Kritik & Saran",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <ChevronLeft color={isDark ? "white" : "black"} size={24} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: bgColor },
          headerTintColor: isDark ? "white" : "black",
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 10 }}>
        <View style={styles.headerInfo}>
          <MessageSquare color={AppColors.primary} size={40} />
          <ThemedText style={styles.title}>
            Kami Senang Mendengar Anda
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Bantu kami menjadikan AiTyScanner lebih baik lagi dengan masukan
            berharga Anda.
          </ThemedText>
        </View>

        <ThemedText style={styles.sectionLabel}>Pilih Kategori</ThemedText>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catBtn,
                {
                  backgroundColor: cardBgColor,
                  borderColor:
                    selectedCat === cat.id ? AppColors.primary : borderColor,
                },
                selectedCat === cat.id && styles.activeCatBtn,
              ]}
              onPress={() => setSelectedCat(cat.id)}
            >
              <cat.icon
                color={selectedCat === cat.id ? AppColors.primary : cat.color}
                size={20}
              />
              <ThemedText
                style={[
                  styles.catText,
                  selectedCat === cat.id && styles.activeCatText,
                ]}
              >
                {cat.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <ThemedText style={styles.sectionLabel}>Pesan Anda</ThemedText>
        <TextInput
          style={[
            styles.textArea,
            { backgroundColor: inputBg, color: isDark ? "white" : "black" },
          ]}
          placeholder="Ketik kritik, saran, atau laporan masalah di sini..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
        />

        <ThemedText style={styles.sectionLabel}>Email (Opsional)</ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBg, color: isDark ? "white" : "black" },
          ]}
          placeholder="nama@email.com"
          placeholderTextColor="#94a3b8"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={[styles.submitBtn, { opacity: isSending ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Send color="white" size={20} />
              <ThemedText style={styles.submitText}>Kirim Masukan</ThemedText>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.footerInfo}>
          <HelpCircle color="#64748b" size={16} />
          <ThemedText style={styles.footerText}>
            Tim kami biasanya merespons dalam 24-48 jam.
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerInfo: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 4,
  },
  categoryRow: {
    flexDirection: "row",
    gap: 10,
  },
  catBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  activeCatBtn: {
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  catText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  activeCatText: {
    color: AppColors.primary,
  },
  textArea: {
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    minHeight: 120,
  },
  input: {
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    height: 50,
  },
  submitBtn: {
    backgroundColor: AppColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    marginTop: 30,
    gap: 10,
    // Shadow
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    gap: 6,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: "#64748b",
  },
});

import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import {
  Search,
  Sparkles,
  CreditCard,
  FileText,
  UserCircle,
  Sigma,
  Languages,
  BookOpen,
  Presentation,
  Monitor,
  Clock,
  Image as ImageIcon,
  FileUp,
  FileImage,
  PenTool,
  Droplets,
  Eraser,
  Layers,
  Scissors,
  ArrowUpDown,
  Lock,
  Minimize2,
  BrainCircuit,
  Hash,
  Printer,
  QrCode,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";

const { width } = Dimensions.get("window");

const TOOL_SECTIONS = [
  {
    title: "Scan",
    items: [
      { id: "id", name: "Kartu ID", icon: CreditCard, color: "#10b981" },
      { id: "ocr", name: "Ekstrak Teks", icon: FileText, color: "#3b82f6" },
      { id: "passport", name: "Pas Foto", icon: UserCircle, color: "#f59e0b" },
      { id: "math", name: "Rumus", icon: Sigma, color: "#ef4444" },
      {
        id: "translate",
        name: "Penerjemahan foto",
        icon: Languages,
        color: "#8b5cf6",
      },
      { id: "book", name: "Buku", icon: BookOpen, color: "#ec4899" },
      { id: "slide", name: "Slide", icon: Presentation, color: "#f97316" },
      {
        id: "whiteboard",
        name: "Papan Tulis",
        icon: Monitor,
        color: "#06b6d4",
      },
      { id: "timestamp", name: "Stempel waktu", icon: Clock, color: "#64748b" },
    ],
  },
  {
    title: "Impor",
    items: [
      {
        id: "import_img",
        name: "Impor Gambar",
        icon: ImageIcon,
        color: "#10b981",
      },
      { id: "import_file", name: "Impor File", icon: FileUp, color: "#3b82f6" },
    ],
  },
  {
    title: "Konversi",
    items: [
      { id: "word", name: "Ke Word", icon: FileText, color: "#2563eb" },
      { id: "excel", name: "Ke Excel", icon: FileText, color: "#16a34a" },
      { id: "ppt", name: "Ke PPT", icon: FileText, color: "#ea580c" },
      {
        id: "pdf_img",
        name: "PDF ke Gambar",
        icon: FileImage,
        color: "#10b981",
      },
      {
        id: "pdf_long",
        name: "PDF ke Gambar Panjang",
        icon: FileImage,
        color: "#06b6d4",
      },
    ],
  },
  {
    title: "Edit",
    items: [
      { id: "sign", name: "Tanda tangani", icon: PenTool, color: "#8b5cf6" },
      {
        id: "watermark",
        name: "Tambah Tanda Air",
        icon: Droplets,
        color: "#3b82f6",
      },
      { id: "erase", name: "Hapus Cerdas", icon: Eraser, color: "#ef4444" },
      { id: "merge", name: "Gabungkan File", icon: Layers, color: "#10b981" },
      {
        id: "split",
        name: "Pisah Halaman PDF",
        icon: Scissors,
        color: "#f59e0b",
      },
      {
        id: "reorder",
        name: "Urutkan Ulang Halaman",
        icon: ArrowUpDown,
        color: "#6366f1",
      },
      { id: "lock", name: "Kunci", icon: Lock, color: "#4b5563" },
      {
        id: "compress",
        name: "Kompres PDF",
        icon: Minimize2,
        color: "#ec4899",
      },
    ],
  },
  {
    title: "Utilitas",
    items: [
      {
        id: "ai_solver",
        name: "Solver AI",
        icon: BrainCircuit,
        color: "#10b981",
      },
      { id: "count", name: "CountCam", icon: Hash, color: "#3b82f6" },
      { id: "print", name: "Cetak", icon: Printer, color: "#64748b" },
      { id: "qr", name: "Scan Kode QR", icon: QrCode, color: "#10b981" },
    ],
  },
];

export default function ToolsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText style={styles.headerTitle}>Alat</ThemedText>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.whatsNewBtn}>
            <FileText color="#10b981" size={16} />
            <ThemedText style={styles.whatsNewText}>Yang Baru</ThemedText>
            <View style={styles.redDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchBtn}>
            <Search color="#94a3b8" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#1e293b", "#0f172a"]}
          style={styles.banner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.bannerInfo}>
            <View style={styles.aiTitleContainer}>
              <ThemedText style={styles.bannerTitle}>AiTy AI</ThemedText>
              <Sparkles color="#60a5fa" size={20} style={styles.sparkle} />
            </View>
            <ThemedText style={styles.bannerSubtitle}>
              Alur kerja dokumen pintar untuk pekerjaan dan kehidupan.
            </ThemedText>
          </View>
          <View style={styles.bannerIllustration}>
            <View style={styles.glowBox} />
            <Sparkles
              color="#3b82f6"
              size={40}
              style={styles.floatingSparkle}
            />
          </View>
        </LinearGradient>

        {TOOL_SECTIONS.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
            <View style={styles.toolsGrid}>
              {section.items.map((tool) => (
                <TouchableOpacity key={tool.id} style={styles.toolCard}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${tool.color}15` },
                    ]}
                  >
                    <tool.icon color={tool.color} size={24} />
                  </View>
                  <ThemedText style={styles.toolName}>{tool.name}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  whatsNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    position: "relative",
  },
  whatsNewText: {
    color: "#10b981",
    fontSize: 13,
    fontWeight: "600",
  },
  redDot: {
    position: "absolute",
    top: -2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ef4444",
  },
  searchBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  banner: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  bannerInfo: {
    flex: 1,
  },
  aiTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  sparkle: {
    marginTop: -4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 8,
    lineHeight: 18,
  },
  bannerIllustration: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  glowBox: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    opacity: 0.1,
    transform: [{ rotate: "15deg" }],
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  toolCard: {
    width: (width - 62) / 4,
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  toolName: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 14,
  },
  floatingSparkle: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

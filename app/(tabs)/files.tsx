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
  Cloud,
  Search,
  FileUp,
  Image as ImageIcon,
  FolderPlus,
  Camera,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";

const { width } = Dimensions.get("window");

export default function FilesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.cloudIconContainer}>
            <Cloud color="#3b82f6" size={20} fill="#3b82f6" />
          </View>
          <ThemedText style={styles.headerText}>Dapatkan Man...</ThemedText>
        </View>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push("/search")}
        >
          <Search color="#94a3b8" size={18} />
          <ThemedText style={styles.searchText}>Cari</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: "rgba(59, 130, 246, 0.1)" },
              ]}
            >
              <FileUp color="#3b82f6" size={24} />
            </View>
            <ThemedText style={styles.actionLabel}>Impor File</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: "rgba(16, 185, 129, 0.1)" },
              ]}
            >
              <ImageIcon color="#10b981" size={24} />
            </View>
            <ThemedText style={styles.actionLabel}>Impor Gambar</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: "rgba(59, 130, 246, 0.1)" },
              ]}
            >
              <FolderPlus color="#3b82f6" size={24} />
            </View>
            <ThemedText style={styles.actionLabel}>Buat Folder</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <View style={styles.docLines}>
              <View style={styles.line} />
              <View style={styles.line} />
              <View style={styles.line} />
              <View style={styles.line} />
              <View style={styles.line} />
            </View>
          </View>
          <ThemedText style={styles.emptyTitle}>
            Pindai atau impor untuk manajemen dokumen yang efisien.
          </ThemedText>
          <TouchableOpacity style={styles.docBtn}>
            <ThemedText style={styles.docBtnText}>Dokumen</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push("/scan")}>
        <Camera color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070a", // Deep dark background to match home
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#05070a",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cloudIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 14,
    color: "#94a3b8",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
    width: width * 0.45,
    gap: 8,
  },
  searchText: {
    color: "#4b5563",
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 12,
    color: "#cbd5e1",
    fontWeight: "500",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 120,
    borderWidth: 2,
    borderColor: "#1e293b",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
  },
  docLines: {
    gap: 8,
  },
  line: {
    height: 2,
    backgroundColor: "#334155",
    borderRadius: 1,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  docBtn: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#10b981",
  },
  docBtnText: {
    color: "#10b981",
    fontSize: 15,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Search,
  X,
  Star,
  Flame,
  FileText,
  Wrench,
  MessageSquare,
  ChevronRight,
} from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { documentService } from "@/src/shared/services/document-service";

const RECOMMENDED_TOOLS = [
  { id: "1", name: "Kartu ID", icon: Flame, color: "#ef4444", badge: "1" },
  { id: "2", name: "Alat PDF", icon: Flame, color: "#f97316", badge: "2" },
  { id: "3", name: "Ekstrak Teks", icon: Flame, color: "#eab308", badge: "3" },
];

const ALL_TOOLS = [
  { id: "scan", name: "Scan Dokumen", icon: FileText },
  { id: "pdf", name: "Alat PDF", icon: Wrench },
  { id: "id", name: "Kartu ID", icon: Star },
  { id: "ocr", name: "Ekstrak Teks", icon: FileText },
  { id: "sign", name: "Tanda Tangani", icon: Star },
  { id: "qr", name: "Scan Kode QR", icon: Star },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [documents, setDocuments] = useState<any[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<any[]>([]);
  const [filteredTools, setFilteredTools] = useState<any[]>([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    const docs = await documentService.getAllDocuments();
    setDocuments(docs);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDocs([]);
      setFilteredTools([]);
      return;
    }

    const query = searchQuery.toLowerCase();

    // Filter Documents
    const fDocs = documents.filter((doc) =>
      doc.name.toLowerCase().includes(query),
    );
    setFilteredDocs(fDocs);

    // Filter Tools
    const fTools = ALL_TOOLS.filter((tool) =>
      tool.name.toLowerCase().includes(query),
    );
    setFilteredTools(fTools);
  }, [searchQuery, documents]);

  const renderTab = (name: string) => (
    <TouchableOpacity
      onPress={() => setActiveTab(name)}
      style={[styles.tab, activeTab === name && styles.activeTab]}
    >
      <ThemedText
        style={[styles.tabText, activeTab === name && styles.activeTabText]}
      >
        {name}
      </ThemedText>
      {activeTab === name && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          <Search color="#9ca3af" size={20} style={styles.searchIcon} />
          <TextInput
            placeholder="Temukan dokumen atau alat dengan kata k..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X color="#9ca3af" size={18} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.cancelText}>Batal</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {renderTab("Semua")}
        {renderTab("File")}
        {renderTab("Alat")}
      </View>

      <ScrollView style={styles.content}>
        {searchQuery.trim() === "" ? (
          <View>
            <View style={styles.sectionHeader}>
              <Star color="#9ca3af" size={16} />
              <ThemedText style={styles.sectionTitle}>
                Fitur yang direkomendasikan
              </ThemedText>
            </View>
            {RECOMMENDED_TOOLS.map((tool) => (
              <TouchableOpacity key={tool.id} style={styles.toolItem}>
                <View style={styles.toolIconContainer}>
                  <tool.icon color={tool.color} size={20} />
                  <ThemedText style={styles.toolBadge}>{tool.badge}</ThemedText>
                </View>
                <ThemedText style={styles.toolName}>{tool.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View>
            {(activeTab === "Semua" || activeTab === "File") &&
              filteredDocs.length > 0 && (
                <View style={styles.resultSection}>
                  <ThemedText style={styles.resultTitle}>
                    Dokumen ({filteredDocs.length})
                  </ThemedText>
                  {filteredDocs.map((doc) => (
                    <TouchableOpacity key={doc.id} style={styles.docResultItem}>
                      <FileText color="#10b981" size={24} />
                      <View style={styles.docResultInfo}>
                        <ThemedText style={styles.docResultName}>
                          {doc.name}
                        </ThemedText>
                        <ThemedText style={styles.docResultDate}>
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </ThemedText>
                      </View>
                      <ChevronRight color="#4b5563" size={20} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

            {(activeTab === "Semua" || activeTab === "Alat") &&
              filteredTools.length > 0 && (
                <View style={styles.resultSection}>
                  <ThemedText style={styles.resultTitle}>
                    Alat ({filteredTools.length})
                  </ThemedText>
                  {filteredTools.map((tool) => (
                    <TouchableOpacity
                      key={tool.id}
                      style={styles.toolResultItem}
                    >
                      <tool.icon color="#8b5cf6" size={24} />
                      <ThemedText style={styles.toolResultName}>
                        {tool.name}
                      </ThemedText>
                      <ChevronRight color="#4b5563" size={20} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

            {filteredDocs.length === 0 && filteredTools.length === 0 && (
              <View style={styles.emptyContainer}>
                <Search color="#374151" size={64} />
                <ThemedText style={styles.emptyText}>
                  Tidak ada hasil ditemukan
                </ThemedText>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Floating Sidebar */}
      <View style={styles.floatingSidebar}>
        <TouchableOpacity style={styles.sideBtn}>
          <X color="#374151" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sideBtn, styles.activeSideBtn]}>
          <Search color="#4f46e5" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideBtn}>
          <Star color="#374151" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideBtn}>
          <ThemedText style={styles.sideBtnText}>ID</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.feedbackBtn}>
          <MessageSquare color="#9ca3af" size={16} />
          <ThemedText style={styles.feedbackText}>Umpan balik</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1f2937",
  },
  cancelText: {
    color: "#1f2937",
    fontSize: 15,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 15,
    gap: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tab: {
    paddingVertical: 10,
    position: "relative",
  },
  activeTab: {},
  tabText: {
    color: "#9ca3af",
    fontSize: 15,
  },
  activeTabText: {
    color: "#10b981",
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#10b981",
    borderRadius: 1,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 8,
  },
  sectionTitle: {
    color: "#9ca3af",
    fontSize: 13,
  },
  toolItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 15,
  },
  toolIconContainer: {
    position: "relative",
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  toolBadge: {
    position: "absolute",
    top: -2,
    right: -4,
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
  toolName: {
    fontSize: 15,
    color: "#374151",
  },
  floatingSidebar: {
    position: "absolute",
    left: 15,
    top: "35%",
    backgroundColor: "#f8fafc",
    borderRadius: 25,
    padding: 8,
    gap: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sideBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  activeSideBtn: {
    backgroundColor: "#e0e7ff",
  },
  sideBtnText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
  },
  footer: {
    paddingVertical: 15,
    alignItems: "center",
  },
  feedbackBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  feedbackText: {
    color: "#9ca3af",
    fontSize: 13,
  },
  resultSection: {
    paddingTop: 20,
  },
  resultTitle: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 10,
  },
  docResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    gap: 15,
  },
  docResultInfo: {
    flex: 1,
  },
  docResultName: {
    fontSize: 15,
    color: "#1f2937",
    fontWeight: "500",
  },
  docResultDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  toolResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    gap: 15,
  },
  toolResultName: {
    flex: 1,
    fontSize: 15,
    color: "#1f2937",
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 100,
    gap: 15,
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 15,
  },
});

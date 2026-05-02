import React from "react";
import {
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDashboard } from "@/src/features/dashboard/hooks/useDashboard";
import { useAppTheme } from "@/src/shared/contexts/ThemeContext";
import { AppColors } from "@/src/shared/constants/theme";
import { DocumentListItem } from "@/src/features/dashboard/components/DocumentListItem";
import { ThemedText } from "@/components/themed-text";
import {
  X,
  Folder as FolderIcon,
  CreditCard,
  GraduationCap,
  BookText,
  Lightbulb,
  Briefcase,
  FileText,
  Archive,
  Info,
  Activity,
  Utensils,
  Heart,
  Cloud,
  Search,
  FileUp,
  Image as ImageIcon,
  FolderPlus,
  Camera,
  Share2,
  FileArchive,
  PenTool,
  Trash2,
  Copy,
  MoreHorizontal,
  Download,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function FilesScreen() {
  const d = useDashboard();
  const insets = useSafeAreaInsets();
  const [isFolderModalVisible, setIsFolderModalVisible] = React.useState(false);

  const { activeColorScheme } = useAppTheme();
  const isDark = activeColorScheme === "dark";
  const bgColor = isDark ? "#05070a" : AppColors.light.background;
  const headerBg = isDark ? "#111827" : AppColors.light.surface;
  const textColor = isDark ? "#fff" : AppColors.light.textPrimary;
  const iconColor = isDark ? "#3b82f6" : AppColors.primary;
  const borderColor = isDark ? "#262626" : AppColors.light.border;

  const FOLDER_CATEGORIES = [
    {
      title: "Studi & Pengembangan Pribadi",
      items: [
        { id: "tugas", name: "Tugas Kelas", icon: GraduationCap },
        { id: "subjek", name: "Subjek", icon: BookText },
        { id: "studi", name: "Studi", icon: Lightbulb },
      ],
    },
    {
      title: "Pekerjaan",
      items: [
        { id: "proyek", name: "Proyek", icon: Briefcase },
        { id: "folder_id_p", name: "Folder ID", icon: CreditCard },
        { id: "kontrak", name: "Kontrak", icon: FileText },
        { id: "materi", name: "Materi", icon: Archive },
      ],
    },
    {
      title: "Sehari-hari",
      items: [
        { id: "instruksi", name: "Instruksi", icon: Info },
        { id: "medis", name: "Medis", icon: Activity },
        { id: "resep", name: "Resep", icon: Utensils },
        { id: "momen", name: "Momen", icon: Heart },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {d.isSelectionMode && (
        <View style={[styles.selectionBarTop, { paddingTop: insets.top }]}>
          <View style={styles.selectionTitleContainer}>
            <TouchableOpacity onPress={d.clearSelection}>
              <X color="#333" size={24} />
            </TouchableOpacity>
            <ThemedText style={styles.selectionCount}>
              {d.selectedIds.length} dipilih
            </ThemedText>
          </View>
          <TouchableOpacity onPress={d.selectAll}>
            <ThemedText style={styles.selectAllText}>
              {d.selectedIds.length === d.filteredDocs.length
                ? "Batal Semua"
                : "Pilih Semua"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
            backgroundColor: headerBg,
            borderBottomColor: borderColor,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={styles.cloudIconContainer}>
            <Cloud color={iconColor} size={20} fill={iconColor} />
          </View>
          <ThemedText style={[styles.headerText, { color: textColor }]}>
            Dapatkan Man...
          </ThemedText>
        </View>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => d.router.push("/search")}
        >
          <Search color="#94a3b8" size={18} />
          <ThemedText style={styles.searchText}>Cari</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={d.handleImportFile}
          >
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

          <TouchableOpacity
            style={styles.actionCard}
            onPress={d.handleImportImage}
          >
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

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setIsFolderModalVisible(true)}
          >
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

        <Modal
          visible={isFolderModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsFolderModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.folderModal}>
              <View style={styles.modalHeader}>
                <ThemedText style={[styles.modalTitle, { color: textColor }]}>
                  Buat Folder
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setIsFolderModalVisible(false)}
                  style={styles.closeBtn}
                >
                  <X color="#666" size={20} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.topFolderOptions}>
                  <TouchableOpacity
                    style={styles.topFolderCard}
                    onPress={() => {
                      d.handleCreateFolder("Folder Baru", "folder");
                      setIsFolderModalVisible(false);
                    }}
                  >
                    <View style={styles.folderIconBox}>
                      <FolderIcon color="#10b981" size={24} fill="#10b981" />
                    </View>
                    <ThemedText style={styles.topFolderText}>Folder</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.topFolderCard}
                    onPress={() => {
                      d.handleCreateFolder("Folder ID Baru", "id");
                      setIsFolderModalVisible(false);
                    }}
                  >
                    <View style={styles.folderIconBox}>
                      <CreditCard color="#10b981" size={24} />
                    </View>
                    <ThemedText style={styles.topFolderText}>
                      Folder ID
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                {FOLDER_CATEGORIES.map((category, idx) => (
                  <View key={idx} style={styles.categorySection}>
                    <ThemedText
                      style={[styles.categoryTitle, { color: textColor }]}
                    >
                      {category.title}
                    </ThemedText>
                    <View style={styles.categoryGrid}>
                      {category.items.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.gridItem}
                          onPress={() => {
                            d.handleCreateFolder(item.name, item.id);
                            setIsFolderModalVisible(false);
                          }}
                        >
                          <View style={styles.gridIconBox}>
                            <item.icon color="#333" size={20} />
                          </View>
                          <ThemedText style={styles.gridLabel}>
                            {item.name}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Semua Dokumen</ThemedText>
        </View>

        {d.isLoading ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator color={AppColors.primary} size="large" />
          </View>
        ) : d.filteredDocs.length > 0 ? (
          <View style={styles.docList}>
            {d.filteredDocs.map((item) => (
              <DocumentListItem
                key={item.id}
                item={item}
                onPress={() => d.router.push(`/document/${item.id}`)}
                onMore={() => {
                  d.setSelectedDoc(item);
                  d.setNewName(item.name);
                  d.setIsOptionsVisible(true);
                }}
                isSelectionMode={d.isSelectionMode}
                isSelected={d.selectedIds.includes(item.id)}
                onSelect={() => d.toggleSelection(item.id)}
              />
            ))}
          </View>
        ) : (
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
            <TouchableOpacity
              style={styles.docBtn}
              onPress={() => d.router.push("/scan")}
            >
              <ThemedText style={styles.docBtnText}>Mulai Pindai</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {!d.isSelectionMode && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => d.router.push("/scan")}
        >
          <Camera color="white" size={28} />
        </TouchableOpacity>
      )}

      {d.isSelectionMode && (
        <View
          style={[
            styles.selectionBarBottom,
            { paddingBottom: insets.bottom + 10 },
          ]}
        >
          <TouchableOpacity style={styles.selectionAction}>
            <Share2 color="#64748b" size={24} />
            <ThemedText style={styles.selectionActionText}>Bagikan</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectionAction}>
            <Copy color="#64748b" size={24} />
            <ThemedText style={styles.selectionActionText}>
              Pindahkan/Salin
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectionAction}
            onPress={() => {
              if (d.selectedIds.length === 1) {
                const doc = d.documents.find(
                  (doc) => doc.id === d.selectedIds[0],
                );
                if (doc) {
                  d.setSelectedDoc(doc);
                  d.setNewName(doc.name);
                  d.setIsRenameVisible(true);
                }
              }
            }}
          >
            <PenTool color="#64748b" size={24} />
            <ThemedText style={styles.selectionActionText}>
              Ubah Nama
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectionAction}
            onPress={d.deleteSelected}
          >
            <Trash2 color="#ef4444" size={24} />
            <ThemedText
              style={[styles.selectionActionText, { color: "#ef4444" }]}
            >
              Hapus
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectionAction}>
            <MoreHorizontal color="#64748b" size={24} />
            <ThemedText style={styles.selectionActionText}>Lainnya</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={d.isOptionsVisible} transparent animationType="slide">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => d.setIsOptionsVisible(false)}
        >
          <View
            style={[styles.bottomModalContent, { backgroundColor: headerBg }]}
          >
            <View style={styles.bottomModalHeader}>
              <ThemedText
                style={[styles.bottomModalTitle, { color: textColor }]}
              >
                {d.selectedDoc?.name}
              </ThemedText>
              <TouchableOpacity onPress={() => d.setIsOptionsVisible(false)}>
                <X color="#94a3b8" size={24} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => d.handleDownload(d.selectedDoc!)}
            >
              <Download color="#eee" size={20} />
              <ThemedText style={styles.optionText}>Download</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                d.setIsOptionsVisible(false);
                d.handleShare(d.selectedDoc!);
              }}
            >
              <Share2 color="#eee" size={20} />
              <ThemedText style={styles.optionText}>Bagikan</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                d.setIsOptionsVisible(false);
                d.handleSaveAs(d.selectedDoc!);
              }}
            >
              <FileArchive color="#eee" size={20} />
              <ThemedText style={styles.optionText}>
                Simpan sebagai PDF/Gambar
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                d.setIsOptionsVisible(false);
                d.setIsRenameVisible(true);
              }}
            >
              <PenTool color="#eee" size={20} />
              <ThemedText style={styles.optionText}>Ganti Nama</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={d.handleDelete}
            >
              <Trash2 color="#ef4444" size={20} />
              <ThemedText style={[styles.optionText, { color: "#ef4444" }]}>
                Hapus
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={d.isRenameVisible} transparent animationType="fade">
        <View style={[styles.modalOverlay, { justifyContent: "center" }]}>
          <View
            style={[
              styles.bottomModalContent,
              {
                marginHorizontal: 20,
                borderRadius: 20,
                padding: 20,
                backgroundColor: headerBg,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.bottomModalTitle,
                { marginBottom: 15, color: textColor },
              ]}
            >
              Ganti Nama
            </ThemedText>
            <TextInput
              style={styles.renameInput}
              value={d.newName}
              onChangeText={d.setNewName}
              autoFocus
            />
            <View style={styles.renameButtons}>
              <TouchableOpacity
                style={[styles.renameBtn, styles.cancelBtn]}
                onPress={() => d.setIsRenameVisible(false)}
              >
                <ThemedText style={styles.renameBtnText}>Batal</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.renameBtn, styles.confirmBtn]}
                onPress={d.handleRename}
              >
                <ThemedText style={styles.renameBtnText}>Simpan</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={d.isSaveAsModalVisible} transparent animationType="fade">
        <Pressable
          style={[styles.modalOverlay, { justifyContent: "center" }]}
          onPress={() => d.setIsSaveAsModalVisible(false)}
        >
          <Pressable
            style={[
              styles.bottomModalContent,
              {
                marginHorizontal: 20,
                borderRadius: 20,
                padding: 0,
                backgroundColor: headerBg,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.1)",
              }}
            >
              <ThemedText
                style={{ fontSize: 18, fontWeight: "bold", color: textColor }}
              >
                Simpan Sebagai...
              </ThemedText>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.05)",
              }}
              onPress={() => d.saveToGallery(d.selectedDoc!)}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 15,
                }}
              >
                <ImageIcon color="#3b82f6" size={24} />
              </View>
              <View>
                <ThemedText
                  style={{ fontSize: 16, fontWeight: "600", color: textColor }}
                >
                  Simpan ke Galeri
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}
                >
                  Simpan gambar JPG ke memori perangkat
                </ThemedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 20,
              }}
              onPress={() => d.saveToPdf(d.selectedDoc!)}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 15,
                }}
              >
                <FileText color="#ef4444" size={24} />
              </View>
              <View>
                <ThemedText
                  style={{ fontSize: 16, fontWeight: "600", color: textColor }}
                >
                  Bagikan PDF
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}
                >
                  Kompilasi dan bagikan sebagai PDF
                </ThemedText>
              </View>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  folderModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "85%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  topFolderOptions: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 25,
  },
  topFolderCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 12,
    gap: 12,
  },
  folderIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  topFolderText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  categorySection: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: (width - 40 - 24) / 3, // 3 columns
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 8,
  },
  gridIconBox: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  gridLabel: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "600",
    textAlign: "center",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  docList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  bottomModalContent: {
    backgroundColor: "#1e293b",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 300,
  },
  bottomModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  bottomModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    gap: 15,
  },
  optionText: {
    fontSize: 16,
    color: "#eee",
  },
  renameInput: {
    backgroundColor: "#334155",
    borderRadius: 12,
    padding: 15,
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  renameButtons: {
    flexDirection: "row",
    gap: 12,
  },
  renameBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#334155",
  },
  confirmBtn: {
    backgroundColor: "#10b981",
  },
  renameBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  docListItemSelected: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  checkboxContainer: {
    padding: 10,
  },
  checkboxUnchecked: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#4b5563",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
  },
  selectionBarTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  selectionCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  selectAllText: {
    fontSize: 16,
    color: "#10b981",
    fontWeight: "600",
  },
  selectionBarBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    zIndex: 1000,
  },
  selectionAction: {
    alignItems: "center",
    gap: 4,
    minWidth: 60,
  },
  selectionActionText: {
    fontSize: 10,
    color: "#64748b",
  },
});

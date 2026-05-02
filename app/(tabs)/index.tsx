import React from "react";
import {
  Search,
  Camera,
  Trash2,
  Share2,
  FileArchive,
  PenTool,
  Crown,
  X,
  Sparkles,
  Copy,
  MoreHorizontal,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Download,
} from "lucide-react-native";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/themed-text";

import { useAppTheme } from "@/src/shared/contexts/ThemeContext";
import { AppColors } from "@/src/shared/constants/theme";
import { useDashboard } from "@/src/features/dashboard/hooks/useDashboard";
import { styles } from "@/src/features/dashboard/styles/dashboard.styles";
import { QuickActionGrid } from "@/src/features/dashboard/components/QuickActionGrid";
import { DocumentListItem } from "@/src/features/dashboard/components/DocumentListItem";

export default function HomeScreen() {
  const d = useDashboard();
  const insets = useSafeAreaInsets();

  const { activeColorScheme } = useAppTheme();
  const isDark = activeColorScheme === "dark";
  const bgColor = isDark ? "#05070a" : AppColors.light.background;
  const headerBg = isDark ? "#171717" : AppColors.light.surface;
  const textColor = isDark ? "#fff" : AppColors.light.textPrimary;
  const borderColor = isDark ? "transparent" : AppColors.light.border;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
            backgroundColor: headerBg,
            borderBottomWidth: isDark ? 0 : 1,
            borderBottomColor: borderColor,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => d.router.push("/search")}
        >
          <Search color="#94a3b8" size={18} />
          <ThemedText style={[styles.searchInput, { color: "#94a3b8" }]}>
            Cari dokumen...
          </ThemedText>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.premiumBtn}>
            <LinearGradient
              colors={["#F59E0B", "#D97706"]}
              style={styles.premiumGradient}
            >
              <Crown color="white" size={18} />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileCircle}>
            <ThemedText style={styles.profileInitial}>A</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

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

      <FlatList
        data={d.filteredDocs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isFirst = index === 0 && d.search === "";
          const isSelected = d.selectedIds.includes(item.id);

          if (isFirst && !d.isSelectionMode) {
            return (
              <View style={styles.recentSection}>
                <View style={styles.recentHeader}>
                  <ThemedText style={styles.recentTitle}>Terkini</ThemedText>
                  <TouchableOpacity
                    onPress={() => d.router.push("/files")}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <ThemedText style={styles.recentViewAll}>
                      Lihat Semua
                    </ThemedText>
                    <ChevronRight color="#94a3b8" size={16} />
                  </TouchableOpacity>
                </View>
                <DocumentListItem
                  item={item}
                  onPress={() => d.router.push(`/document/${item.id}`)}
                  onMore={() => {
                    d.setSelectedDoc(item);
                    d.setNewName(item.name);
                    d.setIsOptionsVisible(true);
                  }}
                  isSelectionMode={d.isSelectionMode}
                  isSelected={isSelected}
                  onSelect={() => d.toggleSelection(item.id)}
                />
                <View style={styles.recentButtons}>
                  <TouchableOpacity
                    style={styles.recentBtn}
                    onPress={() => d.handleShare(item)}
                  >
                    <Share2 color="#334155" size={18} />
                    <ThemedText style={styles.recentBtnText}>
                      Bagikan
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.recentBtn}>
                    <Sparkles color="#10b981" size={18} />
                    <ThemedText style={styles.recentBtnText}>
                      Ke Word
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.recentBtn}
                    onPress={() => d.router.push(`/document/${item.id}`)}
                  >
                    <ThemedText style={styles.recentBtnText}>
                      Tampilan
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }

          return (
            <View style={{ paddingHorizontal: 16 }}>
              <DocumentListItem
                item={item}
                onPress={() => d.router.push(`/document/${item.id}`)}
                onMore={() => {
                  d.setSelectedDoc(item);
                  d.setNewName(item.name);
                  d.setIsOptionsVisible(true);
                }}
                isSelectionMode={d.isSelectionMode}
                isSelected={isSelected}
                onSelect={() => d.toggleSelection(item.id)}
              />
            </View>
          );
        }}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.heroSection}>
              <ThemedText style={[styles.heroTitle, { color: textColor }]}>
                AiTyScanner
              </ThemedText>
              <ThemedText style={styles.heroSubtitle}>
                Scanner untuk Ayang Tya Tercinta ❤️
              </ThemedText>
            </View>
            <QuickActionGrid
              onAction={(id) => {
                if (id === "scan") d.router.push("/scan");
                else if (id === "import_img") d.handleImportImage();
              }}
            />
            {d.filteredDocs.length > 1 && !d.isSelectionMode && (
              <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
                  Semua Dokumen
                </ThemedText>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={() =>
          !d.isLoading && (
            <View style={styles.emptyContainer}>
              <FileArchive color="#334155" size={64} />
              <ThemedText style={styles.emptyTitle}>
                Belum ada dokumen
              </ThemedText>
              <ThemedText style={styles.emptyText}>
                Mulai memindai dokumen Anda atau impor dari galeri sekarang.
              </ThemedText>
            </View>
          )
        }
      />

      {!d.isSelectionMode && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => d.router.push("/scan")}
        >
          <Camera color="white" size={32} />
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
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
              styles.modalContent,
              { marginHorizontal: 20, borderRadius: 20 },
            ]}
          >
            <ThemedText style={[styles.modalTitle, { marginBottom: 15 }]}>
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
              styles.modalContent,
              { marginHorizontal: 20, borderRadius: 20, padding: 0 },
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
                style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}
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
                  style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}
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
                  style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}
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

      {d.isLoading && (
        <ActivityIndicator
          style={StyleSheet.absoluteFillObject}
          color={AppColors.primary}
          size="large"
        />
      )}
    </View>
  );
}

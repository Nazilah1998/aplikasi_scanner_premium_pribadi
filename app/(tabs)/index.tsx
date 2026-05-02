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
} from "lucide-react-native";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/themed-text";
import { AppColors } from "@/src/shared/constants/theme";
import { useDashboard } from "@/src/features/dashboard/hooks/useDashboard";
import { styles } from "@/src/features/dashboard/styles/dashboard.styles";
import { QuickActionGrid } from "@/src/features/dashboard/components/QuickActionGrid";
import { DocumentListItem } from "@/src/features/dashboard/components/DocumentListItem";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const d = useDashboard();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
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

      <FlatList
        data={d.filteredDocs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DocumentListItem
            item={item}
            onPress={() => d.router.push(`/document/${item.id}`)}
            onMore={() => {
              d.setSelectedDoc(item);
              d.setNewName(item.name);
              d.setIsOptionsVisible(true);
            }}
          />
        )}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.heroSection}>
              <ThemedText style={styles.heroTitle}>AiTyScanner</ThemedText>
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
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                Dokumen Terakhir
              </ThemedText>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => d.router.push("/files")}
              >
                <ThemedText style={styles.viewAll}>Lihat Semua</ThemedText>
              </TouchableOpacity>
            </View>
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => d.router.push("/scan")}
      >
        <Camera color="white" size={32} />
      </TouchableOpacity>

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

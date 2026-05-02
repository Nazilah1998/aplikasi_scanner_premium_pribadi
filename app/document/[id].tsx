import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import {
  ArrowLeft,
  Share2,
  Tag,
  LayoutGrid,
  PlusSquare,
  Edit3,
  FileText,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Image as ImageIcon,
  X,
  Download,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import * as LegacyFileSystem from "expo-file-system/legacy";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  Document,
  documentService,
} from "@/src/shared/services/document-service";

const { width, height } = Dimensions.get("window");

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [doc, setDoc] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isGridView, setIsGridView] = useState(false);
  const [isSaveAsModalVisible, setIsSaveAsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const insets = useSafeAreaInsets();

  const loadDocument = useCallback(async () => {
    setIsLoading(true);
    try {
      const docs = await documentService.getAllDocuments();
      const found = docs.find((d) => d.id === id);
      if (found) {
        setDoc(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const handleShare = async () => {
    if (!doc || doc.pages.length === 0) return;
    try {
      // Just share the current page as an image for quick sharing
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(doc.pages[currentPageIndex].imagePath);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal membagikan gambar");
    }
  };

  const handleSaveAs = async () => {
    if (!doc || doc.pages.length === 0) return;
    setIsSaveAsModalVisible(true);
  };

  const saveToGallery = async () => {
    if (!doc || doc.pages.length === 0) return;
    setIsProcessing(true);
    try {
      const permission = await documentService.requestPermissions();
      if (permission) {
        for (const page of doc.pages) {
          await MediaLibrary.saveToLibraryAsync(page.imagePath);
        }
        Alert.alert("Berhasil", "Semua halaman disimpan ke galeri");
      }
    } catch {
      Alert.alert("Error", "Gagal menyimpan ke galeri");
    } finally {
      setIsProcessing(false);
      setIsSaveAsModalVisible(false);
    }
  };

  const saveToPdf = async () => {
    if (!doc || doc.pages.length === 0) return;
    setIsProcessing(true);
    try {
      const html = `<html><body style="margin:0;padding:0;">${doc.pages.map((p) => `<img src="${p.imagePath}" style="width:100%; display:block; margin-bottom:0;"/>`).join("")}</body></html>`;
      const { uri } = await Print.printToFileAsync({ html });

      if (Platform.OS === "android") {
        const permissions =
          await LegacyFileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          const base64 = await LegacyFileSystem.readAsStringAsync(uri, {
            encoding: "base64" as any,
          });
          const newUri =
            await LegacyFileSystem.StorageAccessFramework.createFileAsync(
              permissions.directoryUri,
              `${doc.name}.pdf`,
              "application/pdf",
            );
          await LegacyFileSystem.writeAsStringAsync(newUri, base64, {
            encoding: "base64" as any,
          });
          Alert.alert(
            "Berhasil",
            `Dokumen ${doc.name}.pdf telah diunduh ke folder!`,
          );
        }
      } else {
        await Sharing.shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
        });
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", `Gagal mendownload PDF: ${err.message || ""}`);
    } finally {
      setIsProcessing(false);
      setIsSaveAsModalVisible(false);
    }
  };

  const deleteDoc = () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (doc) {
      setIsProcessing(true);
      try {
        await documentService.deleteDocument(doc.id);
        router.back();
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Gagal menghapus dokumen");
      } finally {
        setIsProcessing(false);
        setIsDeleteModalVisible(false);
      }
    }
  };

  if (isLoading)
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator color="#059669" size="large" />
      </ThemedView>
    );

  if (!doc)
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Dokumen tidak ditemukan</ThemedText>
      </ThemedView>
    );

  const currentPage = doc.pages[currentPageIndex];

  return (
    <ThemedView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBtn}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle} numberOfLines={1}>
            {doc.name}
          </ThemedText>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleShare} style={styles.headerBtn}>
              <Share2 color="white" size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSaveAs} style={styles.headerBtn}>
              <Tag color="white" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsGridView(!isGridView)}
              style={styles.headerBtn}
            >
              <LayoutGrid color={isGridView ? "#10b981" : "white"} size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteDoc} style={styles.headerBtn}>
              <Trash2 color="#ef4444" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isGridView ? (
        <ScrollView
          style={styles.gridScrollView}
          contentContainerStyle={styles.gridContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {doc.pages.map((page, idx) => (
            <TouchableOpacity
              key={page.id}
              style={[
                styles.gridThumbnailContainer,
                currentPageIndex === idx && styles.gridThumbnailActive,
              ]}
              onPress={() => {
                setCurrentPageIndex(idx);
                setIsGridView(false);
              }}
            >
              <Image
                source={{ uri: page.imagePath }}
                style={styles.gridThumbnailImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.gridThumbnailBadge}>
                <ThemedText style={styles.gridThumbnailBadgeText}>
                  {idx + 1}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.previewArea}>
          <View style={styles.pageIndicatorTop}>
            <ThemedText style={styles.pageIndicatorText}>
              {currentPageIndex + 1}/{doc.pages.length}
            </ThemedText>
          </View>

          <View style={styles.imageWrapper}>
            {currentPage && (
              <Image
                source={{ uri: currentPage.imagePath }}
                style={styles.mainImage}
                contentFit="contain"
                transition={200}
              />
            )}
          </View>

          <View style={styles.pageNav}>
            <TouchableOpacity
              disabled={currentPageIndex === 0}
              onPress={() => setCurrentPageIndex((prev) => prev - 1)}
              style={[
                styles.navBtn,
                currentPageIndex === 0 && { opacity: 0.3 },
              ]}
            >
              <ChevronLeft color="white" size={30} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={currentPageIndex === doc.pages.length - 1}
              onPress={() => setCurrentPageIndex((prev) => prev + 1)}
              style={[
                styles.navBtn,
                currentPageIndex === doc.pages.length - 1 && { opacity: 0.3 },
              ]}
            >
              <ChevronRight color="white" size={30} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolItem}
          onPress={() => router.push("/scan")}
        >
          <PlusSquare color="white" size={22} />
          <ThemedText style={styles.toolLabel}>Tambah</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolItem}
          onPress={() =>
            router.push({
              pathname: "/editor",
              params: { docId: doc.id, pageId: currentPage?.id },
            })
          }
        >
          <Edit3 color="white" size={22} />
          <ThemedText style={styles.toolLabel}>Edit</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolItem} onPress={handleShare}>
          <Share2 color="#10b981" size={22} />
          <ThemedText style={[styles.toolLabel, { color: "#10b981" }]}>
            Bagikan
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolItem}>
          <FileText color="#9ca3af" size={22} />
          <ThemedText style={[styles.toolLabel, { color: "#9ca3af" }]}>
            Ke Word
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolItem}>
          <PenTool color="white" size={22} />
          <ThemedText style={styles.toolLabel}>Ttd</ThemedText>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isSaveAsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSaveAsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSaveAsModalVisible(false)}
        >
          <View style={styles.saveAsContainer}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                Simpan Sebagai...
              </ThemedText>
              <TouchableOpacity onPress={() => setIsSaveAsModalVisible(false)}>
                <X color="#94a3b8" size={24} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveOption} onPress={saveToGallery}>
              <View
                style={[
                  styles.saveIconBox,
                  { backgroundColor: "rgba(59, 130, 246, 0.15)" },
                ]}
              >
                <ImageIcon color="#3b82f6" size={24} />
              </View>
              <View style={styles.saveTextContent}>
                <ThemedText style={styles.saveOptionTitle}>
                  Simpan ke Galeri
                </ThemedText>
                <ThemedText style={styles.saveOptionSubtitle}>
                  Simpan gambar JPG ke memori perangkat
                </ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveOption} onPress={saveToPdf}>
              <View
                style={[
                  styles.saveIconBox,
                  { backgroundColor: "rgba(16, 185, 129, 0.15)" },
                ]}
              >
                <Download color="#10b981" size={24} />
              </View>
              <View style={styles.saveTextContent}>
                <ThemedText style={styles.saveOptionTitle}>
                  Download PDF
                </ThemedText>
                <ThemedText style={styles.saveOptionSubtitle}>
                  Kompilasi dan unduh sebagai file PDF
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.deleteModalContainer}>
            <View style={styles.deleteModalIconBox}>
              <Trash2 color="#ef4444" size={32} />
            </View>
            <ThemedText style={styles.deleteModalTitle}>
              Hapus Dokumen
            </ThemedText>
            <ThemedText style={styles.deleteModalSubtitle}>
              Apakah Anda yakin ingin menghapus dokumen ini secara permanen?
            </ThemedText>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteModalCancelBtn}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <ThemedText style={styles.deleteModalCancelText}>
                  Batal
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalConfirmBtn}
                onPress={confirmDelete}
              >
                <ThemedText style={styles.deleteModalConfirmText}>
                  Hapus
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator color="#10b981" size="large" />
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#171717",
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 15,
  },
  headerBtn: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginHorizontal: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewArea: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pageIndicatorTop: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    zIndex: 10,
  },
  pageIndicatorText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  imageWrapper: {
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor: "#171717",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  pageNav: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  toolbar: {
    flexDirection: "row",
    backgroundColor: "#171717",
    paddingBottom: 35,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 10,
  },
  toolItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  toolLabel: {
    fontSize: 10,
    color: "#eee",
    fontWeight: "700",
    textAlign: "center",
  },
  gridScrollView: {
    flex: 1,
    backgroundColor: "#050505",
  },
  gridContentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 10,
  },
  gridThumbnailContainer: {
    width: Math.floor((width - 42) / 3),
    aspectRatio: 0.75,
    backgroundColor: "#171717",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  gridThumbnailActive: {
    borderColor: "#10b981",
  },
  gridThumbnailImage: {
    width: "100%",
    height: "100%",
  },
  gridThumbnailBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gridThumbnailBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  saveAsContainer: {
    backgroundColor: "#1e293b",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
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
    color: "white",
  },
  saveOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  saveIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  saveTextContent: {
    flex: 1,
  },
  saveOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  saveOptionSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModalContainer: {
    backgroundColor: "#1e293b",
    width: "85%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  deleteModalIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  deleteModalSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  deleteModalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  deleteModalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
  },
  deleteModalCancelText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  deleteModalConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
  },
  deleteModalConfirmText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});

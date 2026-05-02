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
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";

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

    Alert.alert("Simpan sebagai...", "Pilih format penyimpanan dokumen", [
      {
        text: "Gambar (Simpan ke Galeri)",
        onPress: async () => {
          const permission = await documentService.requestPermissions();
          if (permission) {
            try {
              for (const page of doc.pages) {
                await MediaLibrary.saveToLibraryAsync(page.imagePath);
              }
              Alert.alert("Berhasil", "Semua halaman disimpan ke galeri");
            } catch {
              Alert.alert("Error", "Gagal menyimpan ke galeri");
            }
          }
        },
      },
      {
        text: "Dokumen PDF",
        onPress: async () => {
          try {
            let html = '<html><body style="margin:0;padding:0;">';
            for (const page of doc.pages) {
              html += `<img src="${page.imagePath}" style="width:100%; display:block; margin-bottom:0;" />`;
            }
            html += "</body></html>";
            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri);
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Gagal membuat PDF");
          }
        },
      },
      {
        text: "Batal",
        style: "cancel",
      },
    ]);
  };

  const deleteDoc = () => {
    Alert.alert("Hapus", "Hapus dokumen ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          if (doc) {
            await documentService.deleteDocument(doc.id);
            router.back();
          }
        },
      },
    ]);
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
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.header}>
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
            <TouchableOpacity style={styles.headerBtn}>
              <LayoutGrid color="white" size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteDoc} style={styles.headerBtn}>
              <Trash2 color="#ef4444" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

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
            style={[styles.navBtn, currentPageIndex === 0 && { opacity: 0.3 }]}
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
});

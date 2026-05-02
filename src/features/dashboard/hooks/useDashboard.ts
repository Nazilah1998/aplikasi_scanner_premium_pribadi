import { useState, useCallback } from "react";
import { Alert, Platform } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import {
  Document,
  DocumentPage,
  documentService,
} from "@/src/shared/services/document-service";
import * as DocumentPicker from "expo-document-picker";
import * as LegacyFileSystem from "expo-file-system/legacy";

export const useDashboard = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isRenameVisible, setIsRenameVisible] = useState(false);
  const [isSaveAsModalVisible, setIsSaveAsModalVisible] = useState(false);
  const [isPdfToolsVisible, setIsPdfToolsVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isSelectionMode = selectedIds.length > 0;

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await documentService.getAllDocuments();
      setDocuments(
        docs.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
      );
      setSelectedIds([]); // Clear selection on reload
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDocuments();
    }, []),
  );

  const handleShare = async (doc: Document) => {
    if (doc.pages.length === 0) return;
    try {
      if (await Sharing.isAvailableAsync())
        await Sharing.shareAsync(doc.pages[0].imagePath);
      else Alert.alert("Info", "Berbagi tidak tersedia");
    } catch {
      Alert.alert("Error", "Gagal berbagi");
    }
  };

  const handleDownload = async (doc: Document) => {
    if (doc.pages.length === 0) return;
    setIsLoading(true);
    try {
      const html = `<html><body>${doc.pages.map((p) => `<img src="${p.imagePath}" style="width:100%;"/>`).join("")}</body></html>`;
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
    } catch (e: any) {
      console.error(e);
      Alert.alert(
        "Error",
        `Gagal mendownload dokumen: ${e.message || "Kesalahan internal"}`,
      );
    } finally {
      setIsLoading(false);
      setIsOptionsVisible(false);
    }
  };

  const handleSaveAs = (doc: Document) => {
    if (doc.pages.length === 0) return;
    setSelectedDoc(doc);
    setIsOptionsVisible(false);
    setIsSaveAsModalVisible(true);
  };

  const saveToGallery = async (doc: Document) => {
    if (doc.pages.length === 0) return;
    try {
      if (await documentService.requestPermissions()) {
        for (const p of doc.pages)
          await MediaLibrary.saveToLibraryAsync(p.imagePath);
        Alert.alert("Berhasil", "Disimpan ke galeri");
      }
    } catch {
      Alert.alert("Error", "Gagal menyimpan ke galeri");
    } finally {
      setIsSaveAsModalVisible(false);
    }
  };

  const saveToPdf = async (doc: Document) => {
    if (doc.pages.length === 0) return;
    try {
      const html = `<html><body>${doc.pages.map((p) => `<img src="${p.imagePath}" style="width:100%;"/>`).join("")}</body></html>`;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch {
      Alert.alert("Error", "Gagal membagikan PDF");
    } finally {
      setIsSaveAsModalVisible(false);
    }
  };

  const handleImportImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return Alert.alert("Izin Ditolak");

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        setIsLoading(true);
        const docId = `doc_${Date.now()}`;
        const pages: DocumentPage[] = [];

        for (const [index, asset] of result.assets.entries()) {
          const fileName = `import_${Date.now()}_${index}.jpg`;
          const baseDir =
            LegacyFileSystem.documentDirectory ||
            LegacyFileSystem.cacheDirectory;
          const permanentUri = baseDir?.endsWith("/")
            ? `${baseDir}${fileName}`
            : `${baseDir}/${fileName}`;

          await LegacyFileSystem.copyAsync({
            from: asset.uri,
            to: permanentUri,
          });

          pages.push({
            id: `page_${docId}_${index}`,
            imagePath: permanentUri,
            filter: "none",
            brightness: 1,
            contrast: 1,
          });
        }

        const newDoc = {
          id: docId,
          name: `Import ${new Date().toLocaleDateString("id-ID")}`,
          pages,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await documentService.saveDocument(newDoc);
        loadDocuments();
        router.push({ pathname: "/document/[id]", params: { id: docId } });
      }
    } catch (err) {
      console.error("Import image error:", err);
      Alert.alert("Error", "Gagal mengimpor gambar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        setIsLoading(true);
        const docId = `doc_${Date.now()}`;
        const pages: DocumentPage[] = [];

        for (const [index, asset] of result.assets.entries()) {
          const extension = asset.name.split(".").pop()?.toLowerCase() || "jpg";
          const fileName = `import_file_${Date.now()}_${index}.${extension}`;

          const baseDir =
            LegacyFileSystem.documentDirectory ||
            LegacyFileSystem.cacheDirectory;
          const permanentUri = baseDir?.endsWith("/")
            ? `${baseDir}${fileName}`
            : `${baseDir}/${fileName}`;

          await LegacyFileSystem.copyAsync({
            from: asset.uri,
            to: permanentUri,
          });

          const isImage =
            asset.mimeType?.startsWith("image/") ||
            ["jpg", "jpeg", "png", "webp"].includes(extension);

          if (!isImage) {
            Alert.alert(
              "Info",
              `File "${asset.name}" adalah PDF/Dokumen. Pemrosesan PDF akan dikonversi di server Cloud (Fitur Segera Hadir).`,
            );
            continue; // Skip processing as image
          }

          pages.push({
            id: `page_${docId}_${index}`,
            imagePath: permanentUri,
            filter: "none" as const,
            brightness: 1,
            contrast: 1,
          } as any);
        }

        if (pages.length > 0) {
          const newDoc = {
            id: docId,
            name:
              result.assets.length > 1
                ? `Gabungan ${pages.length} File`
                : result.assets[0].name,
            pages,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await documentService.saveDocument(newDoc as any);
          loadDocuments();
          Alert.alert("Sukses", `${pages.length} gambar berhasil diimpor`);
          router.push("/(tabs)");
        } else {
          Alert.alert("Info", "Tidak ada file gambar yang diimpor.");
        }
      }
    } catch (err: any) {
      console.error("Import file error:", err);
      Alert.alert(
        "Error",
        `Gagal mengimpor file: ${err.message || "Kesalahan sistem"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFolder = async (name: string, iconType: string) => {
    try {
      setIsLoading(true);
      const docId = `folder_${Date.now()}`;
      const newDoc = {
        id: docId,
        name: name,
        pages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFolder: true,
        folderType: iconType,
      };

      await documentService.saveDocument(newDoc as any);
      loadDocuments();
      Alert.alert("Sukses", `Folder "${name}" berhasil dibuat`);
      router.push("/(tabs)");
    } catch (err) {
      console.error("Create folder error:", err);
      Alert.alert("Error", "Gagal membuat folder");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRename = async () => {
    if (!selectedDoc || !newName.trim()) return;
    try {
      await documentService.saveDocument({
        ...selectedDoc,
        name: newName.trim(),
        updatedAt: new Date().toISOString(),
      });
      setIsRenameVisible(false);
      setSelectedDoc(null);
      loadDocuments();
    } catch {
      Alert.alert("Error", "Gagal ganti nama");
    }
  };

  const handleDelete = async () => {
    if (!selectedDoc) return;
    try {
      await documentService.deleteDocument(selectedDoc.id);
      setIsOptionsVisible(false);
      setSelectedDoc(null);
      loadDocuments();
    } catch {
      Alert.alert("Error", "Gagal hapus");
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredDocs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDocs.map((d) => d.id));
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    Alert.alert(
      "Hapus Dokumen",
      `Hapus ${selectedIds.length} dokumen yang dipilih?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              for (const id of selectedIds) {
                await documentService.deleteDocument(id);
              }
              setSelectedIds([]);
              loadDocuments();
            } catch (e) {
              console.error(e);
              Alert.alert("Error", "Gagal menghapus beberapa dokumen");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  return {
    search,
    setSearch,
    documents,
    isLoading,
    selectedDoc,
    setSelectedDoc,
    isOptionsVisible,
    setIsOptionsVisible,
    isRenameVisible,
    setIsRenameVisible,
    isPdfToolsVisible,
    setIsPdfToolsVisible,
    isSaveAsModalVisible,
    setIsSaveAsModalVisible,
    newName,
    setNewName,
    handleDownload,
    handleShare,
    handleSaveAs,
    saveToGallery,
    saveToPdf,
    handleImportImage,
    handleImportFile,
    handleCreateFolder,
    handleRename,
    handleDelete,
    filteredDocs,
    loadDocuments,
    selectedIds,
    setSelectedIds,
    isSelectionMode,
    toggleSelection,
    selectAll,
    clearSelection,
    deleteSelected,
    router,
  };
};

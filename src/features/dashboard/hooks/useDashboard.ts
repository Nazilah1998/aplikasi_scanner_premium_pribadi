import { useState, useCallback } from "react";
import { Alert } from "react-native";
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

export const useDashboard = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isRenameVisible, setIsRenameVisible] = useState(false);
  const [isPdfToolsVisible, setIsPdfToolsVisible] = useState(false);
  const [newName, setNewName] = useState("");

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

  const handleSaveAs = async (doc: Document) => {
    if (doc.pages.length === 0) return;
    Alert.alert("Simpan sebagai...", "Pilih format", [
      {
        text: "Galeri",
        onPress: async () => {
          if (await documentService.requestPermissions()) {
            for (const p of doc.pages)
              await MediaLibrary.saveToLibraryAsync(p.imagePath);
            Alert.alert("Berhasil", "Disimpan ke galeri");
          }
        },
      },
      {
        text: "PDF",
        onPress: async () => {
          const html = `<html><body>${doc.pages.map((p) => `<img src="${p.imagePath}" style="width:100%;"/>`).join("")}</body></html>`;
          const { uri } = await Print.printToFileAsync({ html });
          await Sharing.shareAsync(uri);
        },
      },
      { text: "Batal", style: "cancel" },
    ]);
  };

  const handleImportImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return Alert.alert("Izin Ditolak");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      setIsLoading(true);
      const docId = `doc_${Date.now()}`;
      const pages: DocumentPage[] = result.assets.map((asset, i) => ({
        id: `p_${docId}_${i}`,
        imagePath: asset.uri,
        filter: "none",
        brightness: 1,
        contrast: 1,
      }));
      await documentService.saveDocument({
        id: docId,
        name: `Impor ${new Date().toLocaleDateString()}`,
        pages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      loadDocuments();
    }
    setIsLoading(false);
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
    newName,
    setNewName,
    handleShare,
    handleSaveAs,
    handleImportImage,
    handleRename,
    handleDelete,
    filteredDocs,
    router,
  };
};

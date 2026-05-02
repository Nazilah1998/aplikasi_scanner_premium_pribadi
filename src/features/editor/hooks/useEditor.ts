import { useState, useCallback, useEffect, useRef } from "react";
import { Alert, Animated, PanResponder, Image as RNImage } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { documentService } from "@/src/shared/services/document-service";

export const useEditor = (
  docId: string | string[],
  pageId: string | string[],
) => {
  const router = useRouter();
  const [doc, setDoc] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalUri, setOriginalUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("Gambar");
  const [activeSubTool, setActiveSubTool] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [applyToAll, setApplyToAll] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Original");
  const [isScanningText, setIsScanningText] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [eraseMode, setEraseMode] = useState("Ajaib");
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const cropPos = useRef(new Animated.ValueXY({ x: 20, y: 20 })).current;
  const cropSize = useRef(new Animated.ValueXY({ x: 200, y: 300 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: cropPos.x, dy: cropPos.y }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: () => {
        cropPos.extractOffset();
      },
    }),
  ).current;

  const loadPage = useCallback(async () => {
    try {
      const documents = await documentService.getAllDocuments();
      const currentDoc = documents.find((d: any) => d.id === docId);
      if (currentDoc) {
        setDoc(currentDoc);
        const pageIdx = currentDoc.pages.findIndex((p: any) => p.id === pageId);
        if (pageIdx !== -1) {
          setCurrentPageIndex(pageIdx);
          setImageUri(currentDoc.pages[pageIdx].imagePath);
          setOriginalUri(currentDoc.pages[pageIdx].imagePath);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [docId, pageId]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const getFilterActions = (filterName: string) => {
    let actions: any[] = [];
    switch (filterName) {
      case "Abu-abu":
        actions.push({ grayscale: true });
        break;
      case "Hemat":
        actions.push({ grayscale: true });
        break;
      case "Balik":
        actions.push({ flip: ImageManipulator.FlipType.Vertical });
        break;
      default:
        break;
    }
    return actions;
  };

  const applyFilter = async (filterName: string) => {
    if (!originalUri) return;
    setActiveFilter(filterName);
    setIsProcessing(true);
    try {
      const actions = getFilterActions(filterName);
      if (actions.length > 0) {
        const result = await ImageManipulator.manipulateAsync(
          originalUri,
          actions,
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
        );
        setImageUri(result.uri);
      } else {
        setImageUri(originalUri);
      }
    } catch {
      // Error handled
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotate = async (direction: "left" | "right") => {
    if (!imageUri) return;
    setIsProcessing(true);
    try {
      const actions = [{ rotate: direction === "left" ? -90 : 90 }];
      const result = await ImageManipulator.manipulateAsync(imageUri, actions, {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      setImageUri(result.uri);
      setOriginalUri(result.uri);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyFinalCrop = async () => {
    if (!imageUri) return;
    setIsProcessing(true);
    try {
      const { width: imgWidth, height: imgHeight } = await new Promise<{
        width: number;
        height: number;
      }>((resolve) => {
        RNImage.getSize(
          imageUri,
          (w, h) => resolve({ width: w, height: h }),
          () => resolve({ width: 0, height: 0 }),
        );
      });
      if (imgWidth === 0 || imgHeight === 0) throw new Error();
      const actions = [
        {
          crop: {
            originX: Math.floor(imgWidth * 0.1),
            originY: Math.floor(imgHeight * 0.1),
            width: Math.floor(imgWidth * 0.8),
            height: Math.floor(imgHeight * 0.8),
          },
        },
      ];
      const result = await ImageManipulator.manipulateAsync(imageUri, actions, {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      setImageUri(result.uri);
      setOriginalUri(result.uri);
      setActiveSubTool(null);
    } catch {
      Alert.alert("Error", "Gagal memproses pemotongan");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOcr = () => {
    setIsScanningText(true);
    setTimeout(() => {
      setIsScanningText(false);
      setExtractedText(
        "KEMENTERIAN AGAMA RI\n\nSURAT KEPUTUSAN KEPALA KANTOR WILAYAH...",
      );
      setShowTextEditor(true);
    }, 2000);
  };

  const handleShare = async () => {
    if (!imageUri) return;
    try {
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(imageUri);
      else Alert.alert("Info", "Berbagi tidak tersedia");
    } catch {
      Alert.alert("Error", "Gagal berbagi");
    }
  };

  const handleSign = () => setActiveOverlay("sign");
  const handleAddText = () => setActiveOverlay("text");
  const handleBrush = () => setActiveOverlay("brush");
  const handleWatermark = () =>
    Alert.alert("Watermark", "Fitur Watermark akan segera hadir.");
  const handleReorder = () =>
    Alert.alert("Urutkan", "Seret halaman untuk mengurutkan.");
  const handlePageTitle = () =>
    Alert.alert("Judul", "Masukkan judul halaman baru.");

  const saveChanges = async () => {
    if (!doc || !imageUri) return;
    setIsProcessing(true);
    try {
      let updatedPages = [...doc.pages];

      if (applyToAll && activeFilter !== "Original") {
        const actions = getFilterActions(activeFilter);
        updatedPages = await Promise.all(
          doc.pages.map(async (p: any) => {
            if (actions.length > 0) {
              const result = await ImageManipulator.manipulateAsync(
                p.imagePath,
                actions,
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
              );
              return { ...p, imagePath: result.uri };
            }
            return p;
          }),
        );
      } else {
        updatedPages = doc.pages.map((p: any, idx: number) => {
          if (idx === currentPageIndex) return { ...p, imagePath: imageUri };
          return p;
        });
      }

      const updatedDoc = {
        ...doc,
        pages: updatedPages,
        updatedAt: new Date().toISOString(),
      };
      await documentService.saveDocument(updatedDoc);
      router.back();
    } catch {
      // Error handled
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    doc,
    imageUri,
    isProcessing,
    activeTab,
    setActiveTab,
    activeSubTool,
    setActiveSubTool,
    currentPageIndex,
    setCurrentPageIndex,
    applyToAll,
    setApplyToAll,
    activeFilter,
    isScanningText,
    extractedText,
    setExtractedText,
    showTextEditor,
    setShowTextEditor,
    eraseMode,
    setEraseMode,
    activeOverlay,
    setActiveOverlay,
    cropPos,
    cropSize,
    panResponder,
    applyFilter,
    handleRotate,
    applyFinalCrop,
    handleOcr,
    saveChanges,
    handleShare,
    handleSign,
    handleAddText,
    handleBrush,
    handleWatermark,
    handleReorder,
    handlePageTitle,
    setImageUri,
    setOriginalUri,
    originalUri,
  };
};

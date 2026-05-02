import { useCameraPermissions, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import {
  X,
  Zap,
  ZapOff,
  ImageIcon,
  LayoutGrid,
  MoreVertical,
  Settings2,
  CreditCard,
  BookOpen,
  Clock,
  FileText,
  FileSpreadsheet,
  PenTool,
  Languages,
  HelpCircle,
  Sigma,
  UserCircle,
  RefreshCcw,
  Eraser,
  QrCode,
  Presentation,
  Monitor,
  Hash,
  Heart,
  ChevronRight,
  Undo2,
} from "lucide-react-native";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Switch,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { AppColors } from "@/src/shared/constants/theme";
import {
  documentService,
  DocumentPage,
} from "@/src/shared/services/document-service";
import { ScanModeOverlay } from "@/src/features/scan/components/ScanModeOverlay";
import { styles } from "@/src/features/scan/styles/scan.styles";

const SCAN_MODES = [
  { id: "QR", name: "Kode QR", dot: true },
  { id: "SIGN", name: "Tanda tangani", dot: true },
  { id: "DOKUMEN", name: "Scan" },
  { id: "ERASE", name: "Hapus Cerdas" },
  { id: "ID", name: "Kartu ID" },
];

const ALL_FEATURES_DATA = [
  {
    title: "Scan Dokumen",
    items: [
      { id: "DOKUMEN", name: "Scan", icon: LayoutGrid, color: "#3b82f6" },
      { id: "ID", name: "Kartu ID", icon: CreditCard, color: "#10b981" },
      { id: "BOOK", name: "Buku", icon: BookOpen, color: "#ec4899" },
      { id: "TIMESTAMP", name: "Stempel waktu", icon: Clock, color: "#64748b" },
    ],
  },
  {
    title: "Konversi Format",
    items: [
      { id: "WORD", name: "Ke Word", icon: FileText, color: "#2563eb" },
      {
        id: "EXCEL",
        name: "Ke Excel",
        icon: FileSpreadsheet,
        color: "#16a34a",
      },
    ],
  },
  {
    title: "Alat Dokumen",
    items: [
      { id: "SIGN", name: "Tanda tangani", icon: PenTool, color: "#8b5cf6" },
      { id: "OCR", name: "Ekstrak Teks", icon: FileText, color: "#3b82f6" },
      {
        id: "TRANSLATE",
        name: "Terjemahkan",
        icon: Languages,
        color: "#8b5cf6",
      },
      {
        id: "QUIZ",
        name: "Pertanyaan Tidak Benar",
        icon: HelpCircle,
        color: "#f59e0b",
      },
      { id: "MATH", name: "Rumus", icon: Sigma, color: "#ef4444" },
    ],
  },
  {
    title: "Perbagus Kualitas Gambar",
    items: [
      { id: "PAS_FOTO", name: "Pas Foto", icon: UserCircle, color: "#f59e0b" },
      {
        id: "PULIHKAN",
        name: "Pulihkan Foto",
        icon: RefreshCcw,
        color: "#3b82f6",
      },
      { id: "ERASE", name: "Hapus Cerdas", icon: Eraser, color: "#ef4444" },
      { id: "QR", name: "Scan Kode QR", icon: QrCode, color: "#10b981" },
    ],
  },
  {
    title: "Tangkap Layar",
    items: [
      { id: "SLIDE", name: "Slide", icon: Presentation, color: "#f97316" },
      {
        id: "WHITEBOARD",
        name: "Papan Tulis",
        icon: Monitor,
        color: "#06b6d4",
      },
    ],
  },
  {
    title: "Lainnya",
    items: [
      { id: "COUNTCAM", name: "CountCam", icon: Hash, color: "#3b82f6" },
      { id: "GREETING", name: "Kartu Ucapan", icon: Heart, color: "#ec4899" },
    ],
  },
];

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = params.mode;
  const retakeDocId = params.retakeDocId;
  const retakePageId = params.retakePageId;
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [flash, setFlash] = useState<"off" | "on" | "auto">("off");
  const [enableTorch, setEnableTorch] = useState(false);
  const [showFlashMenu, setShowFlashMenu] = useState(false);
  const [showHDMenu, setShowHDMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [resolution, setResolution] = useState("12M");
  const [isHD, setIsHD] = useState(true);

  // Quick Settings States
  const [autoCapture, setAutoCapture] = useState(false);
  const [orientation, setOrientation] = useState("Otomatis");
  const [showGrid, setShowGrid] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [levelerEnabled, setLevelerEnabled] = useState(false);
  const [autoCrop, setAutoCrop] = useState(true);

  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBatch, setIsBatch] = useState(false);

  const [activeMode, setActiveMode] = useState((mode as string) || "DOKUMEN");
  const [showOverlay, setShowOverlay] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const scanLinePos = useSharedValue(0);
  const gridOpacity = useSharedValue(0.5);
  const boxWidth = useSharedValue(Dimensions.get("window").width * 0.82);
  const boxHeight = useSharedValue(Dimensions.get("window").height * 0.45);

  const scrollRef = useRef<ScrollView>(null);
  const [tabLayouts, setTabLayouts] = useState<
    Record<string, { x: number; width: number }>
  >({});

  const scrollToMode = useCallback(
    (modeId: string) => {
      const layout = tabLayouts[modeId];
      if (layout && scrollRef.current) {
        const screenWidth = Dimensions.get("window").width;
        const scrollToX = layout.x - screenWidth / 2 + layout.width / 2;
        scrollRef.current.scrollTo({
          x: Math.max(0, scrollToX),
          animated: true,
        });
      }
    },
    [tabLayouts],
  );

  useEffect(() => {
    if (Object.keys(tabLayouts).length === SCAN_MODES.length) {
      scrollToMode(activeMode);
    }
  }, [activeMode, tabLayouts, scrollToMode]);

  useEffect(() => {
    if (
      activeMode === "ID" ||
      activeMode === "PULIHKAN" ||
      activeMode === "PAS_FOTO"
    ) {
      setShowOverlay(true);
    } else {
      setShowOverlay(false);
    }
  }, [activeMode]);

  useEffect(() => {
    scanLinePos.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500 }),
        withTiming(0, { duration: 2500 }),
      ),
      -1,
    );
    gridOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1500 }),
        withTiming(0.4, { duration: 1500 }),
      ),
      -1,
    );

    // Simulate smart tracking
    boxWidth.value = withRepeat(
      withSequence(
        withTiming(Dimensions.get("window").width * 0.85, { duration: 3000 }),
        withTiming(Dimensions.get("window").width * 0.78, { duration: 2000 }),
      ),
      -1,
    );
    boxHeight.value = withRepeat(
      withSequence(
        withTiming(Dimensions.get("window").height * 0.5, { duration: 4000 }),
        withTiming(Dimensions.get("window").height * 0.42, { duration: 3000 }),
      ),
      -1,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedLineStyle = useAnimatedStyle(() => ({
    top: `${scanLinePos.value * 100}%`,
  }));
  const animatedGridStyle = useAnimatedStyle(() => ({
    opacity: gridOpacity.value,
    width: boxWidth.value,
    height: boxHeight.value,
  }));

  const finishScanWithImage = useCallback(
    async (imageUri: string) => {
      try {
        if (retakeDocId && retakePageId) {
          // Update existing page
          const documents = await documentService.getAllDocuments();
          const doc = documents.find((d) => d.id === retakeDocId);
          if (doc) {
            const pageIndex = doc.pages.findIndex((p) => p.id === retakePageId);
            if (pageIndex !== -1) {
              doc.pages[pageIndex].imagePath = imageUri;
              doc.updatedAt = new Date().toISOString();
              await documentService.saveDocument(doc);
              router.replace({
                pathname: "/editor",
                params: {
                  docId: retakeDocId as string,
                  pageId: retakePageId as string,
                },
              });
              return;
            }
          }
        }

        const docId = `doc_${Date.now()}`;
        const pages: DocumentPage[] = [
          {
            id: `page_${docId}_0`,
            imagePath: imageUri,
            filter: "none",
            brightness: 1,
            contrast: 1,
          },
        ];
        const newDoc = {
          id: docId,
          name: `Scan ${new Date().toLocaleDateString("id-ID")}`,
          pages,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await documentService.saveDocument(newDoc);
        router.replace({ pathname: "/document/[id]", params: { id: docId } });
      } catch {
        Alert.alert("Error", "Gagal menyimpan dokumen");
      }
    },
    [router, retakeDocId, retakePageId],
  );

  const takePicture = useCallback(async () => {
    if (!cameraRef.current || isProcessing) return;
    setIsProcessing(true);

    try {
      // Map resolution label to image quality
      let photoQuality = 1.0;
      if (resolution === "8M") photoQuality = 0.9;
      else if (resolution === "6M") photoQuality = 0.8;
      else if (resolution === "5M") photoQuality = 0.7;

      const photo = await cameraRef.current.takePictureAsync({
        quality: photoQuality,
      });

      if (photo && photo.uri) {
        const fileName = `scan_${Date.now()}.jpg`;
        // Ensure there is a slash between directory and filename
        const fs = FileSystem as any;
        const baseDir = fs.documentDirectory || fs.cacheDirectory;
        const permanentUri = baseDir?.endsWith("/")
          ? `${baseDir}${fileName}`
          : `${baseDir}/${fileName}`;

        await FileSystem.moveAsync({
          from: photo.uri,
          to: permanentUri,
        });

        setCapturedImages((prev) => [...prev, permanentUri]);

        if (!isBatch) {
          // If single mode, finish immediately and go to document view (which acts as edit)
          finishScanWithImage(permanentUri);
        }
      }
    } catch (error) {
      console.error("Take picture error:", error);
      Alert.alert(
        "Error",
        "Gagal mengambil atau menyimpan gambar. Pastikan izin penyimpanan aktif.",
      );
    } finally {
      setIsProcessing(false);
    }
  }, [cameraRef, isProcessing, resolution, isBatch, finishScanWithImage]);

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: isBatch,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedUris = result.assets.map((asset) => asset.uri);
        const permanentUris: string[] = [];

        for (const uri of selectedUris) {
          const fileName = `import_${Date.now()}_${Math.floor(
            Math.random() * 1000,
          )}.jpg`;
          const fs = FileSystem as any;
          const baseDir = fs.documentDirectory || fs.cacheDirectory;
          const permanentUri = baseDir?.endsWith("/")
            ? `${baseDir}${fileName}`
            : `${baseDir}/${fileName}`;

          await FileSystem.copyAsync({
            from: uri,
            to: permanentUri,
          });
          permanentUris.push(permanentUri);
        }

        if (isBatch) {
          setCapturedImages((prev) => [...prev, ...permanentUris]);
        } else {
          // If single mode, take the first one and finish
          finishScanWithImage(permanentUris[0]);
        }
      }
    } catch (error) {
      console.error("Pick image error:", error);
      Alert.alert("Error", "Gagal mengimpor gambar");
    }
  }, [isBatch, finishScanWithImage]);

  const finishScan = useCallback(async () => {
    if (capturedImages.length === 0) return;
    setIsProcessing(true);
    try {
      const docId = `doc_${Date.now()}`;
      const pages: DocumentPage[] = capturedImages.map((uri, index) => ({
        id: `page_${docId}_${index}`,
        imagePath: uri,
        filter: "none",
        brightness: 1,
        contrast: 1,
      }));
      const newDoc = {
        id: docId,
        name: `Scan ${new Date().toLocaleDateString("id-ID")}`,
        pages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await documentService.saveDocument(newDoc);
      router.replace({ pathname: "/document/[id]", params: { id: docId } });
    } catch {
      Alert.alert("Error", "Gagal menyimpan dokumen");
    } finally {
      setIsProcessing(false);
    }
  }, [capturedImages, router]);

  // Early returns must come AFTER all hooks
  if (!permission) return <View style={styles.center} />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <ThemedText style={{ color: "white", marginBottom: 20 }}>
          Izin kamera diperlukan
        </ThemedText>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionBtn}
        >
          <ThemedText style={{ color: "white", fontWeight: "bold" }}>
            Beri Izin
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={[styles.topControlWrapper, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
          >
            <X color="white" size={26} />
          </TouchableOpacity>
          {retakeDocId && (
            <View style={{ marginLeft: 10 }}>
              <ThemedText
                style={{ color: "#10b981", fontWeight: "bold", fontSize: 16 }}
              >
                Ambil Ulang
              </ThemedText>
            </View>
          )}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => {
                setShowFlashMenu(!showFlashMenu);
                setShowHDMenu(false);
                setShowSettingsModal(false);
              }}
            >
              {flash === "off" && !enableTorch ? (
                <ZapOff color="white" size={22} />
              ) : (
                <Zap
                  color={flash !== "off" || enableTorch ? "#fbbf24" : "white"}
                  size={22}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => {
                setShowHDMenu(!showHDMenu);
                setShowFlashMenu(false);
                setShowSettingsModal(false);
              }}
            >
              <View
                style={[
                  styles.hdBadgeHeader,
                  isHD && styles.hdBadgeHeaderActive,
                ]}
              >
                <ThemedText
                  style={[
                    styles.hdBadgeHeaderText,
                    isHD && styles.hdBadgeHeaderTextActive,
                  ]}
                >
                  HD
                </ThemedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => {
                setShowSettingsModal(true);
                setShowFlashMenu(false);
                setShowHDMenu(false);
              }}
            >
              <MoreVertical color="white" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        {showFlashMenu && (
          <View style={styles.flashMenu}>
            {[
              { id: "on", name: "Aktif", isTorch: false },
              { id: "off", name: "Nonaktif", isTorch: false },
              { id: "auto", name: "Otomatis", isTorch: false },
              { id: "off", name: "Tetap Aktif", isTorch: true },
            ].map((opt) => {
              const isActive = opt.isTorch
                ? enableTorch
                : flash === opt.id && !enableTorch;
              return (
                <TouchableOpacity
                  key={opt.name}
                  style={[
                    styles.flashOption,
                    isActive && styles.activeFlashOption,
                  ]}
                  onPress={() => {
                    setFlash(opt.id as any);
                    setEnableTorch(opt.isTorch);
                    setShowFlashMenu(false);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.flashOptionText,
                      isActive && styles.activeFlashText,
                    ]}
                  >
                    {opt.name}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {showHDMenu && (
          <View style={styles.hdMenu}>
            {[
              { id: "12M", res: "4624x2600" },
              { id: "8M", res: "3840x2160" },
              { id: "6M", res: "2880x2160" },
              { id: "5M", res: "2560x1920" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.hdOption,
                  resolution === opt.id && styles.activeHdOption,
                ]}
                onPress={() => {
                  setResolution(opt.id);
                  setIsHD(true);
                  setShowHDMenu(false);
                }}
              >
                <ThemedText
                  style={[
                    styles.hdLabel,
                    resolution === opt.id && styles.activeHdText,
                  ]}
                >
                  {opt.id}
                </ThemedText>
                <ThemedText style={styles.hdSubLabel}>({opt.res})</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        flash={flash}
        enableTorch={enableTorch}
      >
        <View style={styles.cameraOverlay}>
          <View style={styles.gridContainer}>
            <Animated.View style={[styles.gridBox, animatedGridStyle]}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <Animated.View style={[styles.scanLine, animatedLineStyle]} />
            </Animated.View>
            <ThemedText style={styles.hintText}>Mencari Dokumen...</ThemedText>
          </View>
        </View>
      </CameraView>

      {activeMode === "DOKUMEN" && capturedImages.length === 0 && (
        <View style={styles.batchToggleOutside}>
          <TouchableOpacity
            style={[styles.batchBtn, !isBatch && styles.activeBatchBtn]}
            onPress={() => setIsBatch(false)}
          >
            <ThemedText
              style={[styles.batchText, !isBatch && styles.activeBatchText]}
            >
              Satu Halaman
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.batchBtn, isBatch && styles.activeBatchBtn]}
            onPress={() => setIsBatch(true)}
          >
            <ThemedText
              style={[styles.batchText, isBatch && styles.activeBatchText]}
            >
              Beberapa Halaman
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        {capturedImages.length > 0 && (
          <View style={styles.batchThumbContainer}>
            <View style={styles.thumbWrapper}>
              <Image
                source={{ uri: capturedImages[capturedImages.length - 1] }}
                style={styles.batchThumb}
              />
            </View>
            <View style={styles.batchBadge}>
              <ThemedText style={styles.batchBadgeText}>
                {capturedImages.length}
              </ThemedText>
            </View>
            <TouchableOpacity style={styles.ubahBtn} onPress={finishScan}>
              <ThemedText style={styles.ubahText}>Ubah</ThemedText>
            </TouchableOpacity>
            <View style={styles.thumbArrow}>
              <ChevronRight color="white" size={16} />
            </View>
          </View>
        )}

        {!(isBatch && capturedImages.length > 0) && (
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modeTabs}
          >
            {SCAN_MODES.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => setActiveMode(m.id)}
                onLayout={(e) => {
                  const { x, width } = e.nativeEvent.layout;
                  setTabLayouts((prev) => ({ ...prev, [m.id]: { x, width } }));
                }}
                style={styles.modeTab}
              >
                {activeMode === m.id && (
                  <View style={styles.activeTabIndicator} />
                )}
                <ThemedText
                  style={[
                    styles.modeText,
                    activeMode === m.id && styles.activeModeText,
                  ]}
                >
                  {m.name}
                </ThemedText>
                {m.dot && <View style={styles.modeDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.mainControls}>
          {capturedImages.length > 0 ? (
            <TouchableOpacity
              style={styles.controlItem}
              onPress={() => setCapturedImages([])}
            >
              <Undo2 color="white" size={28} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.controlItem}
              onPress={() => setShowAllFeatures(true)}
            >
              <LayoutGrid color="white" size={28} />
              <ThemedText style={styles.controlLabel}>Semua Fitur</ThemedText>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.captureBtn}
            onPress={takePicture}
            disabled={isProcessing}
          >
            <View style={styles.captureBtnInner}>
              {isProcessing && <ActivityIndicator color={AppColors.primary} />}
            </View>
          </TouchableOpacity>

          {capturedImages.length > 0 ? (
            <TouchableOpacity style={styles.selesaiBtn} onPress={finishScan}>
              <ThemedText style={styles.selesaiText}>Selesai</ThemedText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.controlItem} onPress={pickImage}>
              <ImageIcon color="white" size={28} />
              <ThemedText style={styles.controlLabel}>Impor Gambar</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showSettingsModal && (
        <View style={styles.settingsOverlay}>
          <View style={styles.settingsModal}>
            <View style={styles.settingsHeader}>
              <View style={styles.settingsTitleRow}>
                <Settings2 color="white" size={22} />
                <ThemedText style={styles.settingsTitle}>Atur</ThemedText>
              </View>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <X color="#9ca3af" size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                {
                  label: "Ambil Otomatis",
                  value: autoCapture ? "Aktif" : "Nonaktif",
                  state: autoCapture,
                  setter: setAutoCapture,
                },
                { label: "Orientasi", value: orientation, isMulti: true },
                {
                  label: "Kisi",
                  value: showGrid ? "Aktif" : "Nonaktif",
                  state: showGrid,
                  setter: setShowGrid,
                },
                {
                  label: "Suara",
                  value: soundEnabled ? "Aktif" : "Nonaktif",
                  state: soundEnabled,
                  setter: setSoundEnabled,
                },
                {
                  label: "Ukur Rata",
                  value: levelerEnabled ? "Aktif" : "Nonaktif",
                  state: levelerEnabled,
                  setter: setLevelerEnabled,
                },
                {
                  label: "Potong Otomatis",
                  value: autoCrop ? "Aktif" : "Nonaktif",
                  state: autoCrop,
                  setter: setAutoCrop,
                },
              ].map((item, idx) => (
                <View key={idx} style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <ThemedText style={styles.settingLabel}>
                      {item.label}
                    </ThemedText>
                    <ThemedText style={styles.settingValue}>
                      {item.value}
                    </ThemedText>
                  </View>
                  <View style={styles.settingActions}>
                    {item.isMulti ? (
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <TouchableOpacity
                          onPress={() => setOrientation("Otomatis")}
                          style={{
                            backgroundColor:
                              orientation === "Otomatis" ? "#10b981" : "#333",
                            padding: 5,
                            borderRadius: 5,
                          }}
                        >
                          <ThemedText style={{ fontSize: 10, color: "white" }}>
                            A
                          </ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setOrientation("Lanskap")}
                          style={{
                            backgroundColor:
                              orientation === "Lanskap" ? "#10b981" : "#333",
                            padding: 5,
                            borderRadius: 5,
                          }}
                        >
                          <ThemedText style={{ fontSize: 10, color: "white" }}>
                            L
                          </ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setOrientation("Potret")}
                          style={{
                            backgroundColor:
                              orientation === "Potret" ? "#10b981" : "#333",
                            padding: 5,
                            borderRadius: 5,
                          }}
                        >
                          <ThemedText style={{ fontSize: 10, color: "white" }}>
                            P
                          </ThemedText>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Switch
                        value={item.state}
                        onValueChange={item.setter}
                        trackColor={{ false: "#333", true: "#10b981" }}
                        thumbColor="white"
                      />
                    )}
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.moreSettingsBtn}
                onPress={() => {
                  setShowSettingsModal(false);
                  router.push("/scan-settings");
                }}
              >
                <ThemedText style={styles.moreSettingsText}>
                  Pengaturan Lainnya
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}

      {showOverlay && (
        <ScanModeOverlay
          mode={activeMode}
          onClose={() => setShowOverlay(false)}
          onAction={() => setShowOverlay(false)}
        />
      )}

      {/* Semua Fitur Modal */}
      <Modal
        visible={showAllFeatures}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAllFeatures(false)}
      >
        <View style={allFeaturesStyles.modalOverlay}>
          <View style={allFeaturesStyles.container}>
            <View style={allFeaturesStyles.header}>
              <ThemedText style={allFeaturesStyles.headerTitle}>
                Semua Fitur
              </ThemedText>
              <TouchableOpacity
                onPress={() => setShowAllFeatures(false)}
                style={allFeaturesStyles.closeBtn}
              >
                <X color="white" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={allFeaturesStyles.scrollContent}
            >
              {ALL_FEATURES_DATA.map((section, sIdx) => (
                <View key={sIdx} style={allFeaturesStyles.section}>
                  <ThemedText style={allFeaturesStyles.sectionTitle}>
                    {section.title}
                  </ThemedText>
                  <View style={allFeaturesStyles.grid}>
                    {section.items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={allFeaturesStyles.item}
                        onPress={() => {
                          setActiveMode(item.id);
                          setShowAllFeatures(false);
                        }}
                      >
                        <View style={allFeaturesStyles.iconBox}>
                          <item.icon color="white" size={24} />
                        </View>
                        <ThemedText style={allFeaturesStyles.itemName}>
                          {item.name}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {sIdx < ALL_FEATURES_DATA.length - 1 && (
                    <View style={allFeaturesStyles.divider} />
                  )}
                </View>
              ))}
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const allFeaturesStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "flex-end",
  },
  container: {
    height: "92%",
    backgroundColor: "#05070a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  item: {
    width: (Dimensions.get("window").width - 68) / 4,
    alignItems: "center",
    marginBottom: 15,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#111827",
    marginTop: 10,
  },
});

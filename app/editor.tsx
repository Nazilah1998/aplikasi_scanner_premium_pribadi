import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  X,
  Eraser,
  RotateCcw,
  RotateCw,
  Maximize,
  Check,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { AppColors } from "@/src/shared/constants/theme";
import { useEditor } from "@/src/features/editor/hooks/useEditor";
import {
  CropOverlay,
  CropOverlayRef,
} from "@/src/features/editor/components/CropOverlay";
import { FilterGallery } from "@/src/features/editor/components/FilterGallery";
import { FilteredImage } from "@/src/features/editor/components/FilteredImage";
import { TextEditorModal } from "@/src/features/editor/components/TextEditorModal";
import { SmartEraseInterface } from "@/src/features/editor/components/SmartEraseInterface";
import { EraseOverlay } from "@/src/features/editor/components/EraseOverlay";
import { SignOverlay } from "@/src/features/editor/components/SignOverlay";
import { EditorTools } from "@/src/features/editor/components/EditorTools";
import { styles } from "@/src/features/editor/styles/editor.styles";

const TABS = ["Gambar", "Tandai", "Halaman"];
const FILTERS = [
  { name: "Original", id: "Original" },
  { name: "Cerahkan", id: "Cerahkan" },
  { name: "Warna Ajaib", id: "Warna Ajaib" },
  { name: "Ajaib Pro", id: "Ajaib Pro" },
  { name: "Tidak Ada...", id: "Tidak Ada" },
  { name: "Tanpa Bay...", id: "Tanpa Bayangan" },
  { name: "H&P", id: "H&P" },
  { name: "Hemat", id: "Hemat" },
  { name: "Abu-abu", id: "Abu-abu" },
  { name: "Balik", id: "Balik" },
];

export default function EditorScreen() {
  const { docId, pageId } = useLocalSearchParams();
  const router = useRouter();
  const e = useEditor(docId as string, pageId as string);
  const cropOverlayRef = React.useRef<CropOverlayRef>(null);
  const initialFilterRef = React.useRef("Original");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Calculate dynamic dimensions for imageCard so it perfectly wraps the image
  let cardWidth = containerSize.width ? containerSize.width - 40 : 0;
  let cardHeight = containerSize.height ? containerSize.height - 40 : 0;
  if (containerSize.width > 0 && containerSize.height > 0) {
    const availableWidth = containerSize.width - 40;
    const availableHeight = containerSize.height - 40;
    const containerRatio = availableWidth / availableHeight;

    if (e.imageRatio > containerRatio) {
      // Image is wider than container
      cardWidth = availableWidth;
      cardHeight = availableWidth / e.imageRatio;
    } else {
      // Image is taller than container
      cardHeight = availableHeight;
      cardWidth = availableHeight * e.imageRatio;
    }
  }

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: e.doc?.name || "Editor",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X color="white" size={24} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={e.handleShare}
              >
                <ThemedText style={styles.headerBtnText}>Bagikan</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={e.saveChanges}>
                <ThemedText style={styles.saveBtnText}>Selesai</ThemedText>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View
        style={styles.mainContent}
        onLayout={(evt) => {
          const { width, height } = evt.nativeEvent.layout;
          setContainerSize({ width, height });
        }}
      >
        <View
          style={[
            styles.imageCard,
            { width: cardWidth || "100%", height: cardHeight || "80%" },
          ]}
        >
          {e.imageUri && (
            <FilteredImage
              uri={e.imageUri}
              filterId={e.activeFilter}
              intensity={e.filterIntensity}
              style={styles.mainImage}
              contentFit="contain"
            />
          )}
          {e.activeSubTool === "crop" && (
            <CropOverlay ref={cropOverlayRef} imageUri={e.imageUri} />
          )}
          {e.activeSubTool === "erase" && <EraseOverlay mode={e.eraseMode} />}
          {e.activeOverlay === "sign" && <SignOverlay />}
          {!e.activeSubTool && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => e.setImageUri(e.originalUri)}
            >
              <Eraser color="white" size={16} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.compareRow}>
          <TouchableOpacity
            style={styles.compareBtn}
            onPress={() =>
              Alert.alert(
                "Bandingkan",
                "Tekan dan tahan untuk melihat gambar asli.",
              )
            }
          >
            <Layers color="white" size={16} />
            <ThemedText style={styles.compareText}>Bandingkan</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.pageNavRow}>
          <TouchableOpacity
            style={styles.navArrow}
            disabled={e.currentPageIndex === 0}
            onPress={() => {
              const prevPage = e.doc?.pages[e.currentPageIndex - 1];
              if (prevPage) {
                e.setCurrentPageIndex(e.currentPageIndex - 1);
                e.setImageUri(prevPage.imagePath);
                e.setOriginalUri(prevPage.imagePath);
              }
            }}
          >
            <ChevronLeft
              color={e.currentPageIndex === 0 ? "#444" : "white"}
              size={20}
            />
          </TouchableOpacity>
          <ThemedText style={styles.pageNumberText}>
            {e.currentPageIndex + 1}/{e.doc?.pages.length || 1}
          </ThemedText>
          <TouchableOpacity
            style={styles.navArrow}
            disabled={e.currentPageIndex === (e.doc?.pages.length || 1) - 1}
            onPress={() => {
              const nextPage = e.doc?.pages[e.currentPageIndex + 1];
              if (nextPage) {
                e.setCurrentPageIndex(e.currentPageIndex + 1);
                e.setImageUri(nextPage.imagePath);
                e.setOriginalUri(nextPage.imagePath);
              }
            }}
          >
            <ChevronRight
              color={
                e.currentPageIndex === (e.doc?.pages.length || 1) - 1
                  ? "#444"
                  : "white"
              }
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomBar}>
        {!e.activeSubTool && (
          <View style={styles.tabContainer}>
            {TABS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tabItem, e.activeTab === t && styles.activeTab]}
                onPress={() => e.setActiveTab(t)}
              >
                <ThemedText
                  style={[
                    styles.tabText,
                    e.activeTab === t && styles.activeTabText,
                  ]}
                >
                  {t}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.toolsContainer}>
          {e.activeTab === "Gambar" && !e.activeSubTool && (
            <EditorTools
              activeTab="Gambar"
              isProcessing={e.isProcessing}
              isScanningText={e.isScanningText}
              onAction={(action) => {
                if (action === "crop") e.setActiveSubTool("crop");
                else if (action === "filter") {
                  initialFilterRef.current = e.activeFilter;
                  e.setActiveSubTool("filter");
                } else if (action === "ocr") e.handleOcr();
                else if (action === "erase") e.setActiveSubTool("erase");
                else if (action === "sign") e.handleSign();
                else if (action === "addText") e.handleAddText();
                else if (action === "brush") e.handleBrush();
                else if (action === "watermark") e.handleWatermark();
                else if (action === "reorder") e.handleReorder();
                else if (action === "pageTitle") e.handlePageTitle();
                else if (action === "retake") {
                  router.push({
                    pathname: "/scan",
                    params: {
                      retakeDocId: e.doc?.id,
                      retakePageId: e.doc?.pages[e.currentPageIndex]?.id,
                    },
                  });
                } else Alert.alert("Fitur", `${action} akan segera hadir.`);
              }}
            />
          )}
          {e.activeTab === "Tandai" && !e.activeSubTool && (
            <EditorTools
              activeTab="Tandai"
              isProcessing={false}
              isScanningText={false}
              onAction={(action) => {
                if (action === "sign") e.handleSign();
                else if (action === "addText") e.handleAddText();
                else if (action === "brush") e.handleBrush();
                else if (action === "watermark") e.handleWatermark();
                else Alert.alert("Fitur", `${action} akan segera hadir.`);
              }}
            />
          )}
          {e.activeTab === "Halaman" && !e.activeSubTool && (
            <EditorTools
              activeTab="Halaman"
              isProcessing={false}
              isScanningText={false}
              onAction={(action) => {
                if (action === "reorder") e.handleReorder();
                else if (action === "pageTitle") e.handlePageTitle();
                else Alert.alert("Fitur", `${action} akan segera hadir.`);
              }}
            />
          )}
          {e.activeSubTool === "crop" && (
            <View style={styles.cropInterface}>
              <View style={styles.subToolRow}>
                <TouchableOpacity
                  style={styles.cropToolBtn}
                  onPress={() => e.handleRotate("left")}
                >
                  <RotateCcw color="white" size={20} />
                  <ThemedText style={styles.cropToolLabel}>Kiri</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cropToolBtn}
                  onPress={() => e.handleRotate("right")}
                >
                  <RotateCw color="white" size={20} />
                  <ThemedText style={styles.cropToolLabel}>Kanan</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cropToolBtn}
                  onPress={() => {
                    Alert.alert(
                      "Auto",
                      "Fitur deteksi tepi dokumen otomatis akan segera hadir. Beralih ke Bebas sementara.",
                    );
                    cropOverlayRef.current?.setRatio("Bebas");
                  }}
                >
                  <Maximize color="white" size={20} />
                  <ThemedText style={styles.cropToolLabel}>Otomatis</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cropToolBtn}
                  onPress={() => cropOverlayRef.current?.setAll()}
                >
                  <Maximize color="white" size={20} />
                  <ThemedText style={styles.cropToolLabel}>Semua</ThemedText>
                </TouchableOpacity>
              </View>
              <View style={styles.ratioBar}>
                <ThemedText style={styles.subToolLabel}>Rasio:</ThemedText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingRight: 20 }}
                >
                  {[
                    "Bebas",
                    "1:1",
                    "3:4",
                    "4:3",
                    "9:16",
                    "16:9",
                    "2:3",
                    "3:2",
                    "A4",
                  ].map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={styles.subToolBtn}
                      onPress={() => cropOverlayRef.current?.setRatio(r)}
                    >
                      <ThemedText style={styles.subToolText}>{r}</ThemedText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.confirmRow}>
                <TouchableOpacity
                  style={styles.cancelAction}
                  onPress={() => e.setActiveSubTool(null)}
                >
                  <X color="white" size={24} />
                </TouchableOpacity>
                <ThemedText style={styles.confirmTitle}>Potong</ThemedText>
                <TouchableOpacity
                  style={styles.confirmAction}
                  onPress={() => {
                    const points =
                      cropOverlayRef.current?.getNormalizedPoints();
                    e.applyFinalCrop(points);
                  }}
                >
                  <Check color="white" size={24} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {e.activeSubTool === "filter" && (
            <FilterGallery
              filters={FILTERS}
              activeFilter={e.activeFilter}
              intensity={e.filterIntensity}
              originalUri={e.originalUri}
              applyToAll={e.applyToAll}
              onSelectFilter={(id) => {
                e.applyFilter(id, e.filterIntensity);
              }}
              onIntensityChange={(val) => {
                e.setFilterIntensity(val);
                e.applyFilter(e.activeFilter, val);
              }}
              onToggleApplyAll={() => e.setApplyToAll(!e.applyToAll)}
              onCancel={() => {
                if (e.activeFilter !== initialFilterRef.current) {
                  e.applyFilter(initialFilterRef.current, 100);
                  e.setFilterIntensity(100);
                }
                e.setActiveSubTool(null);
              }}
              onConfirm={() => e.setActiveSubTool(null)}
            />
          )}
          {e.activeSubTool === "erase" && (
            <SmartEraseInterface
              activeMode={e.eraseMode}
              onSelectMode={e.setEraseMode}
              onCancel={() => e.setActiveSubTool(null)}
              onConfirm={() => e.setActiveSubTool(null)}
            />
          )}
          {e.activeOverlay === "sign" && (
            <View style={styles.subToolRow}>
              <TouchableOpacity
                style={styles.cancelAction}
                onPress={() => e.setActiveOverlay(null)}
              >
                <X color="white" size={24} />
              </TouchableOpacity>
              <ThemedText style={styles.confirmTitle}>Tanda Tangan</ThemedText>
              <TouchableOpacity
                style={styles.confirmAction}
                onPress={() => {
                  Alert.alert("Sukses", "Tanda tangan diterapkan.");
                  e.setActiveOverlay(null);
                }}
              >
                <Check color="white" size={24} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {e.isScanningText && (
          <View style={styles.ocrOverlay}>
            <ActivityIndicator size="large" color={AppColors.primary} />
            <ThemedText style={styles.ocrText}>Mengenali Teks...</ThemedText>
          </View>
        )}
        <TextEditorModal
          visible={e.showTextEditor}
          extractedText={e.extractedText}
          setExtractedText={e.setExtractedText}
          onClose={() => e.setShowTextEditor(false)}
          onSave={() => {
            Alert.alert("Sukses", "Teks disimpan.");
            e.setShowTextEditor(false);
          }}
        />
      </View>
    </View>
  );
}

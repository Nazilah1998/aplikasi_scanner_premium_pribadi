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
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/themed-text";
import { AppColors } from "@/src/shared/constants/theme";
import { useEditor } from "@/src/features/editor/hooks/useEditor";
import { CropOverlay } from "@/src/features/editor/components/CropOverlay";
import { FilterGallery } from "@/src/features/editor/components/FilterGallery";
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
  { name: "Ajaib Pro", id: "Ajaib Pro", badge: "Free Offer" },
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
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

      <View style={styles.mainContent}>
        <View style={styles.imageCard}>
          {e.imageUri && (
            <Image
              source={{ uri: e.imageUri as string }}
              style={styles.mainImage}
              contentFit="contain"
              cachePolicy="none"
            />
          )}
          {e.activeSubTool === "crop" && (
            <CropOverlay
              panHandlers={e.panResponder.panHandlers}
              cropPos={e.cropPos}
              cropSize={e.cropSize}
            />
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
                else if (action === "filter") e.setActiveSubTool("filter");
                else if (action === "ocr") e.handleOcr();
                else if (action === "erase") e.setActiveSubTool("erase");
                else if (action === "sign") e.handleSign();
                else if (action === "addText") e.handleAddText();
                else if (action === "brush") e.handleBrush();
                else if (action === "watermark") e.handleWatermark();
                else if (action === "reorder") e.handleReorder();
                else if (action === "pageTitle") e.handlePageTitle();
                else Alert.alert("Fitur", `${action} akan segera hadir.`);
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
                  onPress={() =>
                    Alert.alert("Auto", "Mendeteksi tepi otomatis...")
                  }
                >
                  <Maximize color="white" size={20} />
                  <ThemedText style={styles.cropToolLabel}>Otomatis</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cropToolBtn}
                  onPress={() => e.cropSize.setValue({ x: 300, y: 400 })}
                >
                  <Maximize color="white" size={20} />
                  <ThemedText style={styles.cropToolLabel}>Semua</ThemedText>
                </TouchableOpacity>
              </View>
              <View style={styles.ratioBar}>
                <ThemedText style={styles.subToolLabel}>Rasio:</ThemedText>
                <TouchableOpacity
                  style={styles.subToolBtn}
                  onPress={() => e.cropSize.setValue({ x: 250, y: 350 })}
                >
                  <ThemedText style={styles.subToolText}>Bebas</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subToolBtn}
                  onPress={() => e.cropSize.setValue({ x: 250, y: 250 })}
                >
                  <ThemedText style={styles.subToolText}>1:1</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subToolBtn}
                  onPress={() => e.cropSize.setValue({ x: 225, y: 300 })}
                >
                  <ThemedText style={styles.subToolText}>3:4</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.subToolBtn}
                  onPress={() => e.cropSize.setValue({ x: 225, y: 400 })}
                >
                  <ThemedText style={styles.subToolText}>16:9</ThemedText>
                </TouchableOpacity>
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
                  onPress={e.applyFinalCrop}
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
              originalUri={e.originalUri}
              applyToAll={e.applyToAll}
              onSelectFilter={e.applyFilter}
              onToggleApplyAll={() => e.setApplyToAll(!e.applyToAll)}
              onCancel={() => e.setActiveSubTool(null)}
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
    </SafeAreaView>
  );
}

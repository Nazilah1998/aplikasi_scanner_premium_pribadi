import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  Crop,
  Palette,
  Type,
  Eraser,
  RefreshCcw,
  PenTool,
  Highlighter,
  Waves,
  ArrowDownUp,
  BookText,
} from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { AppColors } from "@/src/shared/constants/theme";
import { styles } from "../styles/editor.styles";

interface EditorToolsProps {
  activeTab: string;
  isProcessing: boolean;
  isScanningText: boolean;
  onAction: (action: string) => void;
}

export const EditorTools: React.FC<EditorToolsProps> = ({
  activeTab,
  isProcessing,
  isScanningText,
  onAction,
}) => {
  if (isProcessing && !isScanningText) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={AppColors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.toolsRow}
    >
      {activeTab === "Gambar" && (
        <>
          <TouchableOpacity
            style={styles.toolItem}
            onPress={() => onAction("crop")}
          >
            <Crop color="white" size={24} />
            <ThemedText style={styles.toolLabel}>Potong</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolItem}
            onPress={() => onAction("filter")}
          >
            <Palette color={AppColors.primary} size={24} />
            <ThemedText
              style={[styles.toolLabel, { color: AppColors.primary }]}
            >
              Filter
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolItem}
            onPress={() => onAction("ocr")}
          >
            <Type color="white" size={24} />
            <ThemedText style={styles.toolLabel}>Edit{"\n"}Teks</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolItem}
            onPress={() => onAction("erase")}
          >
            <Eraser color="white" size={24} />
            <ThemedText style={styles.toolLabel}>Hapus{"\n"}Cerdas</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolItem}
            onPress={() => onAction("retake")}
          >
            <RefreshCcw color="white" size={24} />
            <ThemedText style={styles.toolLabel}>Ambil{"\n"}Ulang</ThemedText>
          </TouchableOpacity>
        </>
      )}
      {activeTab === "Tandai" && (
        <>
          <TouchableOpacity
            style={styles.toolItem}
            onPress={() => onAction("sign")}
          >
            <PenTool color="white" size={24} />
            <ThemedText style={styles.toolLabel}>Tanda{"\n"}tangani</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolItem}
            onPress={() => onAction("addText")}
          >
            <Type color="white" size={24} />
            <ThemedText style={styles.toolLabel}>
              Tambahkan{"\n"}Teks
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolItem}
            onPress={() => onAction("brush")}
          >
            <Highlighter color="white" size={24} />
            <ThemedText style={styles.toolLabel}>Kuas</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolItem}
            onPress={() => onAction("watermark")}
          >
            <Waves color="white" size={24} />
            <ThemedText style={styles.toolLabel}>
              Tambahkan{"\n"}Watermark
            </ThemedText>
          </TouchableOpacity>
        </>
      )}
      {activeTab === "Halaman" && (
        <>
          <TouchableOpacity
            style={styles.toolItem}
            onPress={() => onAction("reorder")}
          >
            <ArrowDownUp color="white" size={24} />
            <ThemedText style={styles.toolLabel}>Urutkan{"\n"}Ulang</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolItem}
            onPress={() => onAction("pageTitle")}
          >
            <BookText color="white" size={24} />
            <ThemedText style={styles.toolLabel}>Judul{"\n"}Halaman</ThemedText>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

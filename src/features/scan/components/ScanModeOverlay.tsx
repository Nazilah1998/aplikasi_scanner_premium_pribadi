import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { X } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { AppColors } from "@/src/shared/constants/theme";

interface ModeOverlayProps {
  mode: string;
  onClose: () => void;
  onAction: () => void;
}

export const ScanModeOverlay: React.FC<ModeOverlayProps> = ({
  mode,
  onClose,
  onAction,
}) => {
  const getContent = () => {
    switch (mode) {
      case "ID":
        return {
          title: "Salinan ID",
          desc: "Buat dan bagikan salinan ID untuk berbagai kebutuhan, termasuk perbankan, administrasi, dan lainnya.",
          btn: "Buat sekarang",
          tabs: ["Umum", "Kartu Identitas", "Paspor"],
          activeTab: "Paspor",
          placeholder:
            "https://placehold.jp/24/10b981/ffffff/300x200.png?text=Contoh+Kertas+A4",
        };
      case "PULIHKAN":
        return {
          title: "Pulihkan Foto",
          desc: "Perbaiki bekas lipatan, warna yang pudar, dan noda hanya dalam sekali ketuk.",
          btn: "Pulihkan",
          tabs: ["Pulihkan", "Beri Warna"],
          activeTab: "Pulihkan",
          placeholder:
            "https://placehold.jp/24/6366f1/ffffff/300x200.png?text=Sebelum+vs+Sesudah",
        };
      case "PAS_FOTO":
        return {
          title: "Buat Foto ID Profesional",
          desc: "Ubah latar belakang, sesuaikan ukuran, ganti pakaian, dan perbagus tampilan Anda.",
          btn: "Tangkap",
          placeholder:
            "https://placehold.jp/24/fbbf24/000000/300x200.png?text=Pas+Foto+ID",
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: content.placeholder }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X color="white" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <ThemedText style={styles.title}>{content.title}</ThemedText>
          <ThemedText style={styles.desc}>{content.desc}</ThemedText>

          {content.tabs && (
            <View style={styles.tabsRow}>
              {content.tabs.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.tab,
                    content.activeTab === t && styles.activeTab,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.tabText,
                      content.activeTab === t && styles.activeTabText,
                    ]}
                  >
                    {t}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.mainBtn} onPress={onAction}>
            <ThemedText style={styles.mainBtnText}>{content.btn}</ThemedText>
          </TouchableOpacity>

          {mode === "PULIHKAN" && (
            <TouchableOpacity>
              <ThemedText style={styles.linkText}>Lihat Sampel</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 1000,
  },
  card: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    overflow: "hidden",
  },
  imageContainer: {
    height: 200,
    backgroundColor: "#333",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    padding: 5,
  },
  infoContainer: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  desc: {
    color: "#9ca3af",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#444",
  },
  tabText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
  },
  activeTabText: {
    color: "white",
  },
  mainBtn: {
    width: "100%",
    backgroundColor: AppColors.primary,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  mainBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: AppColors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});

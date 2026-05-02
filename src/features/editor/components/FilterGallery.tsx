import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Circle, X, Check, CheckCircle2 } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { AppColors } from "@/src/shared/constants/theme";

interface FilterGalleryProps {
  filters: any[];
  activeFilter: string;
  originalUri: string | null;
  applyToAll: boolean;
  onSelectFilter: (id: string) => void;
  onToggleApplyAll: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const FilterGallery: React.FC<FilterGalleryProps> = ({
  filters,
  activeFilter,
  originalUri,
  applyToAll,
  onSelectFilter,
  onToggleApplyAll,
  onCancel,
  onConfirm,
}) => {
  return (
    <View style={styles.filterInterface}>
      <TouchableOpacity style={styles.applyAllRow} onPress={onToggleApplyAll}>
        {applyToAll ? (
          <CheckCircle2 color={AppColors.primary} size={18} />
        ) : (
          <Circle color="#9ca3af" size={18} />
        )}
        <ThemedText
          style={[styles.applyAllText, applyToAll && { color: "white" }]}
        >
          Terapkan ke Semua
        </ThemedText>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
      >
        {filters.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={styles.filterItem}
            onPress={() => onSelectFilter(f.id)}
          >
            <View
              style={[
                styles.filterThumb,
                activeFilter === f.id && styles.activeFilterThumb,
              ]}
            >
              {originalUri && (
                <Image
                  source={{ uri: originalUri }}
                  style={styles.filterImg}
                  contentFit="cover"
                />
              )}
              {f.badge && (
                <View style={styles.filterBadge}>
                  <ThemedText style={styles.filterBadgeText}>
                    {f.badge}
                  </ThemedText>
                </View>
              )}
            </View>
            <ThemedText
              style={[
                styles.filterName,
                activeFilter === f.id && styles.activeFilterName,
              ]}
            >
              {f.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.confirmRow}>
        <TouchableOpacity style={styles.cancelAction} onPress={onCancel}>
          <X color="white" size={24} />
        </TouchableOpacity>
        <ThemedText style={styles.confirmTitle}>Filter</ThemedText>
        <TouchableOpacity style={styles.confirmAction} onPress={onConfirm}>
          <Check color="white" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterInterface: { paddingTop: 10 },
  applyAllRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 15,
  },
  applyAllText: { fontSize: 13, color: "#9ca3af" },
  filterList: { paddingHorizontal: 15, gap: 12, paddingBottom: 15 },
  filterItem: { alignItems: "center", width: 75 },
  filterThumb: {
    width: 65,
    height: 65,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "#333",
  },
  activeFilterThumb: { borderColor: "#10b981" },
  filterImg: { width: "100%", height: "100%", opacity: 0.8 },
  filterName: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 6,
    textAlign: "center",
  },
  activeFilterName: { color: "#10b981", fontWeight: "bold" },
  filterBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ef4444",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomLeftRadius: 4,
  },
  filterBadgeText: { color: "white", fontSize: 7, fontWeight: "bold" },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
    marginTop: 15,
  },
  confirmTitle: { fontSize: 16, fontWeight: "bold", color: "white" },
  cancelAction: { padding: 10 },
  confirmAction: { padding: 10 },
});

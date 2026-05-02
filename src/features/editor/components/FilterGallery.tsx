import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import { Circle, X, Check, CheckCircle2 } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { AppColors } from "@/src/shared/constants/theme";
import { FilteredImage } from "./FilteredImage";
import { ColorMatrix } from "react-native-color-matrix-image-filters";
import { getFilterMatrix } from "../utils/filterMatrix";

interface FilterGalleryProps {
  filters: any[];
  activeFilter: string;
  intensity: number;
  originalUri: string | null;
  applyToAll: boolean;
  onSelectFilter: (id: string) => void;
  onIntensityChange: (val: number) => void;
  onToggleApplyAll: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

// ── Butter-smooth Custom Slider ───────────────────────────────────────────────
const CustomSlider = ({
  value,
  onValueChange,
}: {
  value: number;
  onValueChange: (val: number) => void;
}) => {
  const widthRef = useRef(1);
  const startValRef = useRef(value);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const x = evt.nativeEvent.locationX;
        const pct = Math.max(0, Math.min(1, x / widthRef.current));
        const v = Math.round(pct * 99) + 1;
        startValRef.current = v;
        onValueChange(v);
      },
      onPanResponderMove: (_evt, gs) => {
        const delta = (gs.dx / widthRef.current) * 100;
        const v = Math.round(
          Math.max(1, Math.min(100, startValRef.current + delta)),
        );
        onValueChange(v);
      },
    }),
  ).current;

  const percent = `${value}%` as any;
  return (
    <View
      style={styles.sliderWrapper}
      onLayout={(e) => {
        widthRef.current = Math.max(1, e.nativeEvent.layout.width);
      }}
      {...panResponder.panHandlers}
    >
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: percent }]} />
      </View>
      <View style={[styles.sliderThumb, { left: percent }]} />
    </View>
  );
};

// ── Filter Thumbnail with live preview ───────────────────────────────────────
const FilterThumb = ({
  uri,
  filterId,
  isActive,
  onPress,
  name,
}: {
  uri: string | null;
  filterId: string;
  isActive: boolean;
  onPress: () => void;
  name: string;
}) => {
  return (
    <TouchableOpacity style={styles.filterItem} onPress={onPress}>
      <View style={[styles.filterThumb, isActive && styles.activeFilterThumb]}>
        {uri ? (
          filterId === "Original" ? (
            <FilteredImage
              uri={uri}
              filterId="Original"
              intensity={100}
              style={styles.filterImg}
              contentFit="cover"
            />
          ) : (
            <ColorMatrix matrix={getFilterMatrix(filterId, 80) as any}>
              <FilteredImage
                uri={uri}
                filterId="Original"
                intensity={100}
                style={styles.filterImg}
                contentFit="cover"
              />
            </ColorMatrix>
          )
        ) : (
          <View style={styles.filterImg} />
        )}
      </View>
      <ThemedText
        style={[styles.filterName, isActive && styles.activeFilterName]}
      >
        {name}
      </ThemedText>
    </TouchableOpacity>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
export const FilterGallery: React.FC<FilterGalleryProps> = ({
  filters,
  activeFilter,
  intensity,
  originalUri,
  applyToAll,
  onSelectFilter,
  onIntensityChange,
  onToggleApplyAll,
  onCancel,
  onConfirm,
}) => {
  return (
    <View style={styles.filterInterface}>
      {/* Terapkan ke Semua */}
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

      {/* Intensity Slider — hanya muncul jika bukan Original */}
      {activeFilter !== "Original" && (
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <ThemedText style={styles.sliderLabel}>Intensitas</ThemedText>
            <ThemedText style={styles.sliderValue}>{intensity}</ThemedText>
          </View>
          <CustomSlider value={intensity} onValueChange={onIntensityChange} />
        </View>
      )}

      {/* Filter Thumbnails */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
      >
        {filters.map((f) => (
          <FilterThumb
            key={f.id}
            uri={originalUri}
            filterId={f.id}
            name={f.name}
            isActive={activeFilter === f.id}
            onPress={() => onSelectFilter(f.id)}
          />
        ))}
      </ScrollView>

      {/* Confirm Row */}
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
    marginBottom: 12,
  },
  applyAllText: { fontSize: 13, color: "#9ca3af" },
  sliderContainer: { marginBottom: 12 },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  sliderLabel: { color: "#9ca3af", fontSize: 12 },
  sliderValue: { color: "#10b981", fontSize: 12, fontWeight: "bold" },
  sliderWrapper: {
    height: 30,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  sliderTrack: { height: 4, backgroundColor: "#333", borderRadius: 2 },
  sliderFill: { height: "100%", backgroundColor: "#10b981", borderRadius: 2 },
  sliderThumb: {
    position: "absolute",
    marginLeft: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10b981",
    borderWidth: 3,
    borderColor: "white",
  },
  filterList: { paddingHorizontal: 15, gap: 12, paddingBottom: 10 },
  filterItem: { alignItems: "center", width: 72 },
  filterThumb: {
    width: 62,
    height: 62,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "#333",
  },
  activeFilterThumb: { borderColor: "#10b981" },
  filterImg: { width: "100%", height: "100%" },
  filterName: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 5,
    textAlign: "center",
  },
  activeFilterName: { color: "#10b981", fontWeight: "bold" },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    marginTop: 10,
  },
  confirmTitle: { fontSize: 16, fontWeight: "bold", color: "white" },
  cancelAction: { padding: 10 },
  confirmAction: { padding: 10 },
});

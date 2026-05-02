import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import {
  Pen,
  Square,
  Sparkles,
  Languages,
  Type,
  X,
  Check,
  RotateCcw,
  RotateCw,
} from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { styles } from "../styles/editor.styles";

const ERASE_TOOLS = [
  { id: "Pena", label: "Pena", icon: Pen },
  { id: "Persegi", label: "Persegi", icon: Square },
  { id: "Ajaib", label: "Ajaib", icon: Sparkles },
  { id: "Tulisan Tangan", label: "Tulisan Tangan", icon: Languages },
  { id: "Hapus Teks", label: "Hapus Teks", icon: Type },
];

interface SmartEraseInterfaceProps {
  activeMode: string;
  onSelectMode: (mode: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const SmartEraseInterface: React.FC<SmartEraseInterfaceProps> = ({
  activeMode,
  onSelectMode,
  onCancel,
  onConfirm,
}) => {
  return (
    <View style={styles.eraseInterface}>
      <View style={styles.eraseHeader}>
        <TouchableOpacity style={styles.undoBtn}>
          <RotateCcw color="#666" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.undoBtn}>
          <RotateCw color="#666" size={20} />
        </TouchableOpacity>
        <View style={styles.pageIndicatorContainer}>
          <ThemedText style={styles.pageIndicatorText}>1/1</ThemedText>
        </View>
        <TouchableOpacity style={styles.compareBtnSmall}>
          <ThemedText style={styles.compareBtnTextSmall}>Bandingkan</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.toolsScrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eraseToolsScroll}
        >
          {ERASE_TOOLS.map((tool) => {
            const isActive = activeMode === tool.id;
            return (
              <TouchableOpacity
                key={tool.id}
                style={[
                  styles.eraseToolItem,
                  isActive && styles.activeEraseTool,
                ]}
                onPress={() => onSelectMode(tool.id)}
              >
                <View
                  style={[
                    styles.eraseIconContainer,
                    isActive && styles.activeEraseIconContainer,
                  ]}
                >
                  <tool.icon color={isActive ? "white" : "#9ca3af"} size={22} />
                </View>
                <ThemedText
                  style={[
                    styles.eraseToolLabel,
                    isActive && styles.activeEraseToolLabel,
                  ]}
                >
                  {tool.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.eraseFooter}>
        <TouchableOpacity style={styles.cancelAction} onPress={onCancel}>
          <X color="white" size={24} />
        </TouchableOpacity>
        <ThemedText style={styles.confirmTitle}>Hapus Cerdas</ThemedText>
        <TouchableOpacity style={styles.confirmAction} onPress={onConfirm}>
          <Check color="white" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

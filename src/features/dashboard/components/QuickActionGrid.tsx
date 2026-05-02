import React from "react";
import { View, TouchableOpacity } from "react-native";
import {
  Scan,
  FileDigit,
  Image as ImageIcon,
  FileUp,
  CreditCard,
  PenTool,
  QrCode,
  LayoutGrid,
} from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { styles } from "../styles/dashboard.styles";

interface QuickActionItem {
  id: string;
  label: string;
  icon: any;
  color: string;
  badge?: string;
}

export const QUICK_ACTIONS: QuickActionItem[] = [
  { id: "scan", label: "Scan", icon: Scan, color: "#10b981" },
  { id: "pdf", label: "Alat PDF", icon: FileDigit, color: "#ef4444" },
  {
    id: "import_img",
    label: "Impor Gambar",
    icon: ImageIcon,
    color: "#3b82f6",
  },
  { id: "import_file", label: "Impor File", icon: FileUp, color: "#6366f1" },
  { id: "id_card", label: "Kartu ID", icon: CreditCard, color: "#f59e0b" },
  {
    id: "sign",
    label: "Tanda tangani",
    icon: PenTool,
    color: "#ec4899",
  },
  { id: "qr", label: "Scan Kode QR", icon: QrCode, color: "#8b5cf6" },
  { id: "all", label: "Semua", icon: LayoutGrid, color: "#94a3b8" },
];

interface QuickActionGridProps {
  onAction: (id: string) => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({
  onAction,
}) => {
  return (
    <View style={styles.gridContainer}>
      {QUICK_ACTIONS.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.gridItem}
          onPress={() => onAction(item.id)}
        >
          <View style={styles.iconCircle}>
            <item.icon color={item.color} size={28} />
            {item.badge && (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
              </View>
            )}
          </View>
          <ThemedText style={styles.gridLabel}>{item.label}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

import React, { useEffect, useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { RefreshCw, X, Download } from "lucide-react-native";
import type { UpdateStatus } from "@/src/shared/hooks/useAppUpdate";

interface UpdateBannerProps {
  status: UpdateStatus;
  onConfirm: () => void;
  onDismiss: () => void;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({
  status,
  onConfirm,
  onDismiss,
}) => {
  const translateY = useRef(new Animated.Value(120)).current;
  const isVisible =
    status === "available" ||
    status === "downloading" ||
    status === "done" ||
    status === "error";

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isVisible ? 0 : 120,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [isVisible, translateY]);

  const config = {
    available: {
      icon: <Download color="#10b981" size={18} />,
      title: "Pembaruan Tersedia",
      subtitle: "Versi baru siap diunduh",
      btnLabel: "Perbarui Sekarang",
      btnColor: "#10b981",
      showDismiss: true,
    },
    downloading: {
      icon: <ActivityIndicator size="small" color="#f59e0b" />,
      title: "Mengunduh Pembaruan...",
      subtitle: "Mohon tunggu sebentar",
      btnLabel: "",
      btnColor: "#f59e0b",
      showDismiss: false,
    },
    done: {
      icon: <RefreshCw color="#10b981" size={18} />,
      title: "Pembaruan Selesai!",
      subtitle: "Aplikasi akan restart sekarang",
      btnLabel: "",
      btnColor: "#10b981",
      showDismiss: false,
    },
    error: {
      icon: <X color="#ef4444" size={18} />,
      title: "Pembaruan Gagal",
      subtitle: "Tidak dapat mengunduh pembaruan",
      btnLabel: "Coba Lagi",
      btnColor: "#ef4444",
      showDismiss: true,
    },
    idle: null,
    checking: null,
  };

  const c = config[status];
  if (!c) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={styles.banner}>
        {/* Glow strip di atas */}
        <View style={[styles.topStrip, { backgroundColor: c.btnColor }]} />

        <View style={styles.content}>
          <View style={styles.iconWrapper}>{c.icon}</View>

          <View style={styles.textBlock}>
            <ThemedText style={styles.title}>{c.title}</ThemedText>
            <ThemedText style={styles.subtitle}>{c.subtitle}</ThemedText>
          </View>

          <View style={styles.actions}>
            {c.btnLabel !== "" && (
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: c.btnColor }]}
                onPress={onConfirm}
              >
                <ThemedText style={styles.btnText}>{c.btnLabel}</ThemedText>
              </TouchableOpacity>
            )}
            {c.showDismiss && (
              <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
                <X color="#6b7280" size={16} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 20,
  },
  banner: {
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2a2a2e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  topStrip: {
    height: 3,
    width: "100%",
    opacity: 0.9,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#2a2a2e",
    justifyContent: "center",
    alignItems: "center",
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 11,
    color: "#6b7280",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  dismissBtn: {
    padding: 6,
  },
});

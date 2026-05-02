import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronRight,
  Cloud,
  CheckSquare,
  Coins,
  User,
  RefreshCcw,
  Scan,
  FileBox,
  PlusSquare,
  Settings,
  Printer,
  ThumbsUp,
  MessageCircle,
  Mail,
  Smartphone,
  Settings2,
  GraduationCap,
  MessageSquare,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/src/shared/contexts/ThemeContext";
import { AppColors } from "@/src/shared/constants/theme";
import { useRouter } from "expo-router";

const MENU_ITEMS = [
  { id: "akun", icon: User, label: "Akun" },
  {
    id: "edu",
    icon: GraduationCap,
    label: "Pendidikan",
    badge: "Premium Gratis",
  },
  { id: "sync", icon: RefreshCcw, label: "Sinkronisasi" },
  { id: "scan", icon: Scan, label: "Scan" },
  { id: "docs", icon: FileBox, label: "Manajemen Dokumen" },
  { id: "widget", icon: PlusSquare, label: "Tambahkan Widget" },
  {
    id: "settings",
    icon: Settings,
    label: "Pengaturan Lainnya",
    route: "/settings",
  },
];

const SECONDARY_MENU = [
  { id: "printer", icon: Printer, label: "Printer Saya" },
  { id: "recom", icon: ThumbsUp, label: "Rekomendasi" },
  { id: "help", icon: MessageSquare, label: "Bantuan" },
  { id: "feedback", icon: MessageCircle, label: "Kritik & Saran" },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { activeColorScheme } = useAppTheme();
  const isDark = activeColorScheme === "dark";

  const bgColor = isDark ? "#05070a" : AppColors.light.background;
  const cardBg = isDark ? "#111827" : AppColors.light.surface;
  const borderColor = isDark
    ? "rgba(255,255,255,0.03)"
    : AppColors.light.border;
  const textColor = isDark ? "#e2e8f0" : AppColors.light.textPrimary;
  const iconColor = isDark ? "#94a3b8" : AppColors.light.textSecondary;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <LinearGradient
          colors={["#facc15", "#eab308"]}
          style={styles.headerGradient}
        >
          <View style={{ paddingTop: insets.top }}>
            <View style={styles.topNav}>
              <View />
              <View style={styles.topNavRight}>
                <TouchableOpacity style={styles.navBtn}>
                  <Settings2 color="#1f2937" size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBtn}>
                  <MessageSquare color="#1f2937" size={24} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.loginBanner}>
              <ThemedText style={styles.loginTitle}>
                Masuk untuk mengakses lebih banyak fitur
              </ThemedText>
              <View style={styles.loginActions}>
                <TouchableOpacity style={styles.loginIconBtn}>
                  <View
                    style={[
                      styles.loginIconCircle,
                      { backgroundColor: "white" },
                    ]}
                  >
                    <Image
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
                      }}
                      style={styles.googleIcon}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginIconBtn}>
                  <View
                    style={[
                      styles.loginIconCircle,
                      { backgroundColor: "#111827" },
                    ]}
                  >
                    <Smartphone color="white" size={22} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginIconBtn}>
                  <View
                    style={[
                      styles.loginIconCircle,
                      { backgroundColor: "#3b82f6" },
                    ]}
                  >
                    <Mail color="white" size={22} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          {/* Premium Card */}
          <TouchableOpacity style={styles.premiumCard}>
            <LinearGradient
              colors={["#fffbeb", "#fef3c7"]}
              style={styles.premiumGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.premiumTextSection}>
                <ThemedText style={styles.premiumHeader}>
                  AiTyScanner Premium
                </ThemedText>
                <ThemedText style={styles.premiumSubheader}>
                  20+ hak istimewa premium terbuka
                </ThemedText>
              </View>
              <ChevronRight color="#92400e" size={20} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={[styles.statBox, { backgroundColor: cardBg, borderColor }]}
            >
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#3b82f6" },
                ]}
              >
                <Cloud color="white" size={22} />
              </View>
              <ThemedText style={styles.statLabel}>Cloud</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statBox, { backgroundColor: cardBg, borderColor }]}
            >
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#ef4444" },
                ]}
              >
                <CheckSquare color="white" size={22} />
              </View>
              <ThemedText style={styles.statLabel}>Tugas</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statBox,
                { flex: 1.2, backgroundColor: cardBg, borderColor },
              ]}
            >
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#f59e0b" },
                ]}
              >
                <Coins color="white" size={22} />
              </View>
              <View>
                <ThemedText style={styles.statLabel}>Saldo Poin-C</ThemedText>
                <ThemedText style={styles.statValue}>0 C-poin</ThemedText>
              </View>
            </TouchableOpacity>
          </View>

          {/* List Menu Section 1 */}
          <View
            style={[
              styles.listContainer,
              { backgroundColor: cardBg, borderColor },
            ]}
          >
            {MENU_ITEMS.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.listItem,
                  idx === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 },
                  { borderBottomColor: borderColor },
                ]}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route as any);
                  }
                }}
              >
                <View style={styles.listItemLeft}>
                  <item.icon color={iconColor} size={22} />
                  <ThemedText
                    style={[styles.listItemLabel, { color: textColor }]}
                  >
                    {item.label}
                  </ThemedText>
                </View>
                <View style={styles.listItemRight}>
                  {item.badge && (
                    <View style={styles.promoBadge}>
                      <ThemedText style={styles.promoBadgeText}>
                        {item.badge}
                      </ThemedText>
                    </View>
                  )}
                  <ChevronRight color="#334155" size={18} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* List Menu Section 2 */}
          <View
            style={[
              styles.listContainer,
              { marginTop: 15, backgroundColor: cardBg, borderColor },
            ]}
          >
            {SECONDARY_MENU.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.listItem,
                  idx === SECONDARY_MENU.length - 1 && { borderBottomWidth: 0 },
                  { borderBottomColor: borderColor },
                ]}
              >
                <View style={styles.listItemLeft}>
                  <item.icon color={iconColor} size={22} />
                  <ThemedText
                    style={[styles.listItemLabel, { color: textColor }]}
                  >
                    {item.label}
                  </ThemedText>
                </View>
                <ChevronRight color="#334155" size={18} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070a",
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 60,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topNavRight: {
    flexDirection: "row",
    gap: 15,
  },
  navBtn: {
    padding: 5,
  },
  loginBanner: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 30,
  },
  loginTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 26,
  },
  loginActions: {
    flexDirection: "row",
    gap: 20,
  },
  loginIconBtn: {
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 4,
    borderRadius: 30,
  },
  loginIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  googleIcon: {
    width: 28,
    height: 28,
  },
  mainContent: {
    marginTop: -40,
    paddingHorizontal: 16,
  },
  premiumCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  premiumGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  premiumTextSection: {
    flex: 1,
  },
  premiumHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 4,
  },
  premiumSubheader: {
    fontSize: 12,
    color: "#b45309",
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  statIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
  },
  statValue: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 2,
  },
  listContainer: {
    backgroundColor: "#111827",
    borderRadius: 16,
    marginTop: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  listItemLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#e2e8f0",
  },
  listItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  promoBadge: {
    backgroundColor: "rgba(255, 77, 79, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  promoBadgeText: {
    color: "#ff4d4f",
    fontSize: 10,
    fontWeight: "bold",
  },
});

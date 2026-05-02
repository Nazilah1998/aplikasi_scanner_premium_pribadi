import { View, TouchableOpacity, Image } from "react-native";
import { MoreVertical, Check } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { Document } from "@/src/shared/services/document-service";
import { useAppTheme } from "@/src/shared/contexts/ThemeContext";
import { AppColors } from "@/src/shared/constants/theme";
import { styles } from "../styles/dashboard.styles";

interface DocumentListItemProps {
  item: Document;
  onPress: () => void;
  onMore: () => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({
  item,
  onPress,
  onMore,
  isSelectionMode = false,
  isSelected = false,
  onSelect,
}) => {
  const { activeColorScheme } = useAppTheme();
  const isDark = activeColorScheme === "dark";
  const itemBg = isDark ? "#111827" : AppColors.light.surface;
  const textColor = isDark ? "#fff" : AppColors.light.textPrimary;
  const hintColor = isDark ? "#94a3b8" : AppColors.light.textHint;

  const handlePress = () => {
    if (isSelectionMode && onSelect) {
      onSelect();
    } else {
      onPress();
    }
  };

  return (
    <View style={styles.docItemWrapper}>
      <TouchableOpacity
        style={[
          styles.docListItem,
          { backgroundColor: itemBg },
          isSelected && styles.docListItemSelected,
        ]}
        onPress={handlePress}
        onLongPress={onSelect}
      >
        <View style={styles.docThumbnailSquare}>
          {item.pages.length > 0 ? (
            <Image
              source={{ uri: item.pages[0].imagePath }}
              style={styles.thumbnailImg}
            />
          ) : (
            <View style={styles.docIconPlaceholder}>
              <ThemedText style={styles.placeholderCharSmall}>
                {item.name[0]}
              </ThemedText>
            </View>
          )}
        </View>
        <View style={styles.docInfo}>
          <ThemedText
            style={[styles.docTitleList, { color: textColor }]}
            numberOfLines={1}
          >
            {item.name}
          </ThemedText>
          <View style={styles.docMetaRow}>
            <ThemedText style={[styles.docMetaText, { color: hintColor }]}>
              {new Date(item.updatedAt).toLocaleDateString()}
            </ThemedText>
            <View style={styles.metaDivider} />
            <ThemedText style={[styles.docMetaText, { color: hintColor }]}>
              {item.pages.length} Halaman
            </ThemedText>
          </View>
        </View>

        {isSelectionMode ? (
          <TouchableOpacity style={styles.checkboxContainer} onPress={onSelect}>
            {isSelected ? (
              <View style={styles.checkboxChecked}>
                <Check color="white" size={14} strokeWidth={3} />
              </View>
            ) : (
              <View style={styles.checkboxUnchecked} />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.selectionCircle} onPress={onMore}>
            <MoreVertical color="#94a3b8" size={20} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

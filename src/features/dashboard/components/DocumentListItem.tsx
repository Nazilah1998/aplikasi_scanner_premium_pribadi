import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { MoreVertical } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { Document } from "@/src/shared/services/document-service";
import { styles } from "../styles/dashboard.styles";

interface DocumentListItemProps {
  item: Document;
  onPress: () => void;
  onMore: () => void;
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({
  item,
  onPress,
  onMore,
}) => {
  return (
    <View style={styles.docItemWrapper}>
      <TouchableOpacity style={styles.docListItem} onPress={onPress}>
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
          <ThemedText style={styles.docTitleList} numberOfLines={1}>
            {item.name}
          </ThemedText>
          <View style={styles.docMetaRow}>
            <ThemedText style={styles.docMetaText}>
              {new Date(item.updatedAt).toLocaleDateString()}
            </ThemedText>
            <View style={styles.metaDivider} />
            <ThemedText style={styles.docMetaText}>
              {item.pages.length} Halaman
            </ThemedText>
          </View>
        </View>
        <TouchableOpacity style={styles.selectionCircle} onPress={onMore}>
          <MoreVertical color="#94a3b8" size={20} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

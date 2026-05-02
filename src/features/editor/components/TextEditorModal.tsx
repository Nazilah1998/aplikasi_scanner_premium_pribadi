import React from "react";
import {
  Modal,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { X, Check, FileText } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { AppColors } from "@/src/shared/constants/theme";
import { styles } from "../styles/editor.styles";

interface TextEditorModalProps {
  visible: boolean;
  extractedText: string;
  setExtractedText: (text: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export const TextEditorModal: React.FC<TextEditorModalProps> = ({
  visible,
  extractedText,
  setExtractedText,
  onClose,
  onSave,
}) => {
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.editorModal}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <X color="white" size={24} />
          </TouchableOpacity>
          <ThemedText style={styles.modalTitle}>Hasil OCR</ThemedText>
          <TouchableOpacity onPress={onSave}>
            <Check color={AppColors.primary} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.editorContent}>
          <TextInput
            multiline
            style={styles.textInput}
            value={extractedText}
            onChangeText={setExtractedText}
            placeholder="Teks tidak ditemukan..."
            placeholderTextColor="#666"
          />
        </View>
        <TouchableOpacity
          style={styles.copyBtn}
          onPress={() => Alert.alert("Disalin", "Teks disalin ke clipboard.")}
        >
          <FileText color="white" size={20} />
          <ThemedText style={styles.copyBtnText}>Salin Semua Teks</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

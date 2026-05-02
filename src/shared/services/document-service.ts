import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";

export interface DocumentPage {
  id: string;
  imagePath: string;
  filter: "none" | "grayscale" | "bw" | "magic";
  brightness: number;
  contrast: number;
}

export interface Document {
  id: string;
  name: string;
  pages: DocumentPage[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "@doc_scanner_metadata";

class DocumentService {
  async requestPermissions() {
    try {
      // Robust permission check
      const { status: existingStatus } =
        await MediaLibrary.getPermissionsAsync();
      if (existingStatus === "granted") return true;

      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === "granted";
    } catch (e) {
      console.warn("MediaLibrary permission request failed, skipping...", e);
      // Return true as fallback so the app doesn't block internal saving
      return true;
    }
  }

  async getAllDocuments(): Promise<Document[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Error loading documents:", e);
      return [];
    }
  }

  async saveDocument(doc: Document): Promise<void> {
    try {
      const docs = await this.getAllDocuments();
      const index = docs.findIndex((d) => d.id === doc.id);

      if (index >= 0) {
        docs[index] = doc;
      } else {
        docs.push(doc);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch (e) {
      console.error("Error saving document:", e);
      throw e;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      const docs = await this.getAllDocuments();
      const filtered = docs.filter((d) => d.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error("Error deleting document:", e);
      throw e;
    }
  }
}

export const documentService = new DocumentService();

import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { ColorMatrix } from "react-native-color-matrix-image-filters";
import { getFilterMatrix } from "../utils/filterMatrix";

interface FilteredImageProps {
  uri: string | null;
  filterId: string;
  intensity?: number;
  style?: any;
  contentFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export const FilteredImage: React.FC<FilteredImageProps> = ({
  uri,
  filterId,
  intensity = 100,
  style,
  contentFit = "contain",
}) => {
  if (!uri) return <View style={[styles.placeholder, style]} />;

  // Map expo-image contentFit to React Native resizeMode
  const resizeMode =
    contentFit === "fill"
      ? "stretch"
      : contentFit === "none"
        ? "center"
        : contentFit;

  const matrix = getFilterMatrix(filterId, intensity);
  const isOriginal =
    filterId === "Original" || filterId === "Tidak Ada" || !filterId;

  const imageComponent = (
    <Image
      source={{ uri }}
      style={[styles.image, style]}
      resizeMode={resizeMode as any}
    />
  );

  if (isOriginal) {
    return <View style={[styles.container, style]}>{imageComponent}</View>;
  }

  return (
    <View style={[styles.container, style]}>
      <ColorMatrix matrix={matrix as any}>{imageComponent}</ColorMatrix>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
});

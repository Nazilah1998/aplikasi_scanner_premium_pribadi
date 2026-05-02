import React from "react";
import { View, StyleSheet, Animated } from "react-native";

interface CropOverlayProps {
  panHandlers: any;
  cropPos: Animated.ValueXY;
  cropSize: Animated.ValueXY;
}

export const CropOverlay: React.FC<CropOverlayProps> = ({
  panHandlers,
  cropPos,
  cropSize,
}) => {
  return (
    <Animated.View
      {...panHandlers}
      style={[
        styles.cropOverlay,
        {
          transform: cropPos.getTranslateTransform(),
          width: cropSize.x,
          height: cropSize.y,
        },
      ]}
    >
      <View style={styles.cropCornerTL} />
      <View style={styles.cropCornerTR} />
      <View style={styles.cropCornerBL} />
      <View style={styles.cropCornerBR} />
      <View style={styles.cropGridH} />
      <View style={styles.cropGridV} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cropOverlay: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  cropCornerTL: {
    position: "absolute",
    top: -5,
    left: -5,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "white",
    borderRadius: 2,
  },
  cropCornerTR: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "white",
    borderRadius: 2,
  },
  cropCornerBL: {
    position: "absolute",
    bottom: -5,
    left: -5,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "white",
    borderRadius: 2,
  },
  cropCornerBR: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "white",
    borderRadius: 2,
  },
  cropGridH: {
    position: "absolute",
    top: "33%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  cropGridV: {
    position: "absolute",
    left: "33%",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
});

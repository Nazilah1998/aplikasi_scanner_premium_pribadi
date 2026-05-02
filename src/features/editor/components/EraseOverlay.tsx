import React, { useRef } from "react";
import { View, StyleSheet, Animated, PanResponder } from "react-native";

interface EraseOverlayProps {
  mode: string;
}

export const EraseOverlay: React.FC<EraseOverlayProps> = ({ mode }) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
    }),
  ).current;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.cursor,
          mode === "Persegi" ? styles.squareCursor : styles.penCursor,
          {
            transform: pan.getTranslateTransform(),
          },
        ]}
      />
      <View style={styles.hintContainer}>
        <View style={styles.hintContent}>
          <View style={styles.hintDot} />
          <View style={styles.hintTextLine} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cursor: {
    position: "absolute",
    top: "40%",
    left: "40%",
    borderWidth: 2,
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    zIndex: 100,
  },
  penCursor: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: -30,
    marginLeft: -30,
  },
  squareCursor: {
    width: 100,
    height: 80,
    marginTop: -40,
    marginLeft: -50,
  },
  hintContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hintContent: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 10,
  },
  hintDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981" },
  hintTextLine: {
    width: 120,
    height: 4,
    backgroundColor: "#444",
    borderRadius: 2,
  },
});

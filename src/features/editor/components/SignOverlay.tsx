import React, { useRef } from "react";
import { View, StyleSheet, Animated, PanResponder } from "react-native";
import { PenTool } from "lucide-react-native";

export const SignOverlay: React.FC = () => {
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
          styles.signBox,
          {
            transform: pan.getTranslateTransform(),
          },
        ]}
      >
        <PenTool color="#10b981" size={32} />
        <View style={styles.signLine} />
      </Animated.View>
      <View style={styles.hintContainer}>
        <View style={styles.hintContent}>
          <PenTool color="#10b981" size={14} />
          <View style={styles.hintTextLine} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signBox: {
    position: "absolute",
    top: "50%",
    left: "30%",
    width: 150,
    height: 80,
    borderWidth: 1,
    borderColor: "#10b981",
    borderStyle: "dashed",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  signLine: {
    width: "80%",
    height: 2,
    backgroundColor: "#10b981",
    marginTop: 10,
    opacity: 0.5,
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
  hintTextLine: {
    width: 100,
    height: 4,
    backgroundColor: "#444",
    borderRadius: 2,
  },
});

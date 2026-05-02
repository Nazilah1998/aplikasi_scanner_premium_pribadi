import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Image as RNImage,
} from "react-native";
import Svg, { Polygon } from "react-native-svg";

interface CropOverlayProps {
  imageUri?: string | null;
  onPointsChange?: (points: any) => void;
}

export interface CropOverlayRef {
  setRatio: (ratio: string) => void;
  setAll: () => void;
  getNormalizedPoints: () => any;
}

const HANDLE_SIZE = 30;

export const CropOverlay = forwardRef<CropOverlayRef, CropOverlayProps>(
  ({ imageUri, onPointsChange }, ref) => {
    const [containerSize, setContainerSize] = useState({ w: 300, h: 400 });
    const [isDragging, setIsDragging] = useState(false);
    const [activePoint, setActivePoint] = useState<{
      x: number;
      y: number;
    } | null>(null);

    const polygonRef = useRef<any>(null);

    // 4 corners Animated Values
    const tl = useRef(new Animated.ValueXY({ x: 40, y: 40 })).current;
    const tr = useRef(new Animated.ValueXY({ x: 260, y: 40 })).current;
    const bl = useRef(new Animated.ValueXY({ x: 40, y: 360 })).current;
    const br = useRef(new Animated.ValueXY({ x: 260, y: 360 })).current;

    // Track values synchronously for Loupe and Polygon
    const tlVal = useRef({ x: 40, y: 40 });
    const trVal = useRef({ x: 260, y: 40 });
    const blVal = useRef({ x: 40, y: 360 });
    const brVal = useRef({ x: 260, y: 360 });

    useImperativeHandle(ref, () => ({
      setRatio: (ratio: string) => {
        const cx = containerSize.w / 2;
        const cy = containerSize.h / 2;
        let rw = containerSize.w * 0.8;
        let rh = containerSize.h * 0.8;

        if (ratio === "Bebas") {
          rw = containerSize.w * 0.8;
          rh = containerSize.h * 0.8;
        } else if (ratio === "A4") {
          const targetRatio = 1 / 1.4142; // A4 standard
          if (rw / rh > targetRatio) rw = rh * targetRatio;
          else rh = rw / targetRatio;
        } else if (ratio.includes(":")) {
          const parts = ratio.split(":");
          const num = parseFloat(parts[0]);
          const den = parseFloat(parts[1]);
          if (!isNaN(num) && !isNaN(den) && den !== 0) {
            const targetRatio = num / den;
            if (rw / rh > targetRatio) rw = rh * targetRatio;
            else rh = rw / targetRatio;
          }
        }

        tl.setValue({ x: cx - rw / 2, y: cy - rh / 2 });
        tr.setValue({ x: cx + rw / 2, y: cy - rh / 2 });
        bl.setValue({ x: cx - rw / 2, y: cy + rh / 2 });
        br.setValue({ x: cx + rw / 2, y: cy + rh / 2 });
      },
      setAll: () => {
        tl.setValue({ x: 0, y: 0 });
        tr.setValue({ x: containerSize.w, y: 0 });
        bl.setValue({ x: 0, y: containerSize.h });
        br.setValue({ x: containerSize.w, y: containerSize.h });
      },
      getNormalizedPoints: () => ({
        tl: {
          x: tlVal.current.x / containerSize.w,
          y: tlVal.current.y / containerSize.h,
        },
        tr: {
          x: trVal.current.x / containerSize.w,
          y: trVal.current.y / containerSize.h,
        },
        bl: {
          x: blVal.current.x / containerSize.w,
          y: blVal.current.y / containerSize.h,
        },
        br: {
          x: brVal.current.x / containerSize.w,
          y: brVal.current.y / containerSize.h,
        },
      }),
    }));

    const updatePolygon = () => {
      if (polygonRef.current) {
        polygonRef.current.setNativeProps({
          points: `${tlVal.current.x},${tlVal.current.y} ${trVal.current.x},${trVal.current.y} ${brVal.current.x},${brVal.current.y} ${blVal.current.x},${blVal.current.y}`,
        });
      }
    };

    useEffect(() => {
      tl.addListener((val) => {
        tlVal.current = val;
        updatePolygon();
      });
      tr.addListener((val) => {
        trVal.current = val;
        updatePolygon();
      });
      bl.addListener((val) => {
        blVal.current = val;
        updatePolygon();
      });
      br.addListener((val) => {
        brVal.current = val;
        updatePolygon();
      });
      return () => {
        tl.removeAllListeners();
        tr.removeAllListeners();
        bl.removeAllListeners();
        br.removeAllListeners();
      };
    }, [tl, tr, bl, br]);

    // Update sizes when layout changes
    const onLayout = (e: any) => {
      const { width, height } = e.nativeEvent.layout;
      setContainerSize({ w: width, h: height });
      // Reset points to corners
      tl.setValue({ x: width * 0.1, y: height * 0.1 });
      tr.setValue({ x: width * 0.9, y: height * 0.1 });
      bl.setValue({ x: width * 0.1, y: height * 0.9 });
      br.setValue({ x: width * 0.9, y: height * 0.9 });
    };

    const createPanResponder = (
      pointInfo: string,
      animValue: Animated.ValueXY,
      valRef: any,
    ) => {
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setIsDragging(true);
          setActivePoint(valRef.current);
          animValue.setOffset({ x: valRef.current.x, y: valRef.current.y });
          animValue.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (e, gestureState) => {
          let newX = gestureState.dx;
          let newY = gestureState.dy;
          animValue.setValue({ x: newX, y: newY });
          setActivePoint({
            x: valRef.current.x + newX,
            y: valRef.current.y + newY,
          });
        },
        onPanResponderRelease: () => {
          animValue.flattenOffset();
          setIsDragging(false);
          setActivePoint(null);
          if (onPointsChange) {
            onPointsChange({
              tl: tlVal.current,
              tr: trVal.current,
              bl: blVal.current,
              br: brVal.current,
            });
          }
        },
      });
    };

    const panTL = useRef(createPanResponder("TL", tl, tlVal)).current;
    const panTR = useRef(createPanResponder("TR", tr, trVal)).current;
    const panBL = useRef(createPanResponder("BL", bl, blVal)).current;
    const panBR = useRef(createPanResponder("BR", br, brVal)).current;

    return (
      <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
        <Svg style={StyleSheet.absoluteFill}>
          {/* The green bounding polygon */}
          <Polygon
            ref={polygonRef}
            points={`${tlVal.current.x},${tlVal.current.y} ${trVal.current.x},${trVal.current.y} ${brVal.current.x},${brVal.current.y} ${blVal.current.x},${blVal.current.y}`}
            fill="rgba(16, 185, 129, 0.1)"
            stroke="#10b981"
            strokeWidth="3"
          />
        </Svg>

        {/* 4 Draggable Corners */}
        <Animated.View
          {...panTL.panHandlers}
          style={[
            styles.cornerHandle,
            { transform: tl.getTranslateTransform() },
          ]}
        >
          <View style={styles.handleDot} />
        </Animated.View>
        <Animated.View
          {...panTR.panHandlers}
          style={[
            styles.cornerHandle,
            { transform: tr.getTranslateTransform() },
          ]}
        >
          <View style={styles.handleDot} />
        </Animated.View>
        <Animated.View
          {...panBL.panHandlers}
          style={[
            styles.cornerHandle,
            { transform: bl.getTranslateTransform() },
          ]}
        >
          <View style={styles.handleDot} />
        </Animated.View>
        <Animated.View
          {...panBR.panHandlers}
          style={[
            styles.cornerHandle,
            { transform: br.getTranslateTransform() },
          ]}
        >
          <View style={styles.handleDot} />
        </Animated.View>

        {/* Loupe (Magnifier) */}
        {isDragging &&
          activePoint &&
          imageUri &&
          (() => {
            let loupeLeft = activePoint.x - 50;
            let loupeTop = activePoint.y - 120; // Default di atas jari

            // Hindari memotong batas kiri dan kanan
            if (loupeLeft < 10) loupeLeft = 10;
            else if (loupeLeft > containerSize.w - 110)
              loupeLeft = containerSize.w - 110;

            // Jika terlalu dekat dengan batas atas, pindahkan kaca pembesar ke bawah jari
            if (loupeTop < 10) {
              loupeTop = activePoint.y + 40;
            }

            // Pastikan tidak tembus batas bawah juga
            if (loupeTop > containerSize.h - 110) {
              loupeTop = containerSize.h - 110;
            }

            return (
              <View
                style={[
                  styles.loupeContainer,
                  {
                    left: loupeLeft,
                    top: loupeTop,
                  },
                ]}
              >
                <RNImage
                  source={{ uri: imageUri }}
                  style={[
                    styles.loupeImage,
                    {
                      position: "absolute",
                      width: containerSize.w * 2, // 2x magnification
                      height: containerSize.h * 2,
                      left: -(activePoint.x * 2) + 50,
                      top: -(activePoint.y * 2) + 50,
                    },
                  ]}
                  resizeMode="contain"
                />
                <View style={styles.loupeCrosshair} />
                <View style={styles.loupeCrosshairH} />
              </View>
            );
          })()}
      </View>
    );
  },
);

CropOverlay.displayName = "CropOverlay";

const styles = StyleSheet.create({
  cornerHandle: {
    position: "absolute",
    left: -HANDLE_SIZE / 2,
    top: -HANDLE_SIZE / 2,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  handleDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#10b981",
  },
  loupeContainer: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#10b981",
    backgroundColor: "white",
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 1000,
  },
  loupeImage: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  loupeCrosshair: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#10b981",
  },
  loupeCrosshairH: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#10b981",
  },
});

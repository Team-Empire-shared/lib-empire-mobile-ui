import { useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  type ViewStyle,
} from "react-native";

export interface ImageGalleryProps {
  /** Array of image URIs */
  images: string[];
  /** Gallery height in px (default 220) */
  height?: number;
  /** Called when an image is tapped (index) */
  onImagePress?: (index: number) => void;
  /** Show pagination dots (default true) */
  showDots?: boolean;
  /** Active dot color (default #2563eb) */
  activeDotColor?: string;
  /** Container style */
  style?: ViewStyle;
}

/**
 * Swipeable image gallery with pagination dots and full-screen preview.
 *
 * ```tsx
 * <ImageGallery images={["https://...jpg", "https://...png"]} />
 * ```
 */
export function ImageGallery({
  images,
  height = 220,
  onImagePress,
  showDots = true,
  activeDotColor = "#2563eb",
  style,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null);
  const screenWidth = Dimensions.get("window").width;
  const flatRef = useRef<FlatList>(null);

  const handleScroll = useCallback(
    (e: any) => {
      const offset = e.nativeEvent.contentOffset.x;
      const idx = Math.round(offset / screenWidth);
      setActiveIndex(idx);
    },
    [screenWidth],
  );

  const handlePress = useCallback(
    (idx: number) => {
      if (onImagePress) {
        onImagePress(idx);
      } else {
        setFullscreenIdx(idx);
      }
    },
    [onImagePress],
  );

  return (
    <View style={style}>
      <FlatList
        ref={flatRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handlePress(index)}
          >
            <Image
              source={{ uri: item }}
              style={{ width: screenWidth, height, backgroundColor: "#f3f4f6" }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />

      {/* Pagination dots */}
      {showDots && images.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            gap: 6,
          }}
        >
          {images.map((_, idx) => (
            <View
              key={idx}
              style={{
                width: idx === activeIndex ? 18 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: idx === activeIndex ? activeDotColor : "#d1d5db",
              }}
            />
          ))}
        </View>
      )}

      {/* Full-screen modal */}
      {fullscreenIdx !== null && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setFullscreenIdx(null)}>
          <View style={{ flex: 1, backgroundColor: "#000" }}>
            <TouchableOpacity
              onPress={() => setFullscreenIdx(null)}
              style={{
                position: "absolute",
                top: 52,
                right: 20,
                zIndex: 10,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>{"\u2715"}</Text>
            </TouchableOpacity>
            <ScrollView
              maximumZoomScale={4}
              minimumZoomScale={1}
              contentContainerStyle={{ flex: 1, justifyContent: "center" }}
              bouncesZoom
            >
              <Image
                source={{ uri: images[fullscreenIdx]! }}
                style={{
                  width: screenWidth,
                  height: Dimensions.get("window").height * 0.8,
                }}
                resizeMode="contain"
              />
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
}

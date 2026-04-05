import { useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  type ViewStyle,
} from "react-native";

export interface FileViewerProps {
  /** File URI (remote or local) */
  uri: string;
  /** File type */
  type: "image" | "pdf";
  /** Visibility control */
  visible: boolean;
  /** Close handler */
  onClose: () => void;
  /** Container style */
  style?: ViewStyle;
}

/**
 * Full-screen file viewer for images (with pinch-to-zoom via ScrollView)
 * and PDFs (via WebView when available).
 *
 * ```tsx
 * <FileViewer uri={docUrl} type="pdf" visible={showViewer} onClose={() => setShowViewer(false)} />
 * ```
 */
export function FileViewer({
  uri,
  type,
  visible,
  onClose,
  style,
}: FileViewerProps) {
  const [imageDims, setImageDims] = useState({ width: 0, height: 0 });
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const handleImageLoad = () => {
    Image.getSize(
      uri,
      (w, h) => setImageDims({ width: w, height: h }),
      () => setImageDims({ width: screenWidth, height: screenHeight * 0.7 }),
    );
  };

  const aspectHeight = imageDims.width > 0
    ? (screenWidth / imageDims.width) * imageDims.height
    : screenHeight * 0.7;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[{ flex: 1, backgroundColor: "#000" }, style]}>
        {/* Close button */}
        <TouchableOpacity
          onPress={onClose}
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

        {type === "image" ? (
          <ScrollView
            maximumZoomScale={5}
            minimumZoomScale={1}
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            bouncesZoom
          >
            <Image
              source={{ uri }}
              style={{
                width: screenWidth,
                height: Math.min(aspectHeight, screenHeight * 0.9),
              }}
              resizeMode="contain"
              onLoad={handleImageLoad}
            />
          </ScrollView>
        ) : (
          // PDF: try WebView, show fallback if not available
          <PdfContent uri={uri} />
        )}
      </View>
    </Modal>
  );
}

/** PDF renderer — attempts react-native-webview, shows message if unavailable */
function PdfContent({ uri }: { uri: string }) {
  try {
    const { WebView } = require("react-native-webview");
    const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(uri)}`;
    return (
      <WebView
        source={{ uri: googleViewerUrl }}
        style={{ flex: 1, marginTop: 48 }}
        startInLoadingState
      />
    );
  } catch {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center", marginBottom: 8 }}>
          PDF Viewer
        </Text>
        <Text style={{ color: "#9ca3af", fontSize: 14, textAlign: "center" }}>
          Install react-native-webview to enable in-app PDF viewing.
        </Text>
      </View>
    );
  }
}

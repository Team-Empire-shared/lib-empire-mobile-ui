import { useNetInfo } from "@react-native-community/netinfo";
import { View, Text } from "react-native";

export interface OfflineBannerProps {
  backgroundColor?: string;
  textColor?: string;
  message?: string;
}

export function OfflineBanner({
  backgroundColor = "#374151",
  textColor = "#fff",
  message = "No internet connection",
}: OfflineBannerProps = {}) {
  const { isConnected } = useNetInfo();
  if (isConnected !== false) return null;

  return (
    <View
      style={{
        backgroundColor,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: "center",
      }}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={{ color: textColor, fontSize: 12, fontWeight: "600" }}>
        {message}
      </Text>
    </View>
  );
}

import { useState } from "react";
import { View, Text } from "react-native";

export interface CompanyLogoProps {
  /** Company name — used for initials fallback */
  name?: string;
  /** Company domain (e.g. "google.com") — used for Clearbit logo fetch */
  domain?: string;
  /** Direct logo URL — takes priority over domain */
  uri?: string | null;
  /** Size in pixels (default 36) */
  size?: number;
  /** Background color for initials fallback */
  backgroundColor?: string;
}

/**
 * Company logo with smart fallback:
 * 1. Direct `uri` if provided
 * 2. Clearbit logo from `domain` (free, no API key)
 * 3. Initials circle from `name`
 */
export function CompanyLogo({
  name = "",
  domain,
  uri,
  size = 36,
  backgroundColor = "#f3f4f6",
}: CompanyLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const borderRadius = size / 2;
  const fontSize = Math.round(size * 0.35);

  const logoUrl = uri ?? (domain ? `https://logo.clearbit.com/${domain}` : null);

  if (logoUrl && !imgFailed) {
    try {
      const { Image } = require("expo-image");
      return (
        <Image
          source={{ uri: logoUrl }}
          style={{ width: size, height: size, borderRadius }}
          contentFit="contain"
          transition={200}
          onError={() => setImgFailed(true)}
        />
      );
    } catch {
      const { Image } = require("react-native");
      return (
        <Image
          source={{ uri: logoUrl }}
          style={{ width: size, height: size, borderRadius }}
          onError={() => setImgFailed(true)}
        />
      );
    }
  }

  // Initials fallback
  const initials = name
    .split(/[\s&]+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius,
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize, fontWeight: "700", color: "#6b7280" }}>
        {initials || "?"}
      </Text>
    </View>
  );
}

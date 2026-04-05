import { View, Text, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { recruitmentMarketingLinkOnDark } from "../lib/theme";

export interface RecruitmentMarketingHeaderProps {
  /** Shown under the brand row (e.g. “Employer App”, “Staff access only”). */
  subtitle?: string;
  style?: ViewStyle;
}

/**
 * True-black top band + “EmpireO” / bright-blue “Recruitment” — matches `recruitment-web` marketing heroes.
 */
export function RecruitmentMarketingHeader({ subtitle, style }: RecruitmentMarketingHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          backgroundColor: "#000000",
          paddingTop: insets.top + 20,
          paddingBottom: 24,
          paddingHorizontal: 24,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.1)",
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 24, fontWeight: "700", letterSpacing: -0.3 }}>
        <Text style={{ color: "#ffffff" }}>EmpireO </Text>
        <Text style={{ color: recruitmentMarketingLinkOnDark }}>Recruitment</Text>
      </Text>
      {subtitle ? (
        <Text
          style={{
            marginTop: 6,
            fontSize: 14,
            fontWeight: "500",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  type ViewStyle,
} from "react-native";

export interface ConfirmationDialogProps {
  /** Dialog visibility */
  visible: boolean;
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string;
  /** Confirm handler */
  onConfirm: () => void;
  /** Cancel handler */
  onCancel: () => void;
  /** Confirm button label (default "Confirm") */
  confirmLabel?: string;
  /** Cancel button label (default "Cancel") */
  cancelLabel?: string;
  /** Destructive variant — red confirm button */
  destructive?: boolean;
  /** Loading state on confirm button */
  loading?: boolean;
  /** Dark mode */
  dark?: boolean;
  /** Container style */
  style?: ViewStyle;
}

/**
 * Reusable confirmation modal with confirm/cancel actions.
 * Supports destructive variant and loading state.
 *
 * ```tsx
 * <ConfirmationDialog
 *   visible={showConfirm}
 *   title="Delete contact?"
 *   message="This action cannot be undone."
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowConfirm(false)}
 *   destructive
 *   loading={deleting}
 * />
 * ```
 */
export function ConfirmationDialog({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  dark = false,
  style,
}: ConfirmationDialogProps) {
  const bg = dark ? "#1f2937" : "#fff";
  const textColor = dark ? "#f9fafb" : "#111827";
  const mutedColor = dark ? "#9ca3af" : "#6b7280";
  const confirmBg = destructive ? "#dc2626" : "#2563eb";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 32,
        }}
      >
        <View
          style={[
            {
              backgroundColor: bg,
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 340,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            },
            style,
          ]}
        >
          <Text style={{ fontSize: 17, fontWeight: "700", color: textColor, marginBottom: 8 }}>
            {title}
          </Text>
          <Text style={{ fontSize: 14, color: mutedColor, lineHeight: 21, marginBottom: 24 }}>
            {message}
          </Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            {/* Cancel */}
            <TouchableOpacity
              onPress={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: dark ? "#374151" : "#f3f4f6",
                alignItems: "center",
                opacity: loading ? 0.5 : 1,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: textColor }}>
                {cancelLabel}
              </Text>
            </TouchableOpacity>

            {/* Confirm */}
            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: confirmBg,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 6,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading && <ActivityIndicator color="#fff" size="small" />}
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

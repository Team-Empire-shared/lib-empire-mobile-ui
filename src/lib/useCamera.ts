import { useCallback } from "react";
import { usePermission } from "./permissions";

/**
 * Hook that combines camera permission handling with ImagePicker.launchCameraAsync.
 *
 * Usage:
 * ```tsx
 * const { takePhoto, hasPermission } = useCamera();
 *
 * const onPress = async () => {
 *   const result = await takePhoto();
 *   if (result && !result.canceled) {
 *     setImage(result.assets[0].uri);
 *   }
 * };
 * ```
 *
 * Requires `expo-image-picker` (and optionally `expo-camera` for permission)
 * as peer dependencies in the consuming app.
 */

export interface UseCameraResult {
  /** Launch the camera. Handles permission automatically. Returns null if denied or module missing. */
  takePhoto: (
    options?: Record<string, unknown>,
  ) => Promise<import("expo-image-picker").ImagePickerResult | null>;
  /** Whether camera permission is currently granted. */
  hasPermission: boolean;
}

export function useCamera(): UseCameraResult {
  const { status, request } = usePermission("camera");

  const takePhoto = useCallback(
    async (
      options?: Record<string, unknown>,
    ): Promise<import("expo-image-picker").ImagePickerResult | null> => {
      // Ensure permission
      if (!status?.granted) {
        await request();
        // Re-check — request() updates status but we need the fresh value
        // Since state update is async, we do a direct check here
        const { requestPermission: reqPerm } = await import("./permissions");
        const freshStatus = await reqPerm("camera");
        if (!freshStatus.granted) return null;
      }

      // Launch camera via ImagePicker
      let ImagePicker: typeof import("expo-image-picker") | null = null;
      try {
        ImagePicker = await import("expo-image-picker");
      } catch {
        console.warn(
          "[@empireoe/mobile-ui] expo-image-picker is not installed. useCamera will not work.",
        );
        return null;
      }

      return ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
        ...options,
      });
    },
    [status, request],
  );

  return {
    takePhoto,
    hasPermission: status?.granted ?? false,
  };
}

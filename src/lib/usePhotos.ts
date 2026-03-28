import { useCallback } from "react";
import { usePermission } from "./permissions";

/**
 * Hook that combines photo library permission handling with
 * ImagePicker.launchImageLibraryAsync.
 *
 * Usage:
 * ```tsx
 * const { pickImage, hasPermission } = usePhotos();
 *
 * const onPress = async () => {
 *   const result = await pickImage();
 *   if (result && !result.canceled) {
 *     setImage(result.assets[0].uri);
 *   }
 * };
 * ```
 *
 * Requires `expo-image-picker` as a peer dependency in the consuming app.
 */

export interface UsePhotosResult {
  /** Open the photo library picker. Handles permission automatically. Returns null if denied or module missing. */
  pickImage: (
    options?: Record<string, unknown>,
  ) => Promise<import("expo-image-picker").ImagePickerResult | null>;
  /** Whether photo library permission is currently granted. */
  hasPermission: boolean;
}

export function usePhotos(): UsePhotosResult {
  const { status, request } = usePermission("photos");

  const pickImage = useCallback(
    async (
      options?: Record<string, unknown>,
    ): Promise<import("expo-image-picker").ImagePickerResult | null> => {
      // Ensure permission
      if (!status?.granted) {
        await request();
        const { requestPermission: reqPerm } = await import("./permissions");
        const freshStatus = await reqPerm("photos");
        if (!freshStatus.granted) return null;
      }

      // Launch image library via ImagePicker
      let ImagePicker: typeof import("expo-image-picker") | null = null;
      try {
        ImagePicker = await import("expo-image-picker");
      } catch {
        console.warn(
          "[@empireoe/mobile-ui] expo-image-picker is not installed. usePhotos will not work.",
        );
        return null;
      }

      return ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
        ...options,
      });
    },
    [status, request],
  );

  return {
    pickImage,
    hasPermission: status?.granted ?? false,
  };
}

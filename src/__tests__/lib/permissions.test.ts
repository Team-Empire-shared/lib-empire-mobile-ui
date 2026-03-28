import { requestPermission, checkPermission } from "../../lib/permissions";

describe("requestPermission", () => {
  it("requests camera permission via expo-camera", async () => {
    const Camera = require("expo-camera");
    Camera.requestCameraPermissionsAsync.mockResolvedValueOnce({
      granted: true,
      canAskAgain: true,
    });

    const result = await requestPermission("camera");
    expect(result.granted).toBe(true);
    expect(result.canAskAgain).toBe(true);
    expect(Camera.requestCameraPermissionsAsync).toHaveBeenCalled();
  });

  it("requests photos permission via expo-image-picker", async () => {
    const ImagePicker = require("expo-image-picker");
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
      granted: true,
      canAskAgain: true,
    });

    const result = await requestPermission("photos");
    expect(result.granted).toBe(true);
  });

  it("requests location permission via expo-location", async () => {
    const Location = require("expo-location");
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      granted: false,
      canAskAgain: false,
    });

    const result = await requestPermission("location");
    expect(result.granted).toBe(false);
    expect(result.canAskAgain).toBe(false);
  });

  it("requests notifications permission via expo-notifications", async () => {
    const Notifications = require("expo-notifications");
    Notifications.getPermissionsAsync.mockResolvedValueOnce({
      status: "undetermined",
      canAskAgain: true,
    });
    Notifications.requestPermissionsAsync.mockResolvedValueOnce({
      status: "granted",
      canAskAgain: true,
    });

    const result = await requestPermission("notifications");
    expect(result.granted).toBe(true);
  });

  it("returns already granted for notifications without re-prompting", async () => {
    const Notifications = require("expo-notifications");
    Notifications.getPermissionsAsync.mockResolvedValueOnce({
      status: "granted",
      canAskAgain: true,
    });

    const result = await requestPermission("notifications");
    expect(result.granted).toBe(true);
    // Should NOT call requestPermissionsAsync since already granted
    expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });
});

describe("checkPermission", () => {
  it("checks camera permission without prompting", async () => {
    const Camera = require("expo-camera");
    Camera.getCameraPermissionsAsync.mockResolvedValueOnce({
      granted: false,
      canAskAgain: true,
    });

    const result = await checkPermission("camera");
    expect(result.granted).toBe(false);
    expect(result.canAskAgain).toBe(true);
  });

  it("checks photos permission without prompting", async () => {
    const ImagePicker = require("expo-image-picker");
    ImagePicker.getMediaLibraryPermissionsAsync.mockResolvedValueOnce({
      granted: true,
      canAskAgain: true,
    });

    const result = await checkPermission("photos");
    expect(result.granted).toBe(true);
  });

  it("checks notification permission", async () => {
    const Notifications = require("expo-notifications");
    Notifications.getPermissionsAsync.mockResolvedValueOnce({
      status: "denied",
      canAskAgain: false,
    });

    const result = await checkPermission("notifications");
    expect(result.granted).toBe(false);
    expect(result.canAskAgain).toBe(false);
  });
});

import { requestPermission, checkPermission } from "../../lib/permissions";

// Note: permissions.ts uses dynamic import() which doesn't work in Jest
// without --experimental-vm-modules. The module loaders catch the error
// and return null, triggering the graceful DENIED fallback path.
// These tests verify that the fallback is correct and the API shape is stable.

beforeEach(() => {
  jest.clearAllMocks();
});

describe("requestPermission — graceful fallback", () => {
  it("returns DENIED shape for camera when module unavailable", async () => {
    const result = await requestPermission("camera");
    expect(typeof result.granted).toBe("boolean");
    expect(typeof result.canAskAgain).toBe("boolean");
    // Fallback: granted=false, canAskAgain=false
    expect(result.granted).toBe(false);
    expect(result.canAskAgain).toBe(false);
  });

  it("returns DENIED shape for photos when module unavailable", async () => {
    const result = await requestPermission("photos");
    expect(result.granted).toBe(false);
    expect(result.canAskAgain).toBe(false);
  });

  it("returns DENIED shape for location when module unavailable", async () => {
    const result = await requestPermission("location");
    expect(result.granted).toBe(false);
    expect(result.canAskAgain).toBe(false);
  });

  it("returns DENIED shape for notifications when module unavailable", async () => {
    const result = await requestPermission("notifications");
    expect(result.granted).toBe(false);
    expect(result.canAskAgain).toBe(false);
  });
});

describe("checkPermission — graceful fallback", () => {
  it("returns DENIED shape for camera when module unavailable", async () => {
    const result = await checkPermission("camera");
    expect(result.granted).toBe(false);
    expect(result.canAskAgain).toBe(false);
  });

  it("returns DENIED shape for photos when module unavailable", async () => {
    const result = await checkPermission("photos");
    expect(result.granted).toBe(false);
  });

  it("returns DENIED shape for notifications when module unavailable", async () => {
    const result = await checkPermission("notifications");
    expect(result.granted).toBe(false);
  });

  it("returns DENIED shape for location when module unavailable", async () => {
    const result = await checkPermission("location");
    expect(result.granted).toBe(false);
  });
});

describe("PermissionResult shape", () => {
  it("always returns an object with granted and canAskAgain", async () => {
    const types = ["camera", "photos", "location", "notifications"] as const;
    for (const type of types) {
      const result = await requestPermission(type);
      expect(result).toHaveProperty("granted");
      expect(result).toHaveProperty("canAskAgain");
    }
  });
});

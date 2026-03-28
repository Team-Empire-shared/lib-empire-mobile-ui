import { checkForUpdate, fetchAndApplyUpdate } from "../../lib/appUpdate";

// __DEV__ is set to true in setup.ts, so all update functions should no-op

describe("appUpdate (dev mode)", () => {
  it("checkForUpdate returns { available: false } in dev", async () => {
    const result = await checkForUpdate();
    expect(result).toEqual({ available: false });
  });

  it("fetchAndApplyUpdate is a no-op in dev", async () => {
    const Updates = require("expo-updates");
    await fetchAndApplyUpdate();
    // Should not call any expo-updates functions in dev
    expect(Updates.fetchUpdateAsync).not.toHaveBeenCalled();
    expect(Updates.reloadAsync).not.toHaveBeenCalled();
  });
});

describe("appUpdate (production mode)", () => {
  const originalDev = (globalThis as any).__DEV__;

  beforeEach(() => {
    (globalThis as any).__DEV__ = false;
    jest.clearAllMocks();
  });

  afterEach(() => {
    (globalThis as any).__DEV__ = originalDev;
  });

  it("checkForUpdate returns available when update exists", async () => {
    const Updates = require("expo-updates");
    Updates.checkForUpdateAsync.mockResolvedValueOnce({ isAvailable: true });

    const result = await checkForUpdate();
    expect(result).toEqual({ available: true });
  });

  it("checkForUpdate returns not available when no update", async () => {
    const Updates = require("expo-updates");
    Updates.checkForUpdateAsync.mockResolvedValueOnce({ isAvailable: false });

    const result = await checkForUpdate();
    expect(result).toEqual({ available: false });
  });

  it("checkForUpdate handles errors gracefully", async () => {
    const Updates = require("expo-updates");
    Updates.checkForUpdateAsync.mockRejectedValueOnce(new Error("Network"));

    const result = await checkForUpdate();
    expect(result).toEqual({ available: false });
  });

  it("fetchAndApplyUpdate calls fetch + reload", async () => {
    const Updates = require("expo-updates");
    Updates.fetchUpdateAsync.mockResolvedValueOnce({});
    Updates.reloadAsync.mockResolvedValueOnce(undefined);

    await fetchAndApplyUpdate();
    expect(Updates.fetchUpdateAsync).toHaveBeenCalled();
    expect(Updates.reloadAsync).toHaveBeenCalled();
  });

  it("fetchAndApplyUpdate swallows errors", async () => {
    const Updates = require("expo-updates");
    Updates.fetchUpdateAsync.mockRejectedValueOnce(new Error("Fail"));

    // Should not throw
    await expect(fetchAndApplyUpdate()).resolves.toBeUndefined();
  });
});

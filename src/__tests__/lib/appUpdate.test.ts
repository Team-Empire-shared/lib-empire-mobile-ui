import { checkForUpdate, fetchAndApplyUpdate } from "../../lib/appUpdate";

// __DEV__ is set to true in setup.ts. In dev mode, all update functions short-circuit.
// In production mode, the dynamic import("expo-updates") fails in Jest
// (no --experimental-vm-modules), so the functions catch the error gracefully.

describe("appUpdate (dev mode)", () => {
  it("checkForUpdate returns { available: false } in dev", async () => {
    const result = await checkForUpdate();
    expect(result).toEqual({ available: false });
  });

  it("fetchAndApplyUpdate is a no-op in dev", async () => {
    await expect(fetchAndApplyUpdate()).resolves.toBeUndefined();
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

  it("checkForUpdate handles import failure gracefully", async () => {
    // dynamic import() fails in Jest, so the catch block returns { available: false }
    const result = await checkForUpdate();
    expect(result).toEqual({ available: false });
  });

  it("fetchAndApplyUpdate handles import failure gracefully", async () => {
    // dynamic import() fails in Jest, so the catch block swallows the error
    await expect(fetchAndApplyUpdate()).resolves.toBeUndefined();
  });
});

describe("exports", () => {
  it("checkForUpdate is a function", () => {
    expect(typeof checkForUpdate).toBe("function");
  });

  it("fetchAndApplyUpdate is a function", () => {
    expect(typeof fetchAndApplyUpdate).toBe("function");
  });

  it("useAppUpdate is exported as a function", () => {
    const { useAppUpdate } = require("../../lib/appUpdate");
    expect(typeof useAppUpdate).toBe("function");
  });
});

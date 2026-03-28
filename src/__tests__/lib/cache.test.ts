import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCached, setCached, clearCache, timeAgo } from "../../lib/cache";

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe("setCached / getCached", () => {
  it("stores and retrieves a value", async () => {
    await setCached("users", [{ id: 1, name: "Alice" }]);

    const result = await getCached("users");
    expect(result).not.toBeNull();
    expect(result!.data).toEqual([{ id: 1, name: "Alice" }]);
    expect(result!.expired).toBe(false);
  });

  it("returns null for a missing key", async () => {
    const result = await getCached("nonexistent");
    expect(result).toBeNull();
  });

  it("marks items as expired after TTL", async () => {
    const shortTTL = 100; // 100ms
    await setCached("temp", "data", shortTTL);

    // Advance time past TTL
    const originalNow = Date.now;
    Date.now = () => originalNow() + 200;

    const result = await getCached("temp");
    expect(result).not.toBeNull();
    expect(result!.expired).toBe(true);
    expect(result!.data).toBe("data"); // stale data still returned

    Date.now = originalNow;
  });

  it("uses custom prefix", async () => {
    await setCached("key", "value", undefined, "custom:");
    const result = await getCached("key", "custom:");
    expect(result).not.toBeNull();
    expect(result!.data).toBe("value");

    // Should not be found with default prefix
    const defaultResult = await getCached("key");
    expect(defaultResult).toBeNull();
  });
});

describe("clearCache", () => {
  it("removes all items with default prefix", async () => {
    await setCached("a", 1);
    await setCached("b", 2);
    await clearCache();

    expect(await getCached("a")).toBeNull();
    expect(await getCached("b")).toBeNull();
  });

  it("only removes items with the specified prefix", async () => {
    await setCached("keep", "yes", undefined, "other:");
    await setCached("remove", "no");
    await clearCache(); // default prefix only

    const kept = await getCached("keep", "other:");
    expect(kept).not.toBeNull();
    expect(kept!.data).toBe("yes");
  });
});

describe("timeAgo", () => {
  it("returns 'just now' for recent timestamps", () => {
    expect(timeAgo(Date.now() - 30_000)).toBe("just now");
  });

  it("returns minutes for timestamps 1-59 minutes ago", () => {
    expect(timeAgo(Date.now() - 5 * 60_000)).toBe("5m ago");
  });

  it("returns hours for timestamps 1-23 hours ago", () => {
    expect(timeAgo(Date.now() - 3 * 3_600_000)).toBe("3h ago");
  });

  it("returns days for timestamps 24+ hours ago", () => {
    expect(timeAgo(Date.now() - 2 * 86_400_000)).toBe("2d ago");
  });
});

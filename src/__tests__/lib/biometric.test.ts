/**
 * Biometric idle-lock — cold-start behaviour.
 *
 * The lock used to live entirely in module state (`backgroundAt`, `locked`) and
 * was only ever raised by the AppState background→active handler. Killing the
 * app wiped that state, and the handler never fires on a fresh process, so a
 * relaunch restored a fully unlocked session straight from the stored token no
 * matter how long the device had been idle. These tests pin the fix and, just
 * as importantly, pin the fail-safe that must survive it.
 */
const TOKEN_KEY = "auth_token";
const LAST_ACTIVE_KEY = "empireoe.biometric.lastActiveAt";
const TIMEOUT = 5 * 60 * 1000;

type Store = Record<string, string | null>;

interface Opts {
  store?: Store;
  hasHardware?: boolean;
  enrolled?: boolean;
  authSucceeds?: boolean;
  hardwareThrows?: boolean;
  setItemThrows?: boolean;
}

/**
 * Build a FRESH module registry — which is exactly what a cold start is — and
 * wire the mocks inside it. The mocks must be required in the same registry as
 * the module under test, otherwise the module closes over a different mock
 * instance than the one the test configures.
 */
function coldStart(opts: Opts = {}) {
  const {
    store = {},
    hasHardware = true,
    enrolled = true,
    authSucceeds = true,
    hardwareThrows = false,
    setItemThrows = false,
  } = opts;
  const backing: Store = { ...store };

  let bio!: typeof import("../../lib/biometric");
  jest.isolateModules(() => {
    const SecureStore = require("expo-secure-store");
    const LocalAuth = require("expo-local-authentication");

    SecureStore.getItemAsync.mockImplementation(
      async (k: string) => backing[k] ?? null,
    );
    SecureStore.setItemAsync.mockImplementation(
      async (k: string, v: string) => {
        if (setItemThrows) throw new Error("keychain locked");
        backing[k] = v;
      },
    );
    SecureStore.deleteItemAsync.mockImplementation(async (k: string) => {
      delete backing[k];
    });

    if (hardwareThrows) {
      LocalAuth.hasHardwareAsync.mockRejectedValue(new Error("no module"));
    } else {
      LocalAuth.hasHardwareAsync.mockResolvedValue(hasHardware);
    }
    LocalAuth.isEnrolledAsync.mockResolvedValue(enrolled);
    LocalAuth.authenticateAsync.mockResolvedValue({ success: authSucceeds });

    bio = require("../../lib/biometric");
  });

  return { bio, backing };
}

const staleStamp = () => String(Date.now() - TIMEOUT - 1000);

describe("cold start — the bypass this fixes", () => {
  it("LOCKS when a token survives and the device idled past the timeout", async () => {
    const { bio } = coldStart({
      store: { [TOKEN_KEY]: "jwt-abc", [LAST_ACTIVE_KEY]: staleStamp() },
    });

    expect(bio.isLocked()).toBe(false); // fresh registry starts clean, as a real relaunch does
    await expect(bio.hydrateLockState(TOKEN_KEY, TIMEOUT)).resolves.toBe(true);
    expect(bio.isLocked()).toBe(true);
  });

  it("does NOT lock when the app was active moments ago", async () => {
    const { bio } = coldStart({
      store: {
        [TOKEN_KEY]: "jwt-abc",
        [LAST_ACTIVE_KEY]: String(Date.now() - 1000),
      },
    });

    await expect(bio.hydrateLockState(TOKEN_KEY, TIMEOUT)).resolves.toBe(false);
    expect(bio.isLocked()).toBe(false);
  });

  it("LOCKS when the last-active stamp is unknown but a token exists", async () => {
    // Cannot distinguish ten seconds from ten days — challenge rather than guess.
    const { bio } = coldStart({ store: { [TOKEN_KEY]: "jwt-abc" } });

    await expect(bio.hydrateLockState(TOKEN_KEY, TIMEOUT)).resolves.toBe(true);
    expect(bio.isLocked()).toBe(true);
  });

  it("does NOT lock a signed-out app, and clears the stale stamp", async () => {
    const { bio, backing } = coldStart({
      store: { [LAST_ACTIVE_KEY]: staleStamp() },
    });

    await expect(bio.hydrateLockState(TOKEN_KEY, TIMEOUT)).resolves.toBe(false);
    expect(bio.isLocked()).toBe(false);
    // Otherwise whoever signs in next inherits a lock.
    expect(backing[LAST_ACTIVE_KEY]).toBeUndefined();
  });

  it("notifies the listener, so an overlay mounted before hydration still locks", async () => {
    const { bio } = coldStart({
      store: { [TOKEN_KEY]: "jwt-abc", [LAST_ACTIVE_KEY]: staleStamp() },
    });
    const seen: boolean[] = [];
    bio.setLockChangeListener((l: boolean) => seen.push(l));

    await bio.hydrateLockState(TOKEN_KEY, TIMEOUT);
    expect(seen).toEqual([true]);
  });

  it("is reached automatically by startAppStateListener — consumers need no code change", async () => {
    const { bio } = coldStart({
      store: { [TOKEN_KEY]: "jwt-abc", [LAST_ACTIVE_KEY]: staleStamp() },
    });
    const seen: boolean[] = [];
    bio.setLockChangeListener((l: boolean) => seen.push(l));

    const unsubscribe = bio.startAppStateListener(TOKEN_KEY, TIMEOUT);
    expect(typeof unsubscribe).toBe("function"); // still synchronous, as before
    await new Promise((r) => setImmediate(r)); // let the fire-and-forget settle

    expect(bio.isLocked()).toBe(true);
    expect(seen).toEqual([true]);
    unsubscribe();
  });
});

describe("fail-safe — must survive the fix", () => {
  it("never locks a device with no biometric hardware", async () => {
    const { bio } = coldStart({
      store: { [TOKEN_KEY]: "jwt-abc", [LAST_ACTIVE_KEY]: staleStamp() },
      hasHardware: false,
    });

    await expect(bio.hydrateLockState(TOKEN_KEY, TIMEOUT)).resolves.toBe(false);
    expect(bio.isLocked()).toBe(false);
  });

  it("never locks a device with nothing enrolled", async () => {
    const { bio } = coldStart({
      store: { [TOKEN_KEY]: "jwt-abc" },
      enrolled: false,
    });

    await expect(bio.hydrateLockState(TOKEN_KEY, TIMEOUT)).resolves.toBe(false);
    expect(bio.isLocked()).toBe(false);
  });

  it("does not lock when the availability probe throws", async () => {
    const { bio } = coldStart({
      store: { [TOKEN_KEY]: "jwt-abc" },
      hardwareThrows: true,
    });

    await expect(bio.hydrateLockState(TOKEN_KEY, TIMEOUT)).resolves.toBe(false);
    expect(bio.isLocked()).toBe(false);
  });

  it("degrades rather than throwing when storage writes fail", async () => {
    const { bio } = coldStart({
      store: { [TOKEN_KEY]: "jwt-abc" },
      setItemThrows: true,
    });

    // Unknown stamp -> locks; the failing write must not blow up startup.
    await expect(bio.hydrateLockState(TOKEN_KEY, TIMEOUT)).resolves.toBe(true);
  });
});

describe("unlocking restarts the idle clock", () => {
  it("a successful auth stamps last-active, so an immediate relaunch does not re-lock", async () => {
    const { bio, backing } = coldStart({
      store: { [TOKEN_KEY]: "jwt-abc", [LAST_ACTIVE_KEY]: staleStamp() },
    });

    await bio.hydrateLockState(TOKEN_KEY, TIMEOUT);
    expect(bio.isLocked()).toBe(true);

    await expect(bio.authenticateWithBiometric()).resolves.toBe(true);
    expect(bio.isLocked()).toBe(false);
    expect(Number(backing[LAST_ACTIVE_KEY])).toBeGreaterThan(Date.now() - 5000);

    // Simulate the process dying and coming straight back with that same store.
    const relaunched = coldStart({ store: backing as Store });
    await expect(
      relaunched.bio.hydrateLockState(TOKEN_KEY, TIMEOUT),
    ).resolves.toBe(false);
  });

  it("a failed auth leaves the app locked", async () => {
    const { bio } = coldStart({
      store: { [TOKEN_KEY]: "jwt-abc" },
      authSucceeds: false,
    });

    await bio.hydrateLockState(TOKEN_KEY, TIMEOUT);
    expect(bio.isLocked()).toBe(true);
    await expect(bio.authenticateWithBiometric()).resolves.toBe(false);
    expect(bio.isLocked()).toBe(true);
  });
});

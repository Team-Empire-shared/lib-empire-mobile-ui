// Minimal react-native stand-in for pure-logic lib tests running under
// testEnvironment "node". The real RN jest preset is currently unusable in this
// repo (see jest.config.js — @testing-library/react-native/jest-preset requires
// react-native/jest-preset, which moved to @react-native/jest-preset and is not
// installed). Only the surface our lib modules actually touch is stubbed.
type Handler = (state: string) => void;

const listeners = new Set<Handler>();

export const AppState = {
  currentState: "active" as string,
  addEventListener(_event: "change", handler: Handler) {
    listeners.add(handler);
    return { remove: () => listeners.delete(handler) };
  },
  /** Test helper — drive a transition. */
  __emit(state: string) {
    AppState.currentState = state;
    return Promise.all([...listeners].map((h) => h(state)));
  },
  __reset() {
    listeners.clear();
    AppState.currentState = "active";
  },
};

export const Platform = {
  OS: "ios" as string,
  select: (o: Record<string, unknown>) => o.ios,
};
export type AppStateStatus = string;

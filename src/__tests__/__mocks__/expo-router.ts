export const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
});
export const useLocalSearchParams = () => ({ id: "1" });
export const useSegments = () => [];
export const useFocusEffect = (cb: () => void) => cb();
export const Redirect = () => null;
export const Link = ({ children }: { children: any }) => children;
export const Stack = Object.assign(() => null, { Screen: () => null });
export const Tabs = Object.assign(
  ({ children }: { children: any }) => children,
  { Screen: () => null },
);
export const router = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };

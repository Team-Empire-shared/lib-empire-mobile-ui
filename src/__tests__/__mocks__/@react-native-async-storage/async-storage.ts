const store: Record<string, string> = {};

const AsyncStorage = {
  getItem: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
  setItem: jest.fn((key: string, value: string) => {
    store[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    delete store[key];
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
  multiRemove: jest.fn((keys: string[]) => {
    keys.forEach((k) => delete store[k]);
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    return Promise.resolve();
  }),
};

export default AsyncStorage;

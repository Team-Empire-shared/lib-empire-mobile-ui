export const init = jest.fn();
export const wrap = (c: unknown) => c;
export const captureException = jest.fn();
export const captureMessage = jest.fn();
export const addBreadcrumb = jest.fn();
export const setUser = jest.fn();
export const withScope = jest.fn((cb: (scope: any) => void) => cb({ setExtras: jest.fn() }));

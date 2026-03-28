export const useNetInfo = () => ({ isConnected: true });
export default { addEventListener: jest.fn(() => jest.fn()), fetch: jest.fn().mockResolvedValue({ isConnected: true }) };

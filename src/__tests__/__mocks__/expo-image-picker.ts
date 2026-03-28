export const launchImageLibraryAsync = jest.fn().mockResolvedValue({ canceled: true, assets: [] });
export const launchCameraAsync = jest.fn().mockResolvedValue({ canceled: true, assets: [] });
export const requestMediaLibraryPermissionsAsync = jest.fn().mockResolvedValue({ granted: true, canAskAgain: true });
export const getMediaLibraryPermissionsAsync = jest.fn().mockResolvedValue({ granted: true, canAskAgain: true });
export const MediaTypeOptions = { Images: "Images", Videos: "Videos", All: "All" };

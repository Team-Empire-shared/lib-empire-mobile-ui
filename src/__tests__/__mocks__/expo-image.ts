const React = require("react");

// Simple mock that renders a plain React element instead of requiring react-native
export const Image = (props: any) => {
  if (props.onError && props.source?.uri?.includes?.("error")) {
    setTimeout(() => props.onError(), 0);
  }
  return React.createElement("View", {
    testID: "expo-image",
    style: props.style,
    source: props.source,
  });
};

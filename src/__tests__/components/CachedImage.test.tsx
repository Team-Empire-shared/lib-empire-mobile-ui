import React from "react";
import { render, screen } from "@testing-library/react-native";
import { CachedImage } from "../../components/CachedImage";

describe("CachedImage", () => {
  it("renders without crashing when given a valid uri", () => {
    const { toJSON } = render(
      <CachedImage uri="https://example.com/photo.jpg" style={{ width: 100, height: 100 }} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("shows initials fallback when uri is null", () => {
    render(
      <CachedImage uri={null} alt="John Doe" style={{ width: 50, height: 50 }} />,
    );
    expect(screen.getByText("JD")).toBeTruthy();
  });

  it("shows '?' when uri is null and no alt provided", () => {
    render(
      <CachedImage uri={null} style={{ width: 50, height: 50 }} />,
    );
    expect(screen.getByText("?")).toBeTruthy();
  });

  it("renders custom fallback when uri is null and fallback provided", () => {
    const { Text } = require("react-native");
    render(
      <CachedImage
        uri={null}
        fallback={<Text>Custom Fallback</Text>}
        style={{ width: 50, height: 50 }}
      />,
    );
    expect(screen.getByText("Custom Fallback")).toBeTruthy();
  });

  it("shows initials fallback when uri is undefined", () => {
    render(
      <CachedImage uri={undefined} alt="Alice" style={{ width: 50, height: 50 }} />,
    );
    expect(screen.getByText("A")).toBeTruthy();
  });
});

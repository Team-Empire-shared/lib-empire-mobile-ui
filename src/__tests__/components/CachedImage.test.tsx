import React from "react";
import { Text, View } from "react-native";
import { create } from "react-test-renderer";
import { CachedImage } from "../../components/CachedImage";

describe("CachedImage", () => {
  it("renders without crashing when given a valid uri", () => {
    const tree = create(
      <CachedImage uri="https://example.com/photo.jpg" style={{ width: 100, height: 100 }} />,
    );
    expect(tree.toJSON()).toBeTruthy();
  });

  it("shows initials fallback when uri is null", () => {
    const tree = create(
      <CachedImage uri={null} alt="John Doe" style={{ width: 50, height: 50 }} />,
    );
    const texts = tree.root.findAllByType(Text);
    expect(texts.length).toBeGreaterThanOrEqual(1);
    expect(texts[0].props.children).toBe("JD");
  });

  it("shows '?' when uri is null and no alt provided", () => {
    const tree = create(
      <CachedImage uri={null} style={{ width: 50, height: 50 }} />,
    );
    const texts = tree.root.findAllByType(Text);
    expect(texts[0].props.children).toBe("?");
  });

  it("renders custom fallback when uri is null and fallback provided", () => {
    const tree = create(
      <CachedImage
        uri={null}
        fallback={<Text>Custom Fallback</Text>}
        style={{ width: 50, height: 50 }}
      />,
    );
    const texts = tree.root.findAllByType(Text);
    expect(texts[0].props.children).toBe("Custom Fallback");
  });

  it("shows initials fallback when uri is undefined", () => {
    const tree = create(
      <CachedImage uri={undefined} alt="Alice" style={{ width: 50, height: 50 }} />,
    );
    const texts = tree.root.findAllByType(Text);
    expect(texts[0].props.children).toBe("A");
  });

  it("applies borderRadius to fallback container", () => {
    const tree = create(
      <CachedImage uri={null} borderRadius={25} style={{ width: 50, height: 50 }} />,
    );
    const views = tree.root.findAllByType(View);
    const styled = views.find((v) =>
      Array.isArray(v.props.style)
        ? v.props.style.some((s: any) => s?.borderRadius === 25)
        : v.props.style?.borderRadius === 25,
    );
    expect(styled).toBeDefined();
  });
});

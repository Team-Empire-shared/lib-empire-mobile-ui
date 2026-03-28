import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { AnimatedButton } from "../../components/AnimatedButton";

describe("AnimatedButton", () => {
  it("renders with label", () => {
    render(<AnimatedButton label="Submit" onPress={() => {}} />);
    expect(screen.getByText("Submit")).toBeTruthy();
  });

  it("fires onPress callback", () => {
    const onPress = jest.fn();
    render(<AnimatedButton label="Click me" onPress={onPress} />);
    fireEvent.press(screen.getByText("Click me"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not fire onPress when disabled", () => {
    const onPress = jest.fn();
    render(<AnimatedButton label="Disabled" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText("Disabled"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows loading label when loading", () => {
    render(
      <AnimatedButton
        label="Save"
        loadingLabel="Saving..."
        onPress={() => {}}
        loading
      />,
    );
    expect(screen.getByText("Saving...")).toBeTruthy();
    expect(screen.queryByText("Save")).toBeNull();
  });

  it("renders all variants without crash", () => {
    const variants = ["primary", "outline", "danger", "success"] as const;
    for (const variant of variants) {
      const { unmount } = render(
        <AnimatedButton label={variant} onPress={() => {}} variant={variant} />,
      );
      expect(screen.getByText(variant)).toBeTruthy();
      unmount();
    }
  });
});

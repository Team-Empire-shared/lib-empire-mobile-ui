import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Avatar } from "../../components/Avatar";

describe("Avatar", () => {
  it("renders with an image uri without crashing", () => {
    const { toJSON } = render(
      <Avatar uri="https://example.com/avatar.jpg" name="Jane Smith" size={48} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders initials fallback when no uri is provided", () => {
    render(<Avatar name="John Doe" size={40} />);
    expect(screen.getByText("JD")).toBeTruthy();
  });

  it("renders single-word name as single initial", () => {
    render(<Avatar name="Admin" />);
    expect(screen.getByText("A")).toBeTruthy();
  });

  it("renders default '?' when name is not provided", () => {
    render(<Avatar />);
    expect(screen.getByText("?")).toBeTruthy();
  });

  it("renders without crash for all prop combinations", () => {
    const { toJSON } = render(
      <Avatar name="Test User" size={64} backgroundColor="#ccc" textColor="#000" />,
    );
    expect(toJSON()).toBeTruthy();
  });
});

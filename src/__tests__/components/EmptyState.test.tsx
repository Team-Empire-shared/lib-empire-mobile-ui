import React from "react";
import { render, screen } from "@testing-library/react-native";
import { EmptyState } from "../../components/EmptyState";

describe("EmptyState", () => {
  it("renders title and subtitle", () => {
    render(
      <EmptyState title="No results" subtitle="Try a different search" />,
    );
    expect(screen.getByText("No results")).toBeTruthy();
    expect(screen.getByText("Try a different search")).toBeTruthy();
  });

  it("renders with only title (no subtitle)", () => {
    render(<EmptyState title="Empty" />);
    expect(screen.getByText("Empty")).toBeTruthy();
  });

  it("renders action button when actionLabel and onAction provided", () => {
    const onAction = jest.fn();
    render(
      <EmptyState
        title="No items"
        actionLabel="Create new"
        onAction={onAction}
      />,
    );
    expect(screen.getByText("Create new")).toBeTruthy();
  });

  it("renders secondary action button", () => {
    render(
      <EmptyState
        title="No items"
        actionLabel="Primary"
        onAction={() => {}}
        secondaryLabel="Go back"
        onSecondary={() => {}}
      />,
    );
    expect(screen.getByText("Primary")).toBeTruthy();
    expect(screen.getByText("Go back")).toBeTruthy();
  });

  it("renders custom icon", () => {
    render(<EmptyState title="No jobs" icon="briefcase" />);
    expect(screen.getByText("briefcase")).toBeTruthy();
  });

  it("renders in dark mode without crash", () => {
    const { toJSON } = render(
      <EmptyState title="Dark mode" subtitle="Works fine" dark />,
    );
    expect(toJSON()).toBeTruthy();
  });
});

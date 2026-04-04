import React from "react";
import { Text } from "react-native";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ErrorBoundary } from "../../components/ErrorBoundary";

function BrokenChild(): React.JSX.Element {
  throw new Error("Test crash");
}

function GoodChild(): React.JSX.Element {
  return <Text>Working</Text>;
}

// Suppress expected error boundary console output during tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (
      msg.includes("ErrorBoundary") ||
      msg.includes("The above error") ||
      msg.includes("Error: Uncaught") ||
      msg.includes("Test crash") ||
      msg.includes("Temporary error")
    ) {
      return;
    }
    originalConsoleError(...args);
  };
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Working")).toBeTruthy();
  });

  it("renders fallback when a child throws", () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Something went wrong.")).toBeTruthy();
    expect(screen.getByText("Please try again.")).toBeTruthy();
  });

  it("renders custom fallback title and message", () => {
    render(
      <ErrorBoundary fallbackTitle="Oops" fallbackMessage="Try later">
        <BrokenChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Oops")).toBeTruthy();
    expect(screen.getByText("Try later")).toBeTruthy();
  });

  it("calls onError callback when error is caught", () => {
    const onError = jest.fn();
    render(
      <ErrorBoundary onError={onError}>
        <BrokenChild />
      </ErrorBoundary>,
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) }),
    );
  });

  it("shows retry button in error state", () => {
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Retry")).toBeTruthy();
  });
});

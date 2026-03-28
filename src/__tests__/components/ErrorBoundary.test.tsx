import React from "react";
import { Text } from "react-native";
import { create, act } from "react-test-renderer";
import { ErrorBoundary } from "../../components/ErrorBoundary";

function BrokenChild(): JSX.Element {
  throw new Error("Test crash");
}

function GoodChild(): JSX.Element {
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
      msg.includes("Error: Uncaught")
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
    const tree = create(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>,
    );
    expect(tree.root.findByType(Text).props.children).toBe("Working");
  });

  it("renders fallback when a child throws", () => {
    const tree = create(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>,
    );
    const texts = tree.root.findAllByType(Text);
    const messages = texts.map((t) => t.props.children);
    expect(messages).toContain("Something went wrong.");
    expect(messages).toContain("Please try again.");
  });

  it("renders custom fallback title and message", () => {
    const tree = create(
      <ErrorBoundary fallbackTitle="Oops" fallbackMessage="Try later">
        <BrokenChild />
      </ErrorBoundary>,
    );
    const texts = tree.root.findAllByType(Text);
    const messages = texts.map((t) => t.props.children);
    expect(messages).toContain("Oops");
    expect(messages).toContain("Try later");
  });

  it("calls onError callback when error is caught", () => {
    const onError = jest.fn();
    create(
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

  it("recovers when retry is pressed", () => {
    let shouldThrow = true;
    function ConditionalChild(): JSX.Element {
      if (shouldThrow) throw new Error("Temporary error");
      return <Text>Recovered</Text>;
    }

    const tree = create(
      <ErrorBoundary>
        <ConditionalChild />
      </ErrorBoundary>,
    );

    // Should show error fallback
    const retryText = tree.root.findAllByType(Text).find(
      (t) => t.props.children === "Retry",
    );
    expect(retryText).toBeDefined();

    // Fix the error condition and press retry
    shouldThrow = false;
    const retryButton = retryText!.parent!;
    act(() => {
      retryButton.props.onPress();
    });

    const texts = tree.root.findAllByType(Text);
    expect(texts.map((t) => t.props.children)).toContain("Recovered");
  });
});

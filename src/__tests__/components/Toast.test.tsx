import React from "react";
import { render } from "@testing-library/react-native";
import { ToastContainer, useToastStore, toast } from "../../components/Toast";

beforeEach(() => {
  jest.useFakeTimers();
  useToastStore.setState({ toasts: [] });
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("toast convenience functions", () => {
  it("toast.success() adds a success toast", () => {
    toast.success("Saved");
    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe("Saved");
    expect(toasts[0].type).toBe("success");
  });

  it("toast.error() adds an error toast", () => {
    toast.error("Failed");
    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe("Failed");
    expect(toasts[0].type).toBe("error");
  });

  it("toast.info() adds an info toast", () => {
    toast.info("Note");
    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].type).toBe("info");
  });

  it("auto-dismisses after 3 seconds", () => {
    toast.success("Temporary");
    expect(useToastStore.getState().toasts).toHaveLength(1);

    jest.advanceTimersByTime(3000);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("supports multiple simultaneous toasts", () => {
    toast.success("One");
    toast.error("Two");
    toast.info("Three");
    expect(useToastStore.getState().toasts).toHaveLength(3);
  });

  it("remove() removes a specific toast by id", () => {
    toast.success("Keep");
    toast.error("Remove me");
    const { toasts, remove } = useToastStore.getState();
    const errorToast = toasts.find((t) => t.type === "error")!;
    remove(errorToast.id);
    expect(useToastStore.getState().toasts).toHaveLength(1);
    expect(useToastStore.getState().toasts[0].type).toBe("success");
  });
});

describe("ToastContainer", () => {
  it("renders null when no toasts", () => {
    const { toJSON } = render(<ToastContainer />);
    expect(toJSON()).toBeNull();
  });

  it("renders toast items when toasts exist", () => {
    // Pre-populate the store before render
    useToastStore.setState({
      toasts: [{ id: 999, message: "Hello", type: "success" as const }],
    });
    const { toJSON } = render(<ToastContainer />);
    expect(toJSON()).toBeTruthy();
  });
});

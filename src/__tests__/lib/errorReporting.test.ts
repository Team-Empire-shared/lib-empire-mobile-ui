import { errorReporter } from "../../lib/errorReporting";

// The Sentry mock is set up in setup.ts
const Sentry = require("@sentry/react-native");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("errorReporter", () => {
  describe("init", () => {
    it("calls Sentry.init with DSN and defaults", () => {
      errorReporter.init("https://abc@sentry.io/123");
      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          dsn: "https://abc@sentry.io/123",
          environment: "development",
        }),
      );
    });

    it("passes custom options to Sentry.init", () => {
      errorReporter.init("https://abc@sentry.io/123", {
        environment: "production",
        tracesSampleRate: 0.5,
      });
      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          environment: "production",
          tracesSampleRate: 0.5,
        }),
      );
    });
  });

  describe("captureException", () => {
    it("forwards error to Sentry.captureException", () => {
      const error = new Error("Test error");
      errorReporter.captureException(error);
      expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });

    it("uses withScope when context is provided", () => {
      const error = new Error("Context error");
      errorReporter.captureException(error, { userId: "42" });
      expect(Sentry.withScope).toHaveBeenCalled();
    });

    it("logs to console in __DEV__", () => {
      const spy = jest.spyOn(console, "error").mockImplementation();
      const error = new Error("Dev error");
      errorReporter.captureException(error);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe("captureMessage", () => {
    it("forwards message to Sentry.captureMessage", () => {
      errorReporter.captureMessage("Something happened", "warning");
      expect(Sentry.captureMessage).toHaveBeenCalledWith("Something happened", "warning");
    });
  });

  describe("setUser", () => {
    it("forwards user to Sentry.setUser", () => {
      errorReporter.setUser({ id: "1", email: "a@b.com", role: "CEO" });
      expect(Sentry.setUser).toHaveBeenCalledWith({ id: "1", email: "a@b.com", role: "CEO" });
    });

    it("clears user with null", () => {
      errorReporter.setUser(null);
      expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });
  });

  describe("addBreadcrumb", () => {
    it("forwards breadcrumb to Sentry", () => {
      errorReporter.addBreadcrumb("User clicked button", "ui", { target: "submit" });
      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User clicked button",
          category: "ui",
          data: { target: "submit" },
        }),
      );
    });
  });
});

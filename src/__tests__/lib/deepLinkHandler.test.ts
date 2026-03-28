import { createDeepLinkHandler } from "../../lib/deepLinkHandler";

const handler = createDeepLinkHandler({
  job: "/job/[id]",
  applications: "/(tabs)/applications",
  listing: "/listing/[id]",
  bookings: "/(tabs)/bookings",
  profile: "/(tabs)/profile",
  settings: "/settings",
});

describe("handleNotification", () => {
  it("maps notification data with screen + id to route", () => {
    const route = handler.handleNotification({ screen: "job", id: "42" });
    expect(route).toBe("/job/42");
  });

  it("maps notification to static route without params", () => {
    const route = handler.handleNotification({ screen: "applications" });
    expect(route).toBe("/(tabs)/applications");
  });

  it("returns null for unknown screen", () => {
    const route = handler.handleNotification({ screen: "unknown" });
    expect(route).toBeNull();
  });

  it("returns null for missing screen field", () => {
    const route = handler.handleNotification({ id: "42" });
    expect(route).toBeNull();
  });

  it("returns null for null/undefined data", () => {
    expect(handler.handleNotification(null as any)).toBeNull();
    expect(handler.handleNotification(undefined as any)).toBeNull();
  });

  it("returns null for non-object data", () => {
    expect(handler.handleNotification("string" as any)).toBeNull();
  });

  it("maps listing screen with id", () => {
    const route = handler.handleNotification({ screen: "listing", id: "99" });
    expect(route).toBe("/listing/99");
  });
});

describe("parseUrl", () => {
  it("parses deep link URL with scheme", () => {
    const result = handler.parseUrl("empireo-app://host/job/123");
    expect(result).toEqual({ screen: "job", params: { id: "123" } });
  });

  it("parses path-only URL", () => {
    const result = handler.parseUrl("/listing/456");
    expect(result).toEqual({ screen: "listing", params: { id: "456" } });
  });

  it("parses static route without params", () => {
    const result = handler.parseUrl("/settings");
    expect(result).toEqual({ screen: "settings", params: {} });
  });

  it("returns null for unmatched URL", () => {
    const result = handler.parseUrl("myapp://host/unknown/path");
    expect(result).toBeNull();
  });

  it("returns null for empty URL", () => {
    expect(handler.parseUrl("")).toBeNull();
  });

  it("strips query string before matching", () => {
    const result = handler.parseUrl("/job/99?ref=push");
    expect(result).toEqual({ screen: "job", params: { id: "99" } });
  });

  it("decodes URI-encoded segments", () => {
    const result = handler.parseUrl("/job/hello%20world");
    expect(result).toEqual({ screen: "job", params: { id: "hello world" } });
  });

  it("parses URL with scheme for static route", () => {
    const result = handler.parseUrl("myapp://host/settings");
    expect(result).toEqual({ screen: "settings", params: {} });
  });
});

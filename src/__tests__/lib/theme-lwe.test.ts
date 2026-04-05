import { colors, lweTheme, productColors } from "../../lib/theme";

describe("Stripe / LWE theme tokens", () => {
  it("keeps brand purple for primary and LWE product key", () => {
    expect(colors.primary).toBe("#533afd");
    expect(productColors.lwe).toBe("#533afd");
    expect(lweTheme.primary).toBe("#533afd");
  });

  it("uses Stripe-style navy for primary text", () => {
    expect(colors.text).toBe("#061b31");
  });
});

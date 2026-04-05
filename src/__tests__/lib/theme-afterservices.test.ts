import { afterServicesTheme, productColors } from "../../lib/theme";

describe("Airbnb / After-Services theme tokens", () => {
  it("uses Airbnb Rausch Red for primary and After-Services product key", () => {
    expect(afterServicesTheme.primary).toBe("#ff385c");
    expect(productColors.afterServices).toBe("#ff385c");
  });

  it("uses Airbnb Hof ink for primary text", () => {
    expect(afterServicesTheme.text).toBe("#222222");
  });

  it("uses Airbnb Foggy muted grey", () => {
    expect(afterServicesTheme.textMuted).toBe("#717171");
  });

  it("uses Airbnb Arches for danger states", () => {
    expect(afterServicesTheme.danger).toBe("#c13515");
  });
});

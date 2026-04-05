import {
  empireoTheme,
  empireoDarkTheme,
  eoeTheme,
  eoeDarkTheme,
  productColors,
} from "../../lib/theme";

describe("Vercel / Empireo + EOE theme tokens", () => {
  it("uses Vercel charcoal as primary for light theme", () => {
    expect(empireoTheme.primary).toBe("#171717");
    expect(productColors.empireo).toBe("#171717");
    expect(productColors.eoe).toBe("#171717");
  });

  it("uses Vercel monochrome ink for primary text", () => {
    expect(empireoTheme.text).toBe("#171717");
  });

  it("uses hairline Vercel border", () => {
    expect(empireoTheme.border).toBe("#ebebeb");
  });

  it("provides a dark variant with OLED black canvas and inverted accent", () => {
    expect(empireoDarkTheme.primary).toBe("#fafafa");
    expect(empireoDarkTheme.background).toBe("#000000");
    expect(empireoDarkTheme.text).toBe("#fafafa");
  });

  it("exposes EOE aliases that reuse the Empireo palette", () => {
    expect(eoeTheme).toBe(empireoTheme);
    expect(eoeDarkTheme).toBe(empireoDarkTheme);
  });
});

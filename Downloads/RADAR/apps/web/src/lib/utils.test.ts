import { describe, expect, it } from "vitest";
import { requireRole, severityColor, severityLabel } from "./utils";

describe("severity helpers", () => {
  it("maps severity to colors and labels", () => {
    expect(severityColor("destroyed")).toBe("#D62828");
    expect(severityLabel("minor_damage")).toContain("ringan");
  });
});

describe("role guard", () => {
  it("allows only configured roles", () => {
    expect(requireRole("operator", ["operator", "admin"])).toBe(true);
    expect(requireRole("citizen", ["operator", "admin"])).toBe(false);
  });
});

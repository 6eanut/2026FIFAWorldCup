import { describe, it, expect } from "vitest";

describe("smoke test", () => {
  it("test infrastructure is working", () => {
    expect(1 + 1).toBe(2);
  });

  it("DOM matchers are registered", () => {
    const div = document.createElement("div");
    div.textContent = "hello";
    expect(div).toHaveTextContent("hello");
  });
});
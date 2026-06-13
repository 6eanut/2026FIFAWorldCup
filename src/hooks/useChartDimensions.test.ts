import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useChartDimensions } from "./useChartDimensions";

describe("useChartDimensions", () => {
  it("returns default height of 300", () => {
    const { result } = renderHook(() => useChartDimensions());
    expect(result.current.height).toBe(300);
  });

  it("returns custom height", () => {
    const { result } = renderHook(() => useChartDimensions(400));
    expect(result.current.height).toBe(400);
  });

  it("returns 0 width initially (no DOM node attached)", () => {
    const { result } = renderHook(() => useChartDimensions());
    expect(result.current.width).toBe(0);
  });

  it("ref is a stable function reference", () => {
    const { result, rerender } = renderHook(() => useChartDimensions());
    const firstRef = result.current.ref;
    rerender();
    expect(result.current.ref).toBe(firstRef);
  });
});